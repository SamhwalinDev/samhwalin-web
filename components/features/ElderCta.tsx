'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, Heart } from 'lucide-react';
import { PostcardModal } from './PostcardModal';

interface ElderCtaProps {
  elderName: string;
  honorific: string;
}

export function ElderCta({ elderName, honorific }: ElderCtaProps) {
  const [isPostcardOpen, setIsPostcardOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setIsPostcardOpen(true)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          <Send size={18} />
          엽서 보내기
        </button>
        <Link
          href="/donate"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          <Heart size={18} />
          후원하기
        </Link>
      </div>

      <PostcardModal
        isOpen={isPostcardOpen}
        onClose={() => setIsPostcardOpen(false)}
        elderName={`${elderName} ${honorific}`}
      />
    </>
  );
}
