# 삼활인 웹사이트 유지보수 문서

> 이 문서는 개발자/기술 담당자를 위한 유지보수 가이드입니다.

## 📌 프로젝트 개요

| 항목 | 정보 |
|------|------|
| **프로덕션 URL** | https://samhwalin.org |
| **GitHub** | https://github.com/SamhwalinDev/samhwalin-web |
| **호스팅** | Vercel |
| **CMS** | Notion API |
| **에러 모니터링** | Sentry |
| **DNS** | Cloudflare (DNS only) |

---

## 🛠 기술 스택

- **Framework**: Next.js 14.1.0 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **CMS**: Notion API (@notionhq/client)
- **Deployment**: Vercel
- **Monitoring**: Sentry (@sentry/nextjs)

---

## 🔑 환경 변수

### Vercel 환경 변수

```bash
NOTION_API_KEY=secret_xxx
NOTION_HWALSEO_DATABASE_ID=2b9862004b7480bc9f9dc71646217b85
NOTION_DONATION_DATABASE_ID=2b9862004b7480809f8cc1c5358a238a
NOTION_SETTINGS_DATABASE_ID=2b9862004b748085a7a9f33906aa187d
NOTION_POSTCARD_DATABASE_ID=2b9862004b7480e0af69f3127956ca6f
NEXT_PUBLIC_KAKAOPAY_LINK=https://qr.kakaopay.com/FddKUcjvV
SENTRY_AUTH_TOKEN=sntrys_xxx
```

### 로컬 개발 환경

`.env.local` 파일 생성:

```bash
cp .env.example .env.local
# 환경 변수 값 입력
```

---

## 📁 프로젝트 구조

```
samhwalin-web/
├── app/
│   ├── page.tsx                 # 홈페이지
│   ├── about/page.tsx           # 프로젝트 소개
│   ├── hwalseo/
│   │   ├── page.tsx             # 활서 목록
│   │   └── [slug]/page.tsx      # 활서 상세
│   ├── postcard/
│   │   └── thank-you/page.tsx   # 엽서 감사 페이지
│   └── api/
│       ├── postcard/route.ts    # 엽서 API
│       └── image/route.ts       # 이미지 프록시 API
├── components/
│   ├── ui/                      # 기본 UI 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   └── features/                # 기능 컴포넌트
├── lib/
│   ├── notion.ts                # Notion API 함수
│   └── utils.ts                 # 유틸리티 함수
├── types/
│   └── index.ts                 # TypeScript 타입 정의
├── sentry.client.config.ts      # Sentry 클라이언트 설정
├── sentry.server.config.ts      # Sentry 서버 설정
├── sentry.edge.config.ts        # Sentry 엣지 설정
└── instrumentation.ts           # Next.js instrumentation
```

---

## 🚀 배포

### 프로덕션 배포

```bash
vercel --prod
```

### 강제 재빌드 (캐시 무시)

```bash
vercel --prod --force
```

### 롤백

1. Vercel Dashboard → Deployments
2. 이전 정상 배포 선택 → ⋯ → Promote to Production

---

## 📊 Notion 데이터베이스 스키마

### 활서 (Hwalseo)

| 속성명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| Title | title | ✅ | 활서 제목 |
| Slug | rich_text | ✅ | URL 슬러그 (영문, 하이픈) |
| ElderName | rich_text | ✅ | 어르신 성함 |
| ElderAge | number | | 어르신 나이 |
| Theme | select | ✅ | 테마 |
| Excerpt | rich_text | ✅ | 요약문 |
| Status | select | ✅ | Published / Draft |
| PublishedAt | date | ✅ | 발행일 |
| (cover) | page cover | ✅ | 커버 이미지 |

### 엽서 (Postcard)

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Name | title | 보내는 분 |
| Email | email | 이메일 |
| ElderName | rich_text | 받는 어르신 |
| HwalseoSlug | rich_text | 관련 활서 |
| Message | rich_text | 메시지 |
| Amount | number | 금액 |
| Status | select | 결제대기/확인완료/발송완료 |
| Date | date | 신청일 |

---

## ⚙️ ISR (Incremental Static Regeneration)

| 페이지 | revalidate | 설명 |
|--------|------------|------|
| `/` | 60초 | 홈페이지 |
| `/hwalseo` | 60초 | 활서 목록 |
| `/about` | 300초 | 소개 페이지 |
| `/hwalseo/[slug]` | 동적 | 활서 상세 (매 요청) |

---

## 🖼 이미지 처리

### Notion 이미지 만료 문제 해결

Notion API로 가져온 이미지 URL은 약 1시간 후 만료됨.
`/api/image` 프록시를 통해 해결:

```typescript
// lib/utils.ts
export function getProxiedImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('/api/image')) return url;
  
  if (
    url.includes('notion.so') ||
    url.includes('s3.us-west-2.amazonaws.com') ||
    url.includes('prod-files-secure')
  ) {
    return `/api/image?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}
```

### 프록시 캐싱

- 브라우저 캐시: 1일 (`max-age=86400`)
- CDN 캐시: 7일 (`s-maxage=604800`)

---

## 🔍 에러 모니터링 (Sentry)

### 설정 파일

- `sentry.client.config.ts` - 클라이언트 사이드
- `sentry.server.config.ts` - 서버 사이드
- `sentry.edge.config.ts` - 엣지 런타임
- `instrumentation.ts` - Next.js instrumentation

### 기능

- ✅ 클라이언트/서버 에러 추적
- ✅ 성능 모니터링 (Tracing)
- ✅ Session Replay
- ✅ Ad blocker 우회 (`/monitoring` 터널)

### 대시보드 접속

https://sentry.io → samhwalin-web 프로젝트

---

## 📝 코드 수정 시 주의사항

### lib/notion.ts

- Notion 속성명 변경 시 이 파일도 수정 필요
- `coverImage`는 빈 문자열('')로 fallback
- 모든 이미지 URL은 `getProxiedImageUrl()` 사용

### types/index.ts

- `HwalseoCard.coverImage`는 required (string)
- 새 Notion 속성 추가 시 타입도 업데이트

### 감사 페이지 (thank-you)

- `useSearchParams`는 반드시 `Suspense`로 감싸기
- 클라이언트 컴포넌트 분리 필요

### next.config.js

- Sentry 설정이 포함되어 있음
- `withSentryConfig` 래퍼 유지 필요

---

## 🐛 알려진 이슈

1. **Hydration Error**: 서버/클라이언트 렌더링 불일치 시 발생. 동적 콘텐츠 주의.
2. **환경 변수**: Vercel 대시보드에서 직접 설정 필요

---

## 📞 긴급 연락처

| 역할 | 담당 | 연락처 |
|------|------|--------|
| 개발 | 박주원 | (연락처) |
| 운영 | 강현서 | (연락처) |

---

## 🔗 관련 링크

- [Notion API 문서](https://developers.notion.com/)
- [Next.js 14 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Vercel 문서](https://vercel.com/docs)
- [Sentry Next.js 문서](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

*마지막 업데이트: 2025-11-29*
