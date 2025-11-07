# Local Development Setup Guide

This guide will help you get the Neural Entrainment backend running locally on your machine.

## Prerequisites

### 1. Node.js (v18 or higher)
- Download: https://nodejs.org/
- Verify: `node --version`

### 2. PostgreSQL (v14 or higher)
- Download: https://www.postgresql.org/download/windows/
- During installation:
  - Remember your `postgres` user password
  - Default port: 5432
  - Add to PATH: `C:\Program Files\PostgreSQL\16\bin`

### 3. Git
- Download: https://git-scm.com/download/win
- Verify: `git --version`

## Quick Start (5 minutes)

### Step 1: Clone and Install

```powershell
# Clone repository (if not already done)
git clone https://github.com/CrisisCore-Systems/neural-entrainment-system.git
cd neural-entrainment-system/backend

# Install dependencies
npm install
```

### Step 2: Configure Environment

```powershell
# Copy example .env
Copy-Item .env.example .env

# Edit .env file and update:
# - DB_PASSWORD=your_postgres_password
# - DISABLE_REDIS=true (for local dev without Redis)
```

### Step 3: Setup Database

```powershell
# Run automated setup script
.\setup-local-db.ps1

# This will:
# - Create neural_entrainment database
# - Run all schema migrations
# - Seed protocols
# - Setup Gateway tables
```

### Step 4: Create Your User

```powershell
# Create your account
node scripts/create-user.js

# Make yourself admin
node scripts/make-admin.js your-email@example.com
```

### Step 5: Start Development Server

```powershell
# Start backend with hot reload
npm run dev

# Backend will run at: http://localhost:3001
# Health check: http://localhost:3001/health
```

## Detailed Setup

### PostgreSQL Setup (Windows)

1. **Install PostgreSQL**
   ```powershell
   # Download and run installer from:
   # https://www.postgresql.org/download/windows/
   
   # During installation:
   # - Set postgres user password (remember this!)
   # - Port: 5432 (default)
   # - Locale: English, United States
   ```

2. **Add PostgreSQL to PATH**
   ```powershell
   # Add to System Environment Variables:
   # C:\Program Files\PostgreSQL\16\bin
   
   # Verify:
   psql --version
   ```

3. **Test Connection**
   ```powershell
   # Connect to PostgreSQL
   psql -U postgres
   
   # If successful, you'll see:
   # postgres=#
   
   # Exit with: \q
   ```

### Environment Configuration

**Option 1: Local PostgreSQL (Recommended)**
```bash
NODE_ENV=development
PORT=3001

# Local PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/neural_entrainment
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neural_entrainment
DB_USER=postgres
DB_PASSWORD=your_password

# Disable Redis for local dev
DISABLE_REDIS=true
DISABLE_DATABASE=false

# JWT (dev only)
JWT_SECRET=local-dev-secret-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

**Option 2: Remote PostgreSQL (Neon)**
```bash
# Use your Neon connection string
DATABASE_URL=postgresql://user:pass@ep-holy-hill-advdgq5d-pooler.c-2.us-east-1.aws.neon.tech/neondb
DISABLE_REDIS=true
```

### Manual Database Setup

If automated script fails:

```powershell
# 1. Create database
psql -U postgres -c "CREATE DATABASE neural_entrainment;"

# 2. Run schema
psql -U postgres -d neural_entrainment -f database/setup.sql

# 3. Seed protocols
psql -U postgres -d neural_entrainment -f database/seed.sql
psql -U postgres -d neural_entrainment -f database/seed_additional.sql

# 4. Run migrations
psql -U postgres -d neural_entrainment -f migrations/005_gateway_process.sql
psql -U postgres -d neural_entrainment -f migrations/006_add_admin_role.sql
```

### Redis Setup (Optional)

Redis is **optional** for local development. Set `DISABLE_REDIS=true` in .env to skip it.

If you want Redis:

**Option 1: Docker (Recommended)**
```powershell
docker run -d -p 6379:6379 --name redis-neural redis:alpine
```

**Option 2: Windows Native**
- Download: https://github.com/tporadowski/redis/releases
- Extract and run: `redis-server.exe`

## Development Workflow

### Starting the Backend

```powershell
# Development mode (hot reload)
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Accessing the API

- **Base URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Protocols**: http://localhost:3001/api/protocols

### API Documentation

**Authentication Endpoints:**
```
POST /api/auth/register - Create new user
POST /api/auth/login - Login user
GET  /api/auth/me - Get current user
POST /api/auth/logout - Logout user
```

**Protocol Endpoints:**
```
GET /api/protocols - List all protocols
GET /api/protocols/:id - Get protocol by ID
```

**Session Endpoints:**
```
GET  /api/sessions - List user sessions
POST /api/sessions - Create new session
PUT  /api/sessions/:id - Update session
GET  /api/sessions/stats - Get session statistics
```

### Testing Your Setup

```powershell
# 1. Health check
curl http://localhost:3001/health

# 2. Get protocols (requires auth)
curl http://localhost:3001/api/protocols

# 3. Register user
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","username":"testuser","password":"password123","medicalDisclaimerAccepted":true}'

# 4. Login
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### PostgreSQL Connection Issues

**Error: "password authentication failed"**
```powershell
# Update .env with correct password
# Or reset postgres password:
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
```

**Error: "database does not exist"**
```powershell
# Create database manually
psql -U postgres -c "CREATE DATABASE neural_entrainment;"
```

**Error: "psql: command not found"**
```powershell
# Add PostgreSQL to PATH
# System Properties > Environment Variables > Path
# Add: C:\Program Files\PostgreSQL\16\bin
```

### Redis Connection Issues

```powershell
# Disable Redis for local dev
# In .env, set:
DISABLE_REDIS=true
```

### Port Already in Use

```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process
taskkill /PID <process_id> /F

# Or change PORT in .env
PORT=3002
```

### Database Migration Issues

```powershell
# Reset database completely
psql -U postgres -c "DROP DATABASE neural_entrainment;"
psql -U postgres -c "CREATE DATABASE neural_entrainment;"
.\setup-local-db.ps1
```

## Useful Commands

### Database Management

```powershell
# Connect to database
psql -U postgres -d neural_entrainment

# List tables
\dt

# Describe table
\d users

# View protocols
SELECT id, name, category FROM protocols;

# View users
SELECT id, username, email, is_admin FROM users;

# Exit
\q
```

### Utility Scripts

```powershell
# Create user
node scripts/create-user.js

# Make user admin
node scripts/make-admin.js email@example.com

# Check admin status
node scripts/check-admin.js email@example.com

# Generate JWT secret
node scripts/generate-jwt.ps1

# Run Gateway migration
node scripts/run-gateway-migration.js
```

## IDE Setup (VS Code)

### Recommended Extensions

- **ESLint** - dbaeumer.vscode-eslint
- **Prettier** - esbenp.prettier-vscode
- **PostgreSQL** - ckolkman.vscode-postgres
- **REST Client** - humao.rest-client

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["typescript"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Next Steps

1. ✅ Backend running locally
2. ✅ Database setup complete
3. ✅ User account created

**Now you can:**
- Develop new backend features
- Test API endpoints locally
- Debug with breakpoints
- Run backend tests
- Connect frontend to local backend (update `VITE_API_URL` in frontend/.env)

## Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for production deployment to Render.

## Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Architecture**: See `ARCHITECTURE.md`
- **Tech Stack**: See `App_techstack.md`
