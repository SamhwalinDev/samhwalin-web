'use client';

import { useState } from 'react';
import SubscribeModal from './SubscribeModal';

interface SubscribeSectionProps {
  source?: string;
}

export default function SubscribeSection({ source = '홈페이지' }: SubscribeSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-16 text-center bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl md:text-[28px] font-bold text-text mb-3">
            더 많은 이야기가 궁금하신가요?
          </h2>
          <p className="text-gray-600 mb-6">
            이메일을 남겨주시면 새로운 인터뷰 대상자의 이야기가 올라올 때 알려드립니다.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white 
                     px-8 py-3.5 rounded-xl font-semibold transition-all duration-200"
          >
            소식 받기
          </button>
        </div>
      </section>

      <SubscribeModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        source={source}
      />
    </>
  );
}
