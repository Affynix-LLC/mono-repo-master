# Contributing to Affynix Monorepo

This guide describes how to contribute to the Affynix monorepo following our engineering standards and best practices.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Dependency Management](#dependency-management)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Git Workflow](#git-workflow)
8. [AI Agent Guidelines](#ai-agent-guidelines)

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x (LTS) - Required for production compatibility
- **Docker**: Latest stable version with Docker Compose
- **Git**: Latest version
- **Code Editor**: VS Code recommended (with Prettier and ESLint extensions)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Affynix-LLC/mono-repo-master.git
   cd mono-repo-master
   ```

2. **Identify your target application**
   
   The monorepo contains three major apps:
   - `affynix_ai_website/` - AI website builder
   - `affynix_com_website/affynix-platform/` - Multi-subdomain SaaS
   - `affynix-harvester/` - Playwright scraper

3. **Set up environment variables**
   
   Each application has an `.env.example` template:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```
   
   Never commit `.env` files or hardcode secrets.

4. **Install dependencies**
   ```bash
   # For platform
   cd affynix_com_website/affynix-platform
   npm install  # or npm ci for production
   
   # For AI website
   cd affynix_ai_website/website_build
   npm install
   
   # For harvester (uses Docker)
   cd affynix-harvester
   # Dependencies managed by Docker
   ```

### Running Development Servers

**AI Website:**
```bash
cd affynix_ai_website/website_build
./deploy.sh --dev  # Hot reload enabled
```

**Platform:**
```bash
cd affynix_com_website/affynix-platform
npm run dev
# Opens on http://localhost:3000
```

**Harvester:**
```bash
cd affynix-harvester
docker compose up --build
# View logs: docker compose logs -f
```

## Development Workflow

### 1. Understand the Project Boundaries

Each application is self-contained:
- Has its own `README.md` with service-specific details
- Independent Docker setup and environment files
- Separate deployment pipeline

**Important**: Cross-app changes require updating all affected READMEs and `.env.example` templates.

### 2. Make Minimal Changes

Following Affynix Engineering Rules:
- **Minimal diffs only** - No refactoring, renaming, or reorganizing unless explicitly requested
- **Deployment-first** - Preserve Vercel compatibility and production stability
- **No experiments** - Don't introduce new platforms or infrastructure changes
- **Target failures precisely** - Use logs and stack traces to identify exact issues

### 3. Confirm Correct Project Root

Before making changes:
```bash
# Verify you're in the correct app directory
pwd

# Check the app's package.json or README
cat package.json | grep '"name"'
```

### 4. Test Locally

Run type checks and builds:
```bash
# Platform
npm run type-check
npm run lint
npm run build

# Verify no errors before committing
```

## Code Standards

### Language and Types

- **Prefer TypeScript** - Avoid `any` unless unavoidable
- **Explicit error handling** - Return meaningful HTTP status codes and messages
- **No new abstractions** - Don't add architecture layers unless requested

### Component Naming

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase or kebab-case (e.g., `formatOffer.js`, `utils/subdomain-router.js`)
- **Imports**: Use path aliases when available
  ```typescript
  import { analytics } from '@/lib/analytics'
  import { Button } from '@/components/ui/Button'
  ```

### File Organization

```
app/
├── components/         # PascalCase React components
├── lib/               # Utilities and integrations
├── app/api/           # API route handlers
└── utils/             # Helper functions
```

### Environment Variables

- Never hardcode secrets or API keys
- Always use `.env.example` as templates
- Document required variables in README
- Reference variables via `process.env.VARIABLE_NAME`

### Logging

- Avoid verbose logging
- Only log actionable runtime failures
- Use structured logging where possible

## Dependency Management

### Adding Dependencies

1. **Check if necessary** - Prefer existing libraries
2. **Pin versions** - Use exact versions for production-critical deps
3. **Don't upgrade** unless required to resolve an issue
4. **Avoid replacements** - Don't swap core libraries (ORM/DB/auth) without approval

### Native Modules

For native modules (e.g., `better-sqlite3`):
- Prefer Node runtime pin + compatible builds
- Avoid changing the dependency first

### Installation

```bash
# Add a dependency
npm install --save <package>

# Add a dev dependency
npm install --save-dev <package>

# For production, use pinned versions
npm ci
```

## Testing

### Before Committing

Always run:
```bash
npm run type-check  # TypeScript errors
npm run lint        # Code style
npm run build       # Build errors
```

### Platform-Specific Tests

Follow each app's testing documentation:
- AI Website: See `affynix_ai_website/website_build/README.md`
- Platform: Run `npm test` if tests exist
- Harvester: Use `docker-compose.test.yml`

### Integration Testing

```bash
# Test harvester + intake-api together
docker-compose -f docker-compose.test.yml up --build

# View logs
docker-compose -f docker-compose.test.yml logs -f
```

## Deployment

### Build Commands

Never change build commands or output directories unless required.

**Platform:**
- Build command: `npm run build`
- Output directory: `.next`
- Framework: Next.js 14

**AI Website:**
```bash
./deploy.sh  # Production deployment
```

**Harvester:**
```bash
docker compose up --build  # Production mode
```

### Runtime Configuration

- **Preferred**: Node 20.x (LTS)
- Avoid changing runtime without testing
- For runtime issues, try:
  1. Pin Node version in `package.json` engines
  2. Update Vercel runtime settings
  3. Check environment variables

### Vercel Deployment

- Don't modify build commands without approval
- Preserve serverless/edge runtime configurations
- Set required environment variables in Vercel dashboard
- See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for details

## Git Workflow

### Branch Naming

```bash
# Feature branches
git checkout -b feat/add-authentication
git checkout -b fix/api-timeout

# Use conventional prefixes
feat/    # New features
fix/     # Bug fixes
docs/    # Documentation
chore/   # Maintenance
```

### Commit Format

Use conventional commits:
```bash
feat(scope): add user authentication
fix(api): resolve timeout in /api/users
docs(readme): update setup instructions
chore(deps): upgrade next to 14.1.0
```

### PR Discipline

1. **Never commit directly to `main`** - Always use PRs
2. **Never force-push** - Preserve commit history
3. **Include in every PR**:
   - Scope of changes
   - Root cause (for fixes)
   - Verification steps
   - Rollback plan

### PR Template

```markdown
## Changes
- Brief description of what changed

## Root Cause (for fixes)
- What was the problem

## Testing
- Steps taken to verify changes

## Rollback Plan
- How to revert if needed
```

## AI Agent Guidelines

### For AI Coding Assistants

When working with this repository:

1. **Follow custom instructions** in `.github/copilot-instructions.md`
2. **Minimal changes only** - Surgical, precise edits
3. **Check project root** before making changes
4. **Preserve patterns** - Don't switch frameworks or architectures
5. **Log-first debugging** - Request Vercel logs before proposing changes

### Subdomain Routing

The platform uses Next.js middleware for dynamic subdomains:
- Configuration in `middleware.ts`
- Always test subdomain rewrites after changes
- See `affynix-platform` for domain config

### Key Files to Know

- `README.md` - Architecture and workflows (this file)
- `middleware.ts` - Subdomain routing logic
- `next.config.js` - Next.js configuration
- `docker-compose.yml` - Service orchestration
- `.env.example` - Required environment variables

## After Making Changes

### Validation Checklist

- [ ] Type checks pass: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Builds successfully: `npm run build`
- [ ] Subdomain routing works (if applicable)
- [ ] API endpoints return correct responses
- [ ] No secrets committed
- [ ] Documentation updated (if needed)

### Before Pushing

```bash
# Check status
git status

# Review changes
git diff

# Stage and commit
git add .
git commit -m "feat(scope): description"

# Push to your branch
git push origin your-branch-name
```

## Getting Help

- **Service-specific questions**: Check the app's README
- **Setup issues**: See [QUICK_START.md](./QUICK_START.md)
- **Environment setup**: See [ENV_SETUP.md](./ENV_SETUP.md)
- **Deployment issues**: See [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)
- **General questions**: Reach out to the dev team

## Additional Resources

- [Affynix Engineering Rules](./.github/copilot-instructions.md)
- [Mono Repo Setup Guide](./MONO_REPO_SETUP.md)
- [Vercel Setup](./VERCEL_SETUP.md)
- [Cloudflare Setup](./CLOUDFLARE_SETUP.md)
- [Airtable Integration](./AIRTABLE_SETUP.md)

---

Thank you for contributing to Affynix! Your attention to these guidelines helps maintain code quality and deployment stability.
