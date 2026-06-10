const URL_BASE = 'http://localhost:8080/api';

// Estado global da aplicação
let estado = {
  viagemSelecionada: null,
  poltronaSelecionada: null,
  passageiro: { nome: '', cpf: '' }
};

// Referências do DOM
const DOM = {
  selOrigem: document.getElementById('selOrigem'),
  selDestino: document.getElementById('selDestino'),
  inputData: document.getElementById('inputData'),
  containerViagens: document.getElementById('listaViagensContainer'),
  busMapContainer: document.getElementById('busMapContainer'),
  btnBuscarViagens: document.getElementById('btnBuscarViagens'),
  btnAvancarPoltronas: document.getElementById('btnAvancarPoltronas'),
  btnAvancarPassageiro: document.getElementById('btnAvancarPassageiro'),
  btnFinalizarVenda: document.getElementById('btnFinalizarVenda'),
  inputNome: document.getElementById('inputNome'),
  inputCpf: document.getElementById('inputCpf')
};

/* ==========================================================================
   FUNÇÕES DE ACESSO AO BACKEND (Integração Spring Boot)
   ========================================================================== */

async function carregarRotasDisponiveis() {
  try {
    const res = await fetch(`${URL_BASE}/rotas`, { credentials: 'include' });
    if (!res.ok) throw new Error('Falha ao conectar com o servidor');

    const rotas = await res.json();

    const origens = [...new Set(rotas.map(r => r.origem))];
    const destinos = [...new Set(rotas.map(r => r.destino))];

    const popularSelect = (selectElem, lista) => {
      selectElem.innerHTML = '<option value="">Selecione...</option>';
      lista.forEach(cidade => {
        selectElem.innerHTML += `<option value="${cidade}">${cidade}</option>`;
      });
    };

    popularSelect(DOM.selOrigem, origens);
    popularSelect(DOM.selDestino, destinos);
  } catch (error) {
    console.error(error);
    mostrarToast('Backend indisponível. Ligue o servidor Spring Boot.');
  }
}

