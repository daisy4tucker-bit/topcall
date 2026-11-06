# Deploying on Render.com

This project is fully configured for Render. A `render.yaml` Blueprint specification has been added to automatically configure your build settings and SPA routing rewrites.

---

## Method 1: Connect via GitHub (Recommended & Easiest)

### Step 1: Push or Sync to GitHub
1. Make sure your repository is pushed to your GitHub account (e.g. `github.com/your-username/aura-directory`).

### Step 2: Create a New Static Site on Render
1. Log into your dashboard at **[render.com](https://dashboard.render.com/)**.
2. Click **New +** in the top right and select **Static Site**.
3. Connect your GitHub account and select this repository.

### Step 3: Configure Build Settings
Render will auto-detect settings or you can confirm:
* **Name**: `aura-directory` (or any name you prefer)
* **Branch**: `main`
* **Build Command**: `npm install && npm run build`
* **Publish Directory**: `dist`

### Step 4: Add the SPA Redirect Rule (Crucial for routing)
To ensure direct visits to `/profiles/aria-sterling` or `/united-states/...` don't 404:
1. Under your Static Site in Render, go to **Redirects/Rewrites**.
2. Click **Add Rule**:
   * **Type**: `Rewrite`
   * **Source**: `/*`
   * **Destination**: `/index.html`
*(Note: If you deploy via Render Blueprint using `render.yaml`, this rewrite rule is created automatically).*

3. Click **Create Static Site**. Render will build and deploy your app in under 60 seconds with a free `https://your-app.onrender.com` URL.

---

## Method 2: 1-Click Blueprint Deploy

1. In Render Dashboard, click **New +** &rarr; **Blueprint**.
2. Connect your GitHub repository containing `render.yaml`.
3. Render reads `render.yaml` and sets up the Static Site, build commands, and redirect rules automatically!

---

## Connecting Your Custom Domain on Render

Once your site is deployed:
1. In your Render Static Site Dashboard, go to **Settings &rarr; Custom Domains**.
2. Click **Add Custom Domain** and enter your domain (e.g., `www.yourdomain.com` or `yourdomain.com`).
3. Render will display the DNS records you need to add at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
   * **For `www` (Subdomain)**: CNAME pointing to `your-app.onrender.com`
   * **For apex domain (`example.com`)**: ANAME / ALIAS or A record pointing to Render's IP address.
4. Render automatically provisions a free SSL certificate (HTTPS) as soon as the DNS records propagate.
