# 삼활린 개발 워크플로우 가이드

## 개요

이 문서는 Claude(웹)와 Claude Code를 활용한 개발 워크플로우를 설명합니다.

```
[기획/검토]          [코딩]              [배포]
Web Claude    →    Claude Code    →    GitHub PR
(대화/계획)         (코드 작성)          (리뷰/병합)
```

### 역할 분담

| 도구 | 역할 | 사용 시점 |
|------|------|----------|
| Claude (웹/앱) | 기획, 설계, 검토, 프롬프트 작성 | 작업 시작 전, 결과 검토 시 |
| Claude Code | 실제 코드 작성, 파일 수정, Git 작업 | 코딩 작업 시 |
| GitHub | PR 생성, 코드 리뷰, 병합 | 작업 완료 후 |

---

## 사전 준비

### 1. 필요한 도구

- VS Code + Claude Code 확장 프로그램
- Git 설치
- GitHub 계정 (SamhwalinDev 조직 접근 권한)

### 2. 프로젝트 클론 (최초 1회)

```bash
git clone https://github.com/SamhwalinDev/samhwalin-web.git
cd samhwalin-web
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일 생성 (주원에게 값 요청)

---

## 워크플로우 단계

### Step 1: 작업 계획 (Web Claude)

Web Claude에게 작업 내용을 설명하고 계획을 세웁니다.

**예시 대화:**
```
나: Elder 페이지에 필터 기능을 추가하고 싶어.
    지역별로 어르신을 필터링할 수 있으면 좋겠어.

Claude: 좋아요. 구현 계획을 세워볼게요.
        1. 필터 컴포넌트 생성
        2. 지역 데이터 연동
        3. 필터 로직 구현

        Claude Code용 프롬프트를 작성해드릴까요?
```

### Step 2: Claude Code 프롬프트 받기

Web Claude가 영어로 된 Claude Code 프롬프트를 작성해줍니다.

### Step 3: Claude Code 실행

1. VS Code에서 프로젝트 열기
2. Claude Code 패널 열기 (Cmd + Shift + P → "Claude")
3. 프롬프트 붙여넣기
4. 실행

### Step 4: 결과 확인 및 커밋

Claude Code가 작업 완료 후 물어봅니다:
```
작업이 완료되었습니다. 커밋할까요?
```

- 결과 확인 후 승인하면 커밋 & 푸시
- 수정이 필요하면 추가 요청

### Step 5: PR 생성 및 병합

1. Claude Code가 제공하는 PR URL 클릭
2. GitHub에서 PR 생성
3. (선택) 리뷰 요청
4. Merge 클릭
5. 로컬 정리:

```bash
git checkout main && git pull
git branch -d feature/브랜치명
```

---

## 자주 쓰는 프롬프트 템플릿

### 코드 확인 요청

```
## Task: Review current code

### Files to Review
- `app/elders/page.tsx`

### What to Check
1. Current component structure
2. Data fetching method
3. Existing styles
```

### 기능 추가 요청

```
## Task: Add [Feature Name]

### Context
[현재 상황 설명]

### Goal
[원하는 결과]

### Files
- Modify: `파일 경로`

### Requirements
1. [요구사항 1]
2. [요구사항 2]
```

### 버그 수정 요청

```
## Task: Fix [Bug Description]

### Problem
[버그 설명]

### Expected Behavior
[정상 동작 설명]

### Files to Check
- `관련 파일`
```

---

## Git 브랜치 규칙

### 브랜치 이름

- `feature/기능명` - 새 기능
- `fix/버그명` - 버그 수정
- `docs/문서명` - 문서 작업

### 커밋 메시지

- `feat:` - 새 기능
- `fix:` - 버그 수정
- `docs:` - 문서
- `style:` - 스타일/UI

**예시:** `feat: Elder 필터 기능 추가`

---

## 주의사항

1. **main 브랜치에 직접 푸시 금지** - 반드시 PR 통해서만
2. **작업 전 항상 최신화** - `git pull origin main`
3. **커밋 전 확인** - 변경 내용 검토 후 승인
4. **모르면 물어보기** - Web Claude에게 먼저 질문

---

## 문제 해결

### Claude Code가 안 될 때

- VS Code 재시작
- 확장 프로그램 재설치

### Git 충돌 발생 시

- Web Claude에게 상황 설명
- 또는 주원에게 연락

### 잘 모르겠을 때

- Web Claude에게 "이거 어떻게 해?" 질문
- 스크린샷과 함께 상황 공유

---

## 연락처

- 기술 문의: 주원
- 프로젝트: https://github.com/SamhwalinDev/samhwalin-web
