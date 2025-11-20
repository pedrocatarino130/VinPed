# VinPed Bank - Sistema de Gestão Financeira Pessoal

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

Sistema completo de gestão financeira pessoal com carteiras virtuais, categorização inteligente de gastos e dashboards analíticos em tempo real.

## 🚀 Tecnologias

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Zustand** - State management
- **React Router** - Navegação
- **React Hook Form + Zod** - Validação de formulários
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP
- **Sonner** - Toast notifications

### Backend
- **Node.js + Express** - API REST
- **TypeScript** - Type safety
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Helmet** - Segurança HTTP
- **Rate Limiting** - Proteção contra abuse

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd VinPed
```

### 2. Instale as dependências

```bash
npm install
```

Isso instalará as dependências de todos os workspaces (root, frontend, backend, shared).

### 3. Configure as variáveis de ambiente

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/vinped_bank
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vinped_bank
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)

```bash
cd ../frontend
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Configure o banco de dados

#### Criar o banco de dados

```bash
createdb vinped_bank
```

Ou via psql:

```sql
CREATE DATABASE vinped_bank;
```

#### Executar migrations

```bash
npm run db:migrate
```

#### Popular com dados iniciais (categorias padrão)

```bash
npm run db:seed
```

## 🏃 Executando o projeto

### Desenvolvimento (Frontend + Backend simultâneamente)

```bash
npm run dev
```

Isso iniciará:
- Frontend em `http://localhost:3000`
- Backend em `http://localhost:5000`

### Executar separadamente

```bash
# Apenas frontend
npm run dev:frontend

# Apenas backend
npm run dev:backend
```

## 🏗️ Build

### Build completo

```bash
npm run build
```

### Build separado

```bash
# Frontend
npm run build:frontend

# Backend
npm run build:backend
```

## 🚀 Deployment (Hospedagem)

O projeto está pronto para deploy em diversas plataformas. Veja o guia completo em **[DEPLOYMENT.md](DEPLOYMENT.md)**.

### Opções Recomendadas:

#### Opção 1: Vercel + Railway (Gratuito)
- **Frontend**: Deploy no Vercel (automático via GitHub)
- **Backend + DB**: Deploy no Railway (PostgreSQL incluído)
- ✅ Melhor opção para começar

#### Opção 2: Docker (VPS/Cloud)
```bash
# Desenvolvimento
docker-compose up -d

# Produção
docker-compose -f docker-compose.prod.yml up -d
```

#### Scripts Úteis:
```bash
# Setup automático do ambiente
./scripts/setup.sh

# Gerar JWT secret seguro
node scripts/generate-jwt-secret.js
```

### Deploy Rápido (Vercel):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/VinPed)

**Veja instruções detalhadas em:** [DEPLOYMENT.md](DEPLOYMENT.md)

## 📁 Estrutura do Projeto

