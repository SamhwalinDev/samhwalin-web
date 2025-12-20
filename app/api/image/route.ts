import { NextRequest, NextResponse } from 'next/server';

// Shared proxy logic
async function proxyImage(url: string | null): Promise<NextResponse> {
  console.log('[Image Proxy] Received URL length:', url?.length);

  if (!url) {
    console.log('[Image Proxy] ERROR: No URL provided');
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Decode URL - handle potential double-encoding from browser/Next.js
  // But be careful: S3 signed URLs must be fetched EXACTLY as provided by Notion
  let fetchUrl: string;
  try {
    fetchUrl = url;
    let prevUrl = '';
    let iterations = 0;
    const maxIterations = 10;

    // Keep decoding until the URL stops changing
    while (fetchUrl !== prevUrl && iterations < maxIterations) {
      prevUrl = fetchUrl;
      try {
        fetchUrl = decodeURIComponent(fetchUrl);
      } catch {
        // If decoding fails, use the previous valid URL
        fetchUrl = prevUrl;
        break;
      }
      iterations++;
    }

    console.log('[Image Proxy] Decoded URL (iterations:', iterations, ')');
    console.log('[Image Proxy] FULL URL:', fetchUrl);

    // Validate final URL
    new URL(fetchUrl);
  } catch (error) {
    console.error('[Image Proxy] ERROR: Invalid URL after decoding:', error);
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // For S3 signed URLs, re-encode special characters in query parameter values
  // Node.js fetch decodes the URL internally, which breaks AWS signatures
  // The signature was computed against encoded values, so we must re-encode
  const isS3Url =
    fetchUrl.includes('prod-files-secure.s3') ||
    fetchUrl.includes('s3.us-west-2.amazonaws.com');

  if (isS3Url) {
    try {
      const urlObj = new URL(fetchUrl);
      // Re-encode query string values to preserve + and / characters
      const encodedSearch = urlObj.search
        .substring(1) // Remove leading ?
        .split('&')
        .map((param) => {
          const eqIndex = param.indexOf('=');
          if (eqIndex === -1) return param;
          const key = param.substring(0, eqIndex);
          const value = param.substring(eqIndex + 1);
          // Re-encode special characters that Node fetch would decode
          const encodedValue = value
            .replace(/\+/g, '%2B') // Plus signs
            .replace(/\//g, '%2F'); // Forward slashes in tokens
          return `${key}=${encodedValue}`;
        })
        .join('&');

      fetchUrl = `${urlObj.origin}${urlObj.pathname}?${encodedSearch}`;
      console.log('[Image Proxy] Re-encoded URL for S3');
    } catch {
      console.log('[Image Proxy] URL parsing failed, using decoded URL');
    }
  }

  // Check if it's an image that needs proxying
  const shouldProxy =
    fetchUrl.includes('notion.so') ||
    fetchUrl.includes('s3.us-west-2.amazonaws.com') ||
    fetchUrl.includes('prod-files-secure') ||
    fetchUrl.includes('unsplash.com') ||
    fetchUrl.includes('images.unsplash.com');

  if (!shouldProxy) {
    console.log('[Image Proxy] Redirecting to original URL');
    return NextResponse.redirect(fetchUrl);
  }

  try {
    console.log('[Image Proxy] Fetching image...');

    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SamhwalinBot/1.0)',
      },
    });

    console.log('[Image Proxy] Fetch response status:', response.status);

    if (!response.ok) {
      console.error('[Image Proxy] ERROR: Fetch failed with status', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch image', status: response.status },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    console.log('[Image Proxy] Success! Size:', imageBuffer.byteLength, 'bytes');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, s-maxage=2592000',
        'CDN-Cache-Control': 'public, max-age=2592000',
        'Vercel-CDN-Cache-Control': 'public, max-age=2592000',
      },
    });
  } catch (error) {
    console.error('[Image Proxy] EXCEPTION:', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}

// GET handler for short URLs (backward compatibility)
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  console.log('[Image Proxy] GET request');
  return proxyImage(url);
}

// POST handler for long URLs (avoids URL length limits)
export async function POST(request: NextRequest) {
  console.log('[Image Proxy] POST request');
  try {
    const body = await request.json();
    const url = body.url;
    return proxyImage(url);
  } catch (error) {
    console.error('[Image Proxy] POST body parse error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
