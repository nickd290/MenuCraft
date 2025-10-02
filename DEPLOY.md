# Deploying MenuCraft to Railway

## Prerequisites
- Railway CLI installed: `npm install -g @railway/cli`
- Railway account: https://railway.app

## Deployment Steps

### 1. Login to Railway
```bash
railway login
```
This will open your browser for authentication.

### 2. Initialize Railway Project
```bash
railway init
```
- Choose "Create new project"
- Give it a name (e.g., "menucraft")

### 3. Set Environment Variables
```bash
railway variables set ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 4. Deploy
```bash
railway up
```

### 5. Get Your Deployment URL
```bash
railway domain
```

## Important Notes

- **Build Command**: `npm run build` (automatically detected)
- **Start Command**: `npm start` (runs the Express server)
- **Port**: Railway automatically sets `PORT` environment variable
- **Static Files**: The server serves the built React app from `dist/`

## Environment Variables Required

- `ANTHROPIC_API_KEY` - Your Anthropic API key for AI features
- `PORT` - Automatically set by Railway

## Monitoring

```bash
# View logs
railway logs

# Check service status
railway status
```

## Troubleshooting

If deployment fails:
1. Check logs: `railway logs`
2. Verify build completed: `npm run build` locally
3. Ensure environment variables are set: `railway variables`
