# Affynix Monorepo

Central hub for Affynix LLC infrastructure and services. This monorepo houses multiple applications and services that work together to power Affynix's platform ecosystem.

## Architecture Overview

This monorepo contains three major applications with distinct purposes:

### Core Applications

- **`affynix_ai_website/`** - AI-powered website builder platform
  - Vite + React frontend
  - Express.js backend API
  - Next.js admin dashboard
  - AI agent orchestration with OpenAI integration

- **`affynix_com_website/affynix-platform/`** - Multi-subdomain SaaS platform
  - Next.js 14 application
  - Dynamic subdomain routing via middleware
  - SEO optimization and analytics
  - Modal-based conversion funnels

- **`affynix-harvester/`** - Automated content harvesting service
  - Playwright-based web scraper
  - Express intake API for processing scraped data
  - Multi-tenant provisioning system
  - Docker-based deployment

### Supporting Services

- **`intake-api/`** - Centralized API for harvester data processing
- **`ai-gateway/`** - AI service orchestration layer
- **`affynix-automation-controller-complete/`** - Automation workflows

## Project Boundaries

Each application is self-contained with:
- Its own `README.md` with service-specific details
- Docker setup and configuration
- Environment variable templates (`.env.example`)
- Independent deployment pipeline

Cross-application changes require updates to all affected READMEs and environment templates.

## Quick Start

### Prerequisites

- Node.js 20.x (LTS)
- Docker and Docker Compose
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Affynix-LLC/mono-repo-master.git
   cd mono-repo-master
   ```

2. **Choose your application** and follow its README:
   - [AI Website Setup](./affynix_ai_website/website_build/README.md)
   - [Platform Setup](./affynix_com_website/affynix-platform/README.md)
   - [Harvester Setup](./affynix-harvester/README.md)

3. **For quick testing**, see [QUICK_START.md](./QUICK_START.md) for Docker Compose setup

### Development Workflows

#### AI Website
```bash
cd affynix_ai_website/website_build
./deploy.sh --dev  # Hot reload development mode
```

#### Platform
```bash
cd affynix_com_website/affynix-platform
npm install
npm run dev  # Starts on http://localhost:3000
```

#### Harvester
```bash
cd affynix-harvester
docker compose up --build
```

## Project Conventions

- **Component naming**: PascalCase in `components/`
- **Utilities**: camelCase or kebab-case in `lib/` and `utils/`
- **Path aliases**: Use `@/lib/...`, `@/components/...` in platform
- **Environment variables**: Never hardcode secrets; always use `.env.example` templates
- **Branching**: Feature branches only; never force-push to `main`
- **Commits**: Conventional format: `feat(scope):`, `fix(scope):`, etc.

## Key Integration Points

- **Analytics**: Centralized in `lib/analytics.js` with environment flags
- **SEO Network**: Configuration in `lib/seo-network.js` and `public/js/seo-network-*.js`
- **Backend APIs**: Service implementations in `affynix-backend/services/*` and `app/api/*`
- **External Services**: OpenAI, Vercel, Cloudflare, Airtable (credentials via environment variables)

## Documentation

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development setup and guidelines
- **[QUICK_START.md](./QUICK_START.md)** - Fast setup with Docker Compose
- **[MONO_REPO_SETUP.md](./MONO_REPO_SETUP.md)** - Detailed integration guide
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variable configuration
- **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** - Current deployment state
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - AI agent guidelines

### Service-Specific Docs

- [Harvester Docker Setup](./affynix-harvester/DOCKER_SETUP.md)
- [Intake API Documentation](./intake-api/README.md)
- [Vercel Setup Guide](./VERCEL_SETUP.md)
- [Airtable Integration](./AIRTABLE_SETUP.md)
- [Cloudflare Configuration](./CLOUDFLARE_SETUP.md)

## Testing

Each application has its own testing setup:

```bash
# Platform
npm run type-check
npm run lint
npm run build

# Harvester
docker-compose -f docker-compose.test.yml up --build
```

## Deployment

- **AI Website**: `./deploy.sh` (production mode)
- **Platform**: Vercel or `docker compose up --build`
- **Harvester**: Docker Compose on target infrastructure

See [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) for current deployment information.

## Subdomain Routing

The platform uses Next.js middleware (`middleware.ts`) to handle dynamic subdomain routing. Requests are rewritten based on the host header for multi-tenant functionality.

## Support

For questions or issues:
1. Check the relevant service's README
2. Review [QUICK_START.md](./QUICK_START.md) for common setup issues
3. Reach out to the development team

## License

Proprietary © Affynix LLC
