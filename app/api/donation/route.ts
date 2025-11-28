import { NextRequest, NextResponse } from 'next/server';
import { createDonation } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, amount, type } = body;

    if (!name || !amount) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    const result = await createDonation({
      name,
      amount,
      type: type || 'oneTime',
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
    console.error('Donation API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}