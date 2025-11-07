# 🚀 Free Deployment Guide for Neural Entrainment System

This guide provides step-by-step instructions for deploying the CrisisCore Neural Interface to **completely free** hosting platforms.

## 📋 Overview

### Current Deployment Status
- ✅ **Frontend**: GitHub Pages (free, configured)
- 🔧 **Backend**: Needs free hosting
- 🔧 **Database**: Needs free PostgreSQL
- 🔧 **Redis**: Needs free caching solution

### Recommended Free Stack

| Component | Platform | Free Tier Limits | Best For |
|-----------|----------|------------------|----------|
| **Backend** | Railway | $5/month credit | Best overall experience |
| **Backend** | Render | 750 hrs/month | Most reliable |
| **Backend** | Fly.io | 3 VMs free | Global distribution |
| **Database** | Neon | 10 GB storage | Serverless PostgreSQL |
| **Database** | Supabase | 500 MB, 2GB transfer | All-in-one solution |
| **Redis** | Upstash | 10k commands/day | Serverless Redis |
| **Frontend** | GitHub Pages | 100 GB/month | ✅ Already configured |

---

## 🎯 Recommended Solution: Railway + Neon + Upstash

This combination offers the best free hosting experience with minimal configuration.

### Option 1: Railway (Recommended)

Railway provides $5/month free credit, which is perfect for small projects.

#### Step 1: Deploy Backend to Railway

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   ```bash
   # In your terminal (optional - Railway can deploy from GitHub)
   npm install -g @railway/cli
   railway login
   ```

3. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `CrisisCore-Systems/neural-entrainment-system`
   - Set root directory to `backend`
   - Railway will auto-detect Node.js

4. **Configure Environment Variables**
   
   In Railway dashboard, add these variables:
   ```env
   NODE_ENV=production
   PORT=3001
   
   # JWT (generate a strong secret)
   JWT_SECRET=your-random-secret-key-here
   JWT_EXPIRES_IN=7d
   
   # CORS (use your GitHub Pages URL)
   CORS_ORIGIN=https://crisiscore-systems.github.io
   
   # Database and Redis will be added next
   ```

5. **Add PostgreSQL Database**
   - In Railway project, click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set `DATABASE_URL` environment variable
   - No manual configuration needed!

6. **Add Redis**
   - In Railway project, click "New" → "Database" → "Add Redis"
   - Railway will automatically set `REDIS_URL` environment variable

7. **Initialize Database Schema**
   - Once deployed, get the database connection string from Railway
   - Connect using psql or a database client:
   ```bash
   psql $DATABASE_URL -f backend/database/schema.sql
   ```

8. **Get Your Backend URL**
   - Railway provides a public URL like: `https://your-app.up.railway.app`
   - Copy this URL for frontend configuration

#### Step 2: Update Frontend Configuration

Update your frontend to connect to Railway backend:

```typescript
// frontend/src/config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'https://your-app.up.railway.app/api';
```

Update `frontend/.env`:
```env
VITE_API_URL=https://your-app.up.railway.app/api
```

#### Railway Deployment Settings

Create `railway.toml` in backend directory:
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

---

### Option 2: Render + Neon + Upstash

Render offers 750 hours/month free (enough for 24/7 operation).

#### Step 1: Setup Free Database (Neon)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create new project: "neural-entrainment"

2. **Get Connection String**
   - Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. **Initialize Schema**
   ```bash
   psql "postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require" -f backend/database/schema.sql
   ```

#### Step 2: Setup Free Redis (Upstash)

