# Start Backend in Test Mode
# Run from backend directory

Write-Host "Starting backend server in test mode..."
$env:NODE_ENV="test"
npx tsx watch src/index.ts
