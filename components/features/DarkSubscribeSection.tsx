'use client';

import { useState } from 'react';
import SubscribeModal from './SubscribeModal';

interface DarkSubscribeSectionProps {
  source?: string;
}

export default function DarkSubscribeSection({ source = '홈페이지' }: DarkSubscribeSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="bg-gray-900 py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            더 많은 이야기가 궁금하신가요?
          </h2>
          <p className="text-gray-300 mb-8">
            이메일을 남겨주시면 새로운 인터뷰 대상자의 이야기가 올라올 때 알려드립니다.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-orange-400 hover:bg-orange-500 text-white 
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
