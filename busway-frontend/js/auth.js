const API_BASE = 'http://localhost:8080/api';

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  return response;
}

async function obterUsuarioLogado() {
  const response = await apiFetch('/me', { method: 'GET' });
  if (!response.ok) return null;
  return response.json();
}

async function fazerLogout() {
  await apiFetch('/logout', { method: 'POST' });
  window.location.href = 'login.html';
}

function cargoEhAdmin(usuario) {
  const cargo = (usuario?.cargo || '').toUpperCase();
  return cargo === 'ADMIN';
}

function renderizarTopbar(usuario, pagina) {
  const area = document.getElementById('topbarUserArea');
  if (!area || !usuario) return;

  const links = [];
  // Se for Admin, injeta os dois links de navegação
  if (cargoEhAdmin(usuario)) {
    links.push('<a href="admin.html">Painel</a>');
    links.push('<a href="index.html">Vendas</a>');
  }

  // Desenha os links e o botão de sair
  area.innerHTML = `
    <span>Olá, ${usuario.nome}!</span>
    ${links.join('')}
    <button type="button" id="btnSairTopbar">Sair</button>
  `;

  document.getElementById('btnSairTopbar')?.addEventListener('click', fazerLogout);
}

async function protegerPagina(tipo) {
  const usuario = await obterUsuarioLogado();

  if (!usuario) {
    window.location.href = 'login.html';
    return null;
  }

  if (tipo === 'admin' && !cargoEhAdmin(usuario)) {
    window.location.href = 'index.html';
    return null;
  }

  renderizarTopbar(usuario, tipo);
  window.usuarioLogado = usuario; // Salva o usuário logado na janela para usarmos depois
  return usuario;
}