/**
 * 어르신 (Elder) 타입
 */
export interface Elder {
  id: string;
  name: string;
  slug: string;
  photo?: string;
  birthYear?: number;
  gender?: '남성' | '여성';
  region?: string;
  introduction?: string;
  bio?: string;
  status: 'Published' | 'Draft';
  hwalseoIds: string[];
}

/**
 * 어르신 카드용 간략 타입
 */
export interface ElderCard {
  id: string;
  name: string;
  slug: string;
  photo?: string;
  birthYear?: number;
  gender?: '남성' | '여성';
  region?: string;
  introduction?: string;
  hwalseoCount: number;
}

/**
 * 활서 (Hwalseo) 타입
 */
export interface Hwalseo {
  id: string;
  slug: string;
  title: string;
  elderName: string;        // 어르신 이름 (레거시, elderId 사용 권장)
  elderId?: string;         // 어르신 DB 참조
  elder?: Elder;            // 어르신 데이터 (상세 조회 시)
  theme: string;            // 테마 (예: 전쟁의 기억, 인생의 지혜)
  excerpt: string;          // 요약
  content: string;          // 본문 (Markdown 또는 HTML)
  coverImage: string;       // 대표 이미지 URL
  publishedAt: string;      // 발행일
  createdAt: string;
  updatedAt: string;
}

/**
 * 활서 카드용 간략 타입
 */
export interface HwalseoCard {
  id: string;
  slug: string;
  title: string;
  elderName: string;
  elderId?: string;
  theme: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
}

/**
 * 팀 멤버
 */
export interface TeamMember {
  name: string;
  role: string;
  description?: string;
  image?: string;
}

/**
 * 네비게이션 링크
 */
export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: '활서', href: '/hwalseo' },
  { label: '어르신들', href: '/elders' },
  { label: '삼활인', href: '/about' },
];
