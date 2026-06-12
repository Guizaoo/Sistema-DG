# Agenda DG Backend

API Node.js/Express para o projeto Agenda DG.

## O que este backend faz

- Cadastro de cliente.
- Login de cliente com token JWT.
- Cadastro de agendamento.
- Listagem de agendamentos para admin.
- Bloqueio de horario repetido no mesmo dia com `UNIQUE (date, time)`.
- Banco SQLite.

## Rotas

### Saude

`GET /health`

### Autenticacao

`POST /auth/register`

```json
{
  "name": "Cliente Teste",
  "phone": "(85) 99999-1234",
  "password": "1234"
}
```

`POST /auth/login`

```json
{
  "phone": "(85) 99999-1234",
  "password": "1234"
}
```

`GET /auth/me`

Precisa do header:

```txt
Authorization: Bearer TOKEN
```

### Agendamentos

`GET /appointments/available-times?date=2026-06-12`

Retorna horarios ocupados naquele dia.

`POST /appointments`

```json
{
  "client": "Cliente Teste",
  "phone": "(85) 99999-1234",
  "service": "Corte masculino",
  "date": "2026-06-12",
  "time": "10:00",
  "notes": "Preferencia por corte baixo"
}
```

Se ja existir agendamento no mesmo `date + time`, a API retorna erro `409`.

`GET /appointments`

Lista todos os agendamentos. Precisa de usuario admin.

`PATCH /appointments/:id/status`

Atualiza status. Precisa de usuario admin.

```json
{
  "status": "Confirmado"
}
```

## Rodar localmente

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API local:

```txt
http://localhost:3001
```

## Railway

No Railway:

1. Criar um novo projeto.
2. Conectar o repositorio.
3. Definir o diretório do serviço como `backend`.
4. Configurar variaveis:

```txt
JWT_SECRET=uma-chave-grande-e-segura
CORS_ORIGIN=https://seu-site.vercel.app
DATABASE_PATH=/data/agenda-dg.sqlite
ADMIN_NAME=Administrador
ADMIN_PHONE=85999990000
ADMIN_PASSWORD=uma-senha-segura
```

5. Criar um volume persistente e montar em:

```txt
/data
```

Sem volume, o SQLite pode perder dados quando o container reiniciar.

O admin inicial e criado automaticamente quando `ADMIN_NAME`,
`ADMIN_PHONE` e `ADMIN_PASSWORD` estiverem configurados.

## Observacao importante

SQLite e barato e simples, mas em producao precisa de volume persistente. Para uma barbearia pequena, funciona bem no comeco.
