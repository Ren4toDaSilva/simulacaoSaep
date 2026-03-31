// ═══════════════════════════════════════════════
//  STORAGE
// ═══════════════════════════════════════════════
const KEY_USERS = 'saep_users';
const KEY_TASKS = 'saep_tasks';
 
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; } catch { return []; }
}
function loadTasks() {
  try { return JSON.parse(localStorage.getItem(KEY_TASKS)) || []; } catch { return []; }
}
function saveUsers(users) { localStorage.setItem(KEY_USERS, JSON.stringify(users)); }
function saveTasks(tasks) { localStorage.setItem(KEY_TASKS, JSON.stringify(tasks)); }
 
function nextId(arr) {
  return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}
 
// ═══════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════
const viewMap = {
  'board':    'view-board',
  'users':    'view-users',
  'new-user': 'view-new-user',
  'new-task': 'view-new-task',
};
const navMap  = { 'board': 0, 'users': 1, 'new-task': 2 };
 
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewMap[name]).classList.add('active');
 
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (navMap[name] !== undefined) btns[navMap[name]].classList.add('active');
 
  if (name === 'board')    { populateFilters(); renderBoard(); renderStats(); }
  if (name === 'users')    renderUsersTable();
  if (name === 'new-task') {
    populateUserSelect();
    if (!document.getElementById('task-edit-id').value) resetTaskForm();
  }
  if (name === 'new-user') {
    if (!document.getElementById('user-edit-id').value) resetUserForm();
  }
  window.scrollTo({top: 0, behavior:'smooth'});
}
 
// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = (type === 'success' ? '✅ ' : '❌ ') + msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
 
// ═══════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════
let confirmCallback = null;
function openModal(msg, cb) {
  document.getElementById('confirm-msg').textContent = msg;
  confirmCallback = cb;
  document.getElementById('confirm-modal').classList.add('open');
}
function closeModal() {
  document.getElementById('confirm-modal').classList.remove('open');
  confirmCallback = null;
}
document.getElementById('confirm-ok').onclick = () => {
  if (confirmCallback) confirmCallback();
  closeModal();
};
document.getElementById('confirm-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('confirm-modal')) closeModal();
});
 
// ═══════════════════════════════════════════════
//  VALIDATION HELPERS
// ═══════════════════════════════════════════════
function setErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
  const input = document.getElementById(id.replace('err-', ''));
  if (input) input.classList.add('error');
}
function clearErr(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('show'); }
  const input = document.getElementById(id.replace('err-', ''));
  if (input) input.classList.remove('error');
}
function clearAllErrors(prefix, fields) {
  fields.forEach(f => clearErr(prefix + f));
}
 
// ═══════════════════════════════════════════════
//  USER CRUD
// ═══════════════════════════════════════════════
function resetUserForm() {
  document.getElementById('user-edit-id').value = '';
  document.getElementById('user-nome').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('user-form-title').textContent = 'Cadastrar Usuário';
  clearAllErrors('err-user-', ['nome', 'email']);
}
 
function saveUser() {
  const editId = document.getElementById('user-edit-id').value;
  const nome   = document.getElementById('user-nome').value.trim();
  const email  = document.getElementById('user-email').value.trim();
 
  let valid = true;
  clearAllErrors('err-user-', ['nome', 'email']);
 
  if (!nome) { setErr('err-user-nome', 'Campo obrigatório.'); valid = false; }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) { setErr('err-user-email', 'Campo obrigatório.'); valid = false; }
  else if (!emailRe.test(email)) { setErr('err-user-email', 'Informe um e-mail válido.'); valid = false; }
  if (!valid) return;
 
  const users = loadUsers();
 
  // Verificar e-mail duplicado
  const dup = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== Number(editId));
  if (dup) { setErr('err-user-email', 'E-mail já cadastrado.'); return; }
 
  if (editId) {
    const i = users.findIndex(u => u.id === Number(editId));
    if (i > -1) { users[i].nome = nome; users[i].email = email; }
    toast('Usuário atualizado com sucesso!');
  } else {
    users.push({ id: nextId(users), nome, email });
    toast('Usuário cadastrado com sucesso!');
  }
  saveUsers(users);
  resetUserForm();
  showView('users');
}
 
