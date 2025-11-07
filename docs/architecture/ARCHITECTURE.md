# 🏗️ Deployment Architecture

Visual guide showing how the Neural Entrainment System is deployed with free hosting.

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet Users                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
        ┌────────────────────────────────┐
        │      GitHub Pages (Free)       │
        │    Frontend Static Hosting     │
        │   React + Vite + Three.js      │
        │                                │
        │  https://your-username.        │
        │  github.io/your-repo/          │
        └────────────────────────────────┘
                         │
                         │ API Calls (HTTPS)
                         ▼
        ┌────────────────────────────────┐
        │     Backend API (Choose One)   │
        ├────────────────────────────────┤
        │  Option 1: Railway             │
        │  ✓ Backend + DB + Redis        │
        │  ✓ Easiest setup               │
        ├────────────────────────────────┤
        │  Option 2: Render              │
        │  ✓ Backend only                │
        │  ✓ 24/7 uptime                 │
        ├────────────────────────────────┤
        │  Option 3: Fly.io              │
        │  ✓ Global distribution         │
        │  ✓ Backend + DB + Redis        │
        └────────────────────────────────┘
                         │
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│   PostgreSQL     │         │      Redis       │
│   (Choose One)   │         │   (Choose One)   │
├──────────────────┤         ├──────────────────┤
│ Railway (Free)   │         │ Railway (Free)   │
│ Neon (Free)      │         │ Upstash (Free)   │
│ Supabase (Free)  │         │ Fly.io (Free)    │
│ Fly.io (Free)    │         │                  │
└──────────────────┘         └──────────────────┘
```

## 🎯 Recommended Setup (Railway)

**All-in-one deployment on Railway:**

```
User Browser
     │
     ├─────► GitHub Pages (Frontend)
     │       ├─ React UI
     │       ├─ Three.js Visuals
     │       └─ Audio Engine
     │
     └─────► Railway (Backend)
             ├─ Node.js API Server
             ├─ PostgreSQL Database
             └─ Redis Cache
```

**Advantages:**
- ✅ One platform for everything
- ✅ Automatic environment variables
- ✅ Easy to manage
- ✅ Quick deployment (~10 minutes)

**Cost:** $0 (within $5/month credit)

## 🔄 Alternative Setup (Render + Neon + Upstash)

**Multi-service deployment:**

```
User Browser
     │
     ├─────► GitHub Pages
     │       └─ Frontend
     │
     └─────► Render
             └─ Backend API
                  │
                  ├─────► Neon
                  │       └─ PostgreSQL
                  │
                  └─────► Upstash
                          └─ Redis
```

**Advantages:**
- ✅ 750 hours/month (24/7)
- ✅ More reliable
- ✅ Better for production
- ✅ Each service independent

**Cost:** $0 (all free tiers)

## 🌍 Global Setup (Fly.io)

**Edge-optimized deployment:**

```
User Browser (Tokyo)
     │
     └─────► GitHub Pages
             └─ Frontend
                  │
                  └─────► Fly.io (Tokyo Region)
                          └─ Backend API
                               ├─ PostgreSQL
                               └─ Redis

User Browser (London)
     │
     └─────► GitHub Pages
             └─ Frontend
                  │
                  └─────► Fly.io (London Region)
                          └─ Backend API
                               ├─ PostgreSQL
                               └─ Redis
```

**Advantages:**
- ✅ Global distribution
- ✅ Low latency worldwide
- ✅ Fast cold starts
- ✅ Advanced networking

**Cost:** $0 (3 VMs free)

## 📦 Component Breakdown

### Frontend (GitHub Pages)
```
Component: React + Vite Web App
Hosting: GitHub Pages
Cost: FREE
Features:
  ✓ Automatic HTTPS
  ✓ CDN distribution
  ✓ Custom domains
  ✓ Auto-deploy from Git
Limits:
  • 1 GB storage
  • 100 GB/month bandwidth
```

### Backend (Railway/Render/Fly.io)
```
Component: Node.js + Fastify API
Hosting: Choose one platform
Cost: FREE
Features:
  ✓ RESTful API
  ✓ JWT authentication
  ✓ WebSocket support
  ✓ Auto-deploy from Git
Limits:
  • Railway: ~500 hrs/month
  • Render: 750 hrs/month
  • Fly.io: 3 VMs always-on
