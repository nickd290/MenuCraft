#!/bin/bash

# MenuCraft Deployment Script
# This script helps deploy MenuCraft to Railway (backend) and Vercel (frontend)

set -e  # Exit on error

echo "🚀 MenuCraft Deployment Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the menucraft directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Deployment Options:${NC}"
echo "1. Deploy Backend to Railway"
echo "2. Deploy Frontend to Vercel"
echo "3. Deploy Both (Backend first, then Frontend)"
echo "4. Build Frontend Only"
echo "5. Exit"
echo ""
read -p "Select an option (1-5): " option

case $option in
    1)
        echo -e "${GREEN}🚂 Deploying Backend to Railway...${NC}"
        echo ""

        # Check if railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo -e "${RED}❌ Railway CLI not found. Please install it first.${NC}"
            exit 1
        fi

        # Check if logged in
        echo "Checking Railway login status..."
        if ! railway whoami &> /dev/null; then
            echo "Please login to Railway:"
            railway login
        fi

        # Set environment variables
        echo ""
        echo -e "${YELLOW}Setting environment variables...${NC}"
        railway variables set ANTHROPIC_API_KEY=your_anthropic_api_key_here
        railway variables set NODE_ENV=production

        # Deploy
        echo ""
        echo -e "${YELLOW}Deploying to Railway...${NC}"
        railway up

        echo ""
        echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
        echo ""
        echo "To get your domain, run: railway domain"
        ;;

    2)
        echo -e "${GREEN}▲ Deploying Frontend to Vercel...${NC}"
        echo ""

        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
            sudo npm install -g vercel
        fi

        # Check Railway domain
        echo ""
        echo -e "${YELLOW}⚠️  IMPORTANT: Before deploying to Vercel...${NC}"
        echo "1. Make sure your Railway backend is deployed"
        echo "2. Update vercel.json with your Railway domain"
        echo ""
        read -p "Have you updated vercel.json with your Railway URL? (y/n): " updated

        if [ "$updated" != "y" ]; then
            echo -e "${RED}❌ Please update vercel.json first, then run this script again.${NC}"
            exit 1
        fi

        # Build
        echo ""
        echo -e "${YELLOW}Building frontend...${NC}"
        npm run build

        # Deploy
        echo ""
        echo -e "${YELLOW}Deploying to Vercel...${NC}"
        vercel --prod

        echo ""
        echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
        ;;

    3)
        echo -e "${GREEN}🚀 Deploying Full Stack...${NC}"
        echo ""

        # Deploy backend first
        echo -e "${YELLOW}Step 1: Deploying Backend to Railway...${NC}"
        $0 1  # Recursively call option 1

        echo ""
        read -p "Press Enter to continue to frontend deployment..."

        # Deploy frontend
        echo ""
        echo -e "${YELLOW}Step 2: Deploying Frontend to Vercel...${NC}"
        $0 2  # Recursively call option 2
        ;;

    4)
        echo -e "${GREEN}🔨 Building Frontend...${NC}"
        echo ""
        npm run build
        echo ""
        echo -e "${GREEN}✅ Frontend built successfully!${NC}"
        echo "Build output is in the 'dist' directory"
        ;;

    5)
        echo "Exiting..."
        exit 0
        ;;

    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Check your Railway logs: railway logs"
echo "2. Visit your Vercel deployment"
echo "3. Test the upload and AI extraction features"
echo ""
