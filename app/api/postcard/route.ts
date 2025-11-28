import { NextRequest, NextResponse } from 'next/server';
import { createPostcard } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, elderName, hwalseoSlug, message, amount } = body;

    // 유효성 검사
    if (!name || !email || !elderName || !message) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    const result = await createPostcard({
      name,
      email,
      elderName,
      hwalseoSlug: hwalseoSlug || '',
      message,
      amount: amount || 3000,
    });

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json(
        { error: '저장에 실패했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Postcard API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}