# 🚀 Guia de Deployment - VinPed Bank

Este guia cobre diferentes opções de deploy para o VinPed Bank.

## 📋 Sumário

- [Opção 1: Vercel + Railway (Recomendado)](#opção-1-vercel--railway-recomendado)
- [Opção 2: Netlify + Render](#opção-2-netlify--render)
- [Opção 3: Deploy com Docker](#opção-3-deploy-com-docker)
- [Configuração de CI/CD](#configuração-de-cicd)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## Opção 1: Vercel + Railway (Recomendado)

### 🎯 Frontend no Vercel

**Vantagens:** Deploy automático, CDN global, HTTPS gratuito, preview deployments

#### Passo a Passo:

1. **Criar conta no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Importar projeto**
   - Clique em "Add New" → "Project"
   - Selecione o repositório `VinPed`
   - Configure as opções:
     ```
     Framework Preset: Vite
     Root Directory: frontend
     Build Command: npm run build
     Output Directory: dist
     ```

3. **Configurar variáveis de ambiente**
   - Em Project Settings → Environment Variables
   - Adicione:
     ```
     VITE_API_URL=https://seu-backend.up.railway.app/api
     ```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar

### 🚂 Backend + Database no Railway

**Vantagens:** PostgreSQL incluído, fácil configuração, deploy automático

#### Passo a Passo:

1. **Criar conta no Railway**
   - Acesse [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Criar novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `VinPed`

3. **Adicionar PostgreSQL**
   - No projeto, clique em "+ New"
   - Selecione "Database" → "PostgreSQL"
   - Railway criará automaticamente o banco

4. **Configurar Backend Service**
   - Clique em "+ New" → "GitHub Repo"
   - Selecione o repositório `VinPed`
   - Configure:
     ```
     Root Directory: backend
     Build Command: npm run build
     Start Command: node dist/server.js
     ```

5. **Configurar variáveis de ambiente**
   - Clique no serviço Backend → Variables
   - Adicione manualmente ou conecte ao PostgreSQL:
     ```bash
     # Conectar ao PostgreSQL automaticamente
     DATABASE_URL=${{Postgres.DATABASE_URL}}

     # Ou configurar manualmente
     DB_HOST=${{Postgres.PGHOST}}
     DB_PORT=${{Postgres.PGPORT}}
     DB_NAME=${{Postgres.PGDATABASE}}
     DB_USER=${{Postgres.PGUSER}}
     DB_PASSWORD=${{Postgres.PGPASSWORD}}

     # Outras variáveis
     PORT=5000
     NODE_ENV=production
     JWT_SECRET=<gere-um-secret-forte>
     JWT_EXPIRES_IN=30d
     CORS_ORIGIN=https://seu-app.vercel.app
     ```

6. **Executar migrations**
   - No Railway, vá em Settings → Service
   - Adicione um "One-off Command":
     ```bash
     npm run db:migrate && npm run db:seed
     ```

7. **Deploy**
   - Railway fará deploy automaticamente
   - Copie a URL gerada (ex: `https://vinped-backend.up.railway.app`)

8. **Atualizar Vercel**
   - Volte ao Vercel
   - Atualize `VITE_API_URL` com a URL do Railway
   - Redeploy o frontend

---

## Opção 2: Netlify + Render

### 🌐 Frontend no Netlify

#### Passo a Passo:

1. **Criar conta no Netlify**
   - Acesse [netlify.com](https://netlify.com)
   - Login com GitHub

2. **Importar projeto**
   - "Add new site" → "Import an existing project"
   - Conecte ao repositório GitHub
   - Configure:
     ```
     Base directory: frontend
     Build command: npm run build
     Publish directory: frontend/dist
     ```

3. **Variáveis de ambiente**
   - Site settings → Environment variables
   - Adicione: `VITE_API_URL`

4. **Deploy**

### 🔧 Backend no Render

#### Passo a Passo:

1. **Criar conta no Render**
   - Acesse [render.com](https://render.com)
   - Login com GitHub

2. **Criar PostgreSQL**
   - Dashboard → New → PostgreSQL
   - Nome: `vinped-db`
   - Region: escolha mais próxima
   - Copie a "Internal Database URL"

3. **Criar Web Service**
   - Dashboard → New → Web Service
   - Conecte ao repositório
   - Configure:
     ```
     Name: vinped-backend
     Root Directory: backend
     Build Command: npm install && npm run build
     Start Command: node dist/server.js
     ```

4. **Variáveis de ambiente**
   - Environment → Add Environment Variable
   - Use a DATABASE_URL do PostgreSQL criado
   - Adicione outras variáveis

5. **Run migrations**
   - Na primeira vez, use o Shell do Render:
     ```bash
     npm run db:migrate && npm run db:seed
     ```

---

## Opção 3: Deploy com Docker

### 🐳 Docker Compose (Completo)

#### Desenvolvimento Local:

```bash
# Criar arquivo .env na raiz
cp .env.example .env

# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

#### Produção (VPS/Cloud):

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Migrations
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

### ☁️ Deploy em Cloud Providers

**AWS ECS / Google Cloud Run / Azure Container Instances:**

1. Build e push das images:
   ```bash
   # Frontend
   docker build -t vinped-frontend:latest -f frontend/Dockerfile .
   docker tag vinped-frontend:latest <registry>/vinped-frontend:latest
   docker push <registry>/vinped-frontend:latest

   # Backend
   docker build -t vinped-backend:latest -f backend/Dockerfile .
   docker tag vinped-backend:latest <registry>/vinped-backend:latest
   docker push <registry>/vinped-backend:latest
   ```

2. Configure o serviço de container com as variáveis de ambiente

3. Configure o banco de dados (RDS, Cloud SQL, etc.)

---

## Configuração de CI/CD

### GitHub Actions

O projeto já vem com GitHub Actions configurado (`.github/workflows/ci.yml`).

#### Configurar Secrets no GitHub:

1. Vá em: `Settings` → `Secrets and variables` → `Actions`

2. Adicione os secrets:
   ```
   VERCEL_TOKEN          # Token do Vercel
   VERCEL_ORG_ID         # ID da organização Vercel
   VERCEL_PROJECT_ID     # ID do projeto Vercel
   VITE_API_URL          # URL do backend em produção
   ```

#### Para obter os tokens do Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link ao projeto
cd frontend
vercel link

# Ver informações (ORG_ID e PROJECT_ID estarão em .vercel/project.json)
cat .vercel/project.json

# Gerar token
# Acesse: https://vercel.com/account/tokens
```

### Railway Deploy Automático

Railway detecta pushes automaticamente se você:
1. Conectou o repositório GitHub
2. Configurou o service corretamente

---

## Variáveis de Ambiente

### 🔑 Gerar JWT Secret Forte

```bash
# Linux/Mac
openssl rand -base64 64

# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Online
# https://generate-secret.vercel.app/64
```

### 📝 Checklist de Variáveis

#### Frontend (Vercel/Netlify):
- [ ] `VITE_API_URL` - URL do backend

#### Backend (Railway/Render):
- [ ] `DATABASE_URL` ou (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)
- [ ] `PORT` (geralmente 5000)
- [ ] `NODE_ENV` (production)
- [ ] `JWT_SECRET` (gerado com openssl)
- [ ] `JWT_EXPIRES_IN` (ex: 30d)
- [ ] `CORS_ORIGIN` (URL do frontend)

---

## 🧪 Testar Deploy

### Endpoints de Health Check:

```bash
# Backend
curl https://seu-backend.up.railway.app/health

# Frontend
curl https://seu-app.vercel.app
```

### Testar Autenticação:

```bash
# Registrar usuário
curl -X POST https://seu-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123456"
  }'

# Login
curl -X POST https://seu-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

---

## 🐛 Troubleshooting

### Problema: Frontend não conecta ao Backend

**Solução:**
1. Verifique `VITE_API_URL` no Vercel
2. Confirme `CORS_ORIGIN` no Railway
3. Certifique-se de que o backend está rodando (health check)

### Problema: Database connection failed

**Solução:**
1. Verifique as variáveis `DATABASE_URL` ou `DB_*`
2. Teste conexão direta com psql
3. Verifique se o PostgreSQL está online no Railway/Render

### Problema: JWT errors

**Solução:**
1. Confirme que `JWT_SECRET` é o mesmo em todos os ambientes
2. Não use caracteres especiais que precisam escape

### Problema: Build fails

**Solução:**
1. Verifique logs completos no Railway/Vercel
2. Teste build localmente: `npm run build`
3. Confirme que todas as dependências estão em `dependencies` (não `devDependencies`)

---

## 📚 Recursos Adicionais

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

## 🎉 Deploy Checklist

Antes de considerar o deploy completo:

- [ ] Frontend acessível via HTTPS
- [ ] Backend acessível via HTTPS
- [ ] Database migrations executadas
- [ ] Categorias padrão seedadas
- [ ] Registro de usuário funcionando
- [ ] Login funcionando
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente em produção
- [ ] CI/CD configurado
- [ ] Health checks passando
- [ ] Logs sendo monitorados

---

**Última atualização:** 2025-11-20
