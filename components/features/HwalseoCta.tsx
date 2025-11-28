'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, Heart } from 'lucide-react';
import { PostcardModal } from '@/components/features';

interface HwalseoCtaProps {
  elderName: string;
  hwalseoSlug?: string;
}

export function HwalseoCta({ elderName, hwalseoSlug }: HwalseoCtaProps) {
  const [isPostcardOpen, setIsPostcardOpen] = useState(false);

  return (
    <>
      <div className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-body text-gray-600 mb-6 text-center">
          {elderName}의 이야기에 공감하셨다면
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsPostcardOpen(true)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gray-900 text-white px-8 py-4 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            <Send size={18} />
            엽서 보내기
          </button>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white text-gray-900 border border-gray-300 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
          >
            <Heart size={18} />
            후원하기
          </Link>
        </div>
      </div>

      <PostcardModal
        isOpen={isPostcardOpen}
        onClose={() => setIsPostcardOpen(false)}
        elderName={elderName}
        hwalseoSlug={hwalseoSlug}
      />
    </>
  );
}