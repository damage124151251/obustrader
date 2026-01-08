# OBUS Trader - Dashboard

Real-time dashboard for the OBUS Trader bot.

## Features

- Live trading statistics
- AI analysis feed in real-time
- Open positions with TP/SL progress bars
- Trade history with animations
- Profit distribution history
- Pixel art theme with OBUS mascot

## Deploy to Vercel

### Option 1: Import from GitHub

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New" > "Project"
4. Import your repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm install -g vercel
cd obus-site
vercel
```

## Environment Variables

Set these in Vercel dashboard (Settings > Environment Variables):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Realtime)
- CSS (Custom pixel art theme)
