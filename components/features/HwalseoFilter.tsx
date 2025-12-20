'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function HwalseoFilter({ hwalseoList, themes }: HwalseoFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    searchParams.get('theme')
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );

  const debouncedSearch = useDebounce(searchQuery, 300);

  // URL 업데이트
  const updateURL = useCallback(
    (search: string, theme: string | null) => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (theme) params.set('theme', theme);

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : '/hwalseo', {
        scroll: false,
      });
    },
    [router]
  );

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    updateURL(debouncedSearch, selectedTheme);
  }, [debouncedSearch, selectedTheme, updateURL]);

  // 필터링 로직
  const filteredList = useMemo(() => {
    return hwalseoList.filter((item) => {
      // 검색 필터
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch =
        !debouncedSearch ||
        item.title.toLowerCase().includes(searchLower) ||
        item.elderName.toLowerCase().includes(searchLower) ||
        item.excerpt.toLowerCase().includes(searchLower);

      // 테마 필터
      const matchesTheme = !selectedTheme || item.theme === selectedTheme;

      return matchesSearch && matchesTheme;
    });
  }, [hwalseoList, debouncedSearch, selectedTheme]);

  // 필터 초기화
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTheme(null);
  };

  const hasActiveFilters = searchQuery || selectedTheme;

  return (
    <>
      {/* 검색 입력 */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 어르신 이름, 내용으로 검색"
            className={cn(
              'w-full pl-11 pr-10 py-3 rounded-full border border-gray-300',
              'text-body-sm placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'transition-colors'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

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
          <p className="text-body text-gray-500">검색 결과가 없습니다.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-primary hover:text-primary-dark font-medium transition-colors"
            >
              필터 초기화
            </button>
          )}
        </div>
      )}
    </>
  );
}
