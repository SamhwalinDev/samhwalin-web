'use client';

import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface PostcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderName: string;
  hwalseoSlug?: string;
}

const AMOUNT_OPTIONS = [
  { value: 3000, label: '3,000원' },
  { value: 5000, label: '5,000원' },
  { value: 10000, label: '10,000원' },
];

// 이메일 기본 형식 검사
function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 흔한 이메일 도메인 오타 패턴
const EMAIL_TYPO_MAP: Record<string, string> = {
  // Gmail 오타
  'gmail.net': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.kr': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.comm': 'gmail.com',
  // Naver 오타
  'naver.net': 'naver.com',
  'naver.co': 'naver.com',
  'naver.con': 'naver.com',
  'naver.kr': 'naver.com',
  'nave.com': 'naver.com',
  'naer.com': 'naver.com',
  'naver.cm': 'naver.com',
  'naver.comm': 'naver.com',
  'navr.com': 'naver.com',
  'naevr.com': 'naver.com',
  // Daum 오타
  'daum.com': 'daum.net',
  'daum.co': 'daum.net',
  'daum.kr': 'daum.net',
  'daum.con': 'daum.net',
  'daum.ne': 'daum.net',
  'daum.nett': 'daum.net',
  // Hanmail 오타
  'hanmail.com': 'hanmail.net',
  'hanmail.co': 'hanmail.net',
  'hanmail.kr': 'hanmail.net',
  'hamail.net': 'hanmail.net',
  'hanmail.ne': 'hanmail.net',
  'hanmail.nett': 'hanmail.net',
  // Kakao 오타
  'kakao.net': 'kakao.com',
  'kakao.co': 'kakao.com',
  'kakao.kr': 'kakao.com',
  'kakao.cm': 'kakao.com',
  // Nate 오타
  'nate.net': 'nate.com',
  'nate.co': 'nate.com',
  'nate.kr': 'nate.com',
  'nate.ne': 'nate.com',
  // Yahoo 오타
  'yahoo.con': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  // Hotmail 오타
  'hotmail.con': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  // Outlook 오타
  'outlook.con': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlok.com': 'outlook.com',
};

// 이메일 도메인 오타 체크
function checkEmailTypo(email: string): string | null {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return null;
  
  const domain = email.slice(atIndex + 1).toLowerCase();
  return EMAIL_TYPO_MAP[domain] || null;
}

// 수정된 이메일 반환
function getFixedEmail(email: string, correctDomain: string): string {
  const atIndex = email.indexOf('@');
  const localPart = email.slice(0, atIndex);
  return `${localPart}@${correctDomain}`;
}

export function PostcardModal({ isOpen, onClose, elderName, hwalseoSlug = '' }: PostcardModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    amount: 3000,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [emailError, setEmailError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    setEmailError('');
    
    // 오타 체크
    const correctDomain = checkEmailTypo(value);
    if (correctDomain) {
      setEmailSuggestion(getFixedEmail(value, correctDomain));
    } else {
      setEmailSuggestion(null);
    }
  };

  const handleAcceptSuggestion = () => {
    if (emailSuggestion) {
      setFormData({ ...formData, email: emailSuggestion });
      setEmailSuggestion(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 기본 형식 검사
    if (!isValidEmailFormat(formData.email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요. (예: example@email.com)');
      return;
    }

    // 오타 제안이 있으면 경고
    if (emailSuggestion) {
      setEmailError('이메일 주소를 다시 확인해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/postcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          elderName,
          hwalseoSlug,
        }),
      });

      if (response.ok) {
        setStep('payment');
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = () => {
    const thankYouUrl = `/postcard/thank-you?name=${encodeURIComponent(formData.name)}&elder=${encodeURIComponent(elderName)}&amount=${formData.amount}`;
    window.open(process.env.NEXT_PUBLIC_KAKAOPAY_LINK, '_blank');
    window.location.href = thankYouUrl;
  };

  const handleClose = () => {
    onClose();
    setStep('form');
    setFormData({ name: '', email: '', message: '', amount: 3000 });
    setEmailError('');
    setEmailSuggestion(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-h3 text-foreground">
            {step === 'form' ? `${elderName}님께 엽서 보내기` : '결제하기'}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* 이름 */}
            <div>
              <label className="block text-body-sm font-medium text-text mb-1">
                보내는 분 이름 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="홍길동"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-body-sm font-medium text-text mb-1">
                이메일 *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                  (emailError || emailSuggestion) ? "border-warning" : "border-border"
                )}
                placeholder="example@email.com"
              />
              {/* 오타 제안 */}
              {emailSuggestion && (
                <div className="mt-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-body-sm text-warning">
                    혹시 <strong>{emailSuggestion}</strong> 을(를) 말씀하신 건가요?
                  </p>
                  <button
                    type="button"
                    onClick={handleAcceptSuggestion}
                    className="mt-2 text-body-sm font-medium text-warning hover:text-primary-dark underline"
                  >
                    네, 수정할게요
                  </button>
                </div>
              )}
              {emailError && (
                <p className="text-small text-error mt-1">{emailError}</p>
              )}
            </div>

            {/* 메시지 */}
            <div>
              <label className="block text-body-sm font-medium text-text mb-1">
                엽서 내용 *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder={`${elderName}님께 전하고 싶은 이야기를 적어주세요.`}
              />
            </div>

            {/* 금액 선택 */}
            <div>
              <label className="block text-body-sm font-medium text-text mb-2">
                엽서 금액 선택 *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AMOUNT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: option.value })}
                    className={cn(
                      'py-3 px-4 rounded-lg border text-body-sm font-medium transition-colors',
                      formData.amount === option.value
                        ? 'border-primary bg-primary-extra-light text-primary'
                        : 'border-border text-text hover:border-border'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-caption text-muted-foreground mt-2">
                엽서 제작 및 배송비로 사용됩니다.
              </p>
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '다음: 결제하기'}
            </Button>
          </form>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-primary-extra-light rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} className="text-primary" />
            </div>
            <h3 className="text-h3 text-foreground mb-2">
              엽서가 저장되었습니다!
            </h3>
            <p className="text-body text-muted-foreground mb-6">
              카카오페이로 <strong>{formData.amount.toLocaleString()}원</strong>을 송금해주시면<br />
              {elderName}님께 엽서를 전달해드립니다.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-body-sm text-muted-foreground mb-1">송금 시 입금자명</p>
              <p className="text-body font-medium text-foreground">{formData.name}</p>
            </div>
            <Button
              onClick={handlePayment}
              variant="cta"
              size="lg"
              className="w-full"
            >
              카카오페이로 결제하기
            </Button>
            <p className="text-caption text-muted-foreground mt-4">
              결제 확인 후 영업일 기준 3일 내 발송됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}