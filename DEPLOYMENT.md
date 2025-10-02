# MenuCraft Deployment Guide

## Overview
- **Backend**: Railway (Node.js server with Anthropic API)
- **Frontend**: Vercel (React/Vite SPA)

---

## Prerequisites

1. **Railway CLI**: Already installed at `/usr/local/bin/railway`
2. **Vercel CLI**: Install with `sudo npm install -g vercel`
3. **Accounts**: Railway account, Vercel account

---

## Part 1: Deploy Backend to Railway

### Step 1: Login to Railway
```bash
cd ~/menucraft
railway login
```
This will open a browser for authentication.

### Step 2: Initialize Railway Project
```bash
railway init
```
- Select "Create new project"
- Name it: **menucraft-backend**

### Step 3: Set Environment Variables
```bash
railway variables set ANTHROPIC_API_KEY=your_anthropic_api_key_here
railway variables set PORT=3001
railway variables set NODE_ENV=production
```

### Step 4: Deploy to Railway
```bash
railway up
```
This will:
- Build the project using Nixpacks
- Install dependencies
- Start the server with `npm run start`
- Deploy to Railway

### Step 5: Get Your Railway Domain
```bash
railway domain
```
Or create a custom domain in Railway dashboard.

**Save this URL!** You'll need it for Vercel configuration.
Example: `https://menucraft-backend.up.railway.app`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (if not installed)
```bash
sudo npm install -g vercel
```

### Step 2: Update vercel.json with Railway URL
Edit `vercel.json` and replace:
```json
"destination": "https://your-railway-backend.up.railway.app/api/:path*"
```
With your actual Railway URL:
```json
"destination": "https://menucraft-backend.up.railway.app/api/:path*"
```

### Step 3: Build the Frontend
```bash
npm run build
```
This creates the `dist/` folder with production assets.

### Step 4: Deploy to Vercel
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Choose your account
- **Link to existing project**: No (first time)
- **Project name**: menucraft
- **Directory**: `./` (current directory)
- **Build command**: Auto-detected (npm run build)
- **Output directory**: dist
- **Development command**: npm run dev

---

## Configuration Files Explained

### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```
- Uses Nixpacks for automatic build detection
- Starts server with `npm run start` (runs `tsx server/index.ts`)
- Auto-restarts on failure

### `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-railway-backend.up.railway.app/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
- Proxies all `/api/*` requests to Railway backend
- Serves SPA with fallback to `index.html`
- Optimizes asset caching

---

## Environment Variables

### Railway (Backend)
| Variable | Value | Purpose |
|----------|-------|---------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Anthropic API access |
| `PORT` | `3001` | Server port (optional, Railway auto-assigns) |
| `NODE_ENV` | `production` | Production mode |

### Vercel (Frontend)
No environment variables needed - all configuration is in `vercel.json`.

---

## Deployment Commands (Quick Reference)

### Railway Backend
```bash
cd ~/menucraft
railway login
railway init
railway variables set ANTHROPIC_API_KEY=your_anthropic_api_key_here
railway up
railway domain
```

### Vercel Frontend
```bash
# Update vercel.json with Railway URL first!
npm run build
vercel --prod
```

---

## Post-Deployment Checklist

- [ ] Railway backend is running (check `railway logs`)
- [ ] Railway domain is accessible (test `https://your-domain.up.railway.app/api/health`)
- [ ] `vercel.json` has correct Railway URL
- [ ] Frontend build completes successfully (`npm run build`)
- [ ] Vercel deployment succeeds
- [ ] Test upload flow on production site
- [ ] Test menu extraction with AI
- [ ] Test template preview and export

---

## Troubleshooting

### Railway Backend Issues
```bash
# View logs
railway logs

# Restart service
railway restart

# Check environment variables
railway variables
```

### Vercel Frontend Issues
```bash
# Check deployment logs
vercel logs

# Redeploy
vercel --prod --force
```

### API Connection Issues
1. Verify Railway domain in `vercel.json`
2. Check CORS settings in `server/index.ts`
3. Ensure Railway service is running
4. Test API endpoint directly: `curl https://your-domain.up.railway.app/api/health`

---

## Updating Deployments

### Update Backend
```bash
# Make changes, then:
railway up
```

### Update Frontend
```bash
# Make changes, then:
npm run build
vercel --prod
```

---

## Custom Domains (Optional)

### Railway
1. Go to Railway dashboard
2. Select your project
3. Go to Settings → Domains
4. Add custom domain
5. Update DNS records as shown

### Vercel
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add custom domain
5. Update DNS records as shown

---

## Monitoring

### Railway
- Dashboard: https://railway.app/dashboard
- Logs: `railway logs` or dashboard
- Metrics: Available in dashboard

### Vercel
- Dashboard: https://vercel.com/dashboard
- Analytics: Built-in
- Logs: `vercel logs` or dashboard

---

## Security Notes

- **API Key**: Stored securely in Railway environment variables
- **CORS**: Configure allowed origins in `server/index.ts`
- **Rate Limiting**: Consider adding rate limiting for API endpoints
- **HTTPS**: Automatically provided by both Railway and Vercel

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Anthropic API**: https://docs.anthropic.com

