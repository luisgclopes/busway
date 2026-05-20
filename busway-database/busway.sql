-- 1. LIMPEZA
DROP TABLE IF EXISTS venda CASCADE;
DROP TABLE IF EXISTS poltrona CASCADE;
DROP TABLE IF EXISTS viagem CASCADE;
DROP TABLE IF EXISTS onibus CASCADE;
DROP TABLE IF EXISTS rota CASCADE;
DROP TABLE IF EXISTS funcionario CASCADE;
DROP TABLE IF EXISTS passageiro CASCADE;

-- 2. CRIAÇÃO DAS TABELAS
CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

-- Tabela nova que o seu Java estava sentindo falta:
CREATE TABLE passageiro (
    id_passageiro SERIAL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE rota (
    id_rota SERIAL PRIMARY KEY,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL
);

CREATE TABLE onibus (
    id_onibus SERIAL PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    capacidade INT NOT NULL
);

CREATE TABLE poltrona (
    id_poltrona SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    id_onibus INT REFERENCES onibus(id_onibus) ON DELETE CASCADE
);

CREATE TABLE viagem (
    id_viagem SERIAL PRIMARY KEY,
    id_rota INT REFERENCES rota(id_rota) ON DELETE CASCADE,
    id_onibus INT REFERENCES onibus(id_onibus) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora TIME NOT NULL
);

CREATE TABLE venda (

    id_venda SERIAL PRIMARY KEY,
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    id_viagem INT REFERENCES viagem(id_viagem),
    id_poltrona INT REFERENCES poltrona(id_poltrona),
    id_passageiro INT REFERENCES passageiro(id_passageiro),
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preco NUMERIC(10,2),
    CONSTRAINT unica_poltrona_por_viagem UNIQUE (id_viagem, id_poltrona)
);

-- 3. POPULAR OS DADOS
INSERT INTO funcionario (nome, cargo) VALUES ('Atendente Teste', 'FUNCIONARIO');

INSERT INTO rota (origem, destino) VALUES ('Seropédica', 'Rio de Janeiro');
INSERT INTO rota (origem, destino) VALUES ('Seropédica', 'Nova Iguaçu');
INSERT INTO rota (origem, destino) VALUES ('Nova Iguaçu', 'São Paulo');

INSERT INTO onibus (placa, capacidade) VALUES ('KJN-1234', 40);
INSERT INTO onibus (placa, capacidade) VALUES ('XYZ-9876', 44);

INSERT INTO poltrona (numero, id_onibus) SELECT generate_series(1, 40), 1;
INSERT INTO poltrona (numero, id_onibus) SELECT generate_series(1, 44), 2;

INSERT INTO viagem (id_rota, id_onibus, data, hora) VALUES (1, 1, '2026-05-19', '08:00:00');
INSERT INTO viagem (id_rota, id_onibus, data, hora) VALUES (2, 2, '2026-05-19', '14:30:00');