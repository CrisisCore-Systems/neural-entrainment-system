# CORS Configuration Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                   Neural Entrainment System                     │
│                    CORS Configuration Flow                      │
└────────────────────────────────────────────────────────────────┘

                   BEFORE FIX (Error)
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Frontend (GitHub Pages)                                         │
│  https://crisiscore-systems.github.io                           │
│           │                                                       │
│           │ POST /api/auth/login                                 │
│           ├──────────────────────────────────────►               │
│           │                                         Backend       │
│           │                                         localhost:3001│
│           │ ❌ CORS Error                                        │
│           ◄────────────────────────────────────────┤             │
│           │                                                       │
│           │ CORS_ORIGIN only allows:                             │
│           │ http://localhost:5173 ❌                             │
│           │                                                       │
│  ERROR: Access blocked by CORS policy                            │
│  The origin 'https://crisiscore-systems.github.io'              │
│  is not allowed                                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘


                    AFTER FIX (Success)
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Frontend (GitHub Pages)                                         │
│  https://crisiscore-systems.github.io                           │
│           │                                                       │
│           │ POST /api/auth/login                                 │
│           ├──────────────────────────────────────►               │
│           │                                         Backend       │
│           │                                         localhost:3001│
│           │ ✅ Success (200 OK)                                  │
│           ◄────────────────────────────────────────┤             │
│           │ { token: "...", user: {...} }                        │
│           │                                                       │
│           │ CORS_ORIGIN allows:                                  │
│           │ • http://localhost:5173 ✅                           │
│           │ • https://crisiscore-systems.github.io ✅           │
│           │                                                       │
│  SUCCESS: Login completes, token stored                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘


              Backend Configuration (.env file)
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  backend/.env                                                    │
│                                                                   │
│  # CORS - Allow both dev and production frontends                │
│  CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
│                    │                           │                 │
│                    │                           └─────────────────┤
│                    │                                             │
│           For local development              For GitHub Pages   │
│           (Vite dev server)                  deployment          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘


                  Configuration Flow
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  1. User runs: ./setup.sh or cp .env.example .env               │
│                                                                   │
│  2. backend/.env created with:                                   │
│     CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
│                                                                   │
│  3. Backend reads .env on startup                                │
│                                                                   │
│  4. config/index.ts parses CORS_ORIGIN:                          │
│     origin: process.env.CORS_ORIGIN                              │
│       .split(',')                                                │
│       .map(o => o.trim())                                        │
│                                                                   │
│  5. Result: ['http://localhost:5173',                            │
│              'https://crisiscore-systems.github.io']            │
│                                                                   │
│  6. Fastify CORS plugin configured with array of origins         │
│                                                                   │
│  7. Backend accepts requests from both origins ✅                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘


                 How CORS Works
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Browser (Preflight Request)                                     │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ OPTIONS /api/auth/login                              │        │
│  │ Origin: https://crisiscore-systems.github.io        │        │
│  │ Access-Control-Request-Method: POST                  │        │
│  └─────────────────────────────────────────────────────┘        │
│           │                                                       │
│           │ Server checks if origin is allowed                   │
│           ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ 200 OK                                               │        │
│  │ Access-Control-Allow-Origin:                         │        │
│  │   https://crisiscore-systems.github.io ✅           │        │
│  │ Access-Control-Allow-Methods: POST                   │        │
│  │ Access-Control-Allow-Credentials: true               │        │
│  └─────────────────────────────────────────────────────┘        │
│           │                                                       │
│           │ Preflight passed, browser sends actual request       │
│           ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ POST /api/auth/login                                 │        │
│  │ Origin: https://crisiscore-systems.github.io        │        │
│  │ { email: "...", password: "..." }                   │        │
│  └─────────────────────────────────────────────────────┘        │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ 200 OK                                               │        │
│  │ Access-Control-Allow-Origin:                         │        │
│  │   https://crisiscore-systems.github.io ✅           │        │
│  │ { token: "...", user: {...} } ✅                    │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Key Points

1. **CORS is a browser security feature** - It prevents websites from making requests to different domains unless explicitly allowed

2. **Backend must explicitly allow origins** - The backend needs to list all frontend URLs that should be able to access it

3. **Both dev and production origins needed** - For seamless development and production deployment

4. **Environment variables for flexibility** - Different environments can have different CORS settings

5. **Preflight requests** - Browsers send OPTIONS requests first to check if the actual request is allowed

## Security Note

Only add trusted origins to CORS_ORIGIN. Adding `*` (allow all) would be a security risk.
