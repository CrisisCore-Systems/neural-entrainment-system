# 🚀 Quick Reference - Free Hosting Deployment

One-page cheat sheet for deploying Neural Entrainment System to free hosting.

## 🎯 TL;DR - Fastest Deployment

### Railway (Recommended - 10 minutes)
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
railway add --plugin postgresql
railway add --plugin redis
railway run psql $DATABASE_URL -f database/schema.sql
railway domain  # Get your URL
```

Update `frontend/.env.production` with your Railway URL, then push to GitHub.

---

## 📊 Platform Quick Comparison

| | Railway | Render | Fly.io |
|---|---------|--------|--------|
| **Setup Time** | 10 min ⭐⭐⭐⭐⭐ | 20 min ⭐⭐⭐ | 15 min ⭐⭐⭐⭐ |
| **Ease of Use** | Easiest | Medium | Technical |
| **Database** | ✅ Included | ❌ External | ✅ Included |
| **Redis** | ✅ Included | ❌ External | ✅ Included |
| **Uptime/Month** | ~500 hrs | 750 hrs | Unlimited* |
| **Best For** | Quick setup | 24/7 uptime | Global apps |

*With auto-sleep

---

## 🔧 Required Environment Variables

```bash
# Backend (set in platform dashboard or CLI)
NODE_ENV=production
PORT=3001                    # or 8080 for Fly.io
DATABASE_URL=postgresql://... # Auto-set by Railway/Fly.io
REDIS_URL=redis://...        # Auto-set by Railway/Fly.io
JWT_SECRET=<random-32-chars> # Generate: openssl rand -base64 32
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-username.github.io
```

```bash
# Frontend (.env.production)
VITE_API_URL=https://your-backend-url.com/api
```

---

## 📝 Platform-Specific Commands

### Railway
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up

# Add database
railway add --plugin postgresql

# Add Redis
railway add --plugin redis

# Set environment variable
railway variables set KEY=VALUE

# View logs
railway logs

# Get deployment URL
railway domain

# Run command with env
railway run <command>

# Open dashboard
railway open
```

### Render
```bash
# No CLI needed - use web dashboard
# 1. Go to render.com
# 2. New → Web Service
# 3. Connect GitHub repo
# 4. Set root directory: backend
# 5. Build: npm install && npm run build
# 6. Start: npm start
# 7. Add environment variables
# 8. Deploy
```

### Fly.io
```bash
# Install CLI (Linux/Mac)
curl -L https://fly.io/install.sh | sh

# Install CLI (Windows)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Login
fly auth login

# Initialize app
cd backend
fly launch --name your-app-name

# Add PostgreSQL
fly postgres create

# Add Redis
fly redis create

# Set secrets
fly secrets set JWT_SECRET=$(openssl rand -base64 32)
fly secrets set CORS_ORIGIN=https://your-site.github.io

# Deploy
fly deploy

# View logs
fly logs

# Get app info
fly info

# SSH into app
fly ssh console
```

---

## 🗄️ Database Setup

### Initialize Schema
```bash
# Get database URL first
# Railway:
DB_URL=$(railway variables get DATABASE_URL)

# Render/Fly.io:
# Copy from dashboard

# Load schema
psql "$DB_URL" -f backend/database/schema.sql

# Verify tables
psql "$DB_URL" -c "\dt"
```

### Test Connection
```bash
# Test PostgreSQL
psql "$DATABASE_URL" -c "SELECT version();"

# Test Redis
redis-cli -u "$REDIS_URL" ping
```

---

## 🌐 Frontend Update

### Update API URL
```bash
cd frontend

# Edit .env.production
echo "VITE_API_URL=https://your-backend-url.com/api" > .env.production

# Rebuild and deploy
npm run build

# Commit and push (auto-deploys to GitHub Pages)
git add .
git commit -m "Update API URL"
git push origin main
```

---

## 🔍 Debugging

### Check Backend Health
```bash
curl https://your-backend-url.com/health
# Should return: {"status":"ok","timestamp":"..."}
```

### View Logs
```bash
# Railway
railway logs --tail

# Fly.io
fly logs

# Render
# View in dashboard → Logs tab
```

### Test API Endpoints
```bash
# Register user
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","username":"testuser"}'

# Login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

## 🚨 Common Issues & Quick Fixes

### Backend Won't Start
```bash
# Check environment variables
railway variables list  # Railway
fly secrets list        # Fly.io

# Check logs
railway logs           # Railway
fly logs              # Fly.io
```

### CORS Error
```bash
# Set CORS_ORIGIN (must match frontend URL exactly)
railway variables set CORS_ORIGIN=https://your-site.github.io

# No trailing slash!
```

### Database Connection Failed
```bash
# Verify DATABASE_URL
railway variables get DATABASE_URL

# Check if SSL is required (add to URL)
?sslmode=require
```

### Cold Start Slow
**This is normal** for free tiers. First request after idle takes 5-30s.

Solutions:
- Show loading message in frontend
- Upgrade to paid tier for always-on
- Use keep-alive ping (may violate ToS)

---

## 💰 Cost Monitoring

### Railway
```bash
# View in dashboard
railway open
# Go to Settings → Usage
```

### Render
Check dashboard → Service → Metrics

### Fly.io
```bash
fly scale show
fly logs --recent
```

---

## 📚 Documentation Links

- **Full Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Comparison**: [HOSTING_COMPARISON.md](./HOSTING_COMPARISON.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🎯 Deployment Checklist

### Backend
- [ ] Choose platform (Railway/Render/Fly.io)
- [ ] Deploy backend
- [ ] Add PostgreSQL
- [ ] Add Redis (or set DISABLE_REDIS=true)
- [ ] Set environment variables
- [ ] Initialize database schema
- [ ] Test health endpoint
- [ ] Get backend URL

### Frontend
- [ ] Update `.env.production` with backend URL
- [ ] Rebuild frontend
- [ ] Push to GitHub (auto-deploys)
- [ ] Test in browser
- [ ] Verify API calls work

### Testing
- [ ] Create test user
- [ ] Login
- [ ] Create session
- [ ] Check logs for errors

---

## 🔑 Quick Security Setup

```bash
# Generate JWT secret
openssl rand -base64 32

# Set in platform
railway variables set JWT_SECRET=<generated-secret>

# Set CORS origin
railway variables set CORS_ORIGIN=https://your-site.github.io

# Enable rate limiting (already in code)
# Verify in backend/src/index.ts
```

---

## 🏃 Full Deployment Script

### Railway (One Command)
```bash
cd backend && ./deploy-railway.sh
```

### Manual Steps (Any Platform)
```bash
# 1. Deploy backend to platform
# 2. Add database and Redis
# 3. Set environment variables:
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://your-site.github.io
NODE_ENV=production

# 4. Initialize database
psql $DATABASE_URL -f database/schema.sql

# 5. Update frontend
cd ../frontend
echo "VITE_API_URL=https://your-backend-url.com/api" > .env.production
git add . && git commit -m "Update API URL" && git push

# 6. Test
curl https://your-backend-url.com/health
```

---

## 🎉 Success Indicators

✅ Health endpoint returns 200 OK  
✅ Frontend loads without errors  
✅ Can create account  
✅ Can login  
✅ Can create session  
✅ No CORS errors in browser console  

---

**Need Help?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Deployment Time**: 10-20 minutes  
**Cost**: $0 (free tier)  
**Maintenance**: Minimal
