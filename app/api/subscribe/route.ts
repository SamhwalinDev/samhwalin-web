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

    // 소스 검증 (한국어 값도 허용)
    const validSources = ['footer', 'homepage', 'hwalseo', '홈페이지', '활서페이지', '푸터', '프로젝트소개', '프로필페이지', '해답찾기', 'Q&A'];
    if (!validSources.includes(source)) {
      return NextResponse.json(
        { success: false, error: 'invalid_source', message: '올바른 구독 출처가 아닙니다.' },
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
          { success: false, error: 'duplicate', message: '이미 구독 중인 이메일입니다.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: result.error || 'server_error', message: '구독 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: '구독이 완료되었습니다!' });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    );
  }
}
