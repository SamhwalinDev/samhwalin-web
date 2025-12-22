'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { ElderCard } from './ElderCard';
import { cn } from '@/lib/utils';
import type { ElderCard as ElderCardType } from '@/types';

interface ElderFilterProps {
  elders: ElderCardType[];
  regions: string[];
}

export function ElderFilter({ elders, regions }: ElderFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialRegion = searchParams.get('region') || '전체';
  const initialSearch = searchParams.get('q') || '';
  
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // 필터링된 어르신 목록
  const filteredElders = useMemo(() => {
    let result = elders;

    // 지역 필터
    if (selectedRegion !== '전체') {
      result = result.filter(elder => elder.region === selectedRegion);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(elder => 
        elder.name.toLowerCase().includes(query) ||
        elder.introduction?.toLowerCase().includes(query) ||
        elder.region?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [elders, selectedRegion, searchQuery]);

  // 지역 선택 핸들러
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    
    const params = new URLSearchParams(searchParams.toString());
    if (region === '전체') {
      params.delete('region');
    } else {
      params.set('region', region);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/elders';
    router.push(newUrl, { scroll: false });
  };

  // 검색 핸들러
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/elders';
    router.push(newUrl, { scroll: false });
  };

  const allRegions = ['전체', ...regions];

  return (
    <div>
      {/* 검색 + 필터 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* 검색 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="이름으로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-transparent rounded-full text-body focus:bg-white focus:border-gray-300 focus:outline-none transition-colors"
          />
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allRegions.map((region) => (
            <button
              key={region}
              onClick={() => handleRegionChange(region)}
              className={cn(
                'px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors',
                selectedRegion === region
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 카운트 */}
      <p className="text-body-sm text-gray-500 mb-6">
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
          <p className="text-body text-gray-500">
            {searchQuery ? '검색 결과가 없습니다.' : '등록된 어르신이 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
}