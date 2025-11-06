# CORS Configuration Guide

## Problem

When the frontend deployed to GitHub Pages (`https://crisiscore-systems.github.io`) tries to connect to the backend API, you may see this error:

```
Access to fetch at 'http://localhost:3001/api/auth/login' from origin 'https://crisiscore-systems.github.io' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to 
the supplied origin.
```

## Root Cause

The backend server's CORS (Cross-Origin Resource Sharing) configuration only allows requests from `http://localhost:5173` (the default Vite development server), but not from the GitHub Pages deployment URL.

## Solution

The backend needs to be configured to accept requests from both origins:
- `http://localhost:5173` - for local development
- `https://crisiscore-systems.github.io` - for production deployment

### Step 1: Create the `.env` file

Navigate to the `backend` directory and run the setup script:

```bash
cd backend
./setup.sh
```

Or manually copy the example environment file:

```bash
cd backend
cp .env.example .env
```

### Step 2: Verify CORS Configuration

Open the `.env` file and confirm the `CORS_ORIGIN` setting includes both URLs:

```env
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

### Step 3: Restart the Backend

After creating or modifying the `.env` file, restart your backend server:

```bash
# Stop the current server (Ctrl+C if running)
# Then start it again
npm run dev
```

### Step 4: Verify the Configuration

When the server starts, you should see a log message showing the configured CORS origins:

```
🔒 CORS origins: http://localhost:5173, https://crisiscore-systems.github.io
```

## Production Deployment

If you're deploying the backend to a hosting service (e.g., Heroku, Railway, Render, AWS, etc.), make sure to set the `CORS_ORIGIN` environment variable in your hosting provider's configuration:

```env
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
```

Some hosting providers may also require you to add your backend's own URL to the CORS origins if you need to support API calls from the backend itself.

## Testing

After applying the fix:

1. Make sure your backend is running
2. Visit `https://crisiscore-systems.github.io/neural-entrainment-system/`
3. Try to log in or make any API call
4. The CORS error should be resolved

## Additional CORS Origins

If you need to allow additional origins (e.g., a custom domain), add them to the comma-separated list:

```env
CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io,https://yourdomain.com
```

## Security Note

The `.env` file is intentionally excluded from version control via `.gitignore` because it may contain sensitive information like database passwords and JWT secrets. Each developer and deployment environment needs to create their own `.env` file based on `.env.example`.

## Troubleshooting

### Error persists after following steps

1. **Clear browser cache**: Sometimes browsers cache CORS responses
2. **Check backend logs**: Ensure the server logged the correct CORS origins on startup
3. **Verify backend is running**: The error message shows the backend URL - make sure it's accessible
4. **Check for typos**: Ensure the CORS_ORIGIN in .env exactly matches the frontend URL (including https:// and no trailing slash)

### Frontend connects to wrong backend URL

If you're developing locally but the frontend is trying to connect to `localhost:3001` instead of your production backend:

1. Check `frontend/.env` file
2. Update `VITE_API_URL` to point to your production backend
3. Rebuild the frontend: `npm run build`

### Backend running on different port

If your backend is running on a port other than 3001, update the `PORT` variable in `backend/.env`:

```env
PORT=3001
```

Then update the `VITE_API_URL` in `frontend/.env` to match.

## Summary

The CORS error occurs because the backend needs explicit permission to accept requests from the GitHub Pages frontend. By setting the `CORS_ORIGIN` environment variable to include both localhost and the GitHub Pages URL, the backend will accept requests from both development and production frontends.
