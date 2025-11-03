# CORS Error? Quick Fix ⚡

## The Error You're Seeing

```
Access to fetch at 'http://localhost:3001/api/auth/login' from origin 'https://crisiscore-systems.github.io' 
has been blocked by CORS policy
```

## The Fix (30 seconds)

```bash
cd backend
./setup.sh
npm run dev
```

Done! ✅

## What This Does

Creates a `.env` file that tells your backend to accept requests from:
- `http://localhost:5173` (development)
- `https://crisiscore-systems.github.io` (production)

## Need More Help?

- 📖 **Quick Guide**: See [CORS_FIX_GUIDE.md](CORS_FIX_GUIDE.md)
- 🎨 **Visual Explanation**: See [CORS_DIAGRAM.md](CORS_DIAGRAM.md)
- 📋 **Full Details**: See [SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md)
- 🔧 **Backend Docs**: See [backend/README.md](backend/README.md)

## Manual Setup (if script doesn't work)

```bash
cd backend
cp .env.example .env
# The file already has the correct CORS configuration
npm run dev
```

## Verify It Worked

When the backend starts, look for this log:
```
🔒 CORS origins: http://localhost:5173, https://crisiscore-systems.github.io
```

## Production Deployment?

Set this environment variable in your hosting provider:
```
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

---

**Why this happens**: CORS is a browser security feature that requires the backend to explicitly allow requests from your frontend's domain.

**The fix**: Configure the backend to allow your GitHub Pages URL in addition to localhost.

**Security**: `.env` files are intentionally not committed to git. Each environment needs its own configuration.
