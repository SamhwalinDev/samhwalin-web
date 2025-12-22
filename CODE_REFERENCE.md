# 삼활인 코드 레퍼런스

> 마지막 업데이트: 2025-12-10
> 이 문서는 AI 어시스턴트가 코드 작업 시 참조하는 핵심 코드 구조입니다.

## 📁 프로젝트 구조 개요

```
samhwalin-web/
├── app/
│   ├── page.tsx                 # 홈페이지
│   ├── layout.tsx               # 루트 레이아웃
│   ├── about/page.tsx           # 프로젝트 소개
│   ├── elders/                  # 어르신 (NEW)
│   │   ├── page.tsx             # 어르신 목록
│   │   └── [id]/page.tsx        # 어르신 상세
│   ├── hwalseo/
│   │   ├── page.tsx             # 활서 목록
│   │   └── [slug]/page.tsx      # 활서 상세
│   ├── donate/
│   │   ├── page.tsx             # 후원 페이지
│   │   └── thank-you/page.tsx   # 후원 감사
│   ├── postcard/
│   │   └── thank-you/page.tsx   # 엽서 감사
│   └── api/
│       ├── donation/route.ts    # 후원 API
│       ├── postcard/route.ts    # 엽서 API
│       ├── subscribe/route.ts   # 구독 API (NEW)
│       └── image/route.ts       # 이미지 프록시
├── components/
│   ├── ui/                      # Button, Input, Card, ProgressBar
│   ├── layout/                  # Header, Footer, Container, Section
│   └── features/                # 기능 컴포넌트 (아래 상세)
├── lib/
│   ├── notion.ts                # Notion API 함수
│   └── utils.ts                 # 유틸리티 함수
└── types/
    └── index.ts                 # TypeScript 타입 정의
```

---

## 🔧 lib/notion.ts - Notion API 함수

### Database IDs (환경변수)
```typescript
NOTION_HWALSEO_DATABASE_ID   // 활서
NOTION_ELDER_DATABASE_ID     // 어르신 (NEW)
NOTION_DONATION_DATABASE_ID  // 후원
NOTION_POSTCARD_DATABASE_ID  // 엽서
NOTION_SUBSCRIBE_DATABASE_ID // 구독 (NEW)
NOTION_SETTINGS_DATABASE_ID  // 설정
```

### 활서(Hwalseo) 함수
```typescript
// 활서 목록 조회 (Published 상태만)
async function getHwalseoList(): Promise<HwalseoCard[]>

// 슬러그로 활서 상세 조회
async function getHwalseoBySlug(slug: string): Promise<Hwalseo | null>

// 관련 활서 조회 (같은 테마)
async function getRelatedHwalseos(currentId: string, theme: string, limit?: number): Promise<HwalseoCard[]>

// 활서 테마 목록 조회
async function getHwalseoThemes(): Promise<string[]>

// 특정 어르신의 활서 목록
async function getHwalseosByElderName(elderName: string): Promise<HwalseoCard[]>
```

### 어르신(Elder) 함수 (NEW)
```typescript
// 어르신 목록 조회
async function getElderList(): Promise<ElderCard[]>

// ID로 어르신 상세 조회
async function getElderById(id: string): Promise<Elder | null>

// 이름으로 어르신 조회
async function getElderByName(name: string): Promise<Elder | null>

// 지역 목록 조회
async function getElderRegions(): Promise<string[]>
```

### 후원/엽서/구독 함수
```typescript
// 후원 통계 조회
async function getDonationStats(): Promise<DonationStats>

// 후원 생성
async function createDonation(data: { name: string; amount: number; type: string }): Promise<Result>

// 엽서 생성
async function createPostcard(data: PostcardData): Promise<Result>

// 구독자 생성 (NEW)
async function createSubscriber(data: { email: string; source: string }): Promise<Result>
```

### 헬퍼 함수
```typescript
// 페이지 블록 → 마크다운 변환
async function getPageContent(pageId: string): Promise<string>
function blocksToMarkdown(blocks: any[]): string
function richTextToString(richText: any[]): string
```

---

## 📦 types/index.ts - 타입 정의

### Hwalseo 타입
```typescript
interface Hwalseo {
  id: string;
  title: string;
  slug: string;
  elderName: string;
  elderBirthYear: number;
  elderGender?: '남성' | '여성';
  elderPhoto?: string;      // 어르신 프로필 사진
  elderBio?: string;        // 어르신 약력
  theme: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: 'Published' | 'Draft';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface HwalseoCard {
  id: string;
  title: string;
  slug: string;
  elderName: string;
  elderBirthYear: number;
  elderGender?: '남성' | '여성';
  elderPhoto?: string;
  elderBio?: string;
  theme: string;
  excerpt: string;
  coverImage: string;       // required (빈 문자열 가능)
  publishedAt: string;
}
```

### Elder 타입 (NEW)
```typescript
interface Elder {
  id: string;
  name: string;
  photo: string;
  birthYear: number;
  gender?: '남성' | '여성';
  region: string;
  introduction: string;
  bio?: string;
  hwalseoCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ElderCard {
  id: string;
  name: string;
  photo: string;
  birthYear: number;
  gender?: '남성' | '여성';
  region: string;
  introduction: string;
  hwalseoCount?: number;
}
```

