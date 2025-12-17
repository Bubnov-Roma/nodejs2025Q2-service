#!/bin/bash

# Script to check Docker image size and layers

echo "🔍 Checking Docker image size..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get image name from env or use default
IMAGE_NAME="${DOCKER_USERNAME:-kilkun}/home-library-app:latest"
MAX_SIZE_MB=500

# Check if image exists
if ! docker images "$IMAGE_NAME" | grep -q "home-library-app"; then
    echo -e "${RED}❌ Image $IMAGE_NAME not found${NC}"
    echo "Build the image first: npm run docker:build"
    exit 1
fi

echo "📦 Image details:"
echo ""
docker images "$IMAGE_NAME"

echo ""
echo "📊 Size breakdown by layer:"
echo ""
docker history --human "$IMAGE_NAME" --no-trunc | head -15

echo ""

# Get size in MB
SIZE=$(docker images "$IMAGE_NAME" --format "{{.Size}}")
SIZE_MB=$(docker images "$IMAGE_NAME" --format "{{.Size}}" | sed 's/MB//' | sed 's/GB/*1024/' | bc 2>/dev/null || echo "0")

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
    echo "💡 Run detailed analysis:"
    echo "   bash scripts/analyze-image.sh"
fi

echo ""
echo "🔬 Quick checks:"
docker run --rm "$IMAGE_NAME" sh -c 'du -sh /app/node_modules 2>/dev/null || echo "node_modules: N/A"'
docker run --rm "$IMAGE_NAME" sh -c 'du -sh /app/dist 2>/dev/null || echo "dist: N/A"'
docker run --rm "$IMAGE_NAME" sh -c 'ls /app/node_modules/@types 2>/dev/null && echo "⚠️  @types found (dev deps)" || echo "✅ No @types"'
docker run --rm "$IMAGE_NAME" sh -c 'ls /app/node_modules/typescript 2>/dev/null && echo "⚠️  typescript found (dev deps)" || echo "✅ No typescript"'