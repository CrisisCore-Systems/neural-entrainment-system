# Developer Guide - Neural Entrainment System

**Complete guide for developers working on the CrisisCore Neural Interface**

Version: 3.0 | Last Updated: November 2025

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Local Development Setup](#local-development-setup)
4. [Development Workflow](#development-workflow)
5. [Code Quality & Standards](#code-quality--standards)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Additional Resources](#additional-resources)

---

## Quick Start

**Get up and running in 10 minutes:**

```bash
# 1. Clone repository
git clone https://github.com/CrisisCore-Systems/neural-entrainment-system.git
cd neural-entrainment-system

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env: Set DB_PASSWORD, set DISABLE_REDIS=true
.\setup-local-db.ps1  # Windows
# OR
./setup-local-db.sh   # Mac/Linux
npm run dev

# 3. Setup Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local: Set VITE_API_URL=http://localhost:3001
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

---

## Project Overview

### What is This?

Advanced web-based neural entrainment platform delivering personalized cognitive enhancement through:
- **Binaural Beats**: Precise audio frequencies (±0.1 Hz accuracy)
- **Visual Stimulation**: Synchronized WebGL patterns at 60 FPS
- **Six-Phase Sessions**: Progressive neural entrainment protocols
- **Gateway System**: Advanced focus development (Levels 10-49)
- **Real-time Analytics**: Session metrics and progress tracking

### Architecture

```
neural-entrainment-system/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API clients, audio engine
│   │   ├── store/        # Zustand state management
│   │   └── types/        # TypeScript interfaces
│   └── public/          # Static assets, 3D models
│
├── backend/           # Node.js + Fastify + TypeScript
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation
│   │   ├── plugins/     # Database, Redis
│   │   └── __tests__/   # Vitest tests
│   ├── database/        # SQL schemas and seeds
│   └── migrations/      # Database migrations
│
└── docs/              # Additional documentation
    ├── setup/         # Setup guides
    ├── architecture/  # System design docs
    ├── deployment/    # Hosting and CI/CD
    └── reference/     # API specs, protocols
```

### Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Three.js for WebGL visualization
- Web Audio API for binaural beats
- Zustand for state management
- Vite for build tooling

**Backend:**
- Node.js v18+ with Fastify
- PostgreSQL (primary database)
- Redis (session cache) - optional for local dev
- JWT authentication
- WebSocket for real-time updates

**Development:**
- TypeScript for type safety
- ESLint + Prettier for code quality
- Vitest for testing
- Git for version control

---

## Local Development Setup

### Prerequisites

1. **Node.js v18+** - [Download](https://nodejs.org/)
2. **PostgreSQL v14+** - [Download](https://www.postgresql.org/download/)
3. **Git** - [Download](https://git-scm.com/)
4. **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

#### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=neural_entrainment
# DB_USER=postgres
# DB_PASSWORD=your_password_here
# JWT_SECRET=generate-with-openssl-rand-base64-32
# DISABLE_REDIS=true  # For local dev without Redis
```

#### 3. Setup Database

**Windows:**
```powershell
.\setup-local-db.ps1
```

**Mac/Linux:**
```bash
chmod +x setup-local-db.sh
./setup-local-db.sh
```

This script will:
- ✅ Create database
- ✅ Run schema migrations
- ✅ Seed 10 protocols
- ✅ Create test user account

#### 4. Start Backend Server

```bash
npm run dev
```

Server runs at: http://localhost:3001

**Verify:**
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"...","uptime":...}
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local:
# VITE_API_URL=http://localhost:3001
```

#### 3. Start Development Server

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

### Test Login

**Default credentials** (created by setup script):
- Email: `test@example.com`
- Password: `password123`

**Admin account** (if you want admin/gateway access):
- Email: `your-email@example.com`
- Update in database: `UPDATE users SET is_admin = true, gateway_level = 27 WHERE email = 'your-email@example.com';`

---

## Development Workflow

### Daily Development

#### 1. Start Local Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

#### 2. Make Changes

- Frontend: Files auto-reload on save
- Backend: Nodemon auto-restarts on save
- Database: Run migrations as needed

#### 3. Before Committing

```bash
# Backend quality checks
cd backend
npm run quality  # Runs lint + format + type-check + tests

# Frontend build check
cd frontend
npm run build
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, commit frequently
git add .
git commit -m "feat: descriptive message"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Common Tasks

#### Add New API Endpoint

1. Create route in `backend/src/routes/`
2. Add types in `backend/src/types/fastify.d.ts`
3. Register route in `backend/src/index.ts`
4. Add tests in `backend/src/__tests__/`
5. Run `npm run quality`

#### Add New React Component

1. Create component in `frontend/src/components/`
2. Add types in `frontend/src/types/`
3. Import and use in parent component
4. Test in browser
5. Run `npm run build` to verify

#### Database Changes

1. Create migration file in `backend/migrations/`
2. Run migration: `psql -U postgres -d neural_entrainment -f backend/migrations/xxx.sql`
3. Update seed files if needed
4. Test with fresh database setup

---

## Code Quality & Standards

### ESLint + Prettier

**Backend has full linting enforcement:**

```bash
cd backend

# Check for errors
npm run lint

# Auto-fix issues
npm run lint:fix

# Format all files
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check

# Run all checks
npm run quality
```

### TypeScript Standards

✅ **Do:**
- Use explicit types for function parameters and return values
- Define interfaces for data structures
- Use `Record<string, unknown>` instead of `any`
- Leverage union types and type guards

❌ **Don't:**
- Use `any` type (will trigger ESLint warning)
- Use `as any` casts
- Disable TypeScript errors without good reason

### Code Style

- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line Length**: 100 characters max
- **Indentation**: 2 spaces
- **Trailing Commas**: ES5 style

**VS Code auto-formats on save** if you have the recommended extensions.

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Gateway session history endpoint
fix: correct binaural beat frequency calculation
docs: update deployment guide
refactor: simplify audio service initialization
test: add tests for session creation
chore: update dependencies
```

---

## Testing

### Test Suite Overview (239+ Tests)

**Complete testing infrastructure** with unit, component, and E2E tests:
- Backend: 70 unit tests ✅
- Frontend: 117 component tests 🟡 (37 passing, 37 need UI adjustments)
- E2E: 52 Playwright tests 📝

For detailed test documentation, see: **[TEST_SUITE_SUMMARY.md](./TEST_SUITE_SUMMARY.md)**

### Backend Tests (70 Passing ✅)

**Framework**: Vitest 1.6.1 with @vitest/coverage-v8

```bash
cd backend

# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run with coverage report
npm run test:coverage

# Run in interactive UI
npm run test:ui

# Run specific test file
npx vitest run src/__tests__/routes/auth.test.ts
```

**Test Coverage:**
- ✅ **Auth routes** (24 tests): Registration, login, validation, password security, medical disclaimers
- ✅ **Session routes** (25 tests): Session creation, metrics validation, ownership checks, state transitions
- ✅ **Protocol routes** (11 tests): Data validation, filtering, sorting, lookup functions
- ✅ **Audio engine** (8 tests): Frequency validation (20Hz-20kHz), volume validation (0-1)
- ✅ **Basic config** (2 tests): Environment and math sanity checks

**Test Files:**
- `backend/src/__tests__/routes/auth.test.ts` - Auth business logic
- `backend/src/__tests__/routes/sessions.test.ts` - Session management logic
- `backend/src/__tests__/routes/protocols.test.ts` - Protocol validation
- `backend/src/__tests__/audioEngine.test.ts` - Audio engine validation
- `backend/src/__tests__/basic.test.ts` - Basic configuration

**Writing New Tests:**
```typescript
// Example test structure
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should handle valid input', () => {
    const result = myFunction(validInput);
    expect(result).toBe(expectedOutput);
  });
  
  it('should reject invalid input', () => {
    expect(() => myFunction(invalidInput)).toThrow('Error message');
  });
});
```

### Frontend Tests (117 Tests - 37 Passing 🟡)

**Framework**: Vitest 1.6.1 + React Testing Library + jsdom

```bash
cd frontend

# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run with coverage report
npm run test:coverage

# Run in interactive UI
npm run test:ui
```

**Test Coverage:**
- ✅ **Auth component** (17 tests): Login, registration, validation, error handling, loading states
- 🟡 **SessionControl component** (51 tests): Session lifecycle, controls, phases, metrics, protocol conversion (37 need UI adjustments)
- 🟡 **ProtocolSelector component** (49 tests): Protocol loading, filtering, sorting, selection, Gateway access (37 need UI adjustments)

**Test Files:**
- `frontend/src/test/Auth.test.tsx` - Authentication component (17 passing)
- `frontend/src/test/SessionControl.test.tsx` - Session management (51 tests, needs UI selector updates)
- `frontend/src/test/ProtocolSelector.test.tsx` - Protocol selection (49 tests, needs UI selector updates)
- `frontend/src/test/setup.ts` - Test configuration with Web Audio + WebGL mocks

**Writing Component Tests:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../components/MyComponent';

it('should render and handle click', () => {
  render(<MyComponent />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

### E2E Tests with Playwright (52 Tests 📝)

**Framework**: Playwright (Chromium, Firefox, WebKit)

```bash
cd backend

# Run all E2E tests
npm run e2e

# Run in headed mode (see browser)
npm run e2e:headed

# Run with Playwright UI
npm run e2e:ui

