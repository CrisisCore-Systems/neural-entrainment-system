# 🧠 CrisisCore Neural Entrainment System v3.0# 🧠 CrisisCore Neural Entrainment System



**Advanced web-based neural entrainment platform for cognitive enhancement through binaural beats, visual stimulation, and adaptive AI feedback systems.**A web-based neural entrainment application that uses binaural beats and visual patterns for meditation, focus, and relaxation.



[![Production Ready](https://img.shields.io/badge/status-production-brightgreen)]() ## 🚀 Quick Links

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)]()### 📖 Deployment Documentation

[![React](https://img.shields.io/badge/react-18%2B-blue)]()- **[🎯 Quick Start Guide](./QUICKSTART.md)** - One-page deployment cheat sheet

- **[📘 Full Deployment Guide](./DEPLOYMENT.md)** - Comprehensive step-by-step instructions

🌐 **Live Demo**: https://crisiscore-systems.github.io/neural-entrainment-system/- **[📊 Platform Comparison](./HOSTING_COMPARISON.md)** - Compare Railway vs Render vs Fly.io

- **[🏗️ Architecture Overview](./ARCHITECTURE.md)** - Visual deployment architecture

---- **[🔧 Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions



## 🚀 Quick Start### 💻 Development Documentation

- **[Backend Documentation](./backend/README.md)** - API and backend setup

**Get started in 2 minutes:**- **[Frontend Documentation](./frontend/README.md)** - UI and frontend development

- **[Technology Stack](./App_techstack.md)** - Complete tech stack overview

```bash

# Clone repository## 📋 Project Structure

git clone https://github.com/CrisisCore-Systems/neural-entrainment-system.git

cd neural-entrainment-system```

neural-entrainment-system/

# See comprehensive setup guide├── backend/              # Node.js + Fastify API server

open DEVELOPER_GUIDE.md│   ├── src/             # Backend source code

```│   ├── database/        # PostgreSQL schema

│   ├── Dockerfile       # Container configuration

**Or jump straight to development:**│   └── deploy-*.sh      # Deployment scripts

├── frontend/            # React + Vite web application

```bash│   ├── src/             # Frontend source code

# Backend (Terminal 1)│   └── public/          # Static assets

cd backend && npm install && npm run dev├── DEPLOYMENT.md        # 🆓 Free hosting deployment guide

├── render.yaml          # Render.com configuration

# Frontend (Terminal 2)└── README.md            # This file

cd frontend && npm install && npm run dev```

```

## 🎯 Features

Visit http://localhost:5173 🎉

- **Binaural Beat Audio Generation**: Real-time synthesis with Web Audio API

---- **Visual Entrainment Patterns**: WebGL-powered synchronized visuals

- **Session Tracking**: Monitor progress and effectiveness

## 📖 Documentation- **Multi-Protocol Support**: Pre-configured programs for various goals

- **User Authentication**: Secure JWT-based auth system

### 🎯 Start Here- **Real-time Analytics**: Track your neural entrainment journey



- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - **Complete developer guide** (setup, workflow, testing, deployment)## 🏃 Quick Start



### 📁 Organized Documentation### Local Development



#### Setup & Configuration#### Prerequisites

- [docs/setup/QUICKSTART.md](./docs/setup/QUICKSTART.md) - Fast deployment reference- Node.js 20+

- [docs/setup/BACKEND_LOCAL_VERIFIED.md](./docs/setup/BACKEND_LOCAL_VERIFIED.md) - Backend verification checklist- PostgreSQL 14+

- [docs/setup/SETUP_CHECK.md](./docs/setup/SETUP_CHECK.md) - Environment validation- Redis 7+ (optional, can be disabled)



#### Architecture & Design#### 1. Clone Repository

- [docs/architecture/ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) - System architecture overview```bash

- [docs/architecture/AUDIO_ENGINE_V2.md](./docs/architecture/AUDIO_ENGINE_V2.md) - Audio engine specificationgit clone https://github.com/CrisisCore-Systems/neural-entrainment-system.git

- [docs/architecture/GATEWAY_PROCESS.md](./docs/architecture/GATEWAY_PROCESS.md) - Gateway focus level systemcd neural-entrainment-system

- [docs/architecture/App_techstack.md](./docs/architecture/App_techstack.md) - Technology stack decisions```

- [docs/architecture/App_competitors.md](./docs/architecture/App_competitors.md) - Competitive analysis

#### 2. Setup Backend

#### Deployment & Hosting```bash

- [docs/deployment/DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md) - Comprehensive deployment guidecd backend

- [docs/deployment/FREE_HOSTING_SOLUTION.md](./docs/deployment/FREE_HOSTING_SOLUTION.md) - Free hosting optionsnpm install

- [docs/deployment/HOSTING_COMPARISON.md](./docs/deployment/HOSTING_COMPARISON.md) - Platform comparisoncp .env.example .env

- [docs/deployment/CORS_DIAGRAM.md](./docs/deployment/CORS_DIAGRAM.md) - CORS configuration# Edit .env with your settings

- [docs/deployment/CORS_FIX_GUIDE.md](./docs/deployment/CORS_FIX_GUIDE.md) - CORS troubleshooting

# Create database

createdb neural_entrainment
psql -d neural_entrainment -f database/schema.sql

#### Reference & Specs

- [docs/reference/App_prd.md](./docs/reference/App_prd.md) - Product requirements document
- [docs/reference/App_devdocs.md](./docs/reference/App_devdocs.md) - Development reference
- [docs/reference/TROUBLESHOOTING.md](./docs/reference/TROUBLESHOOTING.md) - Common issues & solutions
- [docs/reference/GO_TO_MARKET_PLAYBOOK.md](./docs/reference/GO_TO_MARKET_PLAYBOOK.md) - Comprehensive go-to-market and revenue plan

# Start backend

npm run dev

#### Module-Specific Docs```

- [backend/README.md](./backend/README.md) - Backend API documentation

- [backend/LOCAL_SETUP.md](./backend/LOCAL_SETUP.md) - Backend local setup (detailed)#### 3. Setup Frontend

- [backend/LINTING.md](./backend/LINTING.md) - Code quality guide```bash

- [frontend/README.md](./frontend/README.md) - Frontend documentationcd ../frontend

npm install

---

# Start frontend

## 🎯 Featuresnpm run dev

```

### Core Functionality

- ✅ **Binaural Beat Audio** - Precise frequency generation (±0.1 Hz accuracy) via Web Audio APIVisit `http://localhost:5173` to see the application.

- ✅ **Visual Entrainment** - Synchronized WebGL patterns with Three.js at 60 FPS

- ✅ **Six-Phase Sessions** - Progressive neural entrainment protocols### Docker Compose (Easiest)

- ✅ **Gateway Process** - Advanced focus development system (Levels 10-49)

- ✅ **Real-time Analytics** - Session metrics, progress tracking, and insights```bash

- ✅ **Sacred Geometry** - 3D models (Seed of Life, Tree of Life, Flower of Life, etc.)cd backend

- ✅ **User Authentication** - Secure JWT-based system with admin rolesdocker-compose up

- ✅ **Medical Disclaimer** - Safety screening and contraindication checks```



### Technical HighlightsThis starts PostgreSQL, Redis, and the backend all at once!

- ✅ **Audio-Visual Sync** - <5ms latency for therapeutic effectiveness

- ✅ **Emergency Stop** - 100ms response time for safety## 🆓 Deploy to Free Hosting

- ✅ **TypeScript** - 100% type safety (0 errors, 0 warnings)

- ✅ **Testing** - Vitest with Web Audio API mocksWe've prepared detailed guides for deploying to completely free hosting platforms:

- ✅ **Linting** - ESLint + Prettier with auto-fix

- ✅ **Responsive Design** - Mobile-friendly UI### Recommended: Railway (All-in-One)

- ✅ $5/month free credit (enough for 24/7 operation)

---- ✅ PostgreSQL included

- ✅ Redis included

## 🛠️ Technology Stack- ✅ Easiest setup



### Frontend```bash

```cd backend

React 18+ | TypeScript | Vite | Three.js (WebGL) | Web Audio API./deploy-railway.sh

Zustand (state) | React Router | Tailwind CSS (future)```

```

Or on Windows:

### Backend```powershell

```cd backend

Node.js 18+ | Fastify | TypeScript | PostgreSQL | Redis (optional)./deploy-railway.ps1

JWT Auth | WebSocket | GraphQL (future) | Zod validation```

```

### Alternative Options

### Infrastructure

```| Platform | Database | Redis | Setup Time | Best For |

GitHub Pages (frontend) | Railway/Render/Fly.io (backend)|----------|----------|-------|------------|----------|

Neon PostgreSQL | Upstash Redis | Docker | GitHub Actions CI/CD| **Railway** | ✅ Included | ✅ Included | 10 min | Easiest |

```| **Render** | External | External | 20 min | Most reliable |

| **Fly.io** | ✅ Included | ✅ Included | 15 min | Global |

---| **Supabase** | ✅ Included | ❌ | 25 min | Simple apps |



## 📊 Project StructureSee **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step instructions for each platform.



```#### Render + Neon quick env

neural-entrainment-system/

├── frontend/                  # React + TypeScript + Vite- Copy-ready env for Render: `docs/RENDER_ENV.example.env` (KEY=VALUE) or `docs/RENDER_ENV.example.json` (JSON)

│   ├── src/- Set `DATABASE_URL` from Neon and `REDIS_URL` from Upstash (optional)

│   │   ├── components/       # React components (Auth, Session, Gateway, etc.)- Then update `frontend/.env.production` with your Render URL: `VITE_API_URL=https://<service>.onrender.com/api`

│   │   ├── services/         # API clients, audio engine

│   │   ├── store/            # Zustand state management### Deploy on Render + Neon (Free)

│   │   ├── styles/           # CSS modules

│   │   ├── types/            # TypeScript interfacesFollow these steps to deploy the backend on Render and use Neon for PostgreSQL:

│   │   └── utils/            # Sacred geometry, event bus

│   ├── public/1. Create a Neon project → copy the connection string:

│   │   └── models/           # 3D GLB files (Sacred Geometry)	`postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require`

│   └── docs/                 # Frontend-specific docs2. In Neon → SQL Editor, initialize schema:

│	```bash

├── backend/                   # Node.js + Fastify + TypeScript	psql "postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require" -f backend/database/schema.sql

│   ├── src/	```

│   │   ├── routes/           # API endpoints (auth, sessions, protocols, users)3. Create a Render account → New → Web Service → Connect this GitHub repo

│   │   ├── middleware/       # Auth middleware	- Root Directory: `backend`

│   │   ├── plugins/          # Database, Redis plugins	- Build Command: `npm install && npm run build`

│   │   ├── types/            # Fastify type declarations	- Start Command: `npm start`

│   │   ├── utils/            # Logger utilities	- Health Check Path: `/health`

│   │   └── __tests__/        # Vitest tests (10 tests passing)4. In Render → Environment, set variables (see also `docs/RENDER_ENV.example.env`):

│   ├── database/             # PostgreSQL schemas, seeds, migrations	```env

│   ├── migrations/           # Database migration scripts	NODE_ENV=production

│   ├── scripts/              # Utility scripts (JWT generation, etc.)	PORT=3001

│   └── .vscode/              # VS Code settings (auto-format on save)	DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require

│	# Optional Redis (or set DISABLE_REDIS=true in backend/.env for local dev)

├── docs/                      # Organized documentation	REDIS_URL=redis://default:<pass>@<host>:6379

│   ├── setup/                # Setup and configuration guides	JWT_SECRET=<generate-64+ random chars>

│   ├── architecture/         # System design and architecture	JWT_EXPIRES_IN=7d

│   ├── deployment/           # Deployment and hosting guides	CORS_ORIGIN=https://crisiscore-systems.github.io,http://localhost:5173

│   └── reference/            # API specs, product docs, troubleshooting	```

│5. Deploy. Copy your Render URL, e.g. `https://neural-entrainment-backend.onrender.com`.

├── .github/                   # GitHub configuration6. Frontend: set production API URL in `frontend/.env.production`:

│   ├── workflows/            # GitHub Actions CI/CD	```env

│   └── copilot-instructions.md  # AI coding agent instructions	VITE_API_URL=https://neural-entrainment-backend.onrender.com/api

│	```

├── DEVELOPER_GUIDE.md         # 📘 Complete developer guide (START HERE)7. Test health endpoint:

└── README.md                  # This file	```bash

```	curl https://neural-entrainment-backend.onrender.com/health

	```

---

## 🛠️ Technology Stack

## 🧪 Development

### Frontend

### Prerequisites- **React 19** - UI framework

- **Node.js** 18+ - [Download](https://nodejs.org/)- **TypeScript** - Type safety

- **PostgreSQL** 14+ - [Download](https://www.postgresql.org/download/)- **Vite** - Build tool

- **Git** - [Download](https://git-scm.com/)- **Three.js** - WebGL visuals

- **Zustand** - State management

### Setup (5 minutes)- **Tailwind CSS** - Styling



**See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed instructions.**### Backend

- **Node.js 20** - Runtime

Quick version:- **Fastify** - Web framework

```bash- **PostgreSQL** - Database

# 1. Backend- **Redis** - Caching

cd backend- **JWT** - Authentication

npm install- **TypeScript** - Type safety

cp .env.example .env  # Edit with your DB credentials

.\setup-local-db.ps1  # Windows (or setup-local-db.sh for Mac/Linux)### Infrastructure

npm run dev- **GitHub Pages** - Frontend hosting (free)

- **Railway/Render/Fly.io** - Backend hosting (free tier)

# 2. Frontend- **Neon/Supabase** - Database (free tier)

cd frontend- **Upstash** - Redis (free tier)

npm install

cp .env.example .env.local  # Set VITE_API_URL=http://localhost:3001## 📚 Documentation

npm run dev

```- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive free hosting guide

- **[App_techstack.md](./App_techstack.md)** - Technology decisions and rationale

### Code Quality- **[App_devdocs.md](./App_devdocs.md)** - Development documentation

- **[App_prd.md](./App_prd.md)** - Product requirements

**Backend has full enforcement:**- **[AUDIO_ENGINE_V2.md](./AUDIO_ENGINE_V2.md)** - Audio engine specification

```bash

cd backend## 🔐 Security

npm run quality  # Runs: lint + format + type-check + tests

```- JWT-based authentication

- Bcrypt password hashing

**Current status:**- Helmet.js security headers

- ✅ 0 ESLint errors- CORS protection

- ✅ 0 ESLint warnings- Rate limiting

- ✅ 10/10 tests passing- Input validation with Zod

- ✅ 100% TypeScript type safety

## 🧪 Testing

---

```bash

## 🚀 Deployment# Backend tests

cd backend

### Backend Optionsnpm test



| Platform | Setup Time | Database | Redis | Cost |# Frontend tests

|----------|-----------|----------|-------|------|cd frontend

| **Railway** ⭐ | 10 min | ✅ Included | ✅ Included | $5/mo credit |npm test

| **Render** | 20 min | External | External | Free tier |```

| **Fly.io** | 15 min | ✅ Included | ✅ Included | Free tier |

## 📈 Roadmap

### Frontend (GitHub Pages)

- [x] Core audio engine

**Automatic deployment on push to `main` branch.**- [x] Visual entrainment patterns

- [x] User authentication

```bash- [x] Session tracking

# Just push your changes- [x] Free hosting deployment guide

git push origin main- [ ] Mobile app (React Native)

- [ ] Advanced analytics dashboard

# GitHub Actions automatically builds and deploys- [ ] Social features

# Live at: https://your-username.github.io/neural-entrainment-system/- [ ] AI-powered protocol recommendations

```

## 🤝 Contributing

**Detailed deployment guides:** [docs/deployment/](./docs/deployment/)

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

1. Fork the repository

## 📈 Roadmap2. Create your feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

### Completed ✅4. Push to the branch (`git push origin feature/AmazingFeature`)

- [x] Core audio engine with binaural beats5. Open a Pull Request

- [x] Visual entrainment with Three.js

- [x] User authentication (JWT)## 📄 License

- [x] Session tracking and analytics

- [x] Gateway Process (Focus Levels 10-49)This project is licensed under the MIT License - see the LICENSE file for details.

- [x] Sacred Geometry 3D models

- [x] Real-time metrics tracking## ⚠️ Medical Disclaimer

- [x] Code quality enforcement (ESLint + Prettier)

- [x] Comprehensive testing (Vitest)This application is for wellness and entertainment purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before use if you have any medical conditions, especially epilepsy or seizure disorders.

- [x] Local development setup

- [x] Free hosting deployment guides## 🆘 Support

- [x] Documentation consolidation

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues

### In Progress 🔄- **Issues**: Open an issue on GitHub

- [ ] Mobile app (React Native)- **Discussions**: Use GitHub Discussions for questions

- [ ] Advanced analytics dashboard

- [ ] GraphQL API## 🌟 Acknowledgments

- [ ] WebSocket real-time updates

- Web Audio API community

### Planned 📋- Three.js community

- [ ] AI-powered protocol recommendations- Open source contributors

- [ ] Social features (share sessions, community)

- [ ] Biometric integration (heart rate, EEG)---

- [ ] Voice-guided meditations

- [ ] Progressive Web App (PWA)**Status**: ✅ Production Ready  

- [ ] Multi-language support**Latest Version**: 1.0.0  

**Deployment**: Free hosting available (see DEPLOYMENT.md)

---

## 🤝 Contributing

**We welcome contributions!**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Make changes and test thoroughly
4. Run quality checks: `npm run quality` (backend)
5. Commit: `git commit -m 'feat: add AmazingFeature'`
6. Push: `git push origin feature/AmazingFeature`
7. Open Pull Request with clear description

**See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed contribution guidelines.**

---

## ⚠️ Medical Disclaimer

**This application is for wellness and entertainment purposes only.**

- Not intended to diagnose, treat, cure, or prevent any disease
- Consult healthcare professional before use if you have medical conditions
- **Contraindications**: Epilepsy, seizure disorders, photosensitivity
- **Safety**: Emergency stop capability, volume limiting (85 dB max)
- **Usage limits**: Max 2 sessions/day, 45 minutes total

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Help

### Documentation
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Comprehensive guide
- **[docs/reference/TROUBLESHOOTING.md](./docs/reference/TROUBLESHOOTING.md)** - Common issues

### Community
- **Issues**: [GitHub Issues](https://github.com/CrisisCore-Systems/neural-entrainment-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CrisisCore-Systems/neural-entrainment-system/discussions)

### Quick Help
- **Port in use**: See [DEVELOPER_GUIDE.md#troubleshooting](./DEVELOPER_GUIDE.md#troubleshooting)
- **Database errors**: Check PostgreSQL is running
- **API calls failing**: Verify `VITE_API_URL` in frontend `.env.local`
- **Audio not playing**: Check browser console, try Chrome/Edge

---

## 🌟 Acknowledgments

- **Web Audio API** community for audio synthesis guidance
- **Three.js** community for WebGL visualization help
- **Fastify** team for excellent framework
- **Open source contributors** for all dependencies
- **Monroe Institute** for Gateway Process inspiration

---

## 📞 Contact

- **Repository**: https://github.com/CrisisCore-Systems/neural-entrainment-system
- **Issues**: https://github.com/CrisisCore-Systems/neural-entrainment-system/issues
- **Email**: kovertechart@gmail.com

---

**Built with ❤️ by CrisisCore Systems**

**Status**: ✅ Production Ready  
**Version**: 3.0  
**Last Updated**: November 2025  
**Deployment**: Free hosting available

---

### Quick Links
[Developer Guide](./DEVELOPER_GUIDE.md) | [Setup](./docs/setup/) | [Architecture](./docs/architecture/) | [Deployment](./docs/deployment/) | [Reference](./docs/reference/)
