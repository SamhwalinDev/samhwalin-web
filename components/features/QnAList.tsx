'use client';

import { useState, useEffect } from 'react';

interface QnA {
  id: string;
  question: string;
  nickname: string;
  answer: string;
  createdAt: string;
}

interface QnAListProps {
  hwalseoId: string;
  elderName: string;
}

export default function QnAList({ hwalseoId, elderName }: QnAListProps) {
  const [qnas, setQnas] = useState<QnA[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQnAs() {
      try {
        const res = await fetch(`/api/question/${hwalseoId}`);
        if (res.ok) {
          const data = await res.json();
          setQnas(data);
        }
      } catch (error) {
        console.error('Failed to fetch Q&As:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQnAs();
  }, [hwalseoId]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">로딩 중...</div>;
  }

  if (qnas.length === 0) {
    return null; // 답변 없으면 섹션 숨김
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">
        💬 독자 Q&A
      </h3>
      
      <div className="space-y-4">
        {qnas.map((qna) => (
          <div key={qna.id} className="bg-white rounded-2xl p-6 border border-gray-100">
            {/* Question */}
            <div className="flex items-start gap-3 mb-4">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                Q
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">
                  {qna.nickname}님의 질문
                </p>
                <p className="text-gray-900">{qna.question}</p>
              </div>
            </div>
            
            {/* Answer */}
            <div className="flex items-start gap-3 pl-9 pt-4 border-t border-gray-100">
              <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600 flex-shrink-0">
                A
              </span>
              <div className="flex-1">
                <p className="text-sm text-orange-600 mb-1">
                  {elderName}님의 답변
                </p>
                <p className="text-gray-900 whitespace-pre-line">{qna.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