1. **Create Upstash Account**
   - Go to [upstash.com](https://upstash.com)
   - Sign up with GitHub
   - Create new Redis database

2. **Get Connection String**
   - Copy the Redis URL (looks like):
   ```
   redis://default:password@us1-xxx.upstash.io:6379
   ```

#### Step 3: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect GitHub repository: `CrisisCore-Systems/neural-entrainment-system`
   - Configure:
     - Name: `neural-entrainment-backend`
     - Region: Choose closest to your users
     - Branch: `main`
     - Root Directory: `backend`
     - Runtime: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Instance Type: `Free`

3. **Add Environment Variables**
   
   In Render dashboard → Environment:
   ```env
   NODE_ENV=production
   PORT=3001
   
   # PostgreSQL from Neon
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   
   # Redis from Upstash
   REDIS_URL=redis://default:password@us1-xxx.upstash.io:6379
   
   # JWT
   JWT_SECRET=your-random-secret-key-here
   JWT_EXPIRES_IN=7d
   
   # CORS
   CORS_ORIGIN=https://crisiscore-systems.github.io
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will deploy automatically
   - Your backend URL: `https://neural-entrainment-backend.onrender.com`

#### Render Configuration File

Create `render.yaml` in repository root:
```yaml
services:
  - type: web
    name: neural-entrainment-backend
    runtime: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: DATABASE_URL
        sync: false
      - key: REDIS_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: CORS_ORIGIN
        value: https://crisiscore-systems.github.io
```

---

### Option 3: Fly.io (Best for Global Distribution)

Fly.io offers 3 VMs free with global distribution.

#### Step 1: Install Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

#### Step 2: Setup Fly.io

```bash
cd backend

# Login to Fly.io
fly auth login

# Launch application
fly launch --name neural-entrainment-backend --region sjc

# Follow prompts:
# - Would you like to set up a PostgreSQL database? YES
# - Would you like to set up a Redis database? YES
```

#### Step 3: Configure

Fly.io will create `fly.toml`:
```toml
app = "neural-entrainment-backend"
primary_region = "sjc"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

[checks]
  [checks.alive]
    grace_period = "30s"
    interval = "15s"
    method = "GET"
    path = "/health"
    timeout = "10s"
    type = "http"
```

#### Step 4: Set Secrets

```bash
fly secrets set JWT_SECRET=$(openssl rand -base64 32)
fly secrets set CORS_ORIGIN=https://crisiscore-systems.github.io
```

#### Step 5: Deploy

```bash
fly deploy

# Get your app URL
fly info
```

---

## 🔄 Update Frontend to Use Backend

### Update Frontend Environment

Edit `frontend/.env.production`:
```env
# Use your deployed backend URL
VITE_API_URL=https://your-backend-url.com/api

# Or for Railway:
# VITE_API_URL=https://your-app.up.railway.app/api

# Or for Render:
# VITE_API_URL=https://neural-entrainment-backend.onrender.com/api

# Or for Fly.io:
# VITE_API_URL=https://neural-entrainment-backend.fly.dev/api
```

### Update vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/neural-entrainment-system/',
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:3001/api'
    )
  }
})
```

---

## 🎨 Alternative: Supabase (All-in-One Solution)

Supabase provides PostgreSQL, Authentication, and REST API in one platform.

### Pros
- ✅ Free tier includes PostgreSQL, Auth, Storage
- ✅ Built-in REST and GraphQL APIs
- ✅ Real-time subscriptions
- ✅ Row Level Security

### Cons
- ❌ 500 MB database limit (can be limiting)
- ❌ Need to adapt backend to use Supabase client

### Setup Steps

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy API URL and anon key

2. **Use Supabase for Backend**
   - Instead of deploying Node.js backend, use Supabase's built-in APIs
   - Modify frontend to use Supabase client
   - Load database schema using Supabase SQL editor

---

## 📊 Free Tier Comparison

| Feature | Railway | Render | Fly.io | Supabase |
|---------|---------|--------|--------|----------|
| **Credit/Month** | $5 | - | - | - |
| **Uptime Hours** | ~500hrs | 750hrs | ∞ (3 VMs) | ∞ |
| **Auto-sleep** | Yes | Yes (15min) | Yes | No |
| **Cold Start** | <5s | <30s | <5s | N/A |
| **PostgreSQL** | ✅ Included | ❌ Need external | ✅ Included | ✅ Included |
| **Redis** | ✅ Included | ❌ Need external | ✅ Included | ❌ |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ |
| **Best For** | Quick setup | 24/7 availability | Global apps | Simple apps |

---

## 🔐 Security Best Practices

### Generate Strong Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Environment Variables Checklist

- [ ] `JWT_SECRET` - Strong random string (32+ characters)
- [ ] `DATABASE_URL` - PostgreSQL connection string with SSL
- [ ] `REDIS_URL` - Redis connection string (or Upstash)
- [ ] `CORS_ORIGIN` - Your GitHub Pages URL
- [ ] `NODE_ENV` - Set to `production`

### CORS Configuration

Ensure backend CORS allows your frontend:
```typescript
// backend/src/index.ts
await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true
})
```

---

## 🚨 Important Notes

### Free Tier Limitations

1. **Cold Starts**: Free tiers may sleep after inactivity
   - Railway: ~5 minutes idle → sleeps
   - Render: 15 minutes idle → sleeps
   - Fly.io: Immediate sleep when no requests
   - **Solution**: First request might be slow (5-30s)

2. **Bandwidth Limits**: Monitor usage
   - Most platforms include 100GB/month free
   - Audio streaming can consume bandwidth

3. **Database Storage**
   - Neon: 10 GB free
   - Supabase: 500 MB free
   - Railway: 100 GB free
   - **Action**: Monitor database size

### Cost Monitoring

- Set up billing alerts
- Railway: Monitor credit usage in dashboard
- Render: Check service usage metrics
- Fly.io: `fly scale show` to check resources

---

## 🔧 Troubleshooting

### Backend Not Responding

```bash
# Check backend logs
# Railway: View in dashboard
# Render: View in dashboard
# Fly.io:
fly logs

