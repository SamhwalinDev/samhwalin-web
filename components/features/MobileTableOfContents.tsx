'use client';

import { useState } from 'react';
import { List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileTableOfContentsProps {
  content: string;
}

interface Heading {
  level: number;
  text: string;
  lineIndex: number;
}

function extractHeadings(content: string): Heading[] {
  const lines = content.split('\n');

  return lines
    .map((line, index) => {
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        return { level: 1, text: line.replace('# ', ''), lineIndex: index };
      }
      if (line.startsWith('## ')) {
        return { level: 2, text: line.replace('## ', ''), lineIndex: index };
      }
      if (line.startsWith('### ')) {
        return { level: 3, text: line.replace('### ', ''), lineIndex: index };
      }
      return null;
    })
    .filter((h): h is Heading => h !== null);
}

export function MobileTableOfContents({ content }: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headings = extractHeadings(content);

  // Don't render if no headings
  if (headings.length === 0) return null;

  const handleHeadingClick = (lineIndex: number) => {
    setIsOpen(false);
    // Small delay to allow sheet to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(`heading-${lineIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* Floating Button - only visible on < xl screens */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40',
          'flex items-center gap-2 px-5 py-3',
          'bg-gray-900 text-white rounded-full shadow-lg',
          'hover:bg-gray-800 transition-colors',
          isOpen && 'hidden'
        )}
        aria-label="목차 열기"
      >
        <List size={18} />
        <span className="text-body-sm font-medium">목차</span>
      </button>

      {/* Bottom Sheet */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="xl:hidden fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet */}
          <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
              <h3 className="text-h3 text-foreground">목차</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="닫기"
              >
                <X size={24} />
              </button>
            </div>

            {/* Headings List */}
            <nav className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              <ul className="space-y-0.5">
                {headings.map((heading, idx) => {
                  const isH1 = heading.level === 1;
                  const isH2 = heading.level === 2;
                  const isH3 = heading.level === 3;
                  const isFirstH1 = isH1 && headings.findIndex(h => h.level === 1) === idx;

                  return (
                    <li
                      key={idx}
                      className={cn(
                        isH1 && !isFirstH1 && 'mt-4 pt-3 border-t border-gray-100',
                        isH2 && '',
                        isH3 && 'ml-5'
                      )}
                    >
                      <button
                        onClick={() => handleHeadingClick(heading.lineIndex)}
                        className={cn(
                          'w-full text-left flex items-center py-2 transition-colors break-keep',
                          isH1 && 'font-bold text-foreground hover:text-primary text-base',
                          isH2 && 'font-medium text-muted-foreground hover:text-primary pl-4 border-l-2 border-border active:border-primary text-[15px]',
                          isH3 && 'text-muted-foreground hover:text-text text-sm pl-4'
                        )}
                      >
                        {isH1 && <span className="text-primary mr-2.5 text-sm">■</span>}
                        {isH2 && <span className="text-gray-400 mr-2">›</span>}
                        {isH3 && <span className="text-gray-300 mr-2">–</span>}
                        {heading.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Safe Area Padding for iOS */}
            <div className="h-6" />
          </div>
        </>
      )}

      {/* CSS for slide-up animation */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