### 기타 타입
```typescript
interface Donation {
  id: string;
  name: string;
  amount: number;
  message?: string;
  status: string;
  date: string;
}

interface Postcard {
  id: string;
  name: string;
  email: string;
  address: string;
  depositorName: string;
  elderName: string;
  hwalseoSlug: string;
  message: string;
  amount: number;
  status: string;
  date: string;
}

interface DonationOption {
  amount: number;
  label: string;
  impact: string;
  isDefault?: boolean;
}
```

### 상수
```typescript
// 네비게이션 링크
const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/elders', label: '어르신' },  // 변경됨
  { href: '/about', label: '소개' },
  { href: '/donate', label: '후원하기' },
];

// 후원 금액 옵션
const DONATION_OPTIONS: Record<'oneTime' | 'recurring', DonationOption[]>
```

---

## 🛠 lib/utils.ts - 유틸리티 함수

```typescript
// Tailwind 클래스 병합 (clsx + tailwind-merge)
function cn(...inputs: ClassValue[]): string

// 날짜 포맷팅 (한국어)
function formatDate(dateString: string): string
// 예: "2025년 1월 15일"

// 금액 포맷팅 (원화)
function formatCurrency(amount: number): string
// 예: "50,000원"

// 슬러그 생성
function generateSlug(title: string): string

// 텍스트 자르기
function truncateText(text: string, maxLength: number): string

// ⭐ Notion 이미지 프록시 URL 변환 (중요!)
function getProxiedImageUrl(url: string): string
// Notion 이미지 URL → /api/image?url=... 형태로 변환
// 이미지 만료 문제 해결
```

---

## 🎨 components/features/ - 주요 컴포넌트

| 컴포넌트 | 용도 |
|---------|------|
| `HwalseoCard.tsx` | 활서 카드 (목록용) |
| `HwalseoFilter.tsx` | 활서 필터 (테마/어르신) |
| `HwalseoPreview.tsx` | 홈페이지 활서 미리보기 |
| `HwalseoCta.tsx` | 활서 하단 CTA |
| `ElderCard.tsx` | 어르신 카드 (NEW) |
| `ElderFilter.tsx` | 어르신 필터 (NEW) |
| `DonationForm.tsx` | 후원 폼 (금액 선택 → 정보 입력 → 결제) |
| `DonationProgress.tsx` | 후원 진행률 바 |
| `SocialProof.tsx` | 소셜 프루프 (후원자 수 등) |
| `PostcardModal.tsx` | 엽서 모달 (주소검색 포함) |
| `EmailSubscribeForm.tsx` | 이메일 구독 폼 (NEW) |
| `HeroSection.tsx` | 홈 히어로 섹션 |
| `MissionSection.tsx` | 미션 섹션 |

---

## 🌐 API Routes

### POST /api/donation
```typescript
// Request
{ name: string; amount: number; type: 'oneTime' | 'recurring' }

// Response
{ success: true, id: string } | { error: string }
```

### POST /api/postcard
```typescript
// Request
{
  name: string;
  email: string;
  address: string;
  depositorName: string;
  elderName: string;
  hwalseoSlug: string;
  message: string;
  amount: number;
}

// Response
{ success: true, id: string } | { error: string }
```

### POST /api/subscribe (NEW)
```typescript
// Request
{ email: string; source?: string }

// Response
{ success: true } | { error: string }
// 409: 이미 구독 중
```

### GET /api/image
```typescript
// Query
?url={encodedNotionImageUrl}

// Response
이미지 바이너리 (캐시: 7일)
```

---

## ⚠️ 코드 작성 시 주의사항

### 1. 이미지 URL 처리
```typescript
// ✅ 올바른 방법
import { getProxiedImageUrl } from '@/lib/utils';
const imageUrl = getProxiedImageUrl(page.cover?.file?.url || '');

// ❌ 잘못된 방법 - Notion 이미지 URL 직접 사용 금지
const imageUrl = page.cover?.file?.url;
```

### 2. 타입 일관성
```typescript
// coverImage는 required (빈 문자열 fallback)
coverImage: getProxiedImageUrl(page.cover?.file?.url || '')

// elderPhoto는 optional
elderPhoto: page.properties.ElderPhoto?.files?.[0]?.file?.url || undefined
```

### 3. Notion 속성 접근
```typescript
// Title 속성
page.properties.Title?.title?.[0]?.plain_text || ''

// Rich Text 속성  
page.properties.Excerpt?.rich_text?.[0]?.plain_text || ''

// Number 속성
page.properties.BirthYear?.number || 1940

// Select 속성
page.properties.Theme?.select?.name || ''

// Files 속성 (이미지)
page.properties.Photo?.files?.[0]?.file?.url || 
page.properties.Photo?.files?.[0]?.external?.url || ''

// Date 속성
page.properties.PublishedAt?.date?.start || ''
```

### 4. ISR Revalidation
```typescript
// 페이지별 캐시 시간
export const revalidate = 60;     // 홈, 목록 페이지
export const revalidate = 3600;   // 상세 페이지
export const revalidate = 300;    // About 페이지
```

### 5. Suspense 필수
```typescript
// useSearchParams 사용 시 반드시 Suspense로 감싸기
<Suspense fallback={<Loading />}>
  <FilterComponent />
</Suspense>
```

---

## 🔗 관련 문서

- `MAINTENANCE.md` - 기술 유지보수 가이드
- `samhwalin-maintenance-guide.md` - 비개발자용 운영 가이드
- `SAMHWALIN_PROJECT_CONTEXT.md` - 프로젝트 전체 컨텍스트

