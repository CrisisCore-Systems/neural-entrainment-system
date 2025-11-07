# Local PostgreSQL Setup Script for Windows
# This script sets up the neural_entrainment database locally

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Neural Entrainment Database Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if PostgreSQL is installed
$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    Write-Host "❌ PostgreSQL not found!" -ForegroundColor Red
    Write-Host "`nPlease install PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Run installer and remember your postgres user password" -ForegroundColor Yellow
    Write-Host "3. Add PostgreSQL bin folder to PATH" -ForegroundColor Yellow
    Write-Host "`nDefault install location: C:\Program Files\PostgreSQL\16\bin" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL found at: $($pgPath.Source)`n" -ForegroundColor Green

# Get database credentials from .env
$envFile = Get-Content .env -ErrorAction SilentlyContinue
if (-not $envFile) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file from .env.example" -ForegroundColor Yellow
    exit 1
}

$DB_NAME = ($envFile | Select-String "DB_NAME=(.+)").Matches.Groups[1].Value.Trim()
$DB_USER = ($envFile | Select-String "DB_USER=(.+)").Matches.Groups[1].Value.Trim()
$DB_PASSWORD = ($envFile | Select-String "DB_PASSWORD=(.+)").Matches.Groups[1].Value.Trim()

Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "  Database: $DB_NAME"
Write-Host "  User: $DB_USER"
Write-Host "  Password: ****`n"

# Set PostgreSQL password environment variable
$env:PGPASSWORD = $DB_PASSWORD

Write-Host "Step 1: Creating database..." -ForegroundColor Yellow
$createDbResult = psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created successfully`n" -ForegroundColor Green
} else {
    if ($createDbResult -like "*already exists*") {
        Write-Host "⚠️  Database already exists (this is OK)`n" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed to create database:" -ForegroundColor Red
        Write-Host $createDbResult -ForegroundColor Red
        exit 1
    }
}

Write-Host "Step 2: Running schema setup..." -ForegroundColor Yellow
$schemaResult = psql -U $DB_USER -h localhost -d $DB_NAME -f database/setup.sql 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema created successfully`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create schema:" -ForegroundColor Red
    Write-Host $schemaResult -ForegroundColor Red
    exit 1
}

Write-Host "Step 3: Seeding base protocols..." -ForegroundColor Yellow
$seedResult = psql -U $DB_USER -h localhost -d $DB_NAME -f database/seed.sql 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Base protocols seeded`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Seed may have warnings (often OK if protocols exist)`n" -ForegroundColor Yellow
}

Write-Host "Step 4: Seeding additional protocols..." -ForegroundColor Yellow
$seedAdditionalResult = psql -U $DB_USER -h localhost -d $DB_NAME -f database/seed_additional.sql 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Additional protocols seeded`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Additional seed may have warnings`n" -ForegroundColor Yellow
}

Write-Host "Step 5: Running Gateway migrations..." -ForegroundColor Yellow
if (Test-Path "migrations/005_gateway_process.sql") {
    $migrationResult = psql -U $DB_USER -h localhost -d $DB_NAME -f migrations/005_gateway_process.sql 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Gateway migrations applied`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migration warnings (may be OK)`n" -ForegroundColor Yellow
    }
}

Write-Host "Step 6: Running admin role migration..." -ForegroundColor Yellow
if (Test-Path "migrations/006_add_admin_role.sql") {
    $adminResult = psql -U $DB_USER -h localhost -d $DB_NAME -f migrations/006_add_admin_role.sql 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Admin role migration applied`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migration warnings (may be OK)`n" -ForegroundColor Yellow
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✅ Database Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a user account:" -ForegroundColor White
Write-Host "   node scripts/create-user.js`n" -ForegroundColor Gray
Write-Host "2. Make user an admin:" -ForegroundColor White
Write-Host "   node scripts/make-admin.js kovertechart@gmail.com`n" -ForegroundColor Gray
Write-Host "3. Start the backend:" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor Gray

# Clear password
$env:PGPASSWORD = $null
