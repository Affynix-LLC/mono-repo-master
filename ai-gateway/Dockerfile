# AI Gateway Dockerfile

FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage (if needed)
FROM base AS build
# Add any build steps here if needed

# Production stage
FROM base AS production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/tasks', (r) => {process.exit(r.statusCode === 401 || r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["pnpm", "start"]

