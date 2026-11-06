# Production Deployment Guide — AURA Directory Platform

This guide outlines the production deployment process for the AURA Directory Platform (Vite SPA + PostgreSQL / Supabase).

---

## 1. Create & Connect GitHub Repository

1. Initialize git locally (if not already initialized):
   ```bash
   git init
   git add .
   git commit -m "feat: complete MVP directory platform with technical SEO, auth and storage"
   ```
2. Create a new repository on GitHub (e.g., `aura-directory-mvp`).
3. Connect the remote and push to the `main` branch:
   ```bash
   git remote add origin https://github.com/YOUR_ORGANIZATION/aura-directory-mvp.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Connect & Provision Supabase Project

1. Log into [supabase.com](https://supabase.com) and click **New project**.
2. Select an organization, name your project (e.g., `aura-directory-prod`), choose a secure database password, and select the region closest to your primary user base (e.g., `us-east-1` or `us-west-1`).
3. Under **Project Settings &rarr; API**, locate:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public API Key** (`eyJhbGciOi...`)
   - *(Note: Do NOT expose the `service_role` key to client applications!)*

---

## 3. Configure Production Database & RLS

1. In the Supabase Dashboard, navigate to the **SQL Editor**.
2. Open `/supabase/schema.sql` from this codebase.
3. Paste the contents into the SQL Editor and click **Run**.
4. This script sets up:
   - Tables: `countries`, `states_provinces`, `cities`, `profiles`, `profile_photos`, `reports`, `content_removal_requests`, `moderation_actions`, `audit_logs`
   - Constraints: 18+ age checks (`CHECK (age >= 18)`)
   - Indexes: PostgreSQL Trigram (`pg_trgm`) text search indexes, slug indexes, and composite geographic hierarchy indexes
   - Row Level Security (RLS): Public read access restricted exclusively to `is_published = true` items; admin operations gated on authenticated JWT claims

---

## 4. Configure Supabase Storage

1. Navigate to **Storage** in the Supabase Dashboard.
2. Verify or create the bucket named `profile-photos`:
   - Set **Public Bucket**: Enabled (for CDN delivery of authorized photography).
   - Set **File size limit**: `5242880` (5 MB).
   - Set **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`.
3. Verify the Storage RLS Policies:
   - **Public Read**:
     ```sql
     CREATE POLICY "Public Read Published Photos"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'profile-photos');
     ```
   - **Admin Upload & Delete**:
     ```sql
     CREATE POLICY "Admin Manage Photos"
     ON storage.objects FOR ALL
     TO authenticated
     USING (bucket_id = 'profile-photos');
     ```

---

## 5. Configure Authentication & Redirect URLs

1. In Supabase, navigate to **Authentication &rarr; URL Configuration**.
2. Set the **Site URL** to your production domain:
   - Example: `https://aura-directory.com`
3. Add the following to **Redirect URLs**:
   - `https://aura-directory.com`
   - `https://aura-directory.com/admin`
   - `https://aura-directory.com/admin/*`
   - `http://localhost:3000` (for local development)

---

## 6. Configure Production Hosting (e.g., Vercel / Cloudflare Pages / Cloud Run)

### Option A: Vercel (Recommended for Vite SPAs)
1. In the Vercel Dashboard, click **Add New &rarr; Project** and import the GitHub repository.
2. Configure Build & Output settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Configure **Environment Variables**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   APP_URL=https://aura-directory.com
   ```
4. Click **Deploy**.

---

## 7. Configure Custom Domain & HTTPS

1. In your hosting provider (e.g., Vercel / Cloudflare), navigate to **Domains** and add your custom domain:
   - Apex domain: `aura-directory.com`
   - Subdomain: `www.aura-directory.com` (configured to redirect to apex or vice versa)
2. In your DNS provider (e.g., Cloudflare, Namecheap, Google Domains), add the required records:
   - **A Record**: Point `@` to hosting provider IP (e.g., `76.76.21.21` for Vercel)
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
3. **HTTPS Verification**:
   - Automated TLS/SSL certificates are provisioned automatically via Let's Encrypt / edge proxy.
   - Enforce HTTP-to-HTTPS automatic 301 redirection.

---

## 8. Post-Deployment Services Configuration

### A. Sitemap & robots.txt Verification
- Verify that `https://aura-directory.com/robots.txt` returns `Allow: /` and `Disallow: /admin`.
- Verify that `https://aura-directory.com/sitemap.xml` lists all 28 canonical location and profile URLs.

### B. Google Search Console
1. Visit [Google Search Console](https://search.google.com/search-console).
2. Add your property (Domain verification via DNS TXT record).
3. Navigate to **Sitemaps** &rarr; Submit `https://aura-directory.com/sitemap.xml`.
4. Run the **URL Inspection Tool** on your homepage and top city pages (e.g., `/united-states/california/los-angeles/`) to verify clean crawlability.

### C. Analytics (Privacy-Conscious)
- Recommended: Privacy-first analytics that require no tracking cookies (e.g., Cloudflare Web Analytics, Plausible, or Umami).
- If using Google Analytics 4 (GA4), place the measurement tag in `index.html` with anonymized IP and explicit consent controls.

### D. Error Monitoring
- Integrate Sentry (`@sentry/react`) by initializing it in `src/main.tsx` with your production DSN to monitor client-side uncaught exceptions in production.

---

## 9. Comprehensive Production Testing Checklist

Execute the following verification tests on the live production URL:

| # | Test Area | Verification Procedure | Expected Result |
|---|---|---|---|
| 1 | **Homepage** | Visit `https://your-domain.com/` | Loads instantly, verified badges render, zero console errors. |
| 2 | **Location Silos** | Click country &rarr; state &rarr; city (`/united-states/california/los-angeles/`) | Location header, radius filter, breadcrumbs, and city profiles render cleanly. |
| 3 | **Profile Pages** | Visit `/profiles/elena-vance` | Photo carousel, rates, services, contact channels, and Person JSON-LD render. |
| 4 | **Admin Login** | Navigate to `/admin` &rarr; Enter admin credentials | `AdminAuthGate` validates session, establishes 8h token TTL, and opens CMS dashboard. |
| 5 | **Profile Creation** | Click **Create New Profile** &rarr; Complete form &rarr; Publish | New profile created, assigned to location hierarchy, and logged to audit trail. |
| 6 | **Photo Uploads** | Upload a photo under **Photos** tab | Validates MIME type, enforces 18+ consent gate, compresses to WebP, and updates gallery. |
| 7 | **Publishing Toggle**| Change profile from Published &rarr; Draft | Profile disappears immediately from public directory and search results. |
| 8 | **Search & Filters** | Search for "dinner", filter by city, toggle "Verified Only" | Search results update in real-time with zero lag or layout shift. |
| 9 | **Safety Reporting** | Click "Report Profile" &rarr; Submit inquiry | Report saved to `reports` table; rate limiter restricts rapid duplicate submissions. |
| 10 | **Content Removal**| Submit DMCA notice from footer | Record created in `content_removal_requests` queue for admin review. |
| 11 | **Mobile Layout** | Test on mobile viewport (< 640px) | Bottom navigation bar, responsive filters, and drawer menus function smoothly. |
| 12 | **SEO Verification** | Inspect `<head>` on homepage and city page | Unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, and Schema.org present. |
| 13 | **Security Guards** | Log out &rarr; Try loading `/admin` directly | Intercepted with login gate; private data and API mutations return 403 Forbidden. |
