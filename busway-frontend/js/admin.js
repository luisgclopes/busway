const URL_BASE = 'http://localhost:8080/api';

const DOM = {
  inputPlaca: document.getElementById('inputPlaca'),
  inputCapacidade: document.getElementById('inputCapacidade'),
  btnSalvarOnibus: document.getElementById('btnSalvarOnibus'),

  inputOrigem: document.getElementById('inputOrigem'),
  inputDestino: document.getElementById('inputDestino'),
  btnSalvarRota: document.getElementById('btnSalvarRota'),

  selectRota: document.getElementById('selectRota'),
  selectOnibus: document.getElementById('selectOnibus'),
  inputDataViagem: document.getElementById('inputDataViagem'),
  inputHoraViagem: document.getElementById('inputHoraViagem'),
  btnSalvarViagem: document.getElementById('btnSalvarViagem'),

  listaOnibus: document.getElementById('listaOnibus'),
  listaRotas: document.getElementById('listaRotas'),
  listaViagens: document.getElementById('listaViagens'),
  toast: document.getElementById('toast')
};

function mostrarToast(msg, tipo = 'erro') {
  DOM.toast.textContent = msg;
  DOM.toast.className = `toast show ${tipo === 'sucesso' ? 'success' : ''}`;
  setTimeout(() => DOM.toast.classList.remove('show'), 3000);
}

async function req(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Erro na requisição');
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }
  return null;
}

function renderList(container, items, renderItem, emptyText) {
  container.innerHTML = '';
  if (!items || items.length === 0) {
    container.innerHTML = `<p class="empty-state">${emptyText}</p>`;
    return;
  }
  items.forEach(item => container.appendChild(renderItem(item)));
}

function makeItem(title, lines) {
  const div = document.createElement('div');
  div.className = 'list-item';
  div.innerHTML = `
    <strong>${title}</strong>
    ${lines.map(l => `<span>${l}</span>`).join('')}
  `;
  return div;
}

async function carregarOnibus() {
  const onibus = await req(`${URL_BASE}/onibus`);
  renderList(
    DOM.listaOnibus,
    onibus,
    o => makeItem(`Ônibus ${o.placa}`, [
      `ID: ${o.idOnibus}`,
      `Capacidade: ${o.capacidade} lugares`
    ]),
    'Nenhum ônibus cadastrado.'
  );

  DOM.selectOnibus.innerHTML = '<option value="">Selecione um ônibus</option>';
  onibus.forEach(o => {
    const option = document.createElement('option');
    option.value = o.idOnibus;
    option.textContent = `${o.placa} - ${o.capacidade} lugares`;
    DOM.selectOnibus.appendChild(option);
  });
}

async function carregarRotas() {
  const rotas = await req(`${URL_BASE}/rotas`);
  renderList(
    DOM.listaRotas,
    rotas,
    r => makeItem(`${r.origem} → ${r.destino}`, [
      `ID: ${r.idRota}`
    ]),
    'Nenhuma rota cadastrada.'
  );

  DOM.selectRota.innerHTML = '<option value="">Selecione uma rota</option>';
  rotas.forEach(r => {
    const option = document.createElement('option');
    option.value = r.idRota;
    option.textContent = `${r.origem} → ${r.destino}`;
    DOM.selectRota.appendChild(option);
  });
}

async function carregarViagens() {
  const viagens = await req(`${URL_BASE}/admin/viagens`);
  renderList(
    DOM.listaViagens,
    viagens,
    v => makeItem(`${v.rota.origem} → ${v.rota.destino}`, [
      `ID: ${v.idViagem}`,
      `Ônibus: ${v.onibus.placa}`,
      `Data: ${new Date(v.data).toLocaleDateString('pt-BR')}`,
      `Hora: ${String(v.hora).slice(0, 5)}`
    ]),
    'Nenhum horário cadastrado.'
  );
}

async function carregarTudo() {
  try {
    await Promise.all([carregarOnibus(), carregarRotas(), carregarViagens()]);
  } catch (error) {
    console.error(error);
    mostrarToast('Erro ao carregar dados do painel.');
  }
}

DOM.btnSalvarOnibus.addEventListener('click', async () => {
  const placa = DOM.inputPlaca.value.trim().toUpperCase();
  const capacidade = parseInt(DOM.inputCapacidade.value, 10);

  if (!placa || !capacidade) {
    return mostrarToast('Preencha placa e capacidade.');
  }

  try {
    await req(`${URL_BASE}/admin/onibus`, {
      method: 'POST',
      body: JSON.stringify({ placa, capacidade })
    });

    DOM.inputPlaca.value = '';
    DOM.inputCapacidade.value = '';
    mostrarToast('Ônibus cadastrado com sucesso.', 'sucesso');
    await carregarOnibus();
  } catch (error) {
    mostrarToast(error.message);
  }
});

DOM.btnSalvarRota.addEventListener('click', async () => {
  const origem = DOM.inputOrigem.value.trim();
  const destino = DOM.inputDestino.value.trim();

  if (!origem || !destino) {
    return mostrarToast('Preencha origem e destino.');
  }

  try {
    await req(`${URL_BASE}/admin/rotas`, {
      method: 'POST',
      body: JSON.stringify({ origem, destino })
    });

    DOM.inputOrigem.value = '';
    DOM.inputDestino.value = '';
    mostrarToast('Rota cadastrada com sucesso.', 'sucesso');
    await carregarRotas();
  } catch (error) {
    mostrarToast(error.message);
  }
});

DOM.btnSalvarViagem.addEventListener('click', async () => {
  const id_rota = parseInt(DOM.selectRota.value, 10);
  const id_onibus = parseInt(DOM.selectOnibus.value, 10);
  const data = DOM.inputDataViagem.value;
  const hora = DOM.inputHoraViagem.value;

  if (!id_rota || !id_onibus || !data || !hora) {
    return mostrarToast('Selecione rota, ônibus, data e hora.');
  }

  try {
    await req(`${URL_BASE}/admin/viagens`, {
      method: 'POST',
      body: JSON.stringify({ id_rota, id_onibus, data, hora })
    });

    DOM.inputDataViagem.value = '';
    DOM.inputHoraViagem.value = '';
    mostrarToast('Horário cadastrado com sucesso.', 'sucesso');
    await carregarViagens();
  } catch (error) {
    mostrarToast(error.message);
  }
});

window.addEventListener('DOMContentLoaded', carregarTudo);