function editUser(id) {
  const user = loadUsers().find(u => u.id === id);
  if (!user) return;
  document.getElementById('user-edit-id').value = id;
  document.getElementById('user-nome').value  = user.nome;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-form-title').textContent = 'Editar Usuário';
  clearAllErrors('err-user-', ['nome', 'email']);
  showView('new-user');
}
 
function deleteUser(id) {
  const tasks = loadTasks().filter(t => t.usuarioId === id);
  const msg = tasks.length
    ? `Este usuário possui ${tasks.length} tarefa(s) vinculada(s). Ao excluir, as tarefas também serão removidas. Deseja continuar?`
    : 'Deseja realmente excluir este usuário?';
  openModal(msg, () => {
    const users = loadUsers().filter(u => u.id !== id);
    const remaining = loadTasks().filter(t => t.usuarioId !== id);
    saveUsers(users);
    saveTasks(remaining);
    toast('Usuário excluído.');
    renderUsersTable();
    renderStats();
  });
}
 
function renderUsersTable() {
  const users = loadUsers();
  const tasks = loadTasks();
  const tbody = document.getElementById('users-tbody');
  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:32px">Nenhum usuário cadastrado.</td></tr>`;
    return;
  }
  tbody.innerHTML = users.map(u => {
    const tc = tasks.filter(t => t.usuarioId === u.id).length;
    return `<tr>
      <td><span class="id-badge">#${u.id}</span></td>
      <td><strong>${esc(u.nome)}</strong></td>
      <td>${esc(u.email)}</td>
      <td><span style="font-weight:700;color:var(--blue)">${tc}</span></td>
      <td><div class="td-actions">
        <button class="btn btn-outline btn-sm" onclick="editUser(${u.id})">✏️ Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">🗑 Excluir</button>
      </div></td>
    </tr>`;
  }).join('');
}
 
// ═══════════════════════════════════════════════
//  TASK CRUD
// ═══════════════════════════════════════════════
function populateUserSelect() {
  const users = loadUsers();
  const sel = document.getElementById('task-usuario');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Selecione um usuário…</option>' +
    users.map(u => `<option value="${u.id}">${esc(u.nome)}</option>`).join('');
  if (cur) sel.value = cur;
}
 
function resetTaskForm() {
  document.getElementById('task-edit-id').value = '';
  ['task-usuario','task-desc','task-setor','task-prioridade'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
  });
  document.getElementById('task-form-title').textContent = 'Cadastrar Tarefa';
  clearAllErrors('err-task-', ['usuario','desc','setor','prioridade']);
}
 
function saveTask() {
  const editId    = document.getElementById('task-edit-id').value;
  const usuarioId = Number(document.getElementById('task-usuario').value);
  const desc      = document.getElementById('task-desc').value.trim();
  const setor     = document.getElementById('task-setor').value;
  const prioridade= document.getElementById('task-prioridade').value;
 
  let valid = true;
  clearAllErrors('err-task-', ['usuario','desc','setor','prioridade']);
 
  if (!usuarioId) { setErr('err-task-usuario', 'Selecione um usuário.'); valid = false; }
  if (!desc)      { setErr('err-task-desc', 'Campo obrigatório.'); valid = false; }
  if (!setor)     { setErr('err-task-setor', 'Selecione um setor.'); valid = false; }
  if (!prioridade){ setErr('err-task-prioridade', 'Selecione a prioridade.'); valid = false; }
  if (!valid) return;
 
  const tasks = loadTasks();
  if (editId) {
    const i = tasks.findIndex(t => t.id === Number(editId));
    if (i > -1) {
      tasks[i] = { ...tasks[i], usuarioId, desc, setor, prioridade };
    }
    toast('Tarefa atualizada com sucesso!');
  } else {
    tasks.push({
      id: nextId(tasks),
      usuarioId,
      desc,
      setor,
      prioridade,
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
      status: 'A Fazer'
    });
    toast('Tarefa criada com sucesso!');
  }
  saveTasks(tasks);
  resetTaskForm();
  showView('board');
}
 
