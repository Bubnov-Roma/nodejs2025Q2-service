# Build
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build and migrations)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies including devDependencies for migrations
RUN npm ci && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
# Copy source files for TypeORM CLI
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/nest-cli.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main"]