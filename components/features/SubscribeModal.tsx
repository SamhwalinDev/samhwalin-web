'use client';

import { useState } from 'react';
import { X, Mail, CheckCircle, Loader2 } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export default function SubscribeModal({ isOpen, onClose, source = '홈페이지' }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('올바른 이메일을 입력해주세요.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || '구독이 완료되었습니다!');
        setEmail('');
      } else {
        setStatus('error');
        if (data.error === 'duplicate') {
          setMessage('이미 구독 중인 이메일입니다.');
        } else {
          setMessage(data.message || '구독 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('구독 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setStatus('idle');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 
                   rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          /* Success State */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              구독 완료!
            </h3>
            <p className="text-gray-600 mb-6">
              새로운 활서가 올라오면 알려드릴게요.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-primary-dark text-white 
                       py-3.5 rounded-xl font-semibold transition-all duration-200"
            >
              확인
            </button>
          </div>
        ) : (
          /* Form State */
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                삼활인 소식 받기
              </h3>
              <p className="text-gray-600 text-sm">
                새로운 활서가 올라오면 이메일로 알려드릴게요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="이메일 주소를 입력하세요"
                  className={`w-full px-4 py-3.5 rounded-xl border text-center
                           focus:outline-none focus:ring-2 transition-all duration-200
                           ${status === 'error' 
                             ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                             : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                           }`}
                  disabled={status === 'loading'}
                />
                {status === 'error' && message && (
                  <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-primary-dark text-white 
                         py-3.5 rounded-xl font-semibold transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>구독 중...</span>
                  </>
                ) : (
                  <span>소식 받기</span>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              구독은 언제든 취소할 수 있습니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