function editTask(id) {
  const task = loadTasks().find(t => t.id === id);
  if (!task) return;
  document.getElementById('task-edit-id').value = id;
  populateUserSelect();
  document.getElementById('task-usuario').value   = task.usuarioId;
  document.getElementById('task-desc').value      = task.desc;
  document.getElementById('task-setor').value     = task.setor;
  document.getElementById('task-prioridade').value= task.prioridade;
  document.getElementById('task-form-title').textContent = 'Editar Tarefa';
  clearAllErrors('err-task-', ['usuario','desc','setor','prioridade']);
  showView('new-task');
}
 
function deleteTask(id) {
  openModal('Deseja realmente excluir esta tarefa?', () => {
    saveTasks(loadTasks().filter(t => t.id !== id));
    toast('Tarefa excluída.');
    renderBoard();
    renderStats();
  });
}
 
function changeStatus(id, status) {
  const tasks = loadTasks();
  const i = tasks.findIndex(t => t.id === id);
  if (i > -1) tasks[i].status = status;
  saveTasks(tasks);
  renderBoard();
  renderStats();
}
 
// ═══════════════════════════════════════════════
//  BOARD RENDER
// ═══════════════════════════════════════════════
function populateFilters() {
  const tasks = loadTasks();
  const users = loadUsers();
 
  // setores
  const setores = [...new Set(tasks.map(t => t.setor))].filter(Boolean).sort();
  const fSetor = document.getElementById('filter-setor');
  const curSetor = fSetor.value;
  fSetor.innerHTML = '<option value="">Todos os setores</option>' +
    setores.map(s => `<option value="${s}">${s}</option>`).join('');
  fSetor.value = curSetor;
 
  // usuários
  const fUser = document.getElementById('filter-usuario');
  const curUser = fUser.value;
  fUser.innerHTML = '<option value="">Todos os usuários</option>' +
    users.map(u => `<option value="${u.id}">${esc(u.nome)}</option>`).join('');
  fUser.value = curUser;
}
 
