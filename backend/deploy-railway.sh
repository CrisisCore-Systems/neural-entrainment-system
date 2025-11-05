#!/bin/bash

# Quick deployment script for Railway
# This script automates the deployment of the Neural Entrainment System backend to Railway

set -e  # Exit on error

echo "🚀 Neural Entrainment System - Railway Deployment Script"
echo "========================================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if logged in
echo "🔑 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

# Navigate to backend directory
cd "$(dirname "$0")"

echo ""
echo "📂 Current directory: $(pwd)"
echo ""

# Check if project exists
if [ ! -f "railway.json" ] && [ ! -d ".railway" ]; then
    echo "🆕 Initializing new Railway project..."
    railway init
else
    echo "✅ Railway project already initialized"
fi

echo ""
echo "🗄️  Setting up PostgreSQL database..."
railway add --plugin postgresql || echo "ℹ️  PostgreSQL might already be added"

echo ""
echo "🔴 Setting up Redis cache..."
railway add --plugin redis || echo "ℹ️  Redis might already be added"

echo ""
echo "🔐 Setting environment variables..."
echo ""
read -p "Enter your GitHub Pages URL (e.g., https://crisiscore-systems.github.io): " CORS_URL

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_EXPIRES_IN=7d
railway variables set CORS_ORIGIN="$CORS_URL"

echo ""
echo "✅ Environment variables set!"
echo ""

echo "📤 Deploying to Railway..."
railway up

echo ""
echo "🗃️  Initializing database schema..."
echo "Getting database connection string..."
DB_URL=$(railway variables get DATABASE_URL 2>/dev/null || echo "")

if [ -n "$DB_URL" ]; then
    echo "Loading schema into database..."
    psql "$DB_URL" -f database/schema.sql
    echo "✅ Database schema initialized!"
else
    echo "⚠️  Could not retrieve DATABASE_URL automatically."
    echo "Please run the following command manually after deployment:"
    echo "  railway run psql \$DATABASE_URL -f database/schema.sql"
fi

echo ""
echo "🌐 Getting your deployment URL..."
railway domain || echo "⚠️  Run 'railway domain' to get your deployment URL"

echo ""
echo "========================================================="
echo "🎉 Deployment Complete!"
echo "========================================================="
echo ""
echo "Next steps:"
echo "1. Get your backend URL: railway domain"
echo "2. Update frontend/.env with VITE_API_URL=<your-railway-url>/api"
echo "3. Redeploy frontend to GitHub Pages"
echo ""
echo "Useful commands:"
echo "  railway logs    - View application logs"
echo "  railway status  - Check deployment status"
echo "  railway open    - Open Railway dashboard"
echo "  railway run     - Run commands with Railway environment"
echo ""
