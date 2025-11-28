'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { HwalseoCard } from './HwalseoCard';

interface HwalseoItem {
  id: string;
  slug: string;
  title: string;
  elderName: string;
  theme: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
}

interface HwalseoFilterProps {
  hwalseoList: HwalseoItem[];
  themes: string[];
}

export function HwalseoFilter({ hwalseoList, themes }: HwalseoFilterProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const filteredList = selectedTheme
    ? hwalseoList.filter((item) => item.theme === selectedTheme)
    : hwalseoList;

  return (
    <>
      {/* 테마 필터 */}
      {themes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedTheme(null)}
            className={cn(
              'px-4 py-2 rounded-full text-body-sm font-medium transition-colors',
              selectedTheme === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            전체
          </button>
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={cn(
                'px-4 py-2 rounded-full text-body-sm font-medium transition-colors',
                selectedTheme === theme
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {theme}
            </button>
          ))}
        </div>
      )}

      {/* 활서 목록 */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((hwalseo) => (
            <HwalseoCard key={hwalseo.id} hwalseo={hwalseo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-body text-gray-500">
            {selectedTheme 
              ? `'${selectedTheme}' 테마의 활서가 아직 없습니다.`
              : '아직 활서가 없습니다.'}
          </p>
        </div>
      )}
    </>
  );
}