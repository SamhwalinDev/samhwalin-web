# Notion Database Schema

> 마지막 업데이트: 2024-12-23

이 문서는 삼활인 웹사이트에서 사용하는 Notion 데이터베이스 스키마를 정의합니다.

## 목차
1. [데이터베이스 개요](#데이터베이스-개요)
2. [활서 (Hwalseo) 데이터베이스](#1-활서-hwalseo-데이터베이스)
3. [어르신 (Elder) 데이터베이스](#2-어르신-elder-데이터베이스)
4. [후원 (Donation) 데이터베이스](#3-후원-donation-데이터베이스)
5. [엽서 (Postcard) 데이터베이스](#4-엽서-postcard-데이터베이스)
6. [구독자 (Subscriber) 데이터베이스](#5-구독자-subscriber-데이터베이스)
7. [설정 (Settings) 데이터베이스](#6-설정-settings-데이터베이스)
8. [속성 타입 참조](#속성-타입-참조)
9. [공통 패턴](#공통-패턴)

---

## 데이터베이스 개요

| 데이터베이스 | 환경변수 | 용도 |
|-------------|---------|------|
| 활서 (Hwalseo) | `NOTION_HWALSEO_DATABASE_ID` | 어르신 이야기 콘텐츠 |
| 어르신 (Elder) | `NOTION_ELDER_DATABASE_ID` | 어르신 프로필 |
| 후원 (Donation) | `NOTION_DONATION_DATABASE_ID` | 후원 기록 |
| 엽서 (Postcard) | `NOTION_POSTCARD_DATABASE_ID` | 엽서 신청 기록 |
| 구독자 (Subscriber) | `NOTION_SUBSCRIBE_DATABASE_ID` | 뉴스레터 구독자 |
| 설정 (Settings) | `NOTION_SETTINGS_DATABASE_ID` | 사이트 설정값 |

### 데이터베이스 관계도

```
┌─────────────┐       ┌─────────────┐
│   Elder     │◄──────│   Hwalseo   │
│  (어르신)    │ 1:N   │   (활서)     │
└─────────────┘       └─────────────┘
       │                     │
       │                     ▼
       │              ┌─────────────┐
       └──────────────│   Postcard  │
                      │   (엽서)     │
                      └─────────────┘
```

---

## 1. 활서 (Hwalseo) 데이터베이스

어르신들의 인생 이야기를 담은 콘텐츠 데이터베이스입니다.

### 환경변수
```
NOTION_HWALSEO_DATABASE_ID
```

### Properties

| Property Name | Notion Type | Required | TypeScript Field | Description |
|---------------|-------------|----------|------------------|-------------|
| Title | `title` | ✅ | `title` | 활서 제목 |
| Slug | `rich_text` | | `slug` | URL 슬러그 (없으면 자동 생성) |
| ElderName | `rich_text` | ✅ | `elderName` | 어르신 이름 (레거시) |
| Elder | `relation` | | `elderId` | 어르신 DB 참조 (Elder DB) |
| Theme | `select` | ✅ | `theme` | 테마 카테고리 |
| Excerpt | `rich_text` | ✅ | `excerpt` | 요약문 |
| Status | `select` | ✅ | - | Published / Draft |
| PublishedAt | `date` | ✅ | `publishedAt` | 발행일 |
| (cover) | page cover | ✅ | `coverImage` | 커버 이미지 |
| (content) | page blocks | | `content` | 본문 (Markdown 변환) |

> **Note**: `ElderAge` property는 더 이상 사용되지 않습니다. 나이는 `Elder.birthYear`에서 동적으로 계산됩니다.
>
> **Note**: `ElderName` property는 더 이상 사용되지 않습니다. 이름은 `Elder` relation에서 동적으로 가져옵니다.
>
> **Note**: `Slug` property는 더 이상 사용되지 않습니다. Slug는 `{elder-slug}-{hwalseo-id-last-4}` 형식으로 자동 생성됩니다.

### Theme 옵션 (select)

| 옵션 | 설명 |
|------|------|
| 전쟁의 기억 | 한국전쟁 등 전쟁 경험 |
| 인생의 지혜 | 삶에서 얻은 교훈 |
| 가족 이야기 | 가족과의 추억 |
| 직업과 소명 | 직업 생활 이야기 |
| 사랑과 우정 | 인간관계 이야기 |
| 고향의 추억 | 고향 관련 이야기 |

### Status 옵션 (select)

| 옵션 | 설명 |
|------|------|
| Published | 공개됨 (웹사이트에 표시) |
| Draft | 초안 (웹사이트에 미표시) |

### Relations

- **Elder** → `Elder` 데이터베이스 (N:1)
  - 활서에 연결된 어르신
  - Hwalseo의 `Elder` relation property

### 코드에서 사용

```typescript
// lib/notion.ts
getHwalseoList()           // 전체 목록 조회 (Published만)
getHwalseoBySlug(slug)     // 슬러그로 상세 조회
getRelatedHwalseos(id, theme, limit)  // 관련 활서 조회
getHwalseoByElderId(elderId)  // 어르신별 활서 조회
getHwalseoThemes()         // 테마 목록 조회
```

### Slug 자동 생성 규칙

Slug가 없는 경우 다음 형식으로 자동 생성:
```
{elder-slug}-{hwalseo-id-last-4}
예: hong-gildong-a1b2
```

---

## 2. 어르신 (Elder) 데이터베이스

인터뷰 대상 어르신들의 프로필 데이터베이스입니다.

### 환경변수
```
NOTION_ELDER_DATABASE_ID
```

### Properties

| Property Name | Notion Type | Required | TypeScript Field | Description |
|---------------|-------------|----------|------------------|-------------|
| Name | `title` | ✅ | `name` | 어르신 성함 |
| Slug | `rich_text` | | `slug` | URL 슬러그 (없으면 ID 사용) |
| Photo | `files` | | `photo` | 프로필 사진 |
| BirthYear | `number` | | `birthYear` | 출생년도 |
| Gender | `select` | | `gender` | 성별 |
| Region | `select` | | `region` | 거주 지역 |
| Introduction | `rich_text` | | `introduction` | 한 줄 소개 |
| Bio | `rich_text` | | `bio` | 상세 약력 |
| Status | `select` | ✅ | `status` | Published / Draft |
| Hwalseo | `relation` | | `hwalseoIds` | 연결된 활서들 (Hwalseo DB) |

### Gender 옵션 (select)

| 옵션 |
|------|
| 남성 |
| 여성 |

### Region 옵션 (select)

지역은 Notion에서 자유롭게 추가 가능. 예시:
- 서울
- 경기
- 강원
- 충북/충남
- 전북/전남
- 경북/경남
- 제주

### Relations

- **Hwalseo** → `Hwalseo` 데이터베이스 (1:N)
  - 어르신에게 연결된 활서 목록

### 코드에서 사용

```typescript
// lib/notion.ts
getElderList()             // 전체 목록 조회 (Published만)
getElderById(elderId)      // ID로 상세 조회
getElderByName(name)       // 이름으로 조회
```

---

## 3. 후원 (Donation) 데이터베이스

후원 기록을 저장하는 데이터베이스입니다.

### 환경변수
```
NOTION_DONATION_DATABASE_ID
```

### Properties

| Property Name | Notion Type | Required | TypeScript Field | Description |
|---------------|-------------|----------|------------------|-------------|
| Name | `title` | ✅ | `name` | 후원자명 |
| Amount | `number` | ✅ | `amount` | 후원 금액 (원) |
| Date | `date` | ✅ | `date` | 후원일 |
| Message | `rich_text` | | `message` | 후원 유형 (일시후원/정기후원) |
| Status | `select` | ✅ | `status` | 상태 |

### Status 옵션 (select)

| 옵션 | 설명 |
|------|------|
| 결제대기 | 후원 신청됨, 입금 대기 |
| 확인완료 | 입금 확인됨 (통계에 반영) |

### 코드에서 사용

```typescript
// lib/notion.ts
getDonationStats()         // 후원 통계 조회 (확인완료만)
createDonation(data)       // 후원 기록 생성
```

### 통계 계산 로직

`getDonationStats()`에서 계산하는 항목:
- `current`: 확인완료된 총 후원금액
- `donorCount`: 고유 후원자 수 (이름 기준)
- `thisMonthCount`: 이번 달 후원 건수
- `todayCount`: 오늘 후원 건수
- `recentDonors`: 최근 후원자 5명

---

## 4. 엽서 (Postcard) 데이터베이스

활서를 읽고 보내는 감사 엽서 신청 기록입니다.

### 환경변수
```
NOTION_POSTCARD_DATABASE_ID
```

### Properties

| Property Name | Notion Type | Required | TypeScript Field | Description |
|---------------|-------------|----------|------------------|-------------|
| Name | `title` | ✅ | `name` | 보내는 분 이름 |
| Email | `email` | ✅ | `email` | 이메일 주소 |
| ElderName | `rich_text` | ✅ | `elderName` | 받는 어르신 이름 |
| HwalseoSlug | `rich_text` | ✅ | `hwalseoSlug` | 관련 활서 슬러그 |
| Message | `rich_text` | ✅ | `message` | 엽서 메시지 |
| Amount | `number` | ✅ | `amount` | 후원 금액 |
| Status | `select` | ✅ | `status` | 상태 |
| Date | `date` | ✅ | `date` | 신청일 |

### Status 옵션 (select)

| 옵션 | 설명 |
|------|------|
| 결제대기 | 신청됨, 입금 대기 |
| 확인완료 | 입금 확인됨 |
| 발송완료 | 엽서 발송됨 |

### 코드에서 사용

```typescript
// lib/notion.ts
createPostcard(data)       // 엽서 신청 생성
```

---

## 5. 구독자 (Subscriber) 데이터베이스

뉴스레터 구독자 목록입니다.

### 환경변수
```
NOTION_SUBSCRIBE_DATABASE_ID
```

### Properties

| Property Name | Notion Type | Required | TypeScript Field | Description |
|---------------|-------------|----------|------------------|-------------|
| Email | `title` | ✅ | `email` | 이메일 주소 |
| SubscribeAt | `date` | ✅ | `subscribedAt` | 구독 신청일 |
| Source | `rich_text` | ✅ | `source` | 구독 출처 |
| Status | `select` | ✅ | `status` | 상태 |
| ElderId | `select` | | `elderId` | 관심 어르신 (선택) |

### Status 옵션 (select)

| 옵션 | 설명 |
|------|------|
| 활성 | 구독 중 |
| 해지 | 구독 해지됨 |

### Source 값

| 값 | 설명 |
|-----|------|
| homepage | 홈페이지 구독 폼 |
| footer | 푸터 구독 폼 |
| hwalseo | 활서 상세 페이지 |
| website | 기본값 |

### 코드에서 사용

```typescript
// lib/notion.ts
checkSubscriberExists(email)  // 중복 이메일 체크
createSubscriber(data)        // 구독자 생성
```

---

## 6. 설정 (Settings) 데이터베이스

사이트 전역 설정값을 저장합니다.

### 환경변수
```
NOTION_SETTINGS_DATABASE_ID
```

### Properties

| Property Name | Notion Type | Required | Description |
|---------------|-------------|----------|-------------|
| Key | `title` | ✅ | 설정 키 |
| Value | `number` | ✅ | 설정 값 |

### 현재 사용 중인 설정

| Key | Description | 기본값 |
|-----|-------------|--------|
| 후원목표 | 후원 목표 금액 (원) | 300000 |

### 코드에서 사용

```typescript
// lib/notion.ts - getDonationStats() 내부에서 사용
const settingsResponse = await notion.databases.query({
  database_id: settingsDbId,
  filter: {
    property: 'Key',
    title: { equals: '후원목표' },
  },
});
```

---

## 속성 타입 참조

### Notion Type → TypeScript 변환

| Notion Type | TypeScript Type | 추출 방법 |
|-------------|-----------------|-----------|
| `title` | `string` | `page.properties.Name?.title?.[0]?.plain_text \|\| ''` |
| `rich_text` | `string` | `page.properties.Field?.rich_text?.[0]?.plain_text \|\| ''` |
| `select` | `string` | `page.properties.Field?.select?.name \|\| ''` |
| `multi_select` | `string[]` | `page.properties.Field?.multi_select?.map(s => s.name) \|\| []` |
| `relation` | `string[]` | `page.properties.Field?.relation?.map(r => r.id) \|\| []` |
| `files` | `string` | `page.properties.Field?.files?.[0]?.file?.url \|\| page.properties.Field?.files?.[0]?.external?.url \|\| ''` |
| `checkbox` | `boolean` | `page.properties.Field?.checkbox \|\| false` |
| `number` | `number` | `page.properties.Field?.number \|\| 0` |
| `date` | `string` | `page.properties.Field?.date?.start \|\| ''` |
| `email` | `string` | `page.properties.Field?.email \|\| ''` |
| `url` | `string` | `page.properties.Field?.url \|\| ''` |

### Page Meta Properties

| Property | 추출 방법 |
|----------|-----------|
| Page ID | `page.id` |
| Cover Image | `page.cover?.file?.url \|\| page.cover?.external?.url` |
| Created Time | `page.created_time` |
| Last Edited | `page.last_edited_time` |

---

## 공통 패턴

### 이미지 URL 처리

Notion 이미지 URL은 약 1시간 후 만료됩니다. 반드시 프록시 함수를 사용하세요:

```typescript
import { getProxiedImageUrl } from '@/lib/utils';

// ✅ 올바른 사용
const imageUrl = getProxiedImageUrl(
  page.cover?.file?.url || page.cover?.external?.url || ''
);

// ❌ 잘못된 사용 - 만료됨
const imageUrl = page.cover?.file?.url;
```

### 데이터베이스 쿼리 필터

```typescript
// Published 상태만 조회
const response = await notion.databases.query({
  database_id: databaseId,
  filter: {
    property: 'Status',
    select: { equals: 'Published' },
  },
});

// 복합 필터 (AND)
const response = await notion.databases.query({
  database_id: databaseId,
  filter: {
    and: [
      { property: 'Status', select: { equals: 'Published' } },
      { property: 'Theme', select: { equals: theme } },
    ],
  },
});

// Relation 필터
const response = await notion.databases.query({
  database_id: databaseId,
  filter: {
    property: 'Elder',
    relation: { contains: elderId },
  },
});
```

### 정렬

```typescript
const response = await notion.databases.query({
  database_id: databaseId,
  sorts: [
    { property: 'PublishedAt', direction: 'descending' },
    { property: 'Name', direction: 'ascending' },
  ],
});
```

### 페이지 생성

```typescript
const response = await notion.pages.create({
  parent: { database_id: databaseId },
  properties: {
    // Title property
    Name: {
      title: [{ text: { content: 'Value' } }],
    },
    // Rich text property
    Field: {
      rich_text: [{ text: { content: 'Value' } }],
    },
    // Select property
    Status: {
      select: { name: 'OptionName' },
    },
    // Number property
    Amount: {
      number: 10000,
    },
    // Date property
    Date: {
      date: { start: '2024-12-23' },
    },
    // Email property
    Email: {
      email: 'email@example.com',
    },
  },
});
```

### 블록 → 마크다운 변환

`lib/notion.ts`의 `blocksToMarkdown()` 함수가 처리하는 블록 타입:

| Notion Block | Markdown Output |
|--------------|-----------------|
| `paragraph` | 텍스트 |
| `heading_1` | `# 제목` |
| `heading_2` | `## 제목` |
| `heading_3` | `### 제목` |
| `bulleted_list_item` | `• 항목` |
| `numbered_list_item` | `1. 항목` |
| `quote` | `> 인용문` |
| `divider` | `---` |
| `image` | `[IMG]url[/IMG][CAP]caption[/CAP]` |

### Rich Text 포매팅

`richTextToString()` 함수가 처리하는 어노테이션:

| Annotation | Markdown Output |
|------------|-----------------|
| `bold` | `**텍스트**` |
| `italic` | `*텍스트*` |
| `code` | `` `텍스트` `` |
| `strikethrough` | `~~텍스트~~` |
| `underline` | `<u>텍스트</u>` |
| `color` | `[COLOR:color]텍스트[/COLOR]` |
| `color_background` | `[HIGHLIGHT:color]텍스트[/HIGHLIGHT]` |
| `href` (link) | `[텍스트](url)` |

---

## 관련 문서

- [CLAUDE.md](./CLAUDE.md) - AI 어시스턴트용 프로젝트 컨텍스트
- [CODE_REFERENCE.md](./CODE_REFERENCE.md) - 코드 구조 레퍼런스
- [MAINTENANCE.md](./MAINTENANCE.md) - 유지보수 가이드
- [Notion API 공식 문서](https://developers.notion.com/)