```
VinPed/
├── frontend/                  # Aplicação React
│   ├── public/               # Arquivos públicos
│   ├── src/
│   │   ├── assets/          # Imagens, estilos globais
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── dashboard/   # Dashboard principal
│   │   │   ├── wallets/     # Gestão de carteiras
│   │   │   ├── categories/  # Gestão de categorias
│   │   │   └── transactions/# Gestão de transações
│   │   ├── services/        # API clients
│   │   ├── store/           # Zustand stores
│   │   ├── utils/           # Funções utilitárias
│   │   ├── App.tsx          # Componente raiz
│   │   └── main.tsx         # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                   # API Node.js
│   ├── src/
│   │   ├── config/          # Configurações (DB, etc)
│   │   ├── controllers/     # Controllers (lógica de negócio)
│   │   ├── database/        # Migrations e seeds
│   │   ├── middleware/      # Middleware (auth, validation, etc)
│   │   ├── models/          # Models (futuro)
│   │   ├── routes/          # Definição de rotas
│   │   ├── services/        # Services (lógica complexa)
│   │   ├── utils/           # Funções utilitárias
│   │   └── server.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                    # Tipos compartilhados
│   ├── types/
│   │   └── index.ts         # Types TypeScript
│   └── package.json
│
├── package.json              # Root package.json (monorepo)
├── .gitignore
└── README.md
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. Usuário faz login ou registra-se
2. Backend retorna token JWT
3. Frontend armazena token no localStorage (via Zustand persist)
4. Token é enviado no header `Authorization: Bearer <token>` em requisições protegidas
5. Backend valida o token e extrai userId

### Endpoints de Autenticação

```
POST /api/auth/register - Criar nova conta
POST /api/auth/login    - Fazer login
GET  /api/auth/me       - Obter usuário atual (protegido)
POST /api/auth/logout   - Fazer logout (protegido)
```

## 🗄️ API Endpoints

### Wallets (Carteiras)

Todas as rotas requerem autenticação.

```
GET    /api/wallets     - Listar todas as carteiras do usuário
GET    /api/wallets/:id - Obter detalhes de uma carteira
POST   /api/wallets     - Criar nova carteira
PATCH  /api/wallets/:id - Atualizar carteira
DELETE /api/wallets/:id - Excluir carteira
```

## 🎨 Design System

### Cores

- **Primary** (#00FF88) - Ações positivas, saldo positivo
- **Secondary** (#FFA500) - Destaques, CTAs
- **Danger** (#FF4444) - Despesas, alertas críticos
- **Neutral** (#2A2A2A) - Background, cards

### Componentes

O projeto usa classes utilitárias do Tailwind com componentes customizados:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.card`, `.card-hover`
- `.input`, `.input-error`
- `.badge`, `.badge-success`, `.badge-danger`

## 📊 Schema do Banco de Dados

### Tabelas Principais

- **users** - Usuários do sistema
- **wallets** - Carteiras virtuais
- **categories** - Categorias de transações
- **transactions** - Transações financeiras
- **goals** - Metas de economia
- **bills** - Contas a pagar
- **alerts** - Alertas e notificações
- **sessions** - Sessões de usuários

Ver `backend/src/database/schema.sql` para schema completo.

## 🧪 Testes

```bash
npm run test
```

## 📝 Roadmap

### Sprint 1 ✅ (Atual)
- [x] Setup do repositório
- [x] Autenticação (login/register)
- [x] CRUD de carteiras
- [x] Dashboard básico

### Sprint 2 (Próximo)
- [ ] Sistema de categorias
- [ ] Adicionar transações
- [ ] Dashboard com gráficos
- [ ] Responsividade mobile

### Sprint 3
- [ ] Parcelamento de transações
- [ ] Transações programadas
- [ ] Contas a pagar
- [ ] Alertas automáticos

### Sprint 4
- [ ] Metas de economia
- [ ] Simulação de compra
- [ ] Exportação de dados
- [ ] Testes automatizados

### Sprint 5
- [ ] Integração Open Banking
- [ ] PWA offline-first
- [ ] Modo escuro

## 🔄 CI/CD

O projeto inclui GitHub Actions para integração e deploy contínuos:

### Pipeline Automático:
- ✅ Lint e type checking (TypeScript)
- ✅ Testes automatizados
- ✅ Build de produção
- ✅ Deploy automático (Vercel)
- ✅ Security audit

### Configurar no GitHub:

1. Vá em `Settings` → `Secrets and variables` → `Actions`
2. Adicione os secrets necessários:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

Ver mais em: [.github/workflows/ci.yml](.github/workflows/ci.yml)

## 🐳 Docker

### Desenvolvimento com Docker:
```bash
# Subir todos os serviços (Frontend, Backend, PostgreSQL)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Produção com Docker:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👤 Autor

**Pedro Vinicius**

## 🙏 Agradecimentos

- Documentação baseada no PRD completo do VinPed Bank
- Design inspirado em aplicações modernas de fintech

---

**Nota:** Este projeto está em desenvolvimento ativo. Funcionalidades podem mudar.
