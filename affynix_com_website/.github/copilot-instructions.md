# Copilot / AI Agent Instructions for Affynix Platform

Purpose: give AI coding agents the minimal, high-value guidance to be immediately productive and safe in this repo.

Keep it short (20–50 lines). Focus on concrete, repo-specific patterns, commands, and files to check.

1. Repository overview
   - Next.js (App Router) TypeScript site with multi-subdomain routing. Key files: `middleware.ts`, `next.config.js`, `tsconfig.json`, `package.json`.
   - Monorepo-like structure with a separate `affynix-backend/` for services and infra. Frontend app lives at repo root `app/`, components in `components/`, helpers in `lib/`.

2. High-level architecture notes (why it is structured this way)
   - Subdomain meshing: `middleware.ts` rewrites requests by host to `/[subdomain]` pages — prefer edits that preserve this mapping. Subdomains are defined by convention (e.g., `business`, `money`, `health`, `home`, `lifestyle`, `relationships`, `tech`).
   - SEO & conversion-first design: modal-based funnels (see `components/Modal.js`, `LandingPage.js`) and SEO scripts under `public/js/` and `lib/seo-network.js`.
   - Backend services: the `affynix-backend/` folder contains docker-compose-based infrastructure and separate service packages (data, auth). Avoid cross-cutting changes without checking those READMEs.

3. Project-specific conventions (check these before edits)
   - File naming: components use PascalCase in `components/`; utilities and lib files use kebab or camel case under `lib/`.
   - Imports: project uses `@/*` path mapping (`tsconfig.json`). Prefer `@/lib/...` and `@/components/...` when editing.
   - Runtime: Node >= 18, Next 15+; check `package.json` scripts: `npm run dev`, `npm run build`, `npm run start`.
   - Styling: Tailwind is used; keep utility-first classes and avoid introducing heavy global CSS unless necessary.

4. Build / dev / test commands (use these exact commands in zsh)
   - Install dependencies: `npm install`
   - Dev server: `npm run dev` (Next dev on :3000)
   - Build: `npm run build`
   - Start prod locally: `npm run start`
   - Type check: `npm run type-check`
   - Lint/format: `npm run lint`, `npm run format`

5. Safe edit rules (derived from repo rules)
   - NEVER modify production environment variables or deployment scripts without explicit approval.
   - ALWAYS show a diff before committing; do not create commits or push without human confirmation.
   - NEVER run `git push --force`.
   - Preserve existing routing/middleware behavior; test subdomain rewrites locally after changes to `middleware.ts`.

6. Integration points to be aware of
   - Analytics/tracking: `lib/analytics.js` and environment flags in `.env` files (see `.env.local.example` in README). Edits touching analytics require coordination.
   - SEO network: `lib/seo-network.js` and `public/js/seo-network-*.js` — avoid breaking injection patterns.
   - Backend APIs: `affynix-backend/services/*` and `app/api/*` endpoints; changing API shapes needs backend and frontend updates.

7. Quick file checklist for common tasks
   - Change route behavior → check `middleware.ts`, `app/[subdomain]/`, `next.config.js`.
   - Add component → put in `components/`, export consistently, update any domain-specific layouts `app/[subdomain]/layout.tsx`.
   - Update types → update `tsconfig.json` paths and run `npm run type-check`.
   - Update build behavior → update `package.json` scripts and `next.config.js`, test `npm run build`.

8. Examples (copyable, repo-specific)
   - Rewrite in middleware preserves host → see `middleware.ts` rewrite to `/${subdomain}`.
   - Use path alias when importing: `import { detectDomain } from '@/lib/domain-detector';`

9. Where to look for more context
   - Top-level `README.md` and `affynix-backend/README.md` for infra and service runtime details.
   - `.cursor/rules/*.mdc` for project-specific AI agent safety rules and absolute prohibitions.

10. After making edits
   - Run `npm run type-check` and `npm run build`.
   - Run the dev server and visit a subdomain rewrite (e.g., `http://localhost:3000` with host header `business.localhost` or use a hosts entry) to confirm behavior.
   - Provide a short summary of changed files, rationale, and how you validated locally.

If anything in this file is unclear or you want me to add examples for a specific task (e.g., adding a new subdomain layout), tell me which area to expand.
