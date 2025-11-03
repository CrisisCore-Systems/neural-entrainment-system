# 🧠 CrisisCore Neural Entrainment System

A web-based neural entrainment application that uses binaural beats and visual patterns for meditation, focus, and relaxation.

## 🚀 Quick Links

- **[Free Deployment Guide](./DEPLOYMENT.md)** - Deploy to free hosting platforms (Railway, Render, Fly.io)
- **[Backend Documentation](./backend/README.md)** - API and backend setup
- **[Frontend Documentation](./frontend/README.md)** - UI and frontend development
- **[Technology Stack](./App_techstack.md)** - Complete tech stack overview

## 📋 Project Structure

```
neural-entrainment-system/
├── backend/              # Node.js + Fastify API server
│   ├── src/             # Backend source code
│   ├── database/        # PostgreSQL schema
│   ├── Dockerfile       # Container configuration
│   └── deploy-*.sh      # Deployment scripts
├── frontend/            # React + Vite web application
│   ├── src/             # Frontend source code
│   └── public/          # Static assets
├── DEPLOYMENT.md        # 🆓 Free hosting deployment guide
├── render.yaml          # Render.com configuration
└── README.md            # This file
```

## 🎯 Features

- **Binaural Beat Audio Generation**: Real-time synthesis with Web Audio API
- **Visual Entrainment Patterns**: WebGL-powered synchronized visuals
- **Session Tracking**: Monitor progress and effectiveness
- **Multi-Protocol Support**: Pre-configured programs for various goals
- **User Authentication**: Secure JWT-based auth system
- **Real-time Analytics**: Track your neural entrainment journey

## 🏃 Quick Start

### Local Development

#### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Redis 7+ (optional, can be disabled)

#### 1. Clone Repository
```bash
git clone https://github.com/CrisisCore-Systems/neural-entrainment-system.git
cd neural-entrainment-system
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings

# Create database
createdb neural_entrainment
psql -d neural_entrainment -f database/schema.sql

# Start backend
npm run dev
```

#### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Start frontend
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Docker Compose (Easiest)

```bash
cd backend
docker-compose up
```

This starts PostgreSQL, Redis, and the backend all at once!

## 🆓 Deploy to Free Hosting

We've prepared detailed guides for deploying to completely free hosting platforms:

### Recommended: Railway (All-in-One)
- ✅ $5/month free credit (enough for 24/7 operation)
- ✅ PostgreSQL included
- ✅ Redis included
- ✅ Easiest setup

```bash
cd backend
./deploy-railway.sh
```

Or on Windows:
```powershell
cd backend
./deploy-railway.ps1
```

### Alternative Options

| Platform | Database | Redis | Setup Time | Best For |
|----------|----------|-------|------------|----------|
| **Railway** | ✅ Included | ✅ Included | 10 min | Easiest |
| **Render** | External | External | 20 min | Most reliable |
| **Fly.io** | ✅ Included | ✅ Included | 15 min | Global |
| **Supabase** | ✅ Included | ❌ | 25 min | Simple apps |

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step instructions for each platform.

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - WebGL visuals
- **Zustand** - State management
- **Tailwind CSS** - Styling

### Backend
- **Node.js 20** - Runtime
- **Fastify** - Web framework
- **PostgreSQL** - Database
- **Redis** - Caching
- **JWT** - Authentication
- **TypeScript** - Type safety

### Infrastructure
- **GitHub Pages** - Frontend hosting (free)
- **Railway/Render/Fly.io** - Backend hosting (free tier)
- **Neon/Supabase** - Database (free tier)
- **Upstash** - Redis (free tier)

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive free hosting guide
- **[App_techstack.md](./App_techstack.md)** - Technology decisions and rationale
- **[App_devdocs.md](./App_devdocs.md)** - Development documentation
- **[App_prd.md](./App_prd.md)** - Product requirements
- **[AUDIO_ENGINE_V2.md](./AUDIO_ENGINE_V2.md)** - Audio engine specification

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- Helmet.js security headers
- CORS protection
- Rate limiting
- Input validation with Zod

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Roadmap

- [x] Core audio engine
- [x] Visual entrainment patterns
- [x] User authentication
- [x] Session tracking
- [x] Free hosting deployment guide
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Social features
- [ ] AI-powered protocol recommendations

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Medical Disclaimer

This application is for wellness and entertainment purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before use if you have any medical conditions, especially epilepsy or seizure disorders.

## 🆘 Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🌟 Acknowledgments

- Web Audio API community
- Three.js community
- Open source contributors

---

**Status**: ✅ Production Ready  
**Latest Version**: 1.0.0  
**Deployment**: Free hosting available (see DEPLOYMENT.md)