```

### Database (PostgreSQL)
```
Component: User data + sessions
Hosting: Included or external
Cost: FREE
Features:
  ✓ ACID compliance
  ✓ Automatic backups
  ✓ SSL connections
  ✓ Connection pooling
Limits:
  • Railway: 100 GB
  • Neon: 10 GB
  • Supabase: 500 MB
  • Fly.io: 3 GB
```

### Cache (Redis)
```
Component: Session state + caching
Hosting: Included or external
Cost: FREE
Features:
  ✓ Sub-ms latency
  ✓ Pub/sub support
  ✓ Persistent storage
Limits:
  • Railway: 100 MB
  • Upstash: 10k cmd/day
  • Fly.io: 256 MB
```

## 🔐 Security Flow

```
1. User Login Request
   │
   └─► Frontend (GitHub Pages)
        │
        └─► HTTPS POST to Backend
             │
             └─► Backend validates credentials
                  │
                  ├─► Query PostgreSQL
                  │
                  ├─► Generate JWT token
                  │
                  ├─► Store session in Redis
                  │
                  └─► Return token to frontend
```

## 📊 Data Flow

```
Session Creation:
Browser ──► Frontend ──► Backend API ──► PostgreSQL
                             │              (Store session)
                             └────────► Redis
                                        (Cache state)

Session Playback:
Browser ──► Frontend ──► Audio Engine ──► Web Audio API
                                          (Generate beats)
```

## 🚀 Deployment Flow

```
1. Code Push
   git push origin main
        │
        ├─► GitHub Actions
        │   └─► Build frontend ──► Deploy to GitHub Pages
        │
        └─► Platform Auto-Deploy (Railway/Render/Fly.io)
            └─► Build backend ──► Deploy to platform
```

## 💾 Database Schema Flow

```
┌─────────────┐
│    users    │ ──┐
└─────────────┘   │
                  │   ┌──────────────┐
                  └──►│   sessions   │
                      └──────────────┘
                            │
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
         ┌──────────────┐    ┌──────────────┐
         │ daily_metrics│    │session_ratings│
         └──────────────┘    └──────────────┘

┌──────────────┐
│  protocols   │ (Pre-configured programs)
└──────────────┘

┌──────────────┐
│ preferences  │ (User settings)
└──────────────┘
```

## 🔄 Auto-Scaling (Free Tier)

```
No Traffic:
Backend: 😴 Sleeping (saves resources)
Database: 🟢 Always ready
Redis: 🟢 Always ready

First Request:
Backend: ⏰ Cold start (3-30s)
User: ⏳ Waiting...
Backend: 🟢 Now running

Active Usage:
Backend: 🟢 Running (serving requests)
Database: 🟢 Processing queries
Redis: 🟢 Caching data

After 5-15 min idle:
Backend: 😴 Sleeping again
(Cycle repeats)
```

## 📈 Request Flow Timeline

```
Time:   0ms     50ms    100ms   200ms   300ms
        │       │       │       │       │
User ───┼───────┼───────┼───────┼───────┼───► Receives response
        │       │       │       │       │
        │ API   │       │       │       │
        │ Call  │ Auth  │ Query │ Cache │ Response
        │       │ JWT   │ DB    │ Redis │ Format
```

**Cold Start Timeline:**
```
Time:   0ms     2s      5s      7s      10s
        │       │       │       │       │
User ───┼───────┼───────┼───────┼───────┼───► Receives response
        │       │       │       │       │
        │ API   │ Wake  │ Start │ Load  │
        │ Call  │ Server│ App   │ & Run │ Response
```

## 🎯 Choosing Your Architecture

### Small Project / MVP
```
Frontend: GitHub Pages
Backend: Railway (all-in-one)
Cost: $0
Setup: 10 minutes
```

### Production Ready
```
Frontend: GitHub Pages
Backend: Render
Database: Neon
Redis: Upstash
Cost: $0
Setup: 20 minutes
```

### Global App
```
Frontend: GitHub Pages
Backend: Fly.io (multi-region)
Database: Fly.io PostgreSQL
Redis: Fly.io Redis
Cost: $0
Setup: 15 minutes
```

---

**Next Steps:**
1. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Check [HOSTING_COMPARISON.md](./HOSTING_COMPARISON.md) for platform comparison
3. Choose your hosting platform
4. Deploy using our automated scripts

**Quick Deploy:**
```bash
cd backend
./deploy-railway.sh     # Linux/Mac
./deploy-railway.ps1    # Windows
```
