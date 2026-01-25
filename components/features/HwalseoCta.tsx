'use client';

// import { useState } from 'react'; // 엽서 기능 임시 비활성화
// import { Send } from 'lucide-react'; // 엽서 기능 임시 비활성화
// import { PostcardModal } from '@/components/features'; // 엽서 기능 임시 비활성화
import { ShareButtons } from './ShareButtons';
import { EmailSubscribeForm } from './EmailSubscribeForm';

interface HwalseoCtaProps {
  elderName: string;
  hwalseoSlug?: string;
  shareTitle?: string;
  shareUrl?: string;
}

export function HwalseoCta({ elderName, hwalseoSlug, shareTitle, shareUrl }: HwalseoCtaProps) {
  // const [isPostcardOpen, setIsPostcardOpen] = useState(false); // 엽서 기능 임시 비활성화

  return (
    <>
      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-body text-muted-foreground mb-6 text-center">
          {elderName}의 이야기가 마음에 드셨나요?
        </p>

        {/* 1. Share Button */}
        {shareTitle && shareUrl && (
          <div className="pt-2">
            <p className="text-body-sm text-muted-foreground mb-4 text-center">
              이 이야기를 공유하기
            </p>
            <div className="flex justify-center">
              <ShareButtons
                title={shareTitle}
                url={shareUrl}
              />
            </div>
          </div>
        )}

        {/* 2. Action Buttons - 인스타그램 (엽서 보내기는 임시 숨김) */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-row gap-3 justify-center">
            {/* 엽서 보내기 버튼 - 임시 비활성화
            <button
              onClick={() => setIsPostcardOpen(true)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              <Send size={18} />
              엽서 보내기
            </button>
            */}
            <a
              href="https://www.instagram.com/samhwalin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              인스타그램
            </a>
          </div>
        </div>

        {/* 3. Email Subscription */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            새로운 활서 소식 받기
          </p>
          <div className="max-w-sm mx-auto">
            <EmailSubscribeForm source="hwalseo" />
          </div>
        </div>
      </div>

      {/* 엽서 기능 임시 비활성화
      <PostcardModal
        isOpen={isPostcardOpen}
        onClose={() => setIsPostcardOpen(false)}
        elderName={elderName}
        hwalseoSlug={hwalseoSlug}
      />
      */}
    </>
  );
}
