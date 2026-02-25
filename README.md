# CRUD Simples Backend

API Node.js/Express com PostgreSQL e autenticação JWT.

## Variáveis de ambiente

Copie `.env` e preencha valores:

```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=senha
DB_NAME=crud_simples
DB_PORT=5432

# auth
JWT_SECRET=uma_chave_secreta
FRONTEND_URL=http://localhost:5173

# mailer (se não precisar de emails reais, deixe as configurações padrão e o servidor usará um
# `ethereal.email` automático para desenvolvimento)
EMAIL_HOST=smtp.exemplo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=usuario
EMAIL_PASS=senha
```

- Se `EMAIL_HOST` for ausente ou igual a `smtp.example.com`, o backend cria uma conta de teste
  [Ethereal](https://ethereal.email) e imprime no console a URL para visualizar o email enviado.
  Isso evita o erro `getaddrinfo ENOTFOUND` em ambiente de desenvolvimento.
- Você pode definir `EMAIL_FROM=meu@endereco.com` para alterar o remetente usado nos emails.
- Ao iniciar, o servidor faz uma tentativa de verificação (`transporter.verify()`) e mostra no console
  se a conexão SMTP foi estabelecida com sucesso ou se houve erro.

## Inicialização

```bash
npm install
npm run dev
```

- `/auth/register`, `/auth/login` etc.
- Rotas de usuários são protegidas e requerem header `Authorization: Bearer <token>`

## Migrações

O arquivo `init.sql` cria a tabela `users` com colunas de senha e recuperação.

