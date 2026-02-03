import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/calendar',
};

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // Detect social media crawlers and bots
  const isBot = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram|slack|facebot|twitterbot|slackbot|telegrambot/i.test(userAgent);

  if (isBot) {
    // Serve HTML with proper Open Graph meta tags for crawlers
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Talk To Astrid</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://daveenci.ai/calendar" />
  <meta property="og:title" content="Talk To Astrid" />
  <meta property="og:description" content="Schedule a casual introductory call with Astrid to explore how we can support your vision." />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://daveenci.ai/calendar" />
  <meta property="twitter:title" content="Talk To Astrid" />
  <meta property="twitter:description" content="Schedule a casual introductory call with Astrid to explore how we can support your vision." />

  <!-- Regular meta -->
  <meta name="description" content="Schedule a casual introductory call with Astrid to explore how we can support your vision." />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=La+Belle+Aurore&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

  <style>
    html { scroll-behavior: smooth; }
    body { background-color: #F5F0E6; color: #222222; }
  </style>

  <meta http-equiv="refresh" content="0;url=/calendar" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  }

  // For regular users, continue to serve the SPA
  return NextResponse.next();
}
