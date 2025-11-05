#!/bin/bash
# Backend Setup Script
# This script helps set up the backend environment quickly

set -e

echo "🚀 Neural Entrainment Backend Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy .env.example to .env
echo "📝 Creating .env file from .env.example..."
cp .env.example .env
echo "✅ .env file created"
echo ""

echo "📋 Current CORS configuration:"
grep "CORS_ORIGIN" .env
echo ""

echo "ℹ️  Default CORS origins include:"
echo "   - http://localhost:5173 (local development)"
echo "   - https://crisiscore-systems.github.io (production)"
echo ""

echo "⚙️  Next steps:"
echo "1. Edit .env to update database credentials if needed"
echo "2. Ensure PostgreSQL is running: createdb neural_entrainment"
echo "3. Initialize database: psql -d neural_entrainment -f database/schema.sql"
echo "4. Ensure Redis is running: redis-cli ping"
echo "5. Install dependencies: npm install"
echo "6. Start development server: npm run dev"
echo ""
echo "✨ Setup complete!"
