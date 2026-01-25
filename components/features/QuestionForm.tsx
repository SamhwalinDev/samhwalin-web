'use client';

import { useState } from 'react';
import { Send, CheckCircle, MessageCircle } from 'lucide-react';

interface QuestionFormProps {
  elderName: string;
  elderId?: string;
  hwalseoId: string;
  hwalseoTitle?: string;
}

// Helper function to extract first name from Korean names
const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  if (fullName.length === 3) return fullName.slice(1); // 김순자 → 순자
  if (fullName.length === 2) return fullName.slice(1); // 김순 → 순
  if (fullName.length >= 4) return fullName.slice(2);  // 남궁순자 → 순자
  return fullName;
};

export default function QuestionForm({ elderName, elderId, hwalseoId, hwalseoTitle }: QuestionFormProps) {
  const [nickname, setNickname] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const firstName = getFirstName(elderName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          nickname: nickname.trim() || '익명',
          hwalseoId,
          elderId,
          hwalseoTitle,
          elderName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setNickname('');
        setQuestion('');
      } else {
        setError('질문 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="card-toss text-center py-10">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          질문이 전송되었습니다!
        </h3>
        <p className="text-muted-foreground mb-6">
          {firstName}에게 전달해드릴게요.
          <br />답변이 등록되면 이 페이지에서 확인하실 수 있습니다.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-primary hover:underline font-medium"
        >
          다른 질문하기
        </button>
      </div>
    );
  }

  return (
    <div className="card-toss">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-h2 font-semibold text-foreground">
            {firstName}에게 질문하기
          </h3>
          <p className="text-body-sm text-muted-foreground">
            궁금한 점을 남겨주시면 전달해드릴게요
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-body-sm font-medium text-foreground mb-1.5">
            닉네임 <span className="text-muted-foreground font-normal">(선택)</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="익명으로 남길 수 있어요"
            className="w-full px-4 py-3 rounded-xl border border-border 
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                     transition-all duration-200 text-body bg-white"
          />
        </div>
        
        <div>
          <label className="block text-body-sm font-medium text-foreground mb-1.5">
            질문 내용 <span className="text-error">*</span>
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="궁금한 점을 자유롭게 적어주세요"
            rows={4}
            required
            className="w-full px-4 py-3 rounded-xl border border-border 
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                     transition-all duration-200 resize-none text-body bg-white"
          />
        </div>

        {error && (
          <p className="text-error text-body-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !question.trim()}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-body
                   hover:bg-primary-dark transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>전송 중...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>질문 보내기</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}