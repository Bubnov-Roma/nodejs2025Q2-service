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
    exit 1
fi

# Check if PostgreSQL container is running
echo -e "${BLUE}🔍 Checking PostgreSQL container...${NC}"
if ! docker ps | grep -q "home-library-postgres"; then
    echo -e "${YELLOW}⚠️  PostgreSQL container is not running${NC}"
    echo "Starting PostgreSQL..."
    docker-compose up postgres -d
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
fi

# Check if database exists
echo -e "${BLUE}🔍 Checking if database exists...${NC}"
DB_EXISTS=$(docker exec home-library-postgres psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -w "$POSTGRES_DB" || echo "")

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}⚠️  Database '$POSTGRES_DB' does not exist${NC}"
    echo "Creating database..."
    docker exec home-library-postgres createdb -U "$POSTGRES_USER" "$POSTGRES_DB"
    echo -e "${GREEN}✅ Database created successfully${NC}"
else
    echo -e "${GREEN}✅ Database '$POSTGRES_DB' already exists${NC}"
fi

# List databases
echo ""
echo -e "${BLUE}📋 Available databases:${NC}"
docker exec home-library-postgres psql -U "$POSTGRES_USER" -c "\l" | grep -E "(Name|$POSTGRES_DB|---)"

# Check if migrations directory exists
echo ""
if [ ! -d "src/database/migrations" ]; then
    echo -e "${YELLOW}⚠️  Migrations directory does not exist${NC}"
    echo "Creating directory..."
    mkdir -p src/database/migrations
fi

# Generate migrations if needed
echo -e "${BLUE}🔄 Generating migrations...${NC}"
if npm run migration:generate -- src/database/migrations/InitialMigration 2>&1 | grep -q "No changes"; then
    echo -e "${GREEN}✅ No changes detected, migrations are up to date${NC}"
elif [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations generated successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Could not generate migrations (may be already applied)${NC}"
fi

# Run migrations
echo ""
echo -e "${BLUE}🚀 Running migrations...${NC}"
if npm run migration:run; then
    echo -e "${GREEN}✅ Migrations applied successfully${NC}"
else
    echo -e "${RED}❌ Failed to apply migrations${NC}"
    exit 1
fi

# Show tables
echo ""
echo -e "${BLUE}📊 Database tables:${NC}"
docker exec home-library-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt"

echo ""
echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start the application: npm run start:dev"
echo "  2. Or with Docker: npm run docker:dev"
echo ""