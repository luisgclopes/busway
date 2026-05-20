-- 1. Inserir Funcionário (O frontend envia id_funcionario: 1)
INSERT INTO funcionario (nome, cargo) VALUES ('Atendente Teste', 'FUNCIONARIO');

-- 2. Inserir Rotas
INSERT INTO rota (origem, destino) VALUES ('Seropédica', 'Rio de Janeiro');
INSERT INTO rota (origem, destino) VALUES ('Seropédica', 'Nova Iguaçu');
INSERT INTO rota (origem, destino) VALUES ('Nova Iguaçu', 'São Paulo');

-- 3. Inserir Ônibus
INSERT INTO onibus (placa, capacidade) VALUES ('KJN-1234', 40);
INSERT INTO onibus (placa, capacidade) VALUES ('XYZ-9876', 44);

-- 4. Inserir Poltronas automaticamente (Funcionalidade incrível do PostgreSQL)
-- Gera as poltronas de 1 a 40 para o ônibus 1
INSERT INTO poltrona (numero, id_onibus) SELECT generate_series(1, 40), 1;
-- Gera as poltronas de 1 a 44 para o ônibus 2
INSERT INTO poltrona (numero, id_onibus) SELECT generate_series(1, 44), 2;

-- 5. Inserir Viagens para a data de teste do seu frontend (19/05/2026)
-- Viagem 1: Seropédica -> Rio de Janeiro (id_rota = 1) no Ônibus KJN-1234 (id_onibus = 1)
INSERT INTO viagem (id_rota, id_onibus, data, hora) 
VALUES (1, 1, '2026-05-19', '08:00:00');

-- Viagem 2: Seropédica -> Nova Iguaçu (id_rota = 2) no Ônibus XYZ-9876 (id_onibus = 2)
INSERT INTO viagem (id_rota, id_onibus, data, hora) 
VALUES (2, 2, '2026-05-19', '14:30:00');