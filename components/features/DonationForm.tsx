'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PopularBadge } from './SocialProof';
import { DONATION_OPTIONS, type DonationOption } from '@/types';

type DonationType = 'oneTime' | 'recurring';
type Step = 'amount' | 'info' | 'payment';

interface DonationFormProps {
  className?: string;
}

export function DonationForm({ className }: DonationFormProps) {
  const [step, setStep] = useState<Step>('amount');
  const [donationType, setDonationType] = useState<DonationType>('recurring');
  const [selectedAmount, setSelectedAmount] = useState<number>(30000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = DONATION_OPTIONS[donationType];
  const finalAmount = isCustom ? parseInt(customAmount) || 0 : selectedAmount;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
    setIsCustom(true);
  };

  const handleNext = () => {
    if (finalAmount >= 1000) {
      setStep('info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('입금자명을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          amount: finalAmount,
          type: donationType,
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
  // 카카오페이 새 창으로 열기
  window.open(process.env.NEXT_PUBLIC_KAKAOPAY_LINK, '_blank');
  // 감사 페이지로 이동
  window.location.href = `/donate/thank-you?name=${encodeURIComponent(name)}&amount=${finalAmount}`;
};

  // Step 3: 결제 안내
  if (step === 'payment') {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">💛</span>
        </div>
        <h3 className="text-h3 text-gray-900 mb-2">
          후원 신청이 완료되었습니다!
        </h3>
        <p className="text-body text-gray-600 mb-6">
          카카오페이로 <strong>{formatCurrency(finalAmount)}</strong>을 송금해주시면<br />
          후원 처리가 완료됩니다.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-body-sm text-gray-600 mb-1">송금 시 입금자명</p>
          <p className="text-body font-medium text-gray-900">{name}</p>
        </div>
        <Button
          onClick={handlePayment}
          variant="cta"
          size="lg"
          className="w-full"
        >
          <span className="mr-2">🟡</span>
          카카오페이로 송금하기
        </Button>
        <p className="text-caption text-gray-500 mt-4">
          송금 확인 후 후원 내역에 반영됩니다.
        </p>
      </div>
    );
  }

  // Step 2: 입금자명 입력
  if (step === 'info') {
    return (
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        <div className="text-center mb-6">
          <p className="text-body text-gray-600">
            {donationType === 'recurring' ? '월 ' : ''}{formatCurrency(finalAmount)} 후원
          </p>
        </div>

        <div>
          <label className="block text-body-sm font-medium text-gray-700 mb-2">
            입금자명 *
          </label>
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="카카오페이 송금 시 표시될 이름"
            className="w-full"
          />
          <p className="text-caption text-gray-500 mt-2">
            입금 확인을 위해 정확히 입력해주세요.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => setStep('amount')}
          >
            이전
          </Button>
          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="flex-1"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? '처리 중...' : '다음'}
          </Button>
        </div>
      </form>
    );
  }

  // Step 1: 금액 선택
  return (
    <div className={cn('space-y-8', className)}>
      {/* 후원 유형 탭 */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setDonationType('recurring')}
          className={cn(
            'flex-1 py-3 text-body-sm font-medium transition-colors',
            'border-b-2 -mb-px',
            donationType === 'recurring'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          )}
        >
          정기 후원
        </button>
        <button
          type="button"
          onClick={() => setDonationType('oneTime')}
          className={cn(
            'flex-1 py-3 text-body-sm font-medium transition-colors',
            'border-b-2 -mb-px',
            donationType === 'oneTime'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          )}
        >
          일시 후원
        </button>
      </div>

      {/* 금액 선택 */}
      <div className="space-y-4">
        <h3 className="text-body font-semibold text-gray-900">
          후원 금액을 선택해주세요
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {options.map((option: DonationOption) => (
            <AmountButton
              key={option.amount}
              option={option}
              isSelected={!isCustom && selectedAmount === option.amount}
              onClick={() => handleAmountSelect(option.amount)}
              showPopular={option.isDefault}
            />
          ))}
        </div>

        {/* 기타 금액 */}
        <div className="relative">
          <Input
            placeholder="직접 입력"
            value={customAmount ? formatCurrency(parseInt(customAmount)).replace('원', '') : ''}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            onFocus={() => setIsCustom(true)}
            className={cn(
              'text-right pr-12',
              isCustom && customAmount && 'border-gray-900'
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            원
          </span>
        </div>
      </div>

      {/* CTA 버튼 */}
      <Button
        onClick={handleNext}
        variant="cta"
        size="lg"
        disabled={finalAmount < 1000}
        className="w-full"
      >
        {donationType === 'recurring' ? '월 ' : ''}
        {formatCurrency(finalAmount)} 후원하기
      </Button>

      {/* 안내 문구 */}
      <div className="text-center space-y-2">
        <p className="text-small text-gray-500">
          🔒 카카오페이로 안전하게 송금됩니다
        </p>
        {donationType === 'recurring' && (
          <p className="text-small text-gray-500">
            정기 후원은 매월 직접 송금해주시면 됩니다
          </p>
        )}
      </div>
    </div>
  );
}

// 금액 버튼
interface AmountButtonProps {
  option: DonationOption;
  isSelected: boolean;
  onClick: () => void;
  showPopular?: boolean;
}

function AmountButton({ option, isSelected, onClick, showPopular }: AmountButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-start gap-1',
        'w-full p-4',
        'bg-white text-left',
        'border rounded-lg shadow-sm',
        'transition-all duration-fast ease-out',
        isSelected
          ? 'border-2 border-gray-900 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      )}
    >
      {showPopular && (
        <PopularBadge className="absolute -top-2 right-3" />
      )}
      <span className="text-body font-semibold text-gray-900">
        {option.label}
      </span>
      <span className="text-small text-gray-500">
        {option.impact}
      </span>
    </button>
  );
}