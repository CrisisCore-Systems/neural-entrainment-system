# Neural Entrainment Backend

Backend API server for CrisisCore Neural Interface v3.0

## 🚀 Free Hosting

Looking to deploy? Check out our **[Free Deployment Guide](../DEPLOYMENT.md)** for step-by-step instructions on deploying to:
- Railway (recommended - easiest setup)
- Render (best for 24/7 uptime)
- Fly.io (global distribution)
- Supabase (all-in-one solution)

See **[Hosting Comparison](../HOSTING_COMPARISON.md)** for platform comparison.

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

2. **Set up environment (automated):**
```bash
./setup.sh
```

Or manually:
```bash
cp .env.example .env
# Edit .env with your database credentials
# Also set CORS_ORIGIN to include allowed origins (comma-separated)
# Example:
# CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

**Important:** The `.env` file includes CORS configuration. For production deployments, ensure `CORS_ORIGIN` includes all frontend URLs that need to access the API:
- `http://localhost:5173` for local development
- `https://crisiscore-systems.github.io` for GitHub Pages deployment

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

Tip (Windows): If you don't use Docker, you can either:
- Run Redis in WSL: `wsl --install` then `sudo apt install redis-server && sudo service redis-server start`.
- Or install a native Windows-compatible Redis distribution (e.g., a developer edition) and start it as a service.

Set `REDIS_URL=redis://127.0.0.1:6379` (or `REDIS_HOST=127.0.0.1` and `REDIS_PORT=6379`) for best results on Windows. You can also set `DISABLE_REDIS=true` to force the in-memory cache during local development.

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
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
DISABLE_REDIS=false

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

## Neon (Postgres) Setup

If you're using Neon as your free PostgreSQL, follow these quick steps:

1. Create a Neon project and an app role (e.g., `app_user`) with a strong password.
2. Copy the direct connection string (psql URI):
	`postgresql://app_user:<password>@<host>/<db>?sslmode=require`
3. Initialize the schema using the SQL editor in Neon or locally with psql:
	```bash
	psql "postgresql://app_user:<password>@<host>/<db>?sslmode=require" -f backend/database/schema.sql
	```
4. Set the connection string as `DATABASE_URL` on your hosting platform (Render, Railway, etc.).
	Never expose this in the frontend; keep it server-side only.

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

## Troubleshooting

### CORS Errors

If you see CORS errors like:
```
Access to fetch at 'http://localhost:3001/api/auth/login' from origin 'https://crisiscore-systems.github.io' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check
```

**Solution:**
1. Ensure you have a `.env` file in the backend directory (copy from `.env.example`)
2. Verify the `CORS_ORIGIN` environment variable includes all required origins:
   ```env
   CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
   ```
3. Restart the backend server after making changes to `.env`
4. For production deployments, make sure your hosting provider has the correct `CORS_ORIGIN` environment variable set

### Database Connection Issues

If the server fails to start with database errors:
1. Ensure PostgreSQL is running
2. Verify database credentials in `.env`
3. Check that the database exists: `psql -l | grep neural_entrainment`

### Redis Connection Issues

If you see Redis connection errors:
1. Ensure Redis is running: `redis-cli ping` (should return `PONG`)
2. Verify Redis URL in `.env`
3. Or start Redis with Docker: `docker run -d -p 6379:6379 redis:7-alpine`

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
