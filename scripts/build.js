import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const binDir = path.join(rootDir, 'node_modules', '.bin');

// Ensure node_modules/.bin is first in PATH across any subshell / environment
const env = {
  ...process.env,
  PATH: `${binDir}:${process.env.PATH || ''}`
};

function runStep(title, command) {
  console.log(`\n========================================`);
  console.log(`▶ [Build Step] ${title}`);
  console.log(`  Executing: ${command}`);
  console.log(`========================================`);
  try {
    execSync(command, {
      cwd: rootDir,
      env,
      stdio: 'inherit'
    });
  } catch (err) {
    console.error(`❌ Failed at step: ${title}`);
    throw err;
  }
}

async function main() {
  const tsxBin = fs.existsSync(path.join(binDir, 'tsx'))
    ? path.join(binDir, 'tsx')
    : 'npx tsx';

  const viteBin = fs.existsSync(path.join(binDir, 'vite'))
    ? path.join(binDir, 'vite')
    : 'npx vite';

  // Step 1: Generate XML Sitemap and verify robots.txt
  runStep('Generate Sitemap & Robots.txt', `"${tsxBin}" scripts/generate-sitemap.ts`);

  // Step 2: Build Vite production bundle
  try {
    runStep('Build Vite Client Bundle', `"${viteBin}" build`);
  } catch (viteCliErr) {
    console.warn('⚠️ CLI invocation failed, falling back to Vite JavaScript API...');
    const { build } = await import('vite');
    await build({
      root: rootDir,
      configFile: path.join(rootDir, 'vite.config.ts')
    });
    console.log('✅ Vite JavaScript API build completed successfully.');
  }

  // Step 3: Generate static route entry points for steady refreshes & zero 404s
  runStep('Generate Static Routes for Steady Refresh', `"${tsxBin}" scripts/generate-routes.ts`);

  console.log('\n✨ Production build finished successfully!');
}

main().catch((err) => {
  console.error('\n❌ Build process terminated with error:', err.message || err);
  process.exit(1);
});
