# Vercel Deployment Guide

## Frontend Deployment (affynix.ai)

The frontend is configured to deploy to Vercel.

### Setup Steps

1. **Connect Repository** (Already done ✓)
   - Repository is connected to Vercel

2. **Configure Project Settings in Vercel Dashboard:**
   - **Root Directory**: `Website/website_build/frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables:**
   - Add in Vercel Dashboard → Settings → Environment Variables:
     - `VITE_API_URL` = `https://api.affynix.ai`

4. **Domain Configuration:**
   - In Vercel Dashboard → Settings → Domains
   - Add `affynix.ai` and `www.affynix.ai`
   - Follow DNS instructions to point domains to Vercel

### Deployment

Vercel will automatically deploy when you push to the main branch.

## Backend Deployment (api.affynix.ai)

The backend needs to be deployed separately. Options:

### Option 1: Vercel Serverless Functions
- Convert backend to Vercel serverless functions
- Requires restructuring the Express app

### Option 2: VPS/Cloud Server (Recommended)
- Deploy using Docker on a VPS (DigitalOcean, AWS, etc.)
- Use the `deploy.sh` script
- Point `api.affynix.ai` to your server

### Option 3: Railway/Render
- Deploy backend as a Docker container
- Point `api.affynix.ai` to the service

## Admin Interface (admin.affynix.ai)

The admin interface can be:
- Same as backend (if using serverless functions)
- Separate Vercel project
- Same VPS as backend

## Current Configuration

- **Frontend**: Ready for Vercel deployment
- **Backend**: Needs separate deployment (Docker/VPS recommended)
- **API URL**: Configured to `https://api.affynix.ai`

