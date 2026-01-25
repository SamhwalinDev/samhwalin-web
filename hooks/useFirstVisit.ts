'use client';

import { useState, useEffect } from 'react';

/**
 * 세션에서 페이지 첫 방문 여부를 확인하는 훅
 * sessionStorage를 사용하여 브라우저 탭이 열려있는 동안만 상태 유지
 * 
 * @param pageKey 페이지를 구분하는 고유 키 (예: 'hwalseo-list', 'elder-list')
 * @returns 첫 방문이면 true, 이미 방문했으면 false
 */
export function useFirstVisit(pageKey: string): boolean {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // SSR 안전성: 브라우저 환경에서만 실행
    if (typeof window === 'undefined') {
      return;
    }

    const storageKey = `visited_${pageKey}`;
    const hasVisited = sessionStorage.getItem(storageKey);

    if (!hasVisited) {
      // 첫 방문: 애니메이션 표시
      setIsFirstVisit(true);
      sessionStorage.setItem(storageKey, 'true');
    } else {
      // 이미 방문함: 애니메이션 없음
      setIsFirstVisit(false);
    }
  }, [pageKey]);

  return isFirstVisit;
}
