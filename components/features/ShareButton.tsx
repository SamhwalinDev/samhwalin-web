'use client';

import { Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url || '');

  useEffect(() => {
    // URL이 제공되지 않으면 현재 페이지 URL 사용
    if (!url && typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [url]);

  const handleShare = async () => {
    if (navigator.share) {
      // 모바일 네이티브 공유
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } catch (err) {
        // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
        if ((err as Error).name !== 'AbortError') {
          console.log('Share error:', err);
        }
      }
    } else {
      // 데스크톱: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        // 폴백: prompt로 복사
        prompt('링크를 복사하세요:', shareUrl);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 rounded-full font-medium 
                 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isCopied}
    >
      <Share2 className="w-5 h-5" />
      <span className="text-sm font-medium">{isCopied ? '복사됨!' : '공유하기'}</span>
    </button>
  );
}