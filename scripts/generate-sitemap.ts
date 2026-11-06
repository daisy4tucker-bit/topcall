import fs from 'fs';
import path from 'path';
import { generateSitemapXml, getIndexableSitemapEntries, getSitemapStats, generateRobotsTxt, DEFAULT_BASE_URL } from '../src/services/sitemapService';
import { SAMPLE_PROFILES } from '../src/data/mockProfiles';

// Allow overriding base URL via CLI arg: --domain=https://... or env var SITEMAP_BASE_URL
const argDomain = process.argv.find((a) => a.startsWith('--domain='))?.split('=')[1];
const targetDomain = argDomain || process.env.SITEMAP_BASE_URL || DEFAULT_BASE_URL;

console.log('🚀 [Sitemap Generator] Starting automated XML sitemap build...');
console.log(`🌐 [Sitemap Generator] Target Domain: ${targetDomain}`);

try {
  // 1. Generate Sitemap XML with all locations and active profile slugs
  const sitemapXml = generateSitemapXml(targetDomain, SAMPLE_PROFILES);
  const stats = getSitemapStats(targetDomain, SAMPLE_PROFILES);
  const entries = getIndexableSitemapEntries(targetDomain, SAMPLE_PROFILES);

  // 2. Write to public/sitemap.xml
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
  console.log(`✅ [Sitemap Generator] Wrote: ${publicSitemapPath} (${(sitemapXml.length / 1024).toFixed(2)} KB)`);

  // 3. Write to dist/sitemap.xml if dist exists
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, sitemapXml, 'utf-8');
    console.log(`✅ [Sitemap Generator] Wrote: ${distSitemapPath} (${(sitemapXml.length / 1024).toFixed(2)} KB)`);
  }

  // 4. Update robots.txt to ensure reference matches target domain
  const publicRobotsPath = path.join(publicDir, 'robots.txt');
  const robotsContent = generateRobotsTxt(targetDomain);
  fs.writeFileSync(publicRobotsPath, robotsContent, 'utf-8');
  console.log(`✅ [Sitemap Generator] Synchronized: ${publicRobotsPath}`);

  if (fs.existsSync(distDir)) {
    const distRobotsPath = path.join(distDir, 'robots.txt');
    fs.writeFileSync(distRobotsPath, robotsContent, 'utf-8');
    console.log(`✅ [Sitemap Generator] Synchronized: ${distRobotsPath}`);
  }

  // 5. Print Detailed Summary
  console.log('\n📊 [Sitemap Summary]');
  console.log(`   • Total Indexable URLs:  ${stats.totalUrls}`);
  console.log(`   • Country Hubs:          ${stats.countryCount}`);
  console.log(`   • State Hubs:            ${stats.stateCount}`);
  console.log(`   • City Hubs:             ${stats.cityCount}`);
  console.log(`   • Active Profile Slugs:  ${stats.profileCount}`);
  console.log('\n🌟 [Indexed Profile Slugs]');
  entries
    .filter((e) => e.category === 'Profile')
    .forEach((p) => {
      console.log(`   - ${p.url} -> "${p.title}"`);
    });

  console.log('\n🎉 [Sitemap Generator] Complete! Search engines can now crawl all regional silos and profile landing pages.');
} catch (err) {
  console.error('❌ [Sitemap Generator] Failed to generate sitemap:', err);
  process.exit(1);
}
