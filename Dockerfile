# ============================================
# Build stage
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy only package files first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with optimizations
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --prefer-offline --no-audit --progress=false && \
    npx prisma generate && \
    npm cache clean --force

# Copy source files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

# ============================================
# Production stage
# ============================================
FROM node:24-alpine

# Install only essential runtime dependencies
RUN apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy and prepare entrypoint
COPY --chown=nodejs:nodejs scripts/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nodejs

EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD node -e "require('http').get('http://localhost:4000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]