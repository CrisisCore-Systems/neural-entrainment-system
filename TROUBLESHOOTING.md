# 🔧 Deployment Troubleshooting Guide

Common issues and solutions when deploying the Neural Entrainment System to free hosting platforms.

## 📋 Table of Contents

1. [Backend Won't Start](#backend-wont-start)
2. [Database Connection Errors](#database-connection-errors)
3. [Redis Connection Errors](#redis-connection-errors)
4. [CORS Errors](#cors-errors)
5. [Cold Start Issues](#cold-start-issues)
6. [Build Failures](#build-failures)
7. [Environment Variable Issues](#environment-variable-issues)
8. [Frontend Can't Connect to Backend](#frontend-cant-connect-to-backend)

---

## Backend Won't Start

### Symptom
Backend service shows "crashed" or won't stay running.

### Common Causes & Solutions

#### 1. Missing Environment Variables
```bash
# Check if all required variables are set
railway variables list  # Railway
# or check in Render/Fly.io dashboard

# Required variables:
# - NODE_ENV=production
# - PORT=3001 (or 8080 for Fly.io)
# - DATABASE_URL
# - REDIS_URL (or REDIS_HOST/REDIS_PORT)
# - JWT_SECRET
# - CORS_ORIGIN
```

**Solution:** Set missing variables in platform dashboard or CLI.

#### 2. Port Mismatch
**Railway/Render:** Backend listens on PORT environment variable
**Fly.io:** Must listen on port 8080

```typescript
// backend/src/index.ts should have:
const PORT = process.env.PORT || 3001;
```

**Solution:** Update `fly.toml` to set `PORT=8080` or modify code to use correct port.

#### 3. TypeScript Build Failed
```bash
# Check build logs
railway logs  # Railway
# or Render/Fly.io logs

# Common error: "Cannot find module"
```

**Solution:** Ensure `build` script in `package.json` compiles TypeScript:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## Database Connection Errors

### Symptom
```
Error: connect ECONNREFUSED
Error: password authentication failed
Error: SSL connection required
```

### Solutions

#### 1. SSL/TLS Required
Most free PostgreSQL providers require SSL.

**Solution:** Add `?sslmode=require` to DATABASE_URL:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

#### 2. Connection String Format
Different formats for different providers:

**Neon:**
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Supabase:**
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

**Railway:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:7439/railway
```

#### 3. Database Not Initialized
Schema not loaded into database.

**Solution:**
```bash
# Get database URL
railway variables get DATABASE_URL  # Railway
# or from Render/Fly.io dashboard

# Load schema
psql "DATABASE_URL_HERE" -f backend/database/schema.sql
```

#### 4. Connection Limit Reached
Free tiers have connection limits (usually 5-20).

**Solution:** Implement connection pooling:
```typescript
// backend/src/plugins/postgres.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5, // Limit pool size for free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## Redis Connection Errors

### Symptom
```
Error: connect ECONNREFUSED 127.0.0.1:6379
Error: Redis connection to xxx failed
```

### Solutions

#### 1. Redis URL Format
Check Redis connection string format:

**Railway Redis:**
```
redis://default:password@containers-us-west-xxx.railway.app:6379
```

**Upstash:**
```
redis://default:password@us1-xxx.upstash.io:6379
```

#### 2. Missing Redis
If Redis is optional in your app:

**Solution:** Add fallback to in-memory cache:
```typescript
// backend/src/plugins/redis.ts
const useRedis = process.env.REDIS_URL && !process.env.DISABLE_REDIS;

if (!useRedis) {
  console.log('Redis disabled, using in-memory cache');
  // Fallback to Map() or similar
}
```

Set `DISABLE_REDIS=true` to skip Redis entirely.

#### 3. TLS Required (Upstash)
Upstash requires TLS connections.

**Solution:**
```typescript
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});
```

---

## CORS Errors

### Symptom
Browser console shows:
```
Access to XMLHttpRequest blocked by CORS policy
No 'Access-Control-Allow-Origin' header
```

### Solutions

#### 1. CORS_ORIGIN Not Set
**Solution:** Set CORS_ORIGIN environment variable:
```bash
railway variables set CORS_ORIGIN=https://crisiscore-systems.github.io
```

#### 2. Wrong Origin URL
Must match EXACTLY (no trailing slash).

**Wrong:**
```
CORS_ORIGIN=https://crisiscore-systems.github.io/
```

**Correct:**
```
CORS_ORIGIN=https://crisiscore-systems.github.io
```

#### 3. Multiple Origins
Separate with commas:
```
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

#### 4. Backend CORS Configuration
Verify backend code:
```typescript
// backend/src/index.ts
await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true
})
```

---

## Cold Start Issues

### Symptom
First request takes 10-30 seconds, then works normally.

### Explanation
Free tier services sleep after inactivity:
- **Railway**: 5 minutes idle
- **Render**: 15 minutes idle
- **Fly.io**: Immediate

This is **normal behavior** for free tiers.

### Solutions

#### 1. Add Loading State
```typescript
// frontend/src/api/client.ts
const makeRequest = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal 
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Server is waking up, please wait...');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
```

#### 2. Keep-Alive Pings (Optional)
Use a cron job to ping your backend:
```yaml
# .github/workflows/keepalive.yml
name: Keep Backend Alive
on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://your-backend-url.com/health
```

⚠️ **Warning**: This may violate free tier terms of service. Check platform policies.

#### 3. Upgrade to Paid Tier
Most platforms offer always-on instances for $5-7/month.

---

## Build Failures

### Symptom
Deployment fails during build phase.

### Solutions

#### 1. Node Version Mismatch
**Solution:** Specify Node version:

**Railway** - add to `railway.toml`:
```toml
[build]
nixpacksPlan = "nodejs-20"
```

**Render** - add to `render.yaml`:
```yaml
services:
  - type: web
    runtime: node
    buildCommand: npm install && npm run build
```

**Fly.io** - runs latest Node by default.

#### 2. Missing Build Script
**Solution:** Ensure `package.json` has build command:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

#### 3. TypeScript Errors
**Solution:** Fix TypeScript errors or disable strict mode temporarily:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false  // Temporarily to unblock deployment
  }
}
```

#### 4. Out of Memory
Free tier build memory is limited.

**Solution:** Reduce dependencies or use build flags:
```bash
NODE_OPTIONS="--max-old-space-size=512" npm run build
```

---

## Environment Variable Issues

### Symptom
App crashes or behaves unexpectedly in production.

### Solutions

#### 1. Variables Not Loading
Check if `.env` files are being read:

**Railway/Render/Fly.io:** Environment variables are set in dashboard, NOT from `.env` files.

**Solution:** Set all variables manually in platform:
```bash
railway variables set KEY=VALUE
```

#### 2. JWT_SECRET Not Secure
Generate a strong secret:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 3. DATABASE_URL Override
Platform may auto-set DATABASE_URL.

**Solution:** Use platform's auto-generated DATABASE_URL for connected databases.

---

## Frontend Can't Connect to Backend

### Symptom
Frontend shows network errors, backend is running fine.

### Solutions

#### 1. Wrong API URL
Check `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

Must match backend URL exactly.

#### 2. Frontend Not Rebuilt
After changing API URL, rebuild frontend:
```bash
cd frontend
npm run build
git add .
git commit -m "Update API URL"
git push
```

GitHub Actions will redeploy.

#### 3. HTTPS Mixed Content
Frontend (HTTPS) can't call backend (HTTP).

**Solution:** Ensure backend has HTTPS:
- Railway: Automatic HTTPS ✅
- Render: Automatic HTTPS ✅
- Fly.io: Automatic HTTPS ✅

#### 4. API Path Mismatch
Backend might be at `/api` or `/api/v1`.

**Check backend routes:**
```typescript
// backend/src/index.ts
app.register(routes, { prefix: '/api' })  // URL is /api/...
```

**Update frontend:**
```typescript
// frontend/src/config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

---

## Platform-Specific Issues

### Railway

#### Deployment Hangs
**Solution:** Check Railway status page: status.railway.app

#### Credit Exhausted
**Solution:** Monitor usage in dashboard, upgrade to paid plan.

### Render

#### Service Won't Wake
**Solution:** Make a manual request to wake service, or upgrade to paid plan.

#### PostgreSQL Connection Failed
**Solution:** Render doesn't include free PostgreSQL, use Neon or Railway.

### Fly.io

#### fly.toml Syntax Error
**Solution:** Validate TOML syntax:
```bash
fly config validate
```

#### Machine Won't Start
**Solution:** Check logs:
```bash
fly logs
```

---

## Getting Help

### Check Logs
**Railway:**
```bash
railway logs
```

**Render:**
View in dashboard → Logs tab

**Fly.io:**
```bash
fly logs
```

### Test Health Endpoint
```bash
curl https://your-backend-url.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T21:00:00.000Z"
}
```

### Test Database Connection
```bash
railway run psql $DATABASE_URL -c "SELECT version();"
```

### Common Commands

**Railway:**
```bash
railway status       # Check deployment status
railway variables    # List environment variables
railway open        # Open dashboard
railway restart     # Restart service
```

**Render:**
```bash
# Use web dashboard - no CLI for service management
```

**Fly.io:**
```bash
fly status          # Check app status
fly scale show      # Show current scale
fly deploy          # Redeploy
fly ssh console     # SSH into machine
```

---

## Still Having Issues?

1. **Check Platform Status**
   - Railway: status.railway.app
   - Render: status.render.com
   - Fly.io: status.flyio.net

2. **Review Documentation**
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
   - [ARCHITECTURE.md](./ARCHITECTURE.md)
   - Platform docs

3. **Search Platform Communities**
   - Railway Discord
   - Render Community
   - Fly.io Community

4. **Open GitHub Issue**
   - Include error logs
   - Describe what you've tried
   - Share configuration (remove secrets!)

---

**Quick Reset:**
If all else fails, redeploy from scratch:

```bash
# Railway
railway down
railway up

# Render
Delete service → Create new service

# Fly.io
fly apps destroy your-app
fly launch
```
