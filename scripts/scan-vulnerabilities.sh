#!/bin/bash

# Vulnerability scanning script for Docker images
# Uses Docker's built-in scan and npm audit

echo "🔍 Starting vulnerability scan..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Scan npm dependencies
npm audit --production
NPM_EXIT_CODE=$?

if [ $NPM_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ No vulnerabilities found in npm dependencies.${NC}"
else
    echo -e "${YELLOW}⚠️ Vulnerabilities found in npm dependencies. Please review the audit report above.${NC}"
fi

echo ""

# 2. Scan Docker image
echo "🔍 Scanning Docker image..."
IMAGE_NAME="home-library-app:latest"

if docker images | grep -q "home-library-app"; then
#     echo "Using local image for scanning..."

#     if command -v trivy &> /dev/null; then
#         echo "Using Trivy..."
#         trivy image --input docker-archive:$(docker save $IMAGE_NAME -o /tmp/image.tar) /tmp/image.tar
#     else
#         echo -e "${YELLOW}⚠️ Install Trivy for better scanning${NC}"

    if command -v docker scout &> /dev/null; then
        echo "Using Docker Scout..."
        docker scout cves $IMAGE_NAME
    elif command -v trivy &> /dev/null; then
        echo "Using Trivy..."
        trivy image $IMAGE_NAME
    else
        echo -e "${YELLOW}⚠️ No Docker scanning tool found.${NC}"
        echo "Install Docker Scout or Trivy for image scanning"
        echo "- Docker Scout: comes with Docker Desktop"
        echo "- Trivy: brew install trivy (macOS) or see https://github.com/aquasecurity/trivy"
        
    fi
else
    echo -e "${YELLOW}⚠️ Docker image $IMAGE_NAME not found.${NC}"
    echo "Build the image first: npm run docker:build"
fi
echo ""
echo "🔍 Scan completed!"

# Exit with npm audit code
exit $NPM_EXIT_CODE