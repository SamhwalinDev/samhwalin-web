import { NextRequest, NextResponse } from 'next/server';

// Sentry tunnel endpoint to bypass ad blockers
// https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option

const SENTRY_HOST = 'sentry.io';
const SENTRY_PROJECT_IDS = process.env.SENTRY_PROJECT_ID
  ? [process.env.SENTRY_PROJECT_ID]
  : [];

export async function POST(request: NextRequest) {
  try {
    const envelope = await request.text();
    const pieces = envelope.split('\n');

    // Parse the envelope header to get the DSN
    const header = JSON.parse(pieces[0]);
    const dsn = new URL(header.dsn);
    const projectId = dsn.pathname.replace('/', '');

    // Validate the project ID if configured
    if (SENTRY_PROJECT_IDS.length > 0 && !SENTRY_PROJECT_IDS.includes(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 403 }
      );
    }

    // Forward the envelope to Sentry
    const sentryUrl = `https://${SENTRY_HOST}/api/${projectId}/envelope/`;

    const response = await fetch(sentryUrl, {
      method: 'POST',
      body: envelope,
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
      },
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Sentry tunnel error:', error);
    return NextResponse.json(
      { error: 'Failed to tunnel request' },
      { status: 500 }
    );
  }
}
