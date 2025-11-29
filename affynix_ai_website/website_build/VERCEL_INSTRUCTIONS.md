# Vercel Deployment Instructions

## Quick Setup in Vercel Dashboard

Since you've already connected the GitHub repository, follow these steps:

### 1. Project Settings

In your Vercel project dashboard:

1. Go to **Settings** → **General**
2. Set **Root Directory**: `Website/website_build/frontend`
3. **Framework Preset**: Vite (or Auto-detect)

### 2. Build Settings

In **Settings** → **Build & Development Settings**:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

In **Settings** → **Environment Variables**, add:

- **Key**: `VITE_API_URL`
- **Value**: `https://api.affynix.ai`
- **Environment**: Production, Preview, Development (all)

### 4. Domain Configuration

In **Settings** → **Domains**:

1. Add `affynix.ai`
2. Add `www.affynix.ai`
3. Follow DNS instructions to point your domain to Vercel

### 5. Deploy

Vercel will automatically deploy when you push to the main branch, or you can:
- Click **Deploy** in the dashboard
- Or push the latest commit

## Important Notes

- The frontend is configured to use `https://api.affynix.ai` for API calls
- Make sure your backend is deployed and accessible at `api.affynix.ai` before deploying frontend
- The `vercel.json` file in the frontend directory handles routing for the SPA

## Backend Deployment

The backend (`api.affynix.ai`) needs to be deployed separately:
- Use Docker on a VPS (see `DEPLOYMENT.md`)
- Or use Railway/Render for containerized deployment
- The backend is not configured for Vercel serverless functions (would require restructuring)