# Run in debug mode
npm run e2e:debug

# Run specific browser
npx playwright test --project=chromium
```

**Test Scenarios:**
- 🎭 **Authentication Flow** (9 tests): Login, validation, session persistence, logout
- 🎯 **Protocol Selection** (11 tests): Browsing, filtering, sorting, Gateway tile, errors
- 🎮 **Session Management** (14 tests): Start/pause/stop, metrics, emergency stop, phase transitions
- 🚀 **Complete User Journeys** (7 tests): Full workflows, responsiveness, error recovery
- 🔐 **Gateway Process** (11 tests): Admin features, frequency control, safety limits, presets

**Test Files:**
- `backend/tests/auth-flow.spec.ts` - Login and authentication
- `backend/tests/protocol-selection.spec.ts` - Protocol browsing and selection
- `backend/tests/session-management.spec.ts` - Session lifecycle
- `backend/tests/user-journey.spec.ts` - Complete user workflows
- `backend/tests/gateway-process.spec.ts` - Advanced Gateway features

**Note**: E2E tests require both frontend and backend servers running. Playwright config auto-starts frontend dev server.

### Integration Testing

```bash
# Start backend
cd backend && npm run dev

# In another terminal, test endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/protocols

# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Manual Testing Checklist

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Registration requires medical disclaimer
- [ ] Password strength indicator works
- [ ] Logout clears session

**Session Management:**
- [ ] Protocol selection loads correctly
- [ ] Session starts with audio playing
- [ ] Visual effects synchronize with audio
- [ ] Session controls work (play/pause/stop)
- [ ] Session metrics save correctly
- [ ] Gateway protocols unlock after 10 standard sessions

**Audio/Visual:**
- [ ] Binaural beats audible in headphones
- [ ] Volume controls work
- [ ] Emergency stop immediately halts audio
- [ ] Visual patterns render smoothly (60 FPS)
- [ ] No audio/visual desync (<5ms tolerance)

### Test Coverage Goals

- **Backend**: Target 80% coverage for business logic
- **Frontend**: Target 70% coverage for components
- **Critical paths**: 100% coverage (auth, session safety, audio limits)

---

## Deployment

### Local to Production Checklist

✅ **Before deploying:**
1. Run `npm run quality` in backend (0 errors, 0 warnings)
2. Run `npm test` in backend (all tests passing)
3. Run `npm run test:run` in frontend (all tests passing)
4. Run `npm run build` in frontend (successful build)
5. Test locally with production builds
6. Update environment variables
7. Run database migrations on production
8. Test API endpoints
9. Monitor logs for errors

