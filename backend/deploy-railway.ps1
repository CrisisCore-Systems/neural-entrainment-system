# Quick deployment script for Railway (Windows PowerShell)
# This script automates the deployment of the Neural Entrainment System backend to Railway

param(
    [string]$CorsOrigin = "https://crisiscore-systems.github.io"
)

Write-Host "🚀 Neural Entrainment System - Railway Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Railway CLI is not installed." -ForegroundColor Red
    Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Check if logged in
Write-Host "🔑 Checking Railway authentication..." -ForegroundColor Yellow
$authCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Railway:" -ForegroundColor Yellow
    railway login
}

# Navigate to backend directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host ""
Write-Host "📂 Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Check if project exists
if (-not (Test-Path "railway.json") -and -not (Test-Path ".railway")) {
    Write-Host "🆕 Initializing new Railway project..." -ForegroundColor Yellow
    railway init
} else {
    Write-Host "✅ Railway project already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "🗄️  Setting up PostgreSQL database..." -ForegroundColor Yellow
railway add --plugin postgresql 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ℹ️  PostgreSQL might already be added" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🔴 Setting up Redis cache..." -ForegroundColor Yellow
railway add --plugin redis 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ℹ️  Redis might already be added" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🔐 Setting environment variables..." -ForegroundColor Yellow
Write-Host ""

if (-not $CorsOrigin -or $CorsOrigin -eq "") {
    $CorsOrigin = Read-Host "Enter your GitHub Pages URL (e.g., https://crisiscore-systems.github.io)"
}

# Generate JWT secret using .NET
$JWT_SECRET = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Set environment variables
Write-Host "Setting NODE_ENV=production"
railway variables set NODE_ENV=production

Write-Host "Setting PORT=3001"
railway variables set PORT=3001

Write-Host "Setting JWT_SECRET"
railway variables set JWT_SECRET=$JWT_SECRET

Write-Host "Setting JWT_EXPIRES_IN=7d"
railway variables set JWT_EXPIRES_IN=7d

Write-Host "Setting CORS_ORIGIN=$CorsOrigin"
railway variables set CORS_ORIGIN=$CorsOrigin

Write-Host ""
Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host ""

Write-Host "📤 Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host ""
Write-Host "🗃️  Initializing database schema..." -ForegroundColor Yellow
Write-Host "Getting database connection string..."

try {
    $DB_URL = railway variables get DATABASE_URL 2>$null
    if ($DB_URL) {
        Write-Host "Loading schema into database..."
        # Note: Requires psql to be installed
        if (Get-Command psql -ErrorAction SilentlyContinue) {
            psql $DB_URL -f database/schema.sql
            Write-Host "✅ Database schema initialized!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  psql not found. Install PostgreSQL client or use WSL." -ForegroundColor Yellow
            Write-Host "Please run the following command manually:" -ForegroundColor Yellow
            Write-Host "  railway run psql `$DATABASE_URL -f database/schema.sql" -ForegroundColor White
        }
    }
} catch {
    Write-Host "⚠️  Could not retrieve DATABASE_URL automatically." -ForegroundColor Yellow
    Write-Host "Please run the following command manually after deployment:" -ForegroundColor Yellow
    Write-Host "  railway run psql `$DATABASE_URL -f database/schema.sql" -ForegroundColor White
}

Write-Host ""
Write-Host "🌐 Getting your deployment URL..." -ForegroundColor Yellow
railway domain

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Get your backend URL: railway domain" -ForegroundColor White
Write-Host "2. Update frontend/.env with VITE_API_URL=<your-railway-url>/api" -ForegroundColor White
Write-Host "3. Redeploy frontend to GitHub Pages" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  railway logs    - View application logs" -ForegroundColor White
Write-Host "  railway status  - Check deployment status" -ForegroundColor White
Write-Host "  railway open    - Open Railway dashboard" -ForegroundColor White
Write-Host "  railway run     - Run commands with Railway environment" -ForegroundColor White
Write-Host ""
