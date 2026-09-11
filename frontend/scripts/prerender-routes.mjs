/**
 * Writes a static HTML file per crawler-critical route into dist/_prerendered/ (11 Sep 2026, AEO plan).
 *
 * Runs after `vite build` and BEFORE prerender-hero (it needs the untouched `<div id="root"></div>` placeholder).
 * Each file is dist/index.html with the route's markup inside #root and the route's own <title>, description,
 * canonical, Open Graph / Twitter tags and JSON-LD in <head>. vercel.json serves these files for their paths;
 * the same JS bundle then boots and takes over, so the page behaves exactly like the SPA once loaded.
 *
 * Also rewrites public/sitemap.xml entries? No — the sitemap is hand-kept (see public/sitemap.xml); this script
 * only checks that every prerendered path is listed there and fails the build if one is missing.
 */

import { build } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, '.prerender-routes');
const distDir = path.join(root, 'dist');
const indexPath = path.join(distDir, 'index.html');
const targetDir = path.join(distDir, '_prerendered');
const PLACEHOLDER = '<div id="root"></div>';
const SITE = 'https://daveenci.ai';

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function rewriteHead(html, route) {
  const { metadata, structuredData } = route;
  const url = `${SITE}${metadata.path}`;
  const image = `${SITE}/daveenci-og.png`;
  const title = esc(metadata.title);
  const desc = esc(metadata.description);
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${metadata.type || 'website'}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`);
  const extra = [
    metadata.publishedAt ? `<meta property="article:published_time" content="${esc(metadata.publishedAt)}" />` : '',
    metadata.modifiedAt ? `<meta property="article:modified_time" content="${esc(metadata.modifiedAt)}" />` : '',
    metadata.author ? `<meta name="author" content="${esc(metadata.author)}" />` : '',
    `<script id="route-structured-data" type="application/ld+json">${JSON.stringify(structuredData).replaceAll('</', '<\\/')}</script>`,
  ].filter(Boolean).join('\n  ');
  out = out.replace('</head>', `  ${extra}\n</head>`);
  if (!out.includes(image)) throw new Error('prerender-routes: og:image missing from index.html');
  return out;
}

async function main() {
  await build({
    root,
    logLevel: 'error',
    build: {
      ssr: path.join(root, 'prerender', 'routeShells.tsx'),
      outDir,
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: { output: { format: 'es', entryFileNames: 'routeShells.mjs' } },
    },
  });
  const { renderRoutes } = await import(pathToFileURL(path.join(outDir, 'routeShells.mjs')).href);
  const routes = renderRoutes();

  const html = await fs.readFile(indexPath, 'utf8');
  if (!html.includes(PLACEHOLDER)) {
    throw new Error(`prerender-routes: could not find ${PLACEHOLDER} in dist/index.html — run before prerender-hero.`);
  }
  const sitemap = await fs.readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8');
  const vercel = await fs.readFile(path.join(root, '..', 'vercel.json'), 'utf8');

  await fs.mkdir(targetDir, { recursive: true });
  for (const route of routes) {
    if (!sitemap.includes(`<loc>${SITE}${route.path}</loc>`)) {
      throw new Error(`prerender-routes: ${route.path} is not in public/sitemap.xml — add it (crawlers find pages there first)`);
    }
    if (!vercel.includes(`/_prerendered/${route.file}`)) {
      throw new Error(`prerender-routes: vercel.json has no route serving /_prerendered/${route.file} for ${route.path}`);
    }
    const page = rewriteHead(html, route).replace(PLACEHOLDER, `<div id="root">${route.html}</div>`);
    await fs.writeFile(path.join(targetDir, route.file), page, 'utf8');
    console.log(`prerender-routes: ${route.path} → _prerendered/${route.file} (${(Buffer.byteLength(route.html) / 1024).toFixed(1)} kB of markup)`);
  }
  await fs.rm(outDir, { recursive: true, force: true });
}

main().catch((error) => {
  console.error('prerender-routes failed:', error);
  process.exit(1);
});