### Quick Deployment Guide

**Backend** (Railway recommended):
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
railway add --plugin postgresql
railway add --plugin redis
railway domain  # Get URL
```

**Frontend** (GitHub Pages automatic):
- Push to `main` branch
- GitHub Actions automatically builds and deploys
- Live at: `https://your-username.github.io/neural-entrainment-system/`

### Environment Variables

**Backend (Production):**
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...  # Auto-set by hosting
REDIS_URL=redis://...          # Auto-set by hosting
JWT_SECRET=your-secret-here    # Generate securely
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-username.github.io
```

**Frontend (Production):**
```
VITE_API_URL=https://your-backend.railway.app
```

**For detailed deployment guides, see:**
- Railway: `docs/deployment/RAILWAY.md`
- Render: `docs/deployment/RENDER.md`
- Fly.io: `docs/deployment/FLYIO.md`

---

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

**Database connection error:**
```bash
# Verify PostgreSQL is running
# Windows: Check Services app
# Mac: brew services list
# Linux: systemctl status postgresql

# Test connection
psql -U postgres -d neural_entrainment -c "SELECT 1;"
```

**ESLint/TypeScript errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npm list typescript

# Restart VS Code
```

### Frontend Issues

**Build fails:**
```bash
# Clear cache
rm -rf node_modules .vite dist
npm install
npm run build
```

**API calls failing:**
- Check `VITE_API_URL` in `.env.local`
- Verify backend is running
- Check browser console for CORS errors
- Verify backend `CORS_ORIGIN` matches frontend URL

**Audio not playing:**
- Check browser console for Web Audio API errors
- Verify user clicked button (browsers require user interaction)
- Test in Chrome/Edge (best Web Audio support)

### Common Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Backend not running or wrong URL |
| `401 Unauthorized` | JWT token expired, log in again |
| `MODULE_NOT_FOUND` | Run `npm install` |
| `Port 3001 in use` | Kill process or change PORT in .env |
| `PostgreSQL not found` | Add to PATH or use full path |
| `TypeError: AudioContext is not defined` | Normal in Node.js tests, use mocks |

---

## Additional Resources

### Documentation

- **Architecture**: `docs/architecture/ARCHITECTURE.md` - System design
- **Audio Engine**: `docs/architecture/AUDIO_ENGINE_V2.md` - Audio implementation
- **Gateway Process**: `docs/reference/GATEWAY_PROCESS.md` - Focus level system
- **API Reference**: `docs/reference/API.md` - Endpoint documentation
- **Protocols**: `docs/reference/PROTOCOLS.md` - Session protocol details

### External Links

- **Repository**: https://github.com/CrisisCore-Systems/neural-entrainment-system
- **Live Demo**: https://crisiscore-systems.github.io/neural-entrainment-system/
- **Issue Tracker**: https://github.com/CrisisCore-Systems/neural-entrainment-system/issues
- **Fastify Docs**: https://www.fastify.io/docs/latest/
- **React Docs**: https://react.dev/
- **Three.js Docs**: https://threejs.org/docs/
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Getting Help

1. **Check this guide** - Most common issues covered
2. **Search existing issues** - Someone may have solved it
3. **Check logs** - Backend logs show detailed errors
4. **Browser console** - Frontend errors appear here
5. **Create issue** - Include error messages and steps to reproduce

### Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick contribution steps:**
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Run quality checks
5. Submit pull request with clear description

---

## Quick Reference Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix issues
npm run format       # Format code
npm run quality      # Run all checks
npm test             # Run tests
npm run build        # Build for production

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
psql -U postgres -d neural_entrainment -f backend/database/schema.sql   # Run schema
psql -U postgres -d neural_entrainment -f backend/database/seed.sql     # Seed data
.\backend\setup-local-db.ps1  # Automated setup (Windows)
```

---

**Last Updated**: November 6, 2025
**Version**: 3.0
**Maintained by**: CrisisCore Systems

For questions or issues, please create an issue on GitHub or contact the development team.
