'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export function ShareButtons({
  title,
  url,
  description = '삼활인 활서',
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Try Web Share API first (mobile/supported browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
        return;
      } catch {
        // User cancelled or error - fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors',
        copied
          ? 'bg-accent text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white',
        className
      )}
      aria-label={copied ? '링크가 복사되었습니다' : '공유하기'}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
    </button>
  );
}
