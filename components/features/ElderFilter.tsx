'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ElderCard } from './ElderCard';
import type { ElderCard as ElderCardType } from '@/types';

interface ElderFilterProps {
  elders: ElderCardType[];
}

export function ElderFilter({ elders }: ElderFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 필터링된 어르신 목록
  const filteredElders = useMemo(() => {
    if (!searchQuery.trim()) {
      return elders;
    }

    const query = searchQuery.toLowerCase().trim();
    return elders.filter(
      (elder) =>
        elder.name.toLowerCase().includes(query) ||
        elder.introduction?.toLowerCase().includes(query) ||
        elder.region?.toLowerCase().includes(query)
    );
  }, [elders, searchQuery]);

  return (
    <div>
      {/* 검색 */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="이름, 소개, 지역으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-body-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* 결과 카운트 */}
      <p className="text-center text-body-sm text-muted-foreground mb-8">
        {filteredElders.length}명의 어르신
      </p>

      {/* 어르신 그리드 */}
      {filteredElders.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filteredElders.map((elder) => (
            <ElderCard key={elder.id} elder={elder} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-body text-muted-foreground">
            {searchQuery ? '검색 결과가 없습니다.' : '등록된 어르신이 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
}