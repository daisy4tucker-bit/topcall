import fs from 'fs';
import path from 'path';
import { getIndexableSitemapEntries } from '../src/services/sitemapService';
import { SAMPLE_PROFILES } from '../src/data/mockProfiles';

console.log('📦 [Static Route Generator] Creating static physical entry points for steady refresh...');

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(distDir) || !fs.existsSync(indexHtmlPath)) {
  console.log('⚠️ [Static Route Generator] dist/index.html not found, skipping route prerender.');
  process.exit(0);
}

try {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  const entries = getIndexableSitemapEntries('https://www.topcallgirls.online', SAMPLE_PROFILES);
  let createdCount = 0;

  for (const entry of entries) {
    if (entry.path === '/' || !entry.path) continue;
    const cleanPath = entry.path.replace(/^\/|\/$/g, '');
    const targetDir = path.join(distDir, cleanPath);

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml, 'utf-8');
    createdCount++;
  }

  // Also ensure _redirects is present in dist
  const redirectsSrc = path.join(process.cwd(), 'public', '_redirects');
  const redirectsDest = path.join(distDir, '_redirects');
  if (fs.existsSync(redirectsSrc)) {
    fs.copyFileSync(redirectsSrc, redirectsDest);
    console.log('✅ [Static Route Generator] Copied dist/_redirects (SPA rewrite rule)');
  } else {
    fs.writeFileSync(redirectsDest, '/*    /index.html   200\n', 'utf-8');
    console.log('✅ [Static Route Generator] Created dist/_redirects (SPA rewrite rule)');
  }

  console.log(`🎉 [Static Route Generator] Created ${createdCount} static route directories in dist/`);
  console.log('   All direct URLs (e.g. /profiles/aria-sterling) will load instantly on refresh with zero 404s!');
} catch (err) {
  console.error('❌ [Static Route Generator] Error generating static routes:', err);
  process.exit(1);
}