async function buscarViagens(origem, destino, data) {
  const res = await fetch(`${URL_BASE}/viagens?origem=${origem}&destino=${destino}&data=${data}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar viagens');
  return await res.json();
}

async function buscarPoltronasOcupadas(idViagem) {
  const res = await fetch(`${URL_BASE}/viagens/${idViagem}/poltronas-ocupadas`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao consultar ocupação');
  return await res.json();
}

async function emitirPassagemNoServidor(payload) {
  const res = await fetch(`${URL_BASE}/vendas`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.status === 409) {
    throw new Error('Poltrona já foi vendida por outro guichê. Selecione outra.');
  }
  if (!res.ok) throw new Error('Erro interno ao finalizar venda');

  return await res.json();
}

/* ==========================================================================
   LÓGICA DA INTERFACE DE USUÁRIO
   ========================================================================== */

function mostrarToast(msg, tipo = 'erro') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${tipo === 'sucesso' ? 'success' : ''}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function mudarTela(idTela, numStep) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(idTela).classList.add('active');

  for (let i = 1; i <= 4; i++) {
    const st = document.getElementById('step' + i);
    st.classList.remove('active', 'done');
    if (i < numStep) st.classList.add('done');
    if (i === numStep) st.classList.add('active');
  }
}

function atualizarResumo() {
  document.getElementById('resOrigem').innerText = DOM.selOrigem.value || '-';
  document.getElementById('resDestino').innerText = DOM.selDestino.value || '-';
  document.getElementById('resData').innerText = DOM.inputData.value
    ? DOM.inputData.value.split('-').reverse().join('/') : '-';

  document.getElementById('resHora').innerText = estado.viagemSelecionada
    ? estado.viagemSelecionada.horario : '-';
  document.getElementById('resOnibus').innerText = estado.viagemSelecionada
    ? estado.viagemSelecionada.onibus_placa : '-';
  document.getElementById('resValor').innerText = estado.viagemSelecionada
    ? `R$ ${estado.viagemSelecionada.valor.toFixed(2).replace('.', ',')}` : 'R$ 0,00';

  document.getElementById('resPoltrona').innerText = estado.poltronaSelecionada
    ? String(estado.poltronaSelecionada).padStart(2, '0') : '-';
  document.getElementById('resPassageiro').innerText = estado.passageiro.nome || '-';
}

function preencherPassagem() {
  const dataFormatada = DOM.inputData.value
    ? DOM.inputData.value.split('-').reverse().join('/') : '-';
  const dataEmissao = new Date().toLocaleString('pt-BR');

  document.getElementById('ticketEmissao').innerText = dataEmissao;
  document.getElementById('ticketOrigem').innerText = DOM.selOrigem.value || '-';
  document.getElementById('ticketDestino').innerText = DOM.selDestino.value || '-';
  document.getElementById('ticketData').innerText = dataFormatada;
  document.getElementById('ticketHora').innerText = estado.viagemSelecionada
    ? estado.viagemSelecionada.horario : '-';
  document.getElementById('ticketPlaca').innerText = estado.viagemSelecionada
    ? estado.viagemSelecionada.onibus_placa : '-';
  document.getElementById('ticketPoltrona').innerText = estado.poltronaSelecionada
    ? String(estado.poltronaSelecionada).padStart(2, '0') : '-';
  document.getElementById('ticketNome').innerText = estado.passageiro.nome || '-';
  document.getElementById('ticketCpf').innerText = estado.passageiro.cpf || '-';
  document.getElementById('ticketValor').innerText = estado.viagemSelecionada
    ? `R$ ${estado.viagemSelecionada.valor.toFixed(2).replace('.', ',')}` : 'R$ 0,00';
}

// Inicialização: Protege a página, desenha a Topbar e carrega as rotas
window.addEventListener('DOMContentLoaded', async () => {
  const usuario = await protegerPagina('index');
  if (usuario) {
    carregarRotasDisponiveis();
  }
});

// AÇÃO: Buscar Viagens
DOM.btnBuscarViagens.addEventListener('click', async () => {
  const origem = DOM.selOrigem.value;
  const destino = DOM.selDestino.value;
  const data = DOM.inputData.value;

  if (!origem || !destino || !data) return mostrarToast('Preencha origem, destino e data.');
  if (origem === destino) return mostrarToast('Origem e destino não podem ser iguais.');

  DOM.btnBuscarViagens.disabled = true;
  DOM.btnBuscarViagens.innerText = 'Buscando...';

  try {
    const viagens = await buscarViagens(origem, destino, data);

    DOM.containerViagens.innerHTML = '';
    if (viagens.length === 0) {
      DOM.containerViagens.innerHTML = '<p class="empty-state">Nenhuma viagem encontrada para esta data.</p>';
    } else {
      viagens.forEach(v => {
        const div = document.createElement('div');
        div.className = 'trip-card';
        div.innerHTML = `
          <div class="trip-info">
            <strong>${v.horario}</strong>
            <span>Placa: ${v.onibus_placa} | Capacidade: ${v.capacidade} lugares</span>
          </div>
          <div class="trip-price">R$ ${v.valor.toFixed(2).replace('.', ',')}</div>
        `;
        div.onclick = () => {
          document.querySelectorAll('.trip-card').forEach(el => el.classList.remove('selected'));
          div.classList.add('selected');
          estado.viagemSelecionada = v;
          estado.poltronaSelecionada = null;
          DOM.btnAvancarPoltronas.disabled = false;
          atualizarResumo();
        };
        DOM.containerViagens.appendChild(div);
      });
    }
    mudarTela('screenViagens', 1);
  } catch (error) {
    mostrarToast(error.message);
  } finally {
    DOM.btnBuscarViagens.disabled = false;
    DOM.btnBuscarViagens.innerText = 'Buscar Viagens';
    atualizarResumo();
  }
});

// AÇÃO: Renderizar Mapa Horizontal
DOM.btnAvancarPoltronas.addEventListener('click', async () => {
  DOM.busMapContainer.innerHTML = '';
  DOM.btnAvancarPassageiro.disabled = true;

  try {
    const ocupadas = await buscarPoltronasOcupadas(estado.viagemSelecionada.id_viagem);
    const capacidade = estado.viagemSelecionada.capacidade;

    const colunas = Math.ceil(capacidade / 4);

    for (let c = 0; c < colunas; c++) {
      const divCol = document.createElement('div');
      divCol.className = 'seat-column';

      for (let s = 1; s <= 4; s++) {
        const numeroPoltrona = (c * 4) + s;
        if (numeroPoltrona > capacidade) break;

        const btnSeat = document.createElement('button');
        btnSeat.className = 'seat';
        btnSeat.innerText = String(numeroPoltrona).padStart(2, '0');

        if (ocupadas.includes(numeroPoltrona)) {
          btnSeat.classList.add('occupied');
        } else {
          btnSeat.onclick = () => {
            document.querySelectorAll('.seat').forEach(el => el.classList.remove('selected'));
            btnSeat.classList.add('selected');
            estado.poltronaSelecionada = numeroPoltrona;
            DOM.btnAvancarPassageiro.disabled = false;
            atualizarResumo();
          };
        }

        divCol.appendChild(btnSeat);

        // Corredor visual entre assento 2 e 3
        if (s === 2) {
          const corredor = document.createElement('div');
          corredor.className = 'aisle-horizontal';
          divCol.appendChild(corredor);
        }
      }
      DOM.busMapContainer.appendChild(divCol);
    }
    mudarTela('screenPoltronas', 2);
  } catch (error) {
    mostrarToast(error.message);
  }
});

DOM.btnAvancarPassageiro.addEventListener('click', () => mudarTela('screenPassageiro', 3));

// Atualização dinâmica do formulário de passageiro
DOM.inputNome.addEventListener('input', (e) => {
  estado.passageiro.nome = e.target.value;
  atualizarResumo();
});

DOM.inputCpf.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 3) v = v.substring(0, 3) + '.' + v.substring(3);
  if (v.length > 7) v = v.substring(0, 7) + '.' + v.substring(7);
  if (v.length > 11) v = v.substring(0, 11) + '-' + v.substring(11);
  e.target.value = v;
  estado.passageiro.cpf = v;
});

// AÇÃO: Finalizar Venda e persistir
DOM.btnFinalizarVenda.addEventListener('click', async () => {
  if (!estado.passageiro.cpf || !estado.passageiro.nome) {
    return mostrarToast('Preencha todos os dados do passageiro.');
  }

  DOM.btnFinalizarVenda.disabled = true;
  DOM.btnFinalizarVenda.innerText = 'Processando...';

  const payloadVenda = {
    id_viagem: estado.viagemSelecionada.id_viagem,
    numero_poltrona: estado.poltronaSelecionada,
    passageiro_cpf: estado.passageiro.cpf,
    passageiro_nome: estado.passageiro.nome,
    id_funcionario: window.usuarioLogado.idFuncionario, // ID dinâmico real do banco!
    valor: estado.viagemSelecionada.valor
  };

  try {
    await emitirPassagemNoServidor(payloadVenda);
    preencherPassagem();
    mudarTela('screenSucesso', 4);
  } catch (error) {
    mostrarToast(error.message);
  } finally {
    DOM.btnFinalizarVenda.disabled = false;
    DOM.btnFinalizarVenda.innerText = 'Finalizar Venda';
  }
});

function resetarFluxo() {
  estado = { viagemSelecionada: null, poltronaSelecionada: null, passageiro: { nome: '', cpf: '' } };
  DOM.inputNome.value = '';
  DOM.inputCpf.value = '';
  DOM.containerViagens.innerHTML = '<p class="empty-state">Preencha a busca ao lado para ver os horários disponíveis.</p>';
  DOM.btnAvancarPoltronas.disabled = true;
  DOM.btnAvancarPassageiro.disabled = true;
  atualizarResumo();
  mudarTela('screenViagens', 1);
}