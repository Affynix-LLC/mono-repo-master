# Vercel Environment Variable Setup Scripts

## Quick Setup via GitHub Secrets

### 1. Add Secrets to GitHub

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

- **`VERCEL_API_TOKEN`**: Your Vercel API token (get from https://vercel.com/account/tokens)
- **`VERCEL_TEAM_ID`**: `team_ffSkbObQFzckEPWZSlpzwGMq` (Affynix team)
- **`VERCEL_PROJECT_ID`**: `prj_g21F5AyOmuDWqKLmYRZl5A5Fb5un` (affynix.ai_backend project)

### 2. Get Your Supabase Connection String

1. Go to Supabase: https://kvrjdknklunfmnuycvfh.supabase.co
2. Settings → Database → Connection string → URI
3. Copy the connection string
4. Add `?sslmode=require` at the end:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.kvrjdknklunfmnuycvfh.supabase.co:5432/postgres?sslmode=require
   ```

### 3. Set DATABASE_URL via GitHub Actions

1. Go to your repository → Actions tab
2. Select "Set Vercel DATABASE_URL" workflow
3. Click "Run workflow"
4. Paste your Supabase connection string
5. Click "Run workflow"

The workflow will automatically set the `DATABASE_URL` environment variable in your Vercel project.

### 4. Redeploy

After the workflow completes:
1. Go to: https://vercel.com/affynix/affynix.ai_backend/deployments
2. Click the three dots on the latest deployment
3. Click "Redeploy"

---

## Alternative: Run Script Locally

If you prefer to run the script locally:

```bash
cd affynix_ai_website/website_build/backend

# Set your Vercel token
export VERCEL_TOKEN=your-token-here

# Run the script
node scripts/set-vercel-env.js DATABASE_URL "postgresql://postgres:password@db.kvrjdknklunfmnuycvfh.supabase.co:5432/postgres?sslmode=require"
```

---

## Get Vercel API Token

1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "Affynix Backend Setup"
4. Copy the token (you won't see it again!)

---

## Verify It Worked

After setting and redeploying, check your Vercel deployment logs. You should see:
```
[DB] Connected to Supabase Postgres database
[DB] Tables initialized successfully
```

Instead of the previous ENOENT errors.
