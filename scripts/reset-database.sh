#!/bin/bash

echo "🧹 Resetting database..."

# Stop and remove containers
docker-compose down -v

# Remove volumes
docker volume rm home-library-postgres-data 2>/dev/null || true
docker volume rm home-library-postgres-logs 2>/dev/null || true
docker volume rm home-library-app-logs 2>/dev/null || true

# Remove network
docker network rm home-library-network 2>/dev/null || true

echo "✅ Database reset complete!"