# Copilot / AI Agent Instructions for Affynix Monorepo

This file guides AI coding agents to be productive and safe in the Affynix monorepo. Focus on actionable, repo-specific patterns and workflows.

## 1. Big Picture Architecture
- **Three major apps:**
  - `affynix_ai_website/`: Vite+React frontend, Express.js backend, admin (Next.js)
  - `affynix_com_website/affynix-platform/`: Next.js 14 multi-subdomain SaaS, SEO/analytics, modal funnels
  - `affynix-harvester/`: Playwright-based scraper, Express intake API, multi-tenant provisioning
- **Service boundaries:** Each app is self-contained with its own Docker setup, environment files, and README. Cross-app changes require updates in all affected READMEs and .env templates.
- **Subdomain routing:** Next.js middleware (`middleware.ts`) rewrites requests by host for dynamic subdomains. See `affynix-platform` for domain config and routing logic.

## 2. Developer Workflows
- **Install dependencies:** `npm install` (or `npm ci` for platform)
- **Dev servers:**
  - AI Website: `./deploy.sh --dev` (hot reload)
  - Platform: `npm run dev`
  - Harvester: `docker compose up --build`
- **Build/Deploy:**
  - AI Website: `./deploy.sh` (prod)
  - Platform: `docker compose up --build` or Vercel
  - Harvester: `docker compose up --build`
- **Testing:** `npm run type-check`, `npm run lint`, `npm run build` (platform)
- **Logs:** `docker compose logs -f [service]`

## 3. Project Conventions
- **Component naming:** PascalCase in `components/`; utilities in `lib/` use camel/kebab case
- **Imports:** Use path aliases (`@/lib/...`, `@/components/...`) in platform
- **Environment:** Never hardcode secrets; use `.env.example` as templates
- **Branching:** Feature branches only; never force-push to `main`
- **Commits:** Use conventional format: `feat(scope): ...`, `fix(scope): ...`

## 4. Integration Points
- **Analytics:** `lib/analytics.js`, `.env` flags; edits require coordination
- **SEO network:** `lib/seo-network.js`, `public/js/seo-network-*.js`
- **Backend APIs:** `affynix-backend/services/*`, `app/api/*` endpoints
- **External services:** OpenAI, Vercel, Cloudflare, Airtable (see env templates)

## 5. Safe Edit Rules
- NEVER modify production envs or deployment scripts without approval
- ALWAYS show a diff before committing; do not push without human confirmation
- NEVER run `git push --force`
- Preserve subdomain routing and test rewrites after changes

## 6. Enabling OpenAI for All Clients
- OpenAI models should be enabled for all client-facing agent orchestration in the backend API (`affynix_ai_website/website_build/backend/`).
- Update API integration logic to default to OpenAI (e.g., GPT-4, GPT-3.5) for supported endpoints, unless overridden by client config.
- Ensure your `.env` contains valid OpenAI API keys and endpoints (see `env.example`).
- Document any changes in `affynix_ai_website/website_build/README.md` and relevant backend service READMEs.

## 7. Key Files & Where to Look
- Top-level `README.md` for architecture and workflows
- Each app's `README.md` for service-specific details
- `middleware.ts`, `next.config.js`, `docker-compose.yml` for routing and orchestration
- `.env.example` files for required environment variables
- `.cursor/rules/*.mdc` for AI agent safety rules

## 8. After Making Edits
- Run type checks and builds: `npm run type-check`, `npm run build`
- Validate subdomain routing and API endpoints locally
- Provide a summary of changed files, rationale, and validation steps

If any section is unclear or you need more examples (e.g., enabling Claude Sonnet 4.5 for a new client), request clarification or expansion.