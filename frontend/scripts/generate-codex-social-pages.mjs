import { readFile, writeFile } from 'node:fs/promises';

const siteUrl = 'https://daveenci.ai';
const briefings = JSON.parse(
  await readFile(new URL('../content/briefings.json', import.meta.url), 'utf8'),
);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

for (const briefing of briefings) {
  const url = `${siteUrl}/codex/${briefing.id}`;
  const title = escapeHtml(briefing.seoTitle);
  const description = escapeHtml(briefing.description);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="canonical" href="${url}" />
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${siteUrl}/daveenci-og.png" />
  <meta property="article:published_time" content="${briefing.publishedAt}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${siteUrl}/daveenci-og.png" />
</head>
<body>
  <main>
    <article>
      <p>${escapeHtml(briefing.category)} · Issue ${escapeHtml(briefing.issueNo)}</p>
      <h1>${escapeHtml(briefing.title)}</h1>
      <p>${description}</p>
      <a href="${url}">Read the full briefing on DaVeenci</a>
    </article>
  </main>
</body>
</html>`;

  await writeFile(
    new URL(`../public/codex-${briefing.id}-og.html`, import.meta.url),
    html,
    'utf8',
  );
}
