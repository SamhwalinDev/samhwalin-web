'use client';

import { useFirstVisit } from '@/hooks/useFirstVisit';
import { ReactNode } from 'react';

interface AnimatedListProps {
  /**
   * 페이지를 구분하는 고유 키
   * sessionStorage에 저장되어 첫 방문 여부를 추적
   */
  pageKey: string;
  /**
   * 애니메이션을 적용할 자식 요소들
   */
  children: ReactNode[];
  /**
   * 각 아이템 간 애니메이션 지연 시간 (ms)
   * @default 100
   */
  delayStep?: number;
  /**
   * 애니메이션 지속 시간 (ms)
   * @default 500
   */
  duration?: number;
}

/**
 * 첫 방문 시에만 순차적 fade-in-up 애니메이션을 적용하는 리스트 래퍼
 * 
 * Server Component에서 사용할 수 있도록 Client Component로 구현
 * sessionStorage를 사용하여 뒤로가기 시 애니메이션을 표시하지 않음
 */
export function AnimatedList({ 
  pageKey, 
  children, 
  delayStep = 100,
  duration = 500 
}: AnimatedListProps) {
  const showAnimation = useFirstVisit(pageKey);

  return (
    <>
      {children.map((child, index) => (
        <div
          key={index}
          className={showAnimation ? 'animate-fade-in-up' : ''}
          style={showAnimation ? { 
            animationDelay: `${index * delayStep}ms`,
            animationDuration: `${duration}ms`,
          } : {}}
        >
          {child}
        </div>
      ))}
    </>
  );
}
