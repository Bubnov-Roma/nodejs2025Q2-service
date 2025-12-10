#!/bin/bash

# Script to check Docker image size and layers

echo "🔍 Checking Docker image size..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

IMAGE_NAME="home-library-app:latest"
MAX_SIZE_MB=500

# Check if image exists
if ! docker images | grep -q "home-library-app"; then
    echo -e "${RED}❌ Image $IMAGE_NAME not found${NC}"
    echo "Build the image first: npm run docker:build"
    exit 1
fi

echo "📦 Image details:"
echo ""
docker images $IMAGE_NAME

echo ""
echo "📊 Size breakdown by layer:"
echo ""
docker history --human $IMAGE_NAME --no-trunc

echo ""

# Get size in MB
SIZE=$(docker images $IMAGE_NAME --format "{{.Size}}")
SIZE_MB=$(docker images $IMAGE_NAME --format "{{.Size}}" | sed 's/MB//' | sed 's/GB/*1024/' | bc 2>/dev/null || echo "0")

echo "Current size: $SIZE"
echo ""

# Check if size is acceptable
if [ -z "$SIZE_MB" ] || [ "$SIZE_MB" = "0" ]; then
    echo -e "${YELLOW}⚠️  Could not determine size${NC}"
elif (( $(echo "$SIZE_MB < $MAX_SIZE_MB" | bc -l) )); then
    echo -e "${GREEN}✅ Image size is acceptable (< ${MAX_SIZE_MB}MB)${NC}"
else
    echo -e "${RED}❌ Image size exceeds ${MAX_SIZE_MB}MB${NC}"
    echo ""
    echo "💡 Optimization tips:"
    echo "1. Check node_modules size:"
    echo "   docker run --rm $IMAGE_NAME du -sh /app/node_modules"
    echo ""
    echo "2. Remove unused dependencies from package.json"
    echo ""
    echo "3. Use .dockerignore to exclude unnecessary files"
    echo ""
    echo "4. Analyze image layers:"
    echo "   docker history $IMAGE_NAME"
fi

echo ""
echo "🔬 Detailed analysis:"
echo ""
echo "To analyze the image in detail, install 'dive':"
echo "  brew install dive (macOS)"
echo "  https://github.com/wagoodman/dive (other OS)"
echo ""
echo "Then run:"
echo "  dive $IMAGE_NAME"