#!/bin/bash

echo "🚀 Running migrations in Docker..."

# Load environment
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Build TypeScript
echo "📦 Building TypeScript..."
npm run build

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Run migrations
echo "📋 Running migrations..."
npm run typeorm -- migration:run -d dist/database/data-source.js

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi