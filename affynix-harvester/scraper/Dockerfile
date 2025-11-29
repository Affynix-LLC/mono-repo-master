

FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire scraper directory into the container
COPY . .

# Install Chromium and dependencies
RUN npx playwright install --with-deps chromium

# Default command: run the unified scraper runner
CMD ["node", "scripts/run.js"]