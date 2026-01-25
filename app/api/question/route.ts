import { NextRequest, NextResponse } from 'next/server';
import { createQuestion } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { question, nickname, hwalseoId, elderId } = body;

    if (!question || !hwalseoId) {
      return NextResponse.json(
        { error: 'Question and hwalseoId are required' },
        { status: 400 }
      );
    }

    const result = await createQuestion({
      question,
      nickname: nickname || '익명',
      hwalseoId,
      elderId,
    });

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}