#!/bin/bash

# Database setup script
# Automatically creates database and runs migrations

set -e

echo "🐘 PostgreSQL Database Setup"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env file based on .env.example"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

# Start PostgreSQL container if not running
echo -e "${BLUE}🔍 Checking PostgreSQL container...${NC}"
if ! docker ps | grep -q "postgres"; then
    echo -e "${YELLOW}⚠️  PostgreSQL container is not running${NC}"
    echo "Starting PostgreSQL..."
    docker-compose up postgres -d
    echo "Waiting for PostgreSQL to be ready..."
    sleep 10
fi

# Wait for PostgreSQL to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0
until docker exec $(docker ps -qf "name=postgres") pg_isready -U "$POSTGRES_USER" > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        exit 1
    fi
    echo "Waiting for PostgreSQL... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 1
done

echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
echo ""

# Check if database exists
echo -e "${BLUE}🔍 Checking if database exists...${NC}"
CONTAINER_NAME=$(docker ps -qf "name=postgres")
DB_EXISTS=$(docker exec $CONTAINER_NAME psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -w "$POSTGRES_DB" || echo "")

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}⚠️  Database '$POSTGRES_DB' does not exist${NC}"
    echo "Creating database..."
    docker exec $CONTAINER_NAME createdb -U "$POSTGRES_USER" "$POSTGRES_DB"
    echo -e "${GREEN}✅ Database created successfully${NC}"
else
    echo -e "${GREEN}✅ Database '$POSTGRES_DB' already exists${NC}"
fi

# List databases
echo ""
echo -e "${BLUE}📋 Available databases:${NC}"
docker exec $CONTAINER_NAME psql -U "$POSTGRES_USER" -c "\l" | grep -E "(Name|$POSTGRES_DB|---)"

echo ""
echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start the application: npm run start:dev"
echo "  2. Or with Docker: npm run docker:dev"
echo ""