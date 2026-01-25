import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const QUESTION_DB_ID = process.env.NOTION_QUESTION_DB_ID || '2f2d1667aaa3801b9597fd85a6804be8';

export async function POST(request: NextRequest) {
  try {
    const { question, nickname, hwalseoId, elderId, hwalseoTitle, elderName } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!hwalseoId) {
      return NextResponse.json({ error: 'HwalseoId is required' }, { status: 400 });
    }

    // Create new page in Question DB
    // Note: Using Korean field names to match existing Notion DB structure
    const response = await notion.pages.create({
      parent: { database_id: QUESTION_DB_ID },
      properties: {
        '질문': {
          title: [{ text: { content: question.trim() } }],
        },
        '닉네임': {
          rich_text: [{ text: { content: nickname?.trim() || '익명' } }],
        },
        '활서': {
          relation: [{ id: hwalseoId }],
        },
        ...(elderId && {
          '어르신': {
            relation: [{ id: elderId }],
          },
        }),
        '상태': {
          select: { name: '대기중' },
        },
        '공개여부': {
          checkbox: false,
        },
      },
    });

    return NextResponse.json({ success: true, id: response.id });
  } catch (error) {
    console.error('Failed to submit question:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}