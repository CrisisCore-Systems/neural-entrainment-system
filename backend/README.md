# Neural Entrainment Backend

Backend API server for CrisisCore Neural Interface v3.0

## Tech Stack
- **Node.js 20+** with TypeScript
- **Fastify** - High-performance web framework
- **PostgreSQL** - Primary database
- **Redis** - Session caching and real-time state
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Request validation

## Setup

### Prerequisites
- Node.js 20 or higher
- PostgreSQL 14+
- Redis 7+

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
# Also set CORS_ORIGIN to include allowed origins (comma-separated)
# Example:
# CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

3. **Create database:**
```bash
createdb neural_entrainment
```

4. **Initialize schema:**
```bash
psql -d neural_entrainment -f database/schema.sql
```

5. **Start Redis:**
```bash
# Windows (with Redis installed)
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:7-alpine
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout (requires auth)

### Sessions
- `GET /api/sessions` - Get session history (requires auth)
- `POST /api/sessions` - Create new session (requires auth)
- `GET /api/sessions/stats` - Get user statistics (requires auth)

### Protocols
- `GET /api/protocols` - Get all public protocols
- `GET /api/protocols/:id` - Get specific protocol

### Users
- `GET /api/users/preferences` - Get preferences (requires auth)
- `PUT /api/users/preferences` - Update preferences (requires auth)

### Health Check
- `GET /health` - Server health status

## Environment Variables

```env
NODE_ENV=development
PORT=3001

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/neural_entrainment

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

Tip: You can set multiple CORS origins by comma-separating them:

```env
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

### Windows quick setup (PowerShell)

```powershell
cd backend
./setup.ps1 -Port 3001 -CorsOrigins "http://localhost:5173,https://crisiscore-systems.github.io"
npm run dev
```

## Database Schema

### Tables
- **users** - User accounts with medical screening
- **protocols** - Neural entrainment programs (6-phase configs)
- **sessions** - Session tracking with real-time metrics
- **daily_metrics** - Aggregated daily statistics
- **user_preferences** - Audio/visual/notification preferences
- **session_ratings** - User feedback on protocols

### Key Features
- UUID primary keys
- Automatic `updated_at` triggers
- JSONB for flexible metrics storage
- Indexes for query performance
- Foreign key constraints for data integrity

## Architecture

```
backend/
├── src/
│   ├── index.ts              # Main server entry
│   ├── config/               # Configuration
│   ├── plugins/              # Database, Redis plugins
│   ├── middleware/           # Auth middleware
│   ├── routes/               # API route handlers
│   └── utils/                # Logger, helpers
├── database/
│   └── schema.sql            # Database schema
├── package.json
└── tsconfig.json
```

## Security Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting (100 req/15min)
- ✅ Request validation with Zod
- ✅ Medical disclaimer enforcement

## Next Steps
- [ ] WebSocket support for real-time session updates
- [ ] GraphQL API layer
- [ ] Email verification
- [ ] Password reset flow
- [ ] Social authentication (OAuth)
- [ ] Admin dashboard endpoints
- [ ] Metrics export (CSV/JSON)
- [ ] Automated backups

---

**Status**: 🏗️ Backend Foundation Complete  
**Next**: Install dependencies and test endpoints
