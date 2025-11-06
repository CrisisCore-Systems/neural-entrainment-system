# 🔍 Render + Neon Setup Verification

Run through this checklist to verify your deployment is configured correctly.

## ✅ Checklist

### 1. Neon PostgreSQL Setup

- [ ] **Neon account created** at [neon.tech](https://neon.tech)
- [ ] **Database created** named "neural-entrainment" (or similar)
- [ ] **Connection string obtained** (format: `postgresql://user:pass@ep-xxx.aws.neon.tech/dbname?sslmode=require`)
- [ ] **Schema initialized** - Run this command:
  ```bash
  psql "YOUR_NEON_DATABASE_URL" -f backend/database/schema.sql
  ```
- [ ] **Tables verified** - Check tables exist:
  ```bash
  psql "YOUR_NEON_DATABASE_URL" -c "\dt"
  ```
  Expected tables: users, sessions, protocols, session_metrics, daily_metrics

### 2. Render Backend Setup

- [ ] **Render account created** at [render.com](https://render.com)
- [ ] **GitHub repo connected** to Render
- [ ] **Web Service created** with these settings:
  - Name: `neural-entrainment-backend`
  - Root Directory: `backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Instance Type: **Free**

### 3. Render Environment Variables

Check these in Render Dashboard → Your Service → Environment:

**Required Variables:**
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3001` (or let Render auto-set)
- [ ] `DATABASE_URL` = Your Neon connection string (with `?sslmode=require`)
- [ ] `JWT_SECRET` = Random 32+ character string
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `CORS_ORIGIN` = `https://crisiscore-systems.github.io`

**Optional (for Redis-less setup):**
- [ ] `DISABLE_REDIS` = `true` (if not using Redis)

**Not needed:**
- ❌ `REDIS_URL` (skip if using `DISABLE_REDIS=true`)
- ❌ Individual DB_HOST, DB_PORT, etc. (DATABASE_URL is enough)

### 4. Frontend Configuration

Check `frontend/.env.production`:

- [ ] `VITE_API_URL` = `https://neural-entrainment-backend.onrender.com`
  - ⚠️ **Important**: NO `/api` suffix (the code adds it automatically)

### 5. Deployment Tests

#### Test 1: Backend Health Check
```bash
curl https://neural-entrainment-backend.onrender.com/health
```
**Expected Response:**
```json
{"status":"ok","timestamp":"..."}
```

#### Test 2: Backend API Endpoints
```bash
# Test protocols endpoint
curl https://neural-entrainment-backend.onrender.com/api/protocols

# Should return array of protocols (may be empty if not seeded)
```

#### Test 3: Database Connection
Check Render logs for:
```
✓ Database connection successful
```

#### Test 4: CORS Configuration
Open browser console at your GitHub Pages site:
```javascript
fetch('https://neural-entrainment-backend.onrender.com/api/protocols')
  .then(r => r.json())
  .then(console.log)
```
Should NOT show CORS errors.

### 6. Common Issues & Fixes

#### ❌ Issue: "Connection refused" or "ECONNREFUSED"
**Cause:** DATABASE_URL is wrong or database doesn't exist  
**Fix:** Verify Neon connection string is correct and includes `?sslmode=require`

#### ❌ Issue: "password authentication failed"
**Cause:** Wrong credentials in DATABASE_URL  
**Fix:** Copy connection string directly from Neon dashboard

#### ❌ Issue: "relation 'users' does not exist"
**Cause:** Schema not initialized  
**Fix:** Run schema.sql against your Neon database:
```bash
psql "YOUR_NEON_DATABASE_URL" -f backend/database/schema.sql
```

#### ❌ Issue: "CORS error" in browser
**Cause:** CORS_ORIGIN doesn't match your frontend URL  
**Fix:** Set `CORS_ORIGIN=https://crisiscore-systems.github.io` in Render

#### ❌ Issue: Backend returns 404
**Cause:** Frontend using wrong API URL  
**Fix:** Verify `VITE_API_URL` in `frontend/.env.production`

#### ❌ Issue: Render build fails
**Cause:** Missing dependencies or wrong Node version  
**Fix:** Check Render build logs, ensure `package.json` has all dependencies

## 🎯 Quick Verification Script

Run this to test your full setup:

```bash
# Set your backend URL
BACKEND_URL="https://neural-entrainment-backend.onrender.com"

# Test health endpoint
echo "Testing health endpoint..."
curl -s "$BACKEND_URL/health" | jq

# Test API endpoint
echo "Testing protocols API..."
curl -s "$BACKEND_URL/api/protocols" | jq

# Test CORS (should show allowed origins)
echo "Testing CORS headers..."
curl -I "$BACKEND_URL/health" | grep -i "access-control"
```

## 📊 Expected Configuration Summary

### Neon Database
```
Host: ep-xxx-xxx.aws.neon.tech
Database: neondb (or your chosen name)
SSL Mode: Required
Free Tier: 10 GB storage, enough for ~100k sessions
```

### Render Backend
```
URL: https://neural-entrainment-backend.onrender.com
Region: Choose closest to users (Oregon, Frankfurt, etc.)
Free Tier: 750 hours/month (24/7 operation)
Cold Start: ~30 seconds after 15 min idle
```

### Frontend (GitHub Pages)
```
URL: https://crisiscore-systems.github.io/neural-entrainment-system
Connects to: Render backend via VITE_API_URL
```

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong random string (not default value)
- [ ] DATABASE_URL is not exposed in frontend code
- [ ] Neon database has restricted access (not public)
- [ ] CORS_ORIGIN only allows your frontend domain
- [ ] `.env` files are in `.gitignore` (not committed)

## 🚀 Next Steps After Verification

Once everything checks out:

1. **Seed Database** (optional):
   ```bash
   psql "YOUR_NEON_DATABASE_URL" -f backend/database/seed.sql
   ```

2. **Monitor Usage**:
   - Neon: Check storage usage in dashboard
   - Render: Monitor service health and logs

3. **Set Up Monitoring**:
   - Add Sentry for error tracking (optional)
   - Set up uptime monitoring (UptimeRobot, etc.)

4. **Test End-to-End**:
   - Visit your GitHub Pages site
   - Try creating an account
   - Start a neural entrainment session
   - Verify data is saved to Neon database

---

## 📝 Configuration Files Reference

### `render.yaml`
✅ Already exists at project root - tells Render how to deploy

### `frontend/.env.production`
Should contain:
```env
VITE_API_URL=https://neural-entrainment-backend.onrender.com
```

### `backend/.env` (on Render)
Set via Render Dashboard, not a file. Should have:
```env
NODE_ENV=production
DATABASE_URL=postgresql://...neon.tech/...?sslmode=require
JWT_SECRET=random-secret-here
CORS_ORIGIN=https://crisiscore-systems.github.io
DISABLE_REDIS=true
```

---

**Status**: Use this checklist to verify each component is properly configured.

**Last Updated**: November 5, 2025
