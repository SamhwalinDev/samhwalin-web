# 삼활인 웹사이트 핸드오프 문서

> 마지막 업데이트: 2024-12-23

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [시작하기](#시작하기)
3. [프로젝트 구조](#프로젝트-구조)
4. [환경 변수](#환경-변수)
5. [주요 기능](#주요-기능)
6. [개발 워크플로우](#개발-워크플로우)
7. [배포](#배포)
8. [문서 목록](#문서-목록)
9. [최근 변경 사항](#최근-변경-사항)
10. [연락처](#연락처)

---

## 프로젝트 개요

| 항목 | 정보 |
|------|------|
| **프로젝트명** | 삼활인 (Samhwalin) |
| **설명** | 어르신들의 인생 이야기를 기록하고 세대 간 교류를 만드는 플랫폼 |
| **프로덕션 URL** | https://samhwalin.org |
| **GitHub** | https://github.com/SamhwalinDev/samhwalin-web |
| **호스팅** | Vercel |
| **CMS** | Notion API |
| **에러 모니터링** | Sentry |

### 기술 스택

| 카테고리 | 기술 | 버전 |
|----------|------|------|
| Framework | Next.js (App Router) | 14.1.0 |
| Language | TypeScript | 5.3.3 |
| Styling | Tailwind CSS | 3.4.1 |
| CMS | Notion API | @notionhq/client 2.2.14 |
| Icons | Lucide React | 0.312.0 |
| Monitoring | Sentry | @sentry/nextjs 8.0.0 |

---

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/SamhwalinDev/samhwalin-web.git
cd samhwalin-web
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env.local
# .env.local 파일을 열어 환경 변수 값 입력
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

### 5. NPM 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run type-check` | TypeScript 타입 체크 |
| `npm run test:notion` | Notion API 연결 테스트 |

---

## 프로젝트 구조

```
samhwalin-web/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 홈페이지
│   ├── layout.tsx                # 루트 레이아웃
│   ├── about/page.tsx            # 프로젝트 소개
│   ├── elders/                   # 어르신
│   │   ├── page.tsx              # 어르신 목록
│   │   └── [slug]/page.tsx       # 어르신 상세
│   ├── hwalseo/                  # 활서
│   │   ├── page.tsx              # 활서 목록
│   │   └── [slug]/page.tsx       # 활서 상세
│   ├── donate/                   # 후원
│   │   ├── page.tsx              # 후원 페이지
│   │   └── thank-you/page.tsx    # 후원 감사
│   ├── postcard/
│   │   └── thank-you/page.tsx    # 엽서 감사
│   ├── monitoring/               # Sentry 터널
│   └── api/
│       ├── donation/route.ts     # 후원 API
│       ├── postcard/route.ts     # 엽서 API
│       ├── subscribe/route.ts    # 뉴스레터 구독 API
│       └── image/route.ts        # 이미지 프록시 API
├── components/
│   ├── ui/                       # Button, Input, Card, Modal, ProgressBar
│   ├── layout/                   # Header, Footer, Container
│   └── features/                 # 기능 컴포넌트 (아래 상세)
├── lib/
│   ├── notion.ts                 # Notion API 함수
│   └── utils.ts                  # 유틸리티 함수
├── types/
│   └── index.ts                  # TypeScript 타입 정의
├── styles/
│   └── globals.css               # 글로벌 스타일
├── public/images/                # 정적 이미지
├── scripts/                      # 유틸리티 스크립트
├── sentry.*.config.ts            # Sentry 설정
└── instrumentation.ts            # Next.js instrumentation
```

### 주요 컴포넌트 (components/features/)

| 컴포넌트 | 용도 |
|---------|------|
| `HwalseoCard.tsx` | 활서 카드 (목록용) |
| `HwalseoFilter.tsx` | 활서 필터 (테마/검색) |
| `HwalseoPreview.tsx` | 홈페이지 활서 미리보기 |
| `HwalseoCta.tsx` | 활서 하단 CTA |
| `ElderCard.tsx` | 어르신 카드 |
| `ElderFilter.tsx` | 어르신 필터 (지역/검색) |
| `ElderCta.tsx` | 어르신 페이지 CTA |
| `DonationForm.tsx` | 후원 폼 |
| `DonationProgress.tsx` | 후원 진행률 바 |
| `SocialProof.tsx` | 소셜 프루프 |
| `PostcardModal.tsx` | 엽서 모달 |
| `EmailSubscribeForm.tsx` | 이메일 구독 폼 |
| `HeroSection.tsx` | 홈 히어로 섹션 |
| `MissionSection.tsx` | 미션 섹션 |
| `MobileTableOfContents.tsx` | 모바일 목차 |

---

## 환경 변수

`.env.example` 파일 참조. 아래는 필수/선택 구분:

### 필수 (Notion API)

| 변수명 | 설명 |
|--------|------|
| `NOTION_API_KEY` | Notion Integration Token |
| `NOTION_HWALSEO_DATABASE_ID` | 활서 데이터베이스 ID |
| `NOTION_ELDER_DATABASE_ID` | 어르신 데이터베이스 ID |
| `NOTION_DONATION_DATABASE_ID` | 후원 데이터베이스 ID |
| `NOTION_SETTINGS_DATABASE_ID` | 설정 데이터베이스 ID |
| `NOTION_POSTCARD_DATABASE_ID` | 엽서 데이터베이스 ID |
| `NOTION_SUBSCRIBE_DATABASE_ID` | 구독자 데이터베이스 ID |

### 필수 (결제)

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_KAKAOPAY_LINK` | 카카오페이 송금 링크 |

### 선택 (에러 모니터링)

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN |
| `SENTRY_ORG` | Sentry 조직 |
| `SENTRY_PROJECT` | Sentry 프로젝트 |
| `SENTRY_AUTH_TOKEN` | Sentry Auth Token (소스맵 업로드용) |

---

## 주요 기능

### 1. 활서 (Hwalseo)
- Notion 데이터베이스에서 어르신 이야기 조회
- 테마별 필터링, 검색
- 마크다운 콘텐츠 렌더링 (Notion 블록 → 마크다운 → HTML)
- 제목에 `//` 사용 시 줄바꿈으로 표시

### 2. 어르신 (Elders)
- 어르신 프로필 조회
- 지역별 필터링
- 어르신별 활서 연결

### 3. 후원 (Donations)
- 일시/정기 후원 선택
- 카카오페이 송금 연동
- 후원 목표 진행률 표시

### 4. 엽서 (Postcards)
- 활서 읽은 후 감사 엽서 전송
- 후원과 연계

### 5. 뉴스레터 구독
- 이메일 구독 (중복 체크)
- 구독 출처 추적 (homepage, footer, hwalseo)

### 6. 이미지 프록시
- Notion 이미지 URL 만료 문제 해결
- `/api/image?url=...` 형태로 프록시
- 7일 CDN 캐싱

---

## 개발 워크플로우

### 브랜치 전략

```
main (프로덕션)
  └── feature/* (기능 개발)
```

### 코드 작성 시 주의사항

1. **이미지 URL 처리**
   ```typescript
   // ✅ 올바른 방법
   import { getProxiedImageUrl } from '@/lib/utils';
   const imageUrl = getProxiedImageUrl(page.cover?.file?.url || '');

   // ❌ 잘못된 방법 - Notion 이미지 URL 직접 사용 금지
   const imageUrl = page.cover?.file?.url;
   ```

2. **useSearchParams 사용 시 Suspense 필수**
   ```tsx
   <Suspense fallback={<Loading />}>
     <FilterComponent />
   </Suspense>
   ```

3. **색상 토큰 사용** (2024-12 업데이트)
   - `text-gray-900` → `text-foreground`
   - `text-gray-600/500` → `text-muted-foreground`
   - `bg-gray-50` → `bg-muted`
   - `border-gray-200` → `border-border`

---

## 배포

### 자동 배포
- `main` 브랜치에 푸시 시 Vercel 자동 배포

### 수동 배포

```bash
# 프로덕션 배포
vercel --prod

# 강제 재빌드 (캐시 무시)
vercel --prod --force
```

### 롤백
1. Vercel Dashboard → Deployments
2. 이전 정상 배포 선택 → ⋯ → Promote to Production

---

## 문서 목록

| 문서 | 설명 |
|------|------|
| `README.md` | 프로젝트 소개 및 시작 가이드 |
| `CLAUDE.md` | AI 어시스턴트용 프로젝트 컨텍스트 |
| `CODE_REFERENCE.md` | 코드 구조 레퍼런스 |
| `MAINTENANCE.md` | 기술 유지보수 가이드 |
| `HANDOFF.md` | 프로젝트 핸드오프 문서 (이 파일) |

---

## 최근 변경 사항

### 2024-12-23
- `de3cef3` fix: simplify search placeholder text
- `7329678` feat: add title line break support with // delimiter
- `9c6f271` docs: update CLAUDE.md with color system documentation

### 2024-12-22
- `6cfa503` Merge branch 'hungry-lehmann' into main
- `ef16e5a` style: apply semantic gray tokens to remaining components (Step 4)
- `8e7d0ef` style: migrate gray utilities to semantic tokens
- `36d5a7a` style: unify color system with design tokens

### 2024-12-20
- `2dd9008` docs: Update CLAUDE.md with rich text rendering documentation
- `683fcdb` fix: improve Notion content rendering
- `0c252ed` perf: optimize auto-generated slug lookup in getHwalseoBySlug
- `86b89fb` feat: implement Elder-based Hwalseo slug generation

### 주요 변경 요약
- **색상 시스템 통합**: 배경색 `#FFFEF9` → `#FFFFFE`, 시맨틱 토큰 마이그레이션 완료
- **제목 줄바꿈**: `//` 구분자로 활서 제목 줄바꿈 지원
- **어르신 기반 슬러그**: 활서 URL이 어르신 이름 기반으로 자동 생성

---

## 연락처

| 역할 | 담당 | 연락처 |
|------|------|--------|
| 개발 | 박주원 | - |
| 운영 | 강현서 | - |
| 일반 문의 | - | contact@samhwalin.org |

### 관련 링크
- [Notion API 문서](https://developers.notion.com/)
- [Next.js 14 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Vercel 문서](https://vercel.com/docs)
- [Sentry Next.js 문서](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

*Made with ❤️ by 삼활인 팀*
