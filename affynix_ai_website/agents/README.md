# Affynix Agents Website

Agent sales and marketing site for Affynix, deployed at `agents.affynix.ai`.

## Features

- ✅ Full agent sales pages (Home, Agents, Pricing, Consulting)
- ✅ Intake forms connected to backend API
- ✅ OpenAI Assistant chat widget
- ✅ ROI Calculator
- ✅ Responsive design

## Running the app

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Building the app

```bash
npm run build
```

Output will be in `dist/` directory.

## Environment Variables

Create a `.env` file (see `.env.example`):

```bash
VITE_API_URL=https://api.affynix.ai
VITE_OPENAI_ASSISTANT_ID=your_assistant_id_here  # Optional
```

## API Integration

All forms and data operations connect to `api.affynix.ai`:
- Intake submissions → `POST /api/entities/IntakeSubmission`
- Function invocations → `POST /api/functions/:functionName`
- Assistant chat → `POST /api/assistant` (if configured)

## Deployment

See `DEPLOYMENT.md` for Vercel deployment instructions.

## Pages

- `/` - Home page with hero and agent previews
- `/Agents` - Detailed agent information
- `/Pricing` - Pricing plans
- `/Consulting` - Consulting intake form
- `/Calculator` - ROI calculator
- `/Onboarding` - Client onboarding flow
