#!/bin/bash

# Safe Docker build script with memory management

echo "🔧 Preparing for safe Docker build..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Check available memory
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    TOTAL_MEM=$(sysctl -n hw.memsize | awk '{print int($1/1024/1024/1024)}')
    echo "System memory: ${TOTAL_MEM}GB"
    
    DOCKER_MEM=$(docker system info --format '{{.MemTotal}}' 2>/dev/null | awk '{print int($1/1024/1024/1024)}')
    if [ -n "$DOCKER_MEM" ]; then
        echo "Docker memory: ${DOCKER_MEM}GB"
        
        if [ "$DOCKER_MEM" -lt 4 ]; then
            echo -e "${YELLOW}⚠️  Warning: Docker memory is less than 4GB${NC}"
            echo "Recommended: Increase Docker memory to 6GB in Docker Desktop Settings"
            read -p "Continue anyway? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    fi
fi

# Clean up before build
echo ""
echo "🧹 Cleaning up old build artifacts..."
docker builder prune -f > /dev/null 2>&1
echo "✅ Cleanup complete"

# Enable BuildKit
export DOCKER_BUILDKIT=1
echo ""
echo "✅ BuildKit enabled"

# Check .env file
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env created${NC}"
    echo ""
    echo "Please edit .env and set your DOCKER_USERNAME, then run this script again"
    exit 0
fi

# Build with progress
echo ""
echo "🏗️  Building Docker image..."
echo "This may take 5-10 minutes on first build..."
echo ""

# Build with limited resources to avoid OOM
docker-compose build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --progress=plain \
    2>&1 | tee build.log

BUILD_EXIT_CODE=${PIPESTATUS[0]}

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    
    # Check image size
    echo "📦 Checking image size..."
    IMAGE_SIZE=$(docker images home-library-app:latest --format "{{.Size}}")
    echo "Image size: $IMAGE_SIZE"
    
    # Run size check script if it exists
    if [ -f scripts/check-image-size.sh ]; then
        bash scripts/check-image-size.sh
    fi
    
    echo ""
    echo "🚀 To start the application:"
    echo "   npm run docker:prod"
    echo ""
    echo "Or in detached mode:"
    echo "   npm run docker:prod:detached"
    
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    echo ""
    echo "Common issues and solutions:"
    echo ""
    echo "1. Out of memory:"
    echo "   - Increase Docker memory to 6GB in Docker Desktop"
    echo "   - Close other applications"
    echo "   - Restart Docker Desktop"
    echo ""
    echo "2. Network timeout:"
    echo "   - Check internet connection"
    echo "   - Try again (npm mirrors can be slow)"
    echo ""
    echo "3. Disk space:"
    echo "   - Run: npm run docker:prune"
    echo "   - Free up disk space"
    echo ""
    echo "Build log saved to: build.log"
    echo ""
    echo "For more help, see: BUILD_OPTIMIZATION.md"
    
    exit 1
fi