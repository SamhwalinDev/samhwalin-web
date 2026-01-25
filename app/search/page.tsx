'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollAnimationWrapper from '@/components/ui/ScrollAnimationWrapper';

// 고민 태그 목록
const WORRY_TAGS = [
  { id: 'career', label: '직장/이직', emoji: '💼' },
  { id: 'business', label: '창업/사업', emoji: '🚀' },
  { id: 'family', label: '가족/부모', emoji: '👨‍👩‍👧' },
  { id: 'relationship', label: '인간관계', emoji: '🤝' },
  { id: 'health', label: '건강/노후', emoji: '🏥' },
  { id: 'money', label: '돈/재정', emoji: '💰' },
  { id: 'life', label: '삶의 의미', emoji: '🌱' },
  { id: 'regret', label: '후회/선택', emoji: '🔄' },
];

export default function SearchPage() {
  const [hwalseos, setHwalseos] = useState<any[]>([]);
  const [filteredHwalseos, setFilteredHwalseos] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 제목 설정
  useEffect(() => {
    document.title = '해답 찾기 | 삼활인';
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    async function fetchHwalseos() {
      try {
        const res = await fetch('/api/hwalseos');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setHwalseos(data);
        setFilteredHwalseos(data);
      } catch (error) {
        console.error('Failed to fetch hwalseos:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHwalseos();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let result = hwalseos;

    // 태그 필터 (일단 주석 처리 - Notion DB에 태그 필드가 없을 수 있음)
    // if (selectedTag) {
    //   result = result.filter((h: any) => 
    //     h.tags?.includes(selectedTag) || 
    //     h.theme === selectedTag
    //   );
    // }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((h: any) =>
        h.title?.toLowerCase().includes(query) ||
        h.subtitle?.toLowerCase().includes(query) ||
        h.excerpt?.toLowerCase().includes(query) ||
        h.elderName?.toLowerCase().includes(query)
      );
    }

    setFilteredHwalseos(result);
  }, [selectedTag, searchQuery, hwalseos]);

  const handleTagClick = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? null : tagId);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="py-20 bg-[#F5F8F5]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              어떤 고민이 있으세요?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              긴 세월을 살아낸 분들의 경험에서 답을 찾아보세요
            </p>
          </ScrollAnimationWrapper>
          
          {/* Search Input */}
          <ScrollAnimationWrapper animation="fade-up" delay={200} duration={800}>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="고민을 입력해보세요... (예: 퇴사, 부모님과 갈등)"
                className="w-full px-6 py-4 pr-12 rounded-2xl border-2 border-gray-200 
                         text-lg focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100
                         transition-all duration-200 shadow-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              * 검색 기능은 활서가 더 쌓이면 더 정확해져요
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Tags Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <h2 className="text-2xl font-bold text-center mb-8">
              주제로 찾아보기
            </h2>
          </ScrollAnimationWrapper>
          
          <div className="flex flex-wrap justify-center gap-3">
            {WORRY_TAGS.map((tag, index) => (
              <ScrollAnimationWrapper 
                key={tag.id} 
                animation="scale" 
                delay={index * 80} 
                duration={500}
              >
                <button 
                  onClick={() => handleTagClick(tag.id)}
                  className={`px-5 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm
                    ${selectedTag === tag.id 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                >
                  <span className="mr-2">{tag.emoji}</span>
                  {tag.label}
                </button>
              </ScrollAnimationWrapper>
            ))}
          </div>
          
          {/* 선택된 태그 표시 */}
          {selectedTag && (
            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedTag(null)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕ 필터 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <h2 className="text-2xl font-bold mb-2">
              {selectedTag 
                ? `'${WORRY_TAGS.find(t => t.id === selectedTag)?.label}' 관련 활서`
                : searchQuery 
                  ? `'${searchQuery}' 검색 결과`
                  : '활서 목록'
              }
            </h2>
            <p className="text-gray-500 mb-8">
              {isLoading ? '로딩 중...' : `${filteredHwalseos.length}개의 활서`}
            </p>
          </ScrollAnimationWrapper>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">활서를 불러오는 중...</p>
            </div>
          ) : filteredHwalseos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHwalseos.map((hwalseo: any, index: number) => (
                <ScrollAnimationWrapper 
                  key={hwalseo.id} 
                  animation="fade-up" 
                  delay={index * 100} 
                  duration={600}
                >
                  <Link 
                    href={`/hwalseo/${hwalseo.slug}`}
                    className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md 
                             hover:-translate-y-1 transition-all duration-300"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {hwalseo.title}
                    </h3>
                    {hwalseo.excerpt && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {hwalseo.excerpt}
                      </p>
                    )}
                    <p className="text-orange-600 text-sm font-medium">
                      {hwalseo.elderName}님의 이야기
                    </p>
                  </Link>
                </ScrollAnimationWrapper>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery || selectedTag 
                  ? '검색 결과가 없어요.'
                  : '아직 공개된 활서가 없어요.'
                }
              </p>
              <p className="text-gray-400 text-sm">
                {searchQuery || selectedTag 
                  ? '다른 키워드로 찾아보세요!'
                  : '곧 다양한 활서가 업로드될 예정입니다.'
                }
              </p>
            </div>
          )}
          
          {!isLoading && !searchQuery && !selectedTag && filteredHwalseos.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                href="/hwalseo" 
                className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl 
                         font-semibold hover:bg-gray-800 transition-colors"
              >
                모든 활서 보기 →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testype Teaser */}
      <section className="py-16 bg-[#FFF8F3]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollAnimationWrapper animation="blur" duration={1000}>
            <span className="inline-block px-4 py-1 bg-orange-200 text-orange-700 rounded-full text-sm font-semibold mb-4">
              Coming Soon
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              더 깊은 대화가 필요하다면
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              테스형 AI가 직접 들어줄게요.<br/>
              나도 다 겪어봤거든.
            </p>
            <Link 
              href="/testype" 
              className="inline-block px-8 py-4 bg-orange-500 text-white rounded-xl 
                       font-semibold hover:bg-orange-600 transition-colors"
            >
              테스형 AI 알아보기 →
            </Link>
          </ScrollAnimationWrapper>
        </div>
      </section>

    </main>
  );
}