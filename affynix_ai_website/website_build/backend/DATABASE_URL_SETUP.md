# DATABASE_URL Setup for Supabase

## Quick Setup Steps

### 1. Get Your Supabase Connection String

1. Go to your Supabase project: https://kvrjdknklunfmnuycvfh.supabase.co
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **URI**
4. Copy the connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.kvrjdknklunfmnuycvfh.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Add `?sslmode=require` at the end:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.kvrjdknklunfmnuycvfh.supabase.co:5432/postgres?sslmode=require
   ```

### 2. Set DATABASE_URL in Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to: https://vercel.com/affynix/affynix.ai_backend/settings/environment-variables
2. Click **Add New**
3. Set:
   - **Key**: `DATABASE_URL`
   - **Value**: (paste your full connection string from step 1)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

**Option B: Via Vercel CLI**

```bash
cd affynix_ai_website/website_build/backend

# Install Vercel CLI if needed
npm install -g vercel

# Login
vercel login

# Link to your project (if not already linked)
vercel link

# Set the environment variable
vercel env add DATABASE_URL production
# Paste your connection string when prompted
# Repeat for preview and development if needed:
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```

### 3. Redeploy

After setting the environment variable:

1. **Via Dashboard**: Go to your project → **Deployments** → Click the three dots on latest deployment → **Redeploy**
2. **Via CLI**: 
   ```bash
   vercel --prod
   ```

### 4. Verify

Check the deployment logs - you should see:
```
[DB] Connected to Supabase Postgres database
[DB] Tables initialized successfully
```

Instead of the previous ENOENT errors.

## Connection String Format

Your final `DATABASE_URL` should look like:
```
postgresql://postgres:YOUR_PASSWORD@db.kvrjdknklunfmnuycvfh.supabase.co:5432/postgres?sslmode=require
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with your actual Supabase database password
- The `?sslmode=require` is necessary for Supabase connections
- Make sure the password doesn't contain special characters that need URL encoding (if it does, encode them: `@` → `%40`, `#` → `%23`, etc.)

## Troubleshooting

If you see connection errors:
1. Verify your Supabase password is correct
2. Check that your Supabase project allows connections from Vercel IPs (should be enabled by default)
3. Ensure the connection string includes `?sslmode=require`
4. Check Vercel deployment logs for specific error messages
