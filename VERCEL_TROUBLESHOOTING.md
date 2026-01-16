# AI Study - Vercel Deployment Troubleshooting

## Force Vercel to Rebuild

If you're seeing the same build error even after pushing fixes, Vercel might be using cached code. Here's how to force a fresh build:

### Option 1: Clear Build Cache

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Scroll to **Build & Development Settings**
4. Find **"Build Cache"**
5. Click **"Clear Build Cache"**
6. Go back to **Deployments**
7. Click **Redeploy** on the latest deployment

### Option 2: Trigger Fresh Deployment

1. Make a small change to trigger new deployment:
   ```bash
   echo "# Force rebuild" >> README.md
   git add README.md
   git commit -m "Force Vercel rebuild"
   git push origin main
   ```

2. Vercel will automatically deploy with cleared cache

### Option 3: Check Environment Variables

Make sure these are set in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Verify these exist for **Production**:
   - `MONGODB_URI`
   - `GOOGLE_API_KEY`  
   - `JWT_SECRET`

If any are missing, add them and redeploy.

## Verify Latest Code is Deployed

Check the deployment commit hash matches your latest push:
- In Vercel dashboard, click on the deployment
- Check the **"Source"** section shows commit `f054a2d`

If it shows an older commit, Vercel isn't picking up your latest code!
