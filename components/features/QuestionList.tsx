import { Question } from '@/types';

interface QuestionListProps {
  elderName: string;
  questions: Question[];
}

// Helper function to extract first name from Korean names
const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  if (fullName.length === 3) return fullName.slice(1); // 김순자 → 순자
  if (fullName.length === 2) return fullName.slice(1); // 김순 → 순
  if (fullName.length >= 4) return fullName.slice(2);  // 남궁순자 → 순자
  return fullName;
};

export default function QuestionList({ elderName, questions }: QuestionListProps) {
  if (questions.length === 0) {
    return null;
  }

  const firstName = getFirstName(elderName);

  return (
    <div className="space-y-6">
      <h3 className="text-h1 font-semibold text-foreground">
        💬 독자들의 질문과 {firstName}의 답변
      </h3>
      
      <div className="space-y-4">
        {questions.map((qna) => (
          <div key={qna.id} className="card-toss">
            {/* Question */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full 
                            flex items-center justify-center text-body-sm font-bold text-muted-foreground">
                Q
              </div>
              <div className="flex-1">
                <p className="text-body-sm text-muted-foreground mb-1">
                  {qna.nickname}님의 질문
                </p>
                <p className="text-body text-foreground">{qna.question}</p>
              </div>
            </div>
            
            {/* Answer */}
            {qna.answer && (
              <div className="flex items-start gap-3 pt-4 border-t border-border ml-11">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full 
                              flex items-center justify-center text-body-sm font-bold text-primary">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-body-sm text-primary mb-1">
                    {firstName}의 답변
                  </p>
                  <p className="text-body text-foreground">{qna.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}