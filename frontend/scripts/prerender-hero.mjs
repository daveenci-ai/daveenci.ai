/**
 * Injects a statically rendered hero into dist/index.html after the client
 * build, so the LCP element paints without waiting for React to boot.
 *
 * Runs a small separate SSR bundle (Vite handles the TSX, the CSS imports and
 * the asset resolution), renders both hero variants to static markup, and
 * writes them inside #root. React's createRoot() replaces the whole subtree on
 * mount; because the replacement is the same content at the same size, the LCP
 * entry recorded for the shell stands.
 */

import { build } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, '.prerender');
const indexPath = path.join(root, 'dist', 'index.html');
const PLACEHOLDER = '<div id="root"></div>';

async function main() {
  await build({
    root,
    logLevel: 'error',
    build: {
      ssr: path.join(root, 'prerender', 'heroShell.tsx'),
      outDir,
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: {
        output: { format: 'es', entryFileNames: 'heroShell.mjs' },
      },
    },
  });

  const { renderHeroShell } = await import(
    pathToFileURL(path.join(outDir, 'heroShell.mjs')).href
  );
  const shell = renderHeroShell();

  const html = await fs.readFile(indexPath, 'utf8');
  if (!html.includes(PLACEHOLDER)) {
    throw new Error(
      `prerender-hero: could not find ${PLACEHOLDER} in dist/index.html. ` +
        'The client build output changed shape — update this script rather ' +
        'than shipping a page with no hero shell.',
    );
  }

  // Vercel rewrites every path to this one file, so without a guard the
  // homepage hero would paint on /codex/..., /shootos, and every other deep
  // link before React swapped in the real page. This runs during parse,
  // before first paint, and costs nothing on the homepage.
  const guard =
    "<script>if(location.pathname!=='/'){var s=" +
    "document.getElementById('hero-shell');if(s)s.remove();}</script>";

  await fs.writeFile(
    indexPath,
    html.replace(PLACEHOLDER, `<div id="root">${shell}${guard}</div>`),
    'utf8',
  );
  await fs.rm(outDir, { recursive: true, force: true });

  const kb = (Buffer.byteLength(shell, 'utf8') / 1024).toFixed(1);
  console.log(`prerender-hero: injected ${kb} kB of static hero markup`);
}

main().catch((error) => {
  console.error('prerender-hero failed:', error);
  process.exit(1);
});
