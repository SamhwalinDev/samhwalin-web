import { Client } from '@notionhq/client';
import { Metadata } from 'next';
import DarkSubscribeSection from '@/components/features/DarkSubscribeSection';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const QUESTION_DB_ID = process.env.NOTION_QUESTION_DB_ID || '2f2d1667aaa3801b9597fd85a6804be8';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Q&A 아카이브 | 삼활인',
  description: '독자들의 질문과 어르신들의 답변을 모았습니다.',
};

async function getAllQnAs() {
  try {
    const response = await notion.databases.query({
      database_id: QUESTION_DB_ID,
      filter: {
        and: [
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

    return response.results.map((page: any) => ({
      id: page.id,
      question: page.properties['질문']?.title?.[0]?.plain_text || '',
      nickname: page.properties['닉네임']?.rich_text?.[0]?.plain_text || '익명',
      answer: page.properties['답변']?.rich_text?.[0]?.plain_text || '',
      createdAt: page.properties['생성일']?.created_time || page.created_time || '',
    }));
  } catch (error) {
    console.error('Failed to fetch Q&As:', error);
    return [];
  }
}

export default async function QnAPage() {
  const qnas = await getAllQnAs();

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-[#FFF8F3]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-text mb-4">
            💬 Q&A 아카이브
          </h1>
          <p className="text-xl text-gray-600">
            독자들의 질문과 어르신들의 답변을 모았습니다
          </p>
        </div>
      </section>

      {/* Q&A List */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {qnas.length > 0 ? (
            <div className="space-y-6">
              {qnas.map((qna) => (
                <div key={qna.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  {/* Question */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                      Q
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">
                        {qna.nickname}님의 질문
                      </p>
                      <p className="text-lg text-text">{qna.question}</p>
                    </div>
                  </div>
                  
                  {/* Answer */}
                  <div className="flex items-start gap-3 pl-11 pt-4 border-t border-gray-100">
                    <span className="w-8 h-8 bg-primary-extra-light rounded-full flex items-center justify-center text-sm font-bold text-primary-dark flex-shrink-0">
                      A
                    </span>
                    <div className="flex-1">
                      <p className="text-text whitespace-pre-line">{qna.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">💭</span>
              <p className="text-gray-500">아직 답변된 질문이 없어요</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Subscribe Section */}
      <DarkSubscribeSection source="Q&A" />
    </main>
  );
}
