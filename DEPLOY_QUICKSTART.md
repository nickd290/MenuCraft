# 🚀 MenuCraft - Quick Deployment Guide

## TL;DR - Deploy in 5 Minutes

### Option 1: Use the Deployment Script (Recommended)
```bash
cd ~/menucraft
./deploy.sh
```
Select option 3 to deploy both backend and frontend automatically.

### Option 2: Manual Deployment

#### Backend (Railway)
```bash
cd ~/menucraft
railway login
railway init
railway variables set ANTHROPIC_API_KEY=your_anthropic_api_key_here
railway up
railway domain  # Copy this URL!
```

#### Frontend (Vercel)
```bash
# 1. Update vercel.json with your Railway URL from above
# 2. Build and deploy:
npm run build
sudo npm install -g vercel  # If not installed
vercel --prod
```

---

## Files Created for Deployment

✅ **railway.json** - Railway configuration (already exists)
✅ **vercel.json** - Vercel configuration with API proxy
✅ **deploy.sh** - Interactive deployment script
✅ **.env.example** - Environment variables template
✅ **DEPLOYMENT.md** - Comprehensive deployment guide
✅ **DEPLOY_QUICKSTART.md** - This file

---

## What Happens During Deployment?

### Railway (Backend)
1. Detects Node.js project with Nixpacks
2. Installs dependencies (`npm install`)
3. Starts server with `npm run start` → `tsx server/index.ts`
4. Exposes on Railway domain (e.g., `menucraft-backend.up.railway.app`)
5. Environment variables (ANTHROPIC_API_KEY) available to server

### Vercel (Frontend)
1. Builds React app with Vite (`npm run build`)
2. Outputs to `dist/` directory
3. Serves static files
4. Proxies `/api/*` requests to Railway backend
5. Serves SPA with fallback to `/index.html`

---

## Architecture

```
User Browser
    ↓
Vercel (Frontend - React/Vite)
    ↓ /api/* requests proxied
Railway (Backend - Express + Anthropic API)
    ↓
Anthropic Claude API
```

---

## Important: Update vercel.json

Before deploying to Vercel, update `vercel.json` line 9:

```json
"destination": "https://menucraft-backend.up.railway.app/api/:path*"
```

Replace `menucraft-backend.up.railway.app` with your actual Railway domain from `railway domain` command.

---

## Testing Your Deployment

### 1. Test Backend
```bash
curl https://your-railway-domain.up.railway.app/api/health
```
Should return: `{"status":"ok"}`

### 2. Test Frontend
Visit your Vercel URL and:
- Click "Upload Menu"
- Upload a menu image
- Click "Extract Menu with AI"
- Verify extraction works

---

## Environment Variables

### Railway (Backend)
| Variable | Value | Where Used |
|----------|-------|------------|
| `ANTHROPIC_API_KEY` | Your API key | `server/index.ts` |
| `NODE_ENV` | `production` | Node.js |
| `PORT` | Auto-assigned by Railway | `server/index.ts` |

### Vercel (Frontend)
No environment variables needed. All config in `vercel.json`.

---

## Troubleshooting

### "railway: command not found"
Railway CLI not installed. It should be at `/usr/local/bin/railway`.

### "vercel: command not found"
Install Vercel CLI:
```bash
sudo npm install -g vercel
```

### API requests failing
1. Check Railway is running: `railway logs`
2. Verify Railway domain in `vercel.json`
3. Test API directly: `curl https://your-domain.up.railway.app/api/health`

### Build failing
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Updating After Changes

### Backend Changes
```bash
railway up
```

### Frontend Changes
```bash
npm run build
vercel --prod
```

---

## Monitoring

### Railway
```bash
railway logs          # View logs
railway status        # Check status
railway open          # Open dashboard
```

### Vercel
```bash
vercel logs          # View logs
vercel inspect       # Inspect deployment
```

---

## Cost Estimate

### Railway (Backend)
- **Free tier**: $5 credit/month
- **Backend usage**: ~$0-2/month (depending on traffic)
- Anthropic API calls billed separately

### Vercel (Frontend)
- **Hobby tier**: Free
- Unlimited bandwidth for personal projects
- 100 deployments/day

**Total**: Essentially free for low-medium traffic!

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Get Railway domain
3. ✅ Update `vercel.json` with Railway URL
4. ✅ Deploy frontend to Vercel
5. 🎉 Test your live application!

---

## Support

- **Full Guide**: See `DEPLOYMENT.md`
- **Deployment Script**: Run `./deploy.sh`
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs

