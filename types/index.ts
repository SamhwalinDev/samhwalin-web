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
 * 테마 목록
 */
export const THEMES = [
  '전쟁의 기억',
  '인생의 지혜',
  '가족 이야기',
  '직업과 소명',
  '사랑과 우정',
  '고향의 추억',
] as const;

export type Theme = typeof THEMES[number];

/**
 * 후원 옵션
 */
export interface DonationOption {
  amount: number;
  label: string;
  impact: string;
  isDefault?: boolean;
}

export const DONATION_OPTIONS: {
  oneTime: DonationOption[];
  recurring: DonationOption[];
} = {
  oneTime: [
    { amount: 10000, label: '10,000원', impact: '웹 활서 1편 제작 지원' },
    { amount: 30000, label: '30,000원', impact: '웹 활서 3편 제작 지원', isDefault: true },
    { amount: 50000, label: '50,000원', impact: '어르신 인터뷰 1회 진행' },
    { amount: 100000, label: '100,000원', impact: '실물 활서 1권 제작' },
  ],
  recurring: [
    { amount: 10000, label: '🌱 씨앗 10,000원', impact: '매달 1명의 어르신 이야기 기록' },
    { amount: 30000, label: '🌿 새싹 30,000원', impact: '매달 어르신 3명의 이야기 발행', isDefault: true },
    { amount: 50000, label: '🌳 나무 50,000원', impact: '분기별 실물 활서 1권 제작' },
    { amount: 100000, label: '🌲 숲 100,000원', impact: '월 1권 실물 활서 + 영상 활서' },
  ],
};

/**
 * 팀 멤버
 */
export interface TeamMember {
  name: string;
  role: string;
  description?: string;
  image?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: '강현서', role: '인터뷰·기획·글쓰기' },
  { name: '박주원', role: '디자인·개발·전략' },
  { name: '조혜정', role: '굿즈' },
  { name: '윤희은', role: '영상' },
  { name: '권민지', role: '마케팅·전략' },
];

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
  { label: '후원하기', href: '/donate' },
];

/**
 * 엽서 폼 데이터
 */
export interface PostcardFormData {
  senderName: string;
  message: string;
  agreeToTerms: boolean;
}

/**
 * 후원 폼 데이터
 */
export interface DonationFormData {
  type: 'oneTime' | 'recurring';
  amount: number;
  customAmount?: number;
  name: string;
  email: string;
  phone?: string;
  paymentMethod: 'kakao' | 'toss' | 'bank';
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 구독자 타입
 */
export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: 'footer' | 'homepage' | 'hwalseo';
  status: '활성' | '해지';
}
