# Admin build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set build-time environment variables (Vite needs these at build time)
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache curl

# Copy package files
COPY package.json ./

# Install production dependencies
RUN npm install

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./

# Expose port
EXPOSE 3002

# Run preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3002"]
