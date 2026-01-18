# Deployment Guide

This guide will help you deploy the Artwork Data Table Application to various platforms.

## Prerequisites

1. Ensure you have Node.js (v16 or higher) installed
2. Run `npm install` to install all dependencies
3. Test the build locally: `npm run build`

## Environment Variables

Create a `.env` file in the root directory (optional, defaults are provided):

```env
VITE_API_BASE_URL=https://api.artic.edu/api/v1/artworks
```

**Note**: The application will work with default values if no `.env` file is provided.

## Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

## Deployment Options

### 1. Netlify

**Option A: Deploy via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

**Option B: Deploy via Git**
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Netlify will automatically detect the `netlify.toml` configuration
4. Build command: `npm run build`
5. Publish directory: `dist`

**Configuration**: The `netlify.toml` file is already configured with:
- Build command and publish directory
- SPA routing redirects
- Security headers
- Asset caching

### 2. Vercel

**Option A: Deploy via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Option B: Deploy via Git**
1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel dashboard
3. Vercel will automatically detect the `vercel.json` configuration
4. Framework preset: Vite
5. Build command: `npm run build`
6. Output directory: `dist`

**Configuration**: The `vercel.json` file includes:
- Build configuration
- SPA routing rewrites
- Security headers
- Asset caching

### 3. Cloudflare Pages

**Option A: Deploy via Wrangler CLI**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy dist
```

**Option B: Deploy via Git**
1. Push your code to GitHub/GitLab
2. Connect your repository in Cloudflare Pages dashboard
3. Build configuration:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add a custom domain (optional)

**Note**: Cloudflare Pages automatically handles SPA routing.

### 4. GitHub Pages

1. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json` scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. Update `vite.config.ts` to include base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### 5. AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload `dist` folder contents to S3 bucket
3. Configure S3 bucket for static website hosting
4. Set up CloudFront distribution
5. Configure error pages to redirect to `index.html` (for SPA routing)

### 6. Any Static Hosting Provider

1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your hosting provider
3. Ensure your hosting provider supports:
   - Client-side routing (redirects all routes to `index.html`)
   - HTTPS
   - Gzip compression (recommended)

## Post-Deployment Checklist

- [ ] Verify the application loads correctly
- [ ] Test pagination functionality
- [ ] Test row selection features
- [ ] Verify API calls are working (check browser console)
- [ ] Test on different devices/browsers
- [ ] Verify HTTPS is enabled
- [ ] Check that security headers are applied (use securityheaders.com)
- [ ] Test performance (use Lighthouse)

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

### Routing Issues
- Ensure your hosting provider is configured to redirect all routes to `index.html`
- Check the deployment platform's documentation for SPA routing configuration

### API Errors
- Verify the API endpoint is accessible
- Check CORS settings if needed
- Verify environment variables are set correctly in your deployment platform

### Performance Issues
- Enable gzip/brotli compression on your hosting provider
- Verify CDN is configured (if using CloudFront/Cloudflare)
- Check that assets are being cached properly

## Environment-Specific Configuration

### Development
```bash
npm run dev
```

### Production Preview (Local)
```bash
npm run build
npm run preview
```

### Production Build
```bash
npm run build:prod
```

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
