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
 * 제목에서 // 또는 \\ 를 줄바꿈으로 변환
 * Notion에서 제목에 // 또는 \\를 입력하면 줄바꿈으로 표시됨
 * @returns 줄바꿈으로 분리된 문자열 배열
 */
export function formatTitleParts(title: string): string[] {
  return title.split(/\/\/|\\\\/).map((part) => part.trim());
}

/**
 * 제목을 단일 라인으로 변환 (메타데이터, 공유 등에 사용)
 * // 또는 \\ 구분자를 공백으로 대체
 */
export function formatTitleFlat(title: string): string {
  return title
    .split(/\/\/|\\\\/)
    .map((part) => part.trim())
    .join(' ');
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

/**
 * Notion 텍스트를 HTML로 변환
 * - // → <br /> (줄바꿈)
 * - **text** → <strong>text</strong> (볼드)
 * @param text 원본 텍스트
 * @returns HTML 문자열 (dangerouslySetInnerHTML에 사용 가능)
 */
export function processNotionText(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    // Convert **text** to bold (non-greedy match)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert // to line breaks
    .replace(/\/\//g, '<br />');
}

/**
 * Get icon for bio line based on keywords
 */
export function getBioIcon(line: string): string {
  const iconMap: Record<string, string> = {
    // 시간/출생
    '년생': '📅',
    '출생': '📍',
    '태어': '📍',

    // 교육
    '학교': '🎓',
    '입학': '🎓',
    '졸업': '🎓',
    '교사': '👨‍🏫',
    '선생': '👨‍🏫',
    '교수': '👨‍🏫',

    // 역사/경험
    '전쟁': '⚔️',
    '해방': '🕊️',
    '군대': '🎖️',
    '군인': '🎖️',

    // 직업/경력
    '회사': '🏢',
    '사업': '💼',
    '농사': '🌾',
    '농업': '🌾',
    '어업': '🐟',
    '공무원': '🏛️',

    // 종교
    '교회': '⛪',
    '장로': '⛪',
    '집사': '⛪',
    '목사': '⛪',
    '절': '🛕',
    '불교': '🛕',
    '스님': '🛕',

    // 음악/예술
    '연주': '🎵',
    '지휘': '🎵',
    '노래': '🎤',
    '합창': '🎵',
    '악기': '🎵',
    '아코디언': '🪗',
    '피아노': '🎹',
    '그림': '🎨',
    '미술': '🎨',

    // 가족
    '아들': '👨‍👩‍👦',
    '딸': '👨‍👩‍👧',
    '자녀': '👨‍👩‍👧‍👦',
    '손주': '👶',
    '손자': '👶',
    '손녀': '👶',
    '아버지': '👨‍👩‍👦',
    '어머니': '👨‍👩‍👦',
    '할아버지': '👴',
    '할머니': '👵',
    '남편': '💑',
    '아내': '💑',
    '결혼': '💍',

    // 출판/저술
    '출간': '📖',
    '책': '📖',
    '저서': '📖',
    '회고록': '📖',
    '글': '✍️',

    // 취미/활동
    '여행': '✈️',
    '등산': '🏔️',
    '운동': '🏃',
    '요리': '🍳',
    '봉사': '🤝',

    // 건강
    '병원': '🏥',
    '수술': '🏥',
    '건강': '💪',

    // 수상/성취
    '수상': '🏆',
    '상': '🏆',
    '표창': '🏆',
  };

  // Check each keyword
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (line.includes(keyword)) {
      return icon;
    }
  }

  // Default icon if no match
  return '•';
}
