import { NextRequest, NextResponse } from 'next/server';
import { createSubscriber } from '@/lib/notion';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'footer' } = body;

    console.log('Subscribe API called:', { email, source });

    // 이메일 필수 체크
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'email_required' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'invalid_email' },
        { status: 400 }
      );
    }

    // 소스 검증
    const validSources = ['footer', 'homepage', 'hwalseo'];
    if (!validSources.includes(source)) {
      return NextResponse.json(
        { success: false, error: 'invalid_source' },
        { status: 400 }
      );
    }

    // 구독자 생성
    const result = await createSubscriber({
      email: email.toLowerCase().trim(),
      source,
    });

    console.log('Subscribe result:', result);

    if (!result.success) {
      if (result.error === 'duplicate') {
        return NextResponse.json(
          { success: false, error: 'duplicate' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: result.error || 'server_error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    );
  }
}
