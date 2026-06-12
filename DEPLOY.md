# Deploy Agenda DG

Este projeto tem duas partes:

- Frontend React/Vite na raiz de `Agenda DG`.
- Backend Node/Express em `Agenda DG/backend`.

## 1. Railway - Backend

Crie um projeto no Railway apontando para a pasta:

```txt
backend
```

Comando de start:

```bash
npm start
```

Variaveis:

```txt
JWT_SECRET=crie-uma-chave-grande-e-segura
CORS_ORIGIN=https://seu-site.vercel.app
DATABASE_PATH=/data/agenda-dg.sqlite
ADMIN_NAME=Administrador
ADMIN_PHONE=85999990000
ADMIN_PASSWORD=uma-senha-segura
```

Crie um volume persistente e monte em:

```txt
/data
```

Sem esse volume, o SQLite pode perder os dados quando o Railway reiniciar.

Depois do deploy, copie a URL do backend. Exemplo:

```txt
https://agenda-dg-backend.up.railway.app
```

## 2. Vercel - Frontend

Crie um projeto na Vercel apontando para a pasta:

```txt
Agenda DG
```

Build command:

```bash
npm run build
```

Output directory:

```txt
dist
```

Variavel:

```txt
VITE_API_URL=https://agenda-dg-backend.up.railway.app
```

Depois que a Vercel gerar a URL final, volte no Railway e ajuste:

```txt
CORS_ORIGIN=https://sua-url-da-vercel.vercel.app
```

## 3. Teste final

1. Abra o site na Vercel.
2. Crie cadastro de cliente.
3. Agende um horario.
4. Tente agendar o mesmo dia e horario de novo.
5. A API deve bloquear o horario repetido.
6. Entre no admin com `ADMIN_PHONE` e `ADMIN_PASSWORD`.
7. Veja o agendamento no dashboard.
