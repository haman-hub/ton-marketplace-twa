# Deployment Guide

## GitHub Setup

1. **Initialize Git Repository**
```bash
git init
git add .
git commit -m "Initial commit: TON Marketplace TWA"
```

2. **Create GitHub Repository**
- Go to GitHub and create a new repository named `ton-marketplace-twa`
- Don't initialize with README (we already have one)

3. **Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/ton-marketplace-twa.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
npm run deploy
```

### Option 2: Vercel Dashboard

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - `VITE_ADMIN_PASSWORD`: `admin123` (or your preferred password)
   - `VITE_APP_NAME`: `TON Marketplace`

4. **Deploy**
   - Click "Deploy"
   - Your app will be available at `https://your-project-name.vercel.app`

## Telegram Bot Setup

1. **Create Bot with BotFather**
   - Message [@BotFather](https://t.me/botfather)
   - Use `/newbot` command
   - Follow the instructions to create your bot

2. **Set Up Mini App**
   - Use `/newapp` command with BotFather
   - Provide your Vercel deployment URL
   - Set app name and description
   - Upload app icon (512x512 PNG)

3. **Configure Bot Menu**
   - Use `/mybots` → Select your bot → Bot Settings → Menu Button
   - Set button text: "Open Marketplace"
   - Set Mini App URL: Your Vercel deployment URL

## Domain Configuration (Optional)

1. **Custom Domain**
   - In Vercel dashboard, go to your project
   - Navigate to Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **HTTPS Certificate**
   - Vercel automatically provides SSL certificates
   - Your app will be accessible via HTTPS

## Environment Variables

Make sure to set these in your Vercel project:

- `VITE_ADMIN_PASSWORD`: Admin panel password
- `VITE_APP_NAME`: Application name

## Testing

1. **Local Testing**
```bash
npm run dev
```

2. **Production Testing**
```bash
npm run build
npm run preview
```

3. **Telegram Testing**
   - Open your bot in Telegram
   - Click the menu button to launch the Mini App
   - Test all functionality within Telegram

## Monitoring

- **Vercel Analytics**: Enable in project settings for usage insights
- **Error Tracking**: Monitor deployment logs in Vercel dashboard
- **Performance**: Use Vercel Speed Insights for performance monitoring

## Updates

To update your deployed app:

1. **Make Changes**
   - Edit your code locally
   - Test changes with `npm run dev`

2. **Deploy Updates**
```bash
git add .
git commit -m "Your update message"
git push origin main
```

3. **Automatic Deployment**
   - Vercel will automatically deploy when you push to main branch
   - Monitor deployment status in Vercel dashboard

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run lint`
   - Verify all dependencies are installed
   - Check build logs in Vercel dashboard

2. **Environment Variables**
   - Ensure all required env vars are set in Vercel
   - Restart deployment after adding new variables

3. **Telegram Integration**
   - Verify HTTPS is working (required for Telegram)
   - Check that your domain is accessible
   - Ensure proper viewport meta tags are set

### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Telegram Bot API**: [core.telegram.org/bots](https://core.telegram.org/bots)
- **React Documentation**: [react.dev](https://react.dev)