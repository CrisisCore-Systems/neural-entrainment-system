# Neural Entrainment System

CrisisCore Neural Interface v3.0 - Advanced neural entrainment platform with real-time binaural beats, isochronic tones, and visual stimulation.

## Project Structure

```
neural-entrainment-system/
├── frontend/          # React + Three.js frontend application
├── backend/           # Fastify API server with PostgreSQL
├── CORS_FIX_GUIDE.md # Guide to fix CORS errors
└── docs/              # Additional documentation
```

## Quick Start

### Frontend (React + Three.js)
```bash
cd frontend
npm install
npm run dev
```

See [frontend/README.md](frontend/README.md) for detailed instructions.

### Backend (Fastify API)
```bash
cd backend
./setup.sh          # Create .env with correct CORS settings
npm install
npm run dev
```

See [backend/README.md](backend/README.md) for detailed instructions.

## Common Issues

### ⚠️ CORS Errors

If you see CORS errors when the GitHub Pages frontend tries to connect to your backend:

```
Access to fetch has been blocked by CORS policy
```

**Quick Fix:**
1. Navigate to `backend/` directory
2. Run `./setup.sh` to create `.env` file with correct CORS settings
3. Restart your backend server

**Detailed Guide:** See [CORS_FIX_GUIDE.md](CORS_FIX_GUIDE.md)

## Architecture

- **Frontend**: React 19 with Three.js for 3D visualizations, deployed to GitHub Pages
- **Backend**: Fastify server with PostgreSQL and Redis, provides REST API
- **Database**: PostgreSQL 14+ for user data and session tracking
- **Cache**: Redis 7+ for session state and real-time metrics

## Environment Variables

### Backend
```env
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
DATABASE_URL=postgresql://user:pass@localhost:5432/neural_entrainment
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### Frontend
```env
VITE_API_URL=http://localhost:3001
```

## Features

- 🎵 **Advanced Audio Engine**: 6-phase neural entrainment protocols
- 🎨 **Visual Stimulation**: WebGL-based 3D visualizations with Three.js
- 👤 **User Management**: JWT authentication with medical screening
- 📊 **Session Tracking**: Real-time metrics and progress monitoring
- 🔒 **Security**: CORS protection, rate limiting, helmet security headers
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Development

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Redis 7+

### Setup for Development

1. **Clone the repository**
2. **Backend setup**: Follow [backend/README.md](backend/README.md)
3. **Frontend setup**: Follow frontend instructions
4. **Database**: Initialize with `backend/database/schema.sql`

### Deployment

- **Frontend**: Automatically deploys to GitHub Pages via `.github/workflows/deploy-pages.yml`
- **Backend**: Manual deployment to your preferred hosting service (requires setting environment variables)

## Documentation

- [App PRD](App_prd.md) - Product Requirements Document
- [Tech Stack](App_techstack.md) - Technology stack overview  
- [Dev Docs](App_devdocs.md) - Developer documentation
- [Audio Engine](AUDIO_ENGINE_V2.md) - Audio engine architecture
- [Gateway Process](GATEWAY_PROCESS.md) - Gateway implementation details

## License

MIT License - See LICENSE file for details

## Support

For CORS configuration issues, see [CORS_FIX_GUIDE.md](CORS_FIX_GUIDE.md)

For other issues, check the backend and frontend README files or open an issue on GitHub.