function renderBoard() {
  const allTasks  = loadTasks();
  const users     = loadUsers();
  const fSetor    = document.getElementById('filter-setor').value;
  const fPrio     = document.getElementById('filter-prioridade').value;
  const fUser     = document.getElementById('filter-usuario').value;
 
  let tasks = allTasks;
  if (fSetor) tasks = tasks.filter(t => t.setor === fSetor);
  if (fPrio)  tasks = tasks.filter(t => t.prioridade === fPrio);
  if (fUser)  tasks = tasks.filter(t => String(t.usuarioId) === fUser);
 
  const cols = { 'A Fazer': 'todo', 'Fazendo': 'doing', 'Pronto': 'done' };
 
  for (const [status, colKey] of Object.entries(cols)) {
    const group = tasks.filter(t => t.status === status);
    document.getElementById(`cnt-${colKey}`).textContent = group.length;
    const body = document.getElementById(`col-${colKey}`);
    if (!group.length) {
      body.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><p>Nenhuma tarefa aqui.</p></div>`;
      continue;
    }
    body.innerHTML = group.map(t => {
      const user = users.find(u => u.id === t.usuarioId);
      const initials = user ? user.nome.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?';
      const pClass = { 'Baixa':'prio-baixa', 'Média':'prio-media', 'Alta':'prio-alta' }[t.prioridade] || '';
      return `
      <div class="task-card">
        <div class="task-top">
          <span class="task-sector">${esc(t.setor)}</span>
          <span class="priority-badge ${pClass}">${esc(t.prioridade)}</span>
        </div>
        <div class="task-desc">${esc(t.desc)}</div>
        <div class="task-meta">
          <div class="task-user">
            <div class="task-user-avatar">${initials}</div>
            ${user ? esc(user.nome) : 'Usuário removido'}
          </div>
          <span class="task-date">📅 ${t.dataCadastro || ''}</span>
        </div>
        <div class="task-actions">
          <select class="status-select status-${colKey}" onchange="changeStatus(${t.id}, this.value)">
            <option value="A Fazer"  ${t.status==='A Fazer' ?'selected':''}>🔵 A Fazer</option>
            <option value="Fazendo"  ${t.status==='Fazendo' ?'selected':''}>🟠 Fazendo</option>
            <option value="Pronto"   ${t.status==='Pronto'  ?'selected':''}>🟢 Pronto</option>
          </select>
          <button class="btn btn-outline btn-sm" onclick="editTask(${t.id})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm"  onclick="deleteTask(${t.id})">🗑</button>
        </div>
        <div style="margin-top:6px"><span class="id-badge">#${t.id}</span></div>
      </div>`;
    }).join('');
  }
}
 
// ═══════════════════════════════════════════════
//  STATS
// ═══════════════════════════════════════════════
function renderStats() {
  const tasks = loadTasks();
  const users = loadUsers();
  const high  = tasks.filter(t => t.prioridade === 'Alta').length;
  document.getElementById('stats-bar').innerHTML = `
    <div class="stat"><div class="stat-icon blue">📋</div><div><div class="stat-num">${tasks.length}</div><div class="stat-lbl">Total de Tarefas</div></div></div>
    <div class="stat"><div class="stat-icon orange">🔄</div><div><div class="stat-num">${tasks.filter(t=>t.status==='Fazendo').length}</div><div class="stat-lbl">Em Andamento</div></div></div>
    <div class="stat"><div class="stat-icon green">✅</div><div><div class="stat-num">${tasks.filter(t=>t.status==='Pronto').length}</div><div class="stat-lbl">Concluídas</div></div></div>
    <div class="stat"><div class="stat-icon red">🔴</div><div><div class="stat-num">${high}</div><div class="stat-lbl">Alta Prioridade</div></div></div>
  `;
}
 
// ═══════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
 
// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
(function init() {
  // Seed de dados de exemplo se vazio
  if (!loadUsers().length) {
    saveUsers([
      { id:1, nome:'Ana Souza',     email:'ana.souza@empresa.com.br'    },
      { id:2, nome:'Carlos Lima',   email:'carlos.lima@empresa.com.br'  },
      { id:3, nome:'Mariana Costa', email:'mariana.costa@empresa.com.br'},
    ]);
  }
  if (!loadTasks().length) {
    saveTasks([
      { id:1, usuarioId:1, desc:'Revisar padrões de higiene na linha de produção',  setor:'Qualidade',   prioridade:'Alta',  dataCadastro:'01/06/2025', status:'A Fazer' },
      { id:2, usuarioId:2, desc:'Programar manutenção preventiva dos equipamentos', setor:'Manutenção',  prioridade:'Média', dataCadastro:'02/06/2025', status:'Fazendo'  },
      { id:3, usuarioId:3, desc:'Emitir relatório de produção mensal',               setor:'Produção',    prioridade:'Baixa', dataCadastro:'03/06/2025', status:'Pronto'   },
      { id:4, usuarioId:1, desc:'Auditar fornecedores de matéria-prima',             setor:'Qualidade',   prioridade:'Alta',  dataCadastro:'04/06/2025', status:'A Fazer' },
      { id:5, usuarioId:2, desc:'Organizar cronograma de entregas do mês',           setor:'Logística',   prioridade:'Média', dataCadastro:'05/06/2025', status:'Fazendo'  },
    ]);
  }
  populateFilters();
  renderStats();
  renderBoard();
})();