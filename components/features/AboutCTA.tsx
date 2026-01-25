'use client';

import { useState } from 'react';
import Link from 'next/link';
import SubscribeModal from './SubscribeModal';

export default function AboutCTA() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <>
      <section className="bg-gray-900 text-white py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
            함께 활력을 얻어보시겠습니까?
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12">
            Arrive, Alive! No longer Alone.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 md:mb-12">
            <Link
              href="/hwalseo"
              className="bg-white text-gray-900 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold 
                       hover:bg-gray-100 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              활서 읽기
            </Link>
            <button
              onClick={() => setIsSubscribeOpen(true)}
              className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold 
                       hover:bg-white hover:text-gray-900 transition-all"
            >
              뉴스레터 구독
            </button>
            <Link
              href="/support"
              className="border-2 border-white !text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold 
                       hover:bg-white hover:text-gray-900 transition-all"
            >
              후원하기
            </Link>
          </div>
          
          <p className="text-gray-400 text-sm">
            협업 문의: info@samhwalin.org
          </p>
        </div>
      </section>

      <SubscribeModal 
        isOpen={isSubscribeOpen} 
        onClose={() => setIsSubscribeOpen(false)}
        source="프로젝트소개"
      />
    </>
  );
}
