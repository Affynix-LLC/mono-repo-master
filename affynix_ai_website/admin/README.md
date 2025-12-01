# Affynix Admin Portal

Admin interface for managing clients, agents, payments, and integrations.

## Architecture

- **Frontend**: React + Vite (this app)
- **Backend API**: `api.affynix.ai` (Express + SQLite + OpenAI)
- **Deployment**: Vercel at `admin.affynix.ai`

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Set in Vercel or `.env.local`:

```
VITE_API_URL=https://api.affynix.ai
```

## Pages

- `/` - Dashboard overview
- `/clients` - Client management (CRUD)
- `/agents` - AI agent configuration
- `/payments` - Payment tracking
- `/intakes` - Intake form submissions
- `/ai-editor` - AI content generation
- `/settings` - App configuration

## Deployment

Deployed to Vercel at `admin.affynix.ai`

```bash
vercel --prod
```
