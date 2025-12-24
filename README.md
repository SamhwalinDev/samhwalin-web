# 삼활인 웹사이트

> Making People Alive and Connected

삼활인의 공식 웹사이트입니다. 어르신들의 삶을 기록한 '활서'를 발행하고, 세대 간 교류를 만들어갑니다.

## 기술 스택

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **CMS**: [Notion API](https://developers.notion.com/)
- **Hosting**: [Vercel](https://vercel.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)

## 시작하기

### 1. 의존성 설치

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일을 생성합니다:

```bash
cp .env.example .env.local
```

필요한 환경 변수를 설정합니다:

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_HWALSEO_DATABASE_ID=your_database_id
```

### 3. Notion 데이터베이스 설정

Notion에서 활서 데이터베이스를 생성하고 다음 속성을 추가합니다:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | Title | 활서 제목 |
| Slug | Rich Text | URL 슬러그 |
| ElderName | Rich Text | 어르신 이름 |
| ElderAge | Number | 어르신 나이 |
| Theme | Select | 테마 (전쟁의 기억, 인생의 지혜 등) |
| Excerpt | Rich Text | 요약 |
| Status | Select | Published / Draft |
| PublishedAt | Date | 발행일 |

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 프로젝트 구조

```
samhwalin-web/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈페이지
│   ├── hwalseo/             # 활서 페이지
│   ├── donate/              # 후원 페이지
│   └── about/               # 소개 페이지
├── components/
│   ├── ui/                  # 기본 UI 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   └── features/            # 기능별 컴포넌트
├── lib/
│   ├── notion.ts            # Notion API 클라이언트
│   └── utils.ts             # 유틸리티 함수
├── styles/
│   └── globals.css          # 글로벌 스타일
├── types/
│   └── index.ts             # TypeScript 타입
└── public/                  # 정적 파일
```

## 스크립트

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm run start

# 린트
npm run lint

# 타입 체크
npm run type-check
```

## 배포

Vercel에 자동 배포됩니다. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

### 수동 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

## 디자인 시스템

디자인 시스템 문서는 `/samhwalin-design-system/DESIGN-SYSTEM.md`를 참고하세요.

### 주요 컬러

| 용도 | HEX |
|------|-----|
| Primary (오렌지) | #F49249 |
| Secondary (블루그레이) | #7B7FA8 |
| Accent (세이지 그린) | #7A9B7E |
| Base (아이보리) | #FFFEF9 |
| Text (차콜) | #2D3748 |

## 컴포넌트 사용법

### Button

```tsx
import { Button } from '@/components/ui';

<Button variant="primary">기본 버튼</Button>
<Button variant="cta" size="lg">후원하기</Button>
<Button variant="secondary">보조 버튼</Button>
```

### Card

```tsx
import { Card, CardBody, CardTitle } from '@/components/ui';

<Card>
  <CardImage src="/image.jpg" alt="설명" />
  <CardBody>
    <CardTitle>제목</CardTitle>
    <p>내용</p>
  </CardBody>
</Card>
```

### Modal

```tsx
import { Modal } from '@/components/ui';

<Modal isOpen={isOpen} onClose={handleClose} title="제목">
  모달 내용
</Modal>
```

## 유지보수

### 콘텐츠 관리

- 활서 콘텐츠는 Notion에서 관리합니다.
- Notion 페이지를 수정하면 웹사이트에 자동으로 반영됩니다 (ISR 적용 시).
- 새 활서를 발행할 때는 Status를 "Published"로 변경하세요.

### 코드 수정

1. 브랜치 생성: `git checkout -b feature/기능명`
2. 코드 수정
3. 커밋: `git commit -m "설명"`
4. 푸시: `git push origin feature/기능명`
5. PR 생성 및 리뷰

## 문의

- 이메일: contact@samhwalin.org
- 인스타그램: [@samhwalin](https://instagram.com/samhwalin)

---

Made with ❤️ by 삼활인 팀

Last Updated: 2024-12-24
