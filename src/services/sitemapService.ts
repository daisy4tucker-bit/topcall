import { LOCATION_DATA } from '../data/locationHierarchy';
import { SAMPLE_PROFILES } from '../data/mockProfiles';
import { Profile } from '../types';

export interface SitemapEntry {
  path: string;
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
  title: string;
  category: 'Home' | 'Country' | 'State' | 'City' | 'Profile' | 'Informational';
  imageUrl?: string;
  imageCaption?: string;
}

export interface SitemapStats {
  totalUrls: number;
  countryCount: number;
  stateCount: number;
  cityCount: number;
  profileCount: number;
  baseUrl: string;
  generatedAt: string;
}

export const DEFAULT_BASE_URL = 'https://www.topcallgirls.online';

/**
 * Normalizes base URL so there is no trailing slash
 */
function cleanBaseUrl(url: string = DEFAULT_BASE_URL): string {
  return url.replace(/\/+$/, '');
}

/**
 * Returns list of all approved indexable public URLs for the directory
 * Excludes: /admin, login, private data, drafts, suspended profiles
 */
export function getIndexableSitemapEntries(
  baseUrl: string = DEFAULT_BASE_URL,
  customProfiles?: Profile[]
): SitemapEntry[] {
  const base = cleanBaseUrl(baseUrl);
  const now = new Date().toISOString().split('T')[0];
  const entries: SitemapEntry[] = [];

  // 1. Root Directory Homepage
  entries.push({
    path: '/',
    url: `${base}/`,
    lastmod: now,
    changefreq: 'daily',
    priority: '1.0',
    title: 'Top Call Girls — Verified Adult Companions & Escorts Directory',
    category: 'Home',
  });

  // 2. Location Silo Hierarchy: Country -> State -> City
  LOCATION_DATA.forEach((country) => {
    // Country Hub
    entries.push({
      path: `/${country.slug}/`,
      url: `${base}/${country.slug}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: '0.9',
      title: `${country.name} Escorts & Verified Companions Directory`,
      category: 'Country',
    });

    country.states.forEach((state) => {
      // State Hub
      entries.push({
        path: `/${country.slug}/${state.slug}/`,
        url: `${base}/${country.slug}/${state.slug}/`,
        lastmod: now,
        changefreq: 'daily',
        priority: '0.8',
        title: `${state.name} Verified Companions Directory`,
        category: 'State',
      });

      state.cities.forEach((city) => {
        // Metropolitan City Hub (Primary Search Landing Page)
        entries.push({
          path: `/${country.slug}/${state.slug}/${city.slug}/`,
          url: `${base}/${country.slug}/${state.slug}/${city.slug}/`,
          lastmod: now,
          changefreq: 'daily',
          priority: '0.9',
          title: `${city.name}, ${city.stateCode} Escorts & Verified Companions`,
          category: 'City',
        });
      });
    });
  });

  // 3. Published Public Profiles (Strictly active & verified)
  const activeProfilesList = (customProfiles && customProfiles.length > 0
    ? customProfiles
    : SAMPLE_PROFILES
  ).filter((p: any) => {
    // Filter out suspended or unapproved profiles if status property is present
    if (p.status && p.status !== 'published') return false;
    if (p.isPublished === false) return false;
    return Boolean(p.slug);
  });

  activeProfilesList.forEach((profile) => {
    // Resolve absolute image URL for Google image sitemap
    const rawImg = profile.avatarUrl || profile.coverUrl;
    let absoluteImgUrl: string | undefined = undefined;
    if (rawImg) {
      if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
        absoluteImgUrl = rawImg;
      } else {
        absoluteImgUrl = `${base}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
      }
    }

    entries.push({
      path: `/profiles/${profile.slug}`,
      url: `${base}/profiles/${profile.slug}`,
      lastmod: now,
      changefreq: 'daily',
      priority: '0.85',
      title: `${profile.displayName} — Verified Companion in ${profile.city}, ${profile.state}`,
      category: 'Profile',
      imageUrl: absoluteImgUrl,
      imageCaption: `${profile.displayName} — 100% ID Verified Independent Companion in ${profile.city}`,
    });
  });

  return entries;
}

/**
 * Returns summary statistics for SEO reporting
 */
export function getSitemapStats(
  baseUrl: string = DEFAULT_BASE_URL,
  customProfiles?: Profile[]
): SitemapStats {
  const entries = getIndexableSitemapEntries(baseUrl, customProfiles);
  let countryCount = 0;
  let stateCount = 0;
  let cityCount = 0;
  let profileCount = 0;

  LOCATION_DATA.forEach((c) => {
    countryCount++;
    c.states.forEach((s) => {
      stateCount++;
      cityCount += s.cities.length;
    });
  });

  entries.forEach((e) => {
    if (e.category === 'Profile') profileCount++;
  });

  return {
    totalUrls: entries.length,
    countryCount,
    stateCount,
    cityCount,
    profileCount,
    baseUrl: cleanBaseUrl(baseUrl),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generates standard compliant XML sitemap format (sitemap.xml) with Google Image extension
 */
export function generateSitemapXml(
  baseUrl: string = DEFAULT_BASE_URL,
  customProfiles?: Profile[]
): string {
  const entries = getIndexableSitemapEntries(baseUrl, customProfiles);

  const xmlItems = entries
    .map((entry) => {
      const imageNode = entry.imageUrl
        ? `\n    <image:image>
      <image:loc>${escapeXml(entry.imageUrl)}</image:loc>
      <image:title>${escapeXml(entry.title)}</image:title>
      ${entry.imageCaption ? `<image:caption>${escapeXml(entry.imageCaption)}</image:caption>` : ''}
    </image:image>`
        : '';

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${imageNode}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlItems}
</urlset>`;
}

/**
 * Helper to escape XML special entities
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Triggers a client-side file download of the freshly generated sitemap.xml in browser
 */
export function downloadSitemapXml(
  baseUrl: string = DEFAULT_BASE_URL,
  customProfiles?: Profile[],
  filename: string = 'sitemap.xml'
): void {
  if (typeof window === 'undefined') return;

  const xmlContent = generateSitemapXml(baseUrl, customProfiles);
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
  }, 100);
}

/**
 * Generates standard compliant robots.txt with search crawler directives
 */
export function generateRobotsTxt(baseUrl: string = DEFAULT_BASE_URL): string {
  const base = cleanBaseUrl(baseUrl);
  return `# robots.txt for Top Call Girls Platform
# Clean crawl architecture: index high-value regional hubs & verified public profiles
# Disallow administrative, moderation, authentication, and private backend pathways

User-agent: *

# Allow Public Content
Allow: /
Allow: /united-states/
Allow: /canada/
Allow: /profiles/

# Disallow Private & Administrative Endpoints
Disallow: /admin
Disallow: /admin/
Disallow: /admin/*
Disallow: /api/admin/
Disallow: /moderation/
Disallow: /audit-logs/
Disallow: /reports/new

# Crawl Delay to Prevent Server Overload
Crawl-delay: 1

# XML Sitemap Location
Sitemap: ${base}/sitemap.xml
`;
}
