# Busway

Sistema de venda de passagens rodoviárias desenvolvido como projeto acadêmico para a disciplina de Projeto de Software 2026.1 da UFRRJ, com frontend em HTML/CSS/JavaScript, backend em Spring Boot e banco de dados PostgreSQL.

## Tecnologias utilizadas

- Frontend: HTML, CSS, JavaScript
- Backend: Java 17, Spring Boot, Spring Data JPA
- Banco de dados: PostgreSQL
- Ferramentas: Maven, VS Code, DBeaver

## Estrutura do repositório

```bash
busway/
├── busway-frontend/   # Interface do usuário
├── busway-backend/    # API e regras de negócio
└── busway-database/   # Script SQL do banco de dados
```

## Funcionalidades

- Busca de viagens por origem, destino e data
- Seleção de poltronas
- Cadastro de passageiro
- Emissão de passagem
- Painel administrativo para cadastro de ônibus, rotas e viagens
- Persistência de dados em PostgreSQL
- Bloqueio de venda duplicada de poltrona por viagem

## Como executar o projeto

### 1. Banco de dados

Criar um banco PostgreSQL chamado `busway`.

Depois, executar o script:

```sql
busway-database/busway.sql
```

### 2. Backend

Entrar na pasta do backend:

```bash
cd busway-backend
```

Executar o projeto com Maven Wrapper:

```bash
./mvnw spring-boot:run
```

Ou rodar a aplicação pelo VS Code.

### 3. Frontend

Abrir os arquivos do frontend no navegador:

- `busway-frontend/index.html`
- `busway-frontend/admin.html`

Se necessário, usar uma extensão como Live Server.

## Configuração do banco no backend

O backend está configurado para acessar o PostgreSQL local com os seguintes dados:

- Host: `localhost`
- Porta: `5432`
- Banco: `busway`
- Usuário: `postgres`
- Senha: `busway`

Essas configurações podem ser alteradas no arquivo:

```bash
busway-backend/src/main/resources/application.properties
```

## Endpoints principais

- `GET /api/rotas`
- `GET /api/onibus`
- `GET /api/viagens`
- `GET /api/admin/viagens`
- `GET /api/viagens/{id}/poltronas-ocupadas`
- `POST /api/vendas`
- `POST /api/admin/onibus`
- `POST /api/admin/rotas`
- `POST /api/admin/viagens`

## Banco de dados

As principais tabelas do sistema são:

- `funcionario`
- `passageiro`
- `rota`
- `onibus`
- `poltrona`
- `viagem`
- `venda`

## Observações

- O projeto utiliza Hibernate/JPA para persistência dos dados.
- As consultas SQL podem ser visualizadas no terminal do backend por meio do log do Hibernate.
- Os dados cadastrados ficam persistidos no PostgreSQL mesmo após reiniciar a aplicação.

## Autores

Projeto desenvolvido para fins acadêmicos.