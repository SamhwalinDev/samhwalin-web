import { NextRequest, NextResponse } from 'next/server';
import { getHwalseoList } from '@/lib/notion';

export const revalidate = 60; // 1분마다 재검증

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    // 활서 목록 가져오기
    const hwalseoList = await getHwalseoList();

    // 검색어로 필터링 (제목, 어르신 이름, 요약에서 검색)
    const searchLower = query.toLowerCase().trim();
    const results = hwalseoList
      .filter((hwalseo) => {
        const matchesTitle = hwalseo.title.toLowerCase().includes(searchLower);
        const matchesElderName = hwalseo.elderName.toLowerCase().includes(searchLower);
        const matchesExcerpt = hwalseo.excerpt.toLowerCase().includes(searchLower);
        return matchesTitle || matchesElderName || matchesExcerpt;
      })
      .slice(0, 5); // 최대 5개 결과만 반환

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
