import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const QUESTION_DB_ID = process.env.NOTION_QUESTION_DB_ID || '2f2d1667aaa3801b9597fd85a6804be8';

export async function GET(
  request: NextRequest,
  { params }: { params: { hwalseoId: string } }
) {
  try {
    const response = await notion.databases.query({
      database_id: QUESTION_DB_ID,
      filter: {
        and: [
          {
            property: '활서',
            relation: {
              contains: params.hwalseoId,
            },
          },
          {
            property: '상태',
            select: {
              equals: '답변완료',
            },
          },
          {
            property: '공개여부',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: '생성일',
          direction: 'descending',
        },
      ],
    });

    const questions = response.results.map((page: any) => ({
      id: page.id,
      question: page.properties['질문']?.title?.[0]?.plain_text || '',
      nickname: page.properties['닉네임']?.rich_text?.[0]?.plain_text || '익명',
      answer: page.properties['답변']?.rich_text?.[0]?.plain_text || '',
      createdAt: page.properties['생성일']?.created_time || page.created_time || '',
    }));

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
