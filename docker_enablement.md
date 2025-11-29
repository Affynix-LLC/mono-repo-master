# Docker Enablement Playbook

This guide implements the five-part Docker Enablement Plan. It inventories the
current assets, recommends improvements (prioritized AI site → `.com` platform
→ harvester), and finishes with an execution checklist.

---

## 1. Current Docker Assets

- **AI stack (`affynix_ai_website/website_build/`)**
  - Compose file builds two services (Express backend on `3001`, Vite frontend
    preview on `4173`) with multi-stage Dockerfiles.
  - Backend Dockerfile keeps the API minimal (`node:20-alpine`, `npm start`).
  - Frontend Dockerfile builds once and serves via `npm run preview`.
- **`.com` platform (`affynix_com_website/`)**
  - Single-service Compose config builds the Next.js app, binds the project
    directory as a volume, and preserves `node_modules` in-container.
  - Dockerfile installs deps, runs `npm run build`, prunes dev deps, and starts
    with `npm start`.
- **Harvester (`affynix-harvester/`)**
  - Scraper Dockerfile extends the official Playwright Jammy image, installs
    npm deps, and runs `node scripts/run.js`.
  - Intake API utilities exist (`affynix-harvester/affynix-backend`) but no
    Compose stack ties the scraper to the API.

## 2. AI Site Priority Improvements

1. **Shared environment loading**
   - Create `.env` alongside `docker-compose.yml`. Move values such as
     `PORT`, `VITE_API_URL`, analytics tokens, and any admin credentials into
     that file.
   - Reference via:
     ```yaml
     env_file:
       - .env
     ```
   - Allows staging/prod parity without editing Compose.

2. **Development override for hot reload**
   - Introduce `docker-compose.dev.yml` containing:
     - Bind mounts (`frontend/:/app/frontend`, `backend/:/app/backend`).
     - Anonymous `node_modules` volumes (`- /app/frontend/node_modules` etc.).
     - Commands `npm run dev` (frontend) and `npm run dev` or `nodemon` for
       backend.
     - `CHOKIDAR_USEPOLLING=1` env for Vite watchers in Docker.
   - Run with `docker compose -f docker-compose.dev.yml up`.

3. **Canonical entry script**
   - Extend `deploy.sh` to accept flags:
     - `./deploy.sh --env-file .env.prod` (passes to `docker compose`).
     - `./deploy.sh --profile dev` (switches to dev compose).
   - Script already rebuilds, restarts, waits, and health-checks both services,
     so formalizing flags keeps every workflow consistent.

4. **Health checks and observability**
   - Add `healthcheck` blocks per service:
     ```yaml
     healthcheck:
       test: ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"]
       interval: 30s
       timeout: 5s
       retries: 3
     ```
   - Consider structured logging (`logging` section exposing `json-file`
     options) for easier troubleshooting.

5. **Admin delivery**
   - If admin UI should be served separately, add an `admin` service that either
     reuses the backend image (serving admin routes) or builds a static admin
     bundle proxied through the backend container.

## 3. `.com` Platform Containerization

1. **Separate dev/prod Compose files**
   - `docker-compose.dev.yml`:
     - Bind mount the repo.
     - Run `npm run dev` with `NEXT_PUBLIC_*` envs loaded from `.env.local`.
   - `docker-compose.prod.yml`:
     - Build and run the optimized image with no bind mounts.
     - Provide `NODE_ENV=production` and analytics/env secrets via `env_file`.

2. **Multi-stage Dockerfile**
   - Stage 1 (`builder`): install deps (`npm ci`), run `npm run build`.
   - Stage 2 (`runner`): copy `.next`, `public`, `package*.json`, run
     `npm ci --omit=dev`, set `NODE_ENV=production`, run `npm start`.
   - This mirrors the Vercel output and shrinks the image.

3. **In-container tooling**
   - Document commands:
     - `docker compose run --rm affynix-platform npm run lint`
     - `docker compose run --rm affynix-platform npm run type-check`
     - `docker compose run --rm affynix-platform npm run build`
   - Ensures lint/build parity with CI without installing Node locally.

4. **Local multi-subdomain testing**
   - Add Nginx (or Traefik) service to dev Compose that rewrites
     `*.affynix.localhost` hosts to the Next.js container, mimicking Vercel
     domain-based routing governed by `middleware.ts`.
   - Update `/etc/hosts` entries like `127.0.0.1 business.affynix.localhost`.

5. **Optional node_modules cache**
   - Use Docker BuildKit mounts or `npm cache` volumes to speed builds.

## 4. Harvester Docker Strategy

1. **Compose stack definition**
   - `intake-api` service:
     - Node 20 image running `/api/scraper-intake`.
     - Env vars: `AIRTABLE_*`, `CLOUDFLARE_*`, `VERCEL_*`,
       `AFFYNIX_SCRAPER_KEY`.
     - `healthcheck` hitting `/health`.
   - `scraper` service:
     - Existing Playwright image.
     - `env_file: .env.harvester`.
     - Volume mounts for `logs/` and `sessions/`.
     - Default command `npm run scrape`.

2. **Secret management**
   - Store sensitive values in `.env.harvester` (ignored by git).
   - For production deployments, consider Docker secrets or an external secret
     manager (e.g., Doppler, SSM) injected at runtime.

3. **Scheduling options**
   - Add a lightweight `scheduler` container (Alpine + `crond`) that executes
     `docker exec scraper node scripts/run.js` on cron intervals.
   - Alternatively, trigger `docker compose run --rm scraper npm run scrape`
     via CI pipelines or server-side cron.

4. **Mock/testing mode**
   - Provide a `docker-compose.mock.yml` where the intake API runs with dummy
     Airtable/Cloudflare clients so scraper runs can be tested without touching
     production services.

5. **Monitoring**
   - Pipe scraper logs to CloudWatch/ELK by mounting Fluent Bit sidecars or
     using Docker logging drivers.

## 5. Step-by-Step Execution (AI → `.com` → Harvester)

### AI Stack
1. `cd affynix_ai_website/website_build`
2. `cp .env.example .env` and populate API/admin/analytics values.
3. Production-like run: `docker compose --env-file .env up --build -d`
4. Development run: `docker compose -f docker-compose.dev.yml up`
5. Validate health:
   - `curl http://localhost:3001/health`
   - `curl http://localhost:4173`
6. Tail logs: `docker compose logs -f backend frontend`
7. Stop: `docker compose down` (add `-v` to clear volumes)

### `.com` Platform
1. `cd affynix_com_website`
2. Dev server: `docker compose -f docker-compose.dev.yml up`
3. Prod-like: `docker compose -f docker-compose.prod.yml up --build -d`
4. Run tooling:
   - `docker compose run --rm affynix-platform npm run lint`
   - `docker compose run --rm affynix-platform npm run build`
5. Configure `/etc/hosts` and optional Nginx proxy to simulate multi-domain
   routing (e.g., `business.affynix.localhost`).
6. Stop: `docker compose down`

### Harvester
1. `cd affynix-harvester`
2. Create `.env.harvester` with Airtable, Cloudflare, Vercel, and scraper auth
   keys.
3. `docker compose --env-file .env.harvester up --build -d` to bring up
   `intake-api` + `scraper`.
4. Manual harvest: `docker compose run --rm scraper npm run scrape`
5. Review logs: `docker compose logs -f scraper intake-api`
6. Optional: enable scheduler container or external cron for automated runs.
7. Stop: `docker compose down`

Following these steps keeps the AI site container workflows first, establishes
consistent tooling for the `.com` platform second, and only then adds the
harvester orchestration, aligning with the requested priority order.

