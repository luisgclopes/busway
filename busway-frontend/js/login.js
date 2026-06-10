const formLogin = document.getElementById('formLogin');
const inputLogin = document.getElementById('inputLogin');
const inputSenha = document.getElementById('inputSenha');
const erroGeral = document.getElementById('erroGeral');
const btnLogin = document.getElementById('btnLogin');
const btnLoginTexto = document.getElementById('btnLoginTexto');
const btnLoginSpinner = document.getElementById('btnLoginSpinner');
const toggleSenha = document.getElementById('toggleSenha');
const iconOlhoAberto = document.getElementById('iconOlhoAberto');
const iconOlhoFechado = document.getElementById('iconOlhoFechado');

const API_BASE = 'http://localhost:8080/api';

function mostrarErroGeral(msg) {
  erroGeral.textContent = msg;
  erroGeral.classList.add('visible');
}

function limparErroGeral() {
  erroGeral.textContent = '';
  erroGeral.classList.remove('visible');
}

function setLoading(loading) {
  btnLogin.disabled = loading;
  btnLoginTexto.style.display = loading ? 'none' : 'inline';
  btnLoginSpinner.style.display = loading ? 'block' : 'none';
}

toggleSenha?.addEventListener('click', () => {
  const visivel = inputSenha.type === 'text';
  inputSenha.type = visivel ? 'password' : 'text';
  iconOlhoAberto.style.display = visivel ? 'block' : 'none';
  iconOlhoFechado.style.display = visivel ? 'none' : 'block';
});

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${API_BASE}/me`, { credentials: 'include' });
    if (!response.ok) return;
    const usuario = await response.json();
    const cargo = (usuario.cargo || '').toUpperCase();
    window.location.href = cargo === 'ADMIN' ? 'admin.html' : 'index.html';
  } catch (_) {}
});

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparErroGeral();
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: inputLogin.value.trim(),
        senha: inputSenha.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarErroGeral(data.erro || 'Não foi possível entrar.');
      return;
    }

    const cargo = (data.cargo || '').toUpperCase();
    window.location.href = cargo === 'ADMIN' ? 'admin.html' : 'index.html';
  } catch (_) {
    mostrarErroGeral('Erro ao conectar com o servidor.');
  } finally {
    setLoading(false);
  }
});