# Test health endpoint
curl https://your-backend-url.com/health
```

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check if schema is loaded
psql $DATABASE_URL -c "\dt"
```

### CORS Errors

```bash
# Verify CORS_ORIGIN is set correctly
# Check browser console for specific error
# Ensure URL matches exactly (no trailing slash)
```

### Cold Start Issues

- **Solution 1**: Use a cron job to ping your backend every 10 minutes
- **Solution 2**: Add a loading state in frontend for first request
- **Solution 3**: Upgrade to paid tier for always-on instances

---

## 📈 Scaling Beyond Free Tier

When your app grows:

1. **Upgrade to Paid Tier**
   - Railway: $5-20/month
   - Render: $7-25/month
   - Fly.io: Pay per use

2. **Optimize Database**
   - Add indexes
   - Implement caching
   - Archive old sessions

3. **Add CDN**
   - Use Cloudflare (free tier)
   - Cache static assets
   - Reduce bandwidth usage

---

## 🎯 Recommended Setup (TL;DR)

For the easiest setup with best free tier:

1. **Frontend**: GitHub Pages ✅ (already configured)
2. **Backend**: Railway
3. **Database**: Railway PostgreSQL (included)
4. **Redis**: Railway Redis (included)
5. **Total Cost**: $0 (within $5/month credit)

**Setup Time**: ~15 minutes

### Quick Start Commands

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy from backend directory
cd backend
railway init
railway up

# 4. Add PostgreSQL
railway add --plugin postgresql

# 5. Add Redis
railway add --plugin redis

# 6. Initialize database
railway run psql $DATABASE_URL -f database/schema.sql

# 7. Get your URL
railway domain

# 8. Update frontend .env with your Railway URL
```

---

## 📞 Support

- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- Fly.io: [fly.io/docs](https://fly.io/docs)
- Neon: [neon.tech/docs](https://neon.tech/docs)
- Upstash: [docs.upstash.com](https://docs.upstash.com)

---

**Status**: 🎉 Ready to deploy for free!  
**Next**: Choose your preferred platform and follow the steps above.
