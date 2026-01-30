'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailSubscribeFormProps {
  source?: 'footer' | 'homepage' | 'hwalseo';
  className?: string;
}

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

export function EmailSubscribeForm({
  source = 'footer',
  className,
}: EmailSubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setFormState('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (data.success) {
        setFormState('success');
        setEmail('');
        // 3초 후 상태 초기화
        setTimeout(() => setFormState('idle'), 3000);
      } else if (data.error === 'duplicate') {
        setFormState('duplicate');
        setTimeout(() => setFormState('idle'), 3000);
      } else {
        setFormState('error');
        setTimeout(() => setFormState('idle'), 3000);
      }
    } catch {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  const getMessage = () => {
    switch (formState) {
      case 'success':
        return (
          <span className="flex items-center gap-1.5 text-success">
            <CheckCircle size={16} />
            구독 신청이 완료되었습니다!
          </span>
        );
      case 'duplicate':
        return (
          <span className="flex items-center gap-1.5 text-warning">
            <AlertCircle size={16} />
            이미 구독 중인 이메일입니다.
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-error">
            <AlertCircle size={16} />
            오류가 발생했습니다. 다시 시도해주세요.
          </span>
        );
      default:
        return null;
    }
  };

  const isDisabled = formState === 'loading' || formState === 'success';

  return (
    <div className={cn('w-full', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          disabled={isDisabled}
          className={cn(
            'flex-1 px-4 py-2.5 rounded-lg border border-border',
            'text-body-sm placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'transition-colors'
          )}
          required
        />
        <button
          type="submit"
          disabled={isDisabled}
          className={cn(
            'px-4 py-2.5 rounded-lg font-medium text-body-sm',
            'bg-primary text-white',
            'hover:bg-primary-dark',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors',
            'flex items-center gap-2'
          )}
        >
          {formState === 'loading' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Send size={16} />
              <span className="hidden sm:inline">구독하기</span>
            </>
          )}
        </button>
      </form>

      {/* 상태 메시지 */}
      {formState !== 'idle' && formState !== 'loading' && (
        <p className="mt-2 text-small">{getMessage()}</p>
      )}
    </div>
  );
}
