import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind 클래스 병합 유틸리티
 * clsx와 tailwind-merge를 결합하여 조건부 클래스와 중복 클래스를 처리
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 날짜 포맷팅
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 금액 포맷팅 (원화)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

/**
 * 슬러그 생성
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * 텍스트 자르기
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 외부 이미지 URL을 프록시 URL로 변환
 * - Notion API 이미지: 약 1시간 후 만료되므로 프록시를 통해 캐싱
 * - Unsplash 이미지: Next.js Image 도메인 제한 우회
 */
export function getProxiedImageUrl(url: string): string {
  if (!url) return '';

  // Already proxied
  if (url.startsWith('/api/image')) return url;

  // Proxy Notion images (expire) and Unsplash images (external domain)
  if (
    url.includes('notion.so') ||
    url.includes('s3.us-west-2.amazonaws.com') ||
    url.includes('prod-files-secure') ||
    url.includes('unsplash.com')
  ) {
    return `/api/image?url=${encodeURIComponent(url)}`;
  }

  return url;
}
