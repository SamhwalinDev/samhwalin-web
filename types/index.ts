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
  quote?: string;              // Before I Die 명언
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
  subtitle?: string;        // 부제목
  elderName: string;        // 어르신 이름 (레거시, elderId 사용 권장)
  elderId?: string;         // 어르신 DB 참조
  elder?: Elder;            // 어르신 데이터 (상세 조회 시)
  theme: string[];          // 테마 (예: ['전쟁의 기억', '인생의 지혜'])
  excerpt: string;          // 요약
  content: string;          // 본문 (Markdown 또는 HTML)
  coverImage: string;       // 대표 이미지 URL
  publishedAt: string;      // 발행일
  createdAt: string;
  updatedAt: string;
  
  // 스토리텔링 구조를 위한 새 필드들
  hook?: string;            // 훅 - 강렬한 첫 문장
  bio?: string;             // 맥락 - 인터뷰 대상자 소개
  keyTakeaway?: string;     // 핵심 교훈
  behind?: string;          // 뒷이야기 - 인터뷰 후기
  toReader?: string;        // 독자에게 전하는 말
  
  // 추가 메타데이터
  region?: string;          // 지역
  readingTime?: number;     // 예상 읽기 시간 (분)
  likes?: number;          // 좋아요 수
}

/**
 * 활서 카드용 간략 타입
 */
export interface HwalseoCard {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;        // 부제목
  elderName: string;
  elderId?: string;
  theme: string[];
  excerpt: string;
  coverImage: string;
  publishedAt: string;
}

/**
 * 질문 (Question) 타입
 */
export interface Question {
  id: string;
  question: string;
  nickname: string;
  hwalseoId: string;
  elderId?: string;
  answer?: string;
  status: '대기중' | '답변완료';
  isPublic: boolean;
  createdAt: string;
}

/**
 * 질문 입력 타입
 */
export interface QuestionInput {
  question: string;
  nickname: string;
  hwalseoId: string;
  elderId?: string;
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
  { label: '삼활인 소개', href: '/about' },
  { label: '활서', href: '/hwalseo' },
  { label: '프로필', href: '/elders' },
  { label: 'Q&A', href: '/qna' },
  { label: '테스형 AI', href: '/testype' },
  { label: '해답 찾기', href: '/search' },
];
