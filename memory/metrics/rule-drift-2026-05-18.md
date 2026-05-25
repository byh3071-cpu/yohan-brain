---
id: rule-drift-2026-05-18
date: 2026-05-18
domain: governance
tags: [rule-drift, audit, automation]
related: [check-rule-drift, notion-sync, telegram-inbox]
status: closed
---

# 규칙 드리프트 점검 — 2026-05-18

`scripts/check-rule-drift.ts` 실행 결과와 해소 내역.

## 1차 실행 (수정 전)

```
⚠️  드리프트 점검 결과: 6건

--- broken-link (6건) ---
  memory\rules\telegram-inbox.md: "memory/inbox/telegram-inbox.md" → 파일 없음
  memory\rules\notion-sync.md: "memory/inbox/notion-queue.md" → 파일 없음
  memory\rules\notion-sync.md: "memory/inbox/notion-queue.md" → 파일 없음
  docs\CLAUDE-CONTEXT-BOOTSTRAP.md: "memory/inbox/notion-queue.md" → 파일 없음
  docs\CLAUDE-CONTEXT-BOOTSTRAP.md: "memory/inbox/notion-queue.md" → 파일 없음
  docs\CLAUDE-CONTEXT-BOOTSTRAP.md: "memory/inbox/notion-queue.md" → 파일 없음
```

총 6건 / broken-link 6 / stale 0 / duplicate-id 0 / missing-frontmatter 0.

## 원인 분석

### A. `memory/inbox/notion-queue.md` (5건)

- 코드(`src/paths.ts:23-27` `getNotionQueuePath`)가 **on-demand 생성** 큐 파일로 정의. 풀 트리거 시점에 만들어지며 비어 있는 상태로 커밋되지 않음.
- 규칙(`memory/rules/notion-sync.md` §4·§5)과 부트스트랩 문서(`docs/CLAUDE-CONTEXT-BOOTSTRAP.md`)가 동일 경로를 정상 인용.
- **코드·규칙 모두 정상**. 검사기가 on-demand 파일을 모르고 broken-link로 처리한 것이 원인.

### B. `memory/inbox/telegram-inbox.md` (1건)

- 실제 파일은 commit `56810ef chore: SoT 현행화 1단계 ... inbox 121건 아카이브`에서 `memory/inbox/archive/telegram-inbox.md`로 이관됨.
- 규칙(`memory/rules/telegram-inbox.md`)의 "과거 단일 파일" 인용 경로만 옛 위치로 남아 있던 진짜 드리프트.

## 해소 조치

| # | 대상 | 조치 |
|---|------|------|
| 1 | `scripts/check-rule-drift.ts` | `ON_DEMAND` 화이트리스트에 `notion-queue.md` 추가 |
| 2 | `memory/rules/telegram-inbox.md` | "과거 단일 파일" 경로를 `memory/inbox/archive/telegram-inbox.md`로 갱신, 이관 날짜 명시 |

## 2차 실행 (수정 후)

```
✅ 드리프트 없음 — 깨진 링크 0, 오래된 규칙 0, 중복 ID 0
```

## 후속 메모

- `notion-queue.md`와 같은 on-demand 큐 파일이 늘어나면 `ON_DEMAND` 리스트가 비대해질 수 있음. 추후 프론트매터 또는 별도 manifest로 선언 받는 방식 검토.
- `STALE_DAYS=60` 임계는 현재 0건이지만, 규칙 정기 점검 사이클(2026-04-09 결정)에서 명시한 주기와 정합 여부 다음 회차에 재확인.

## 관련 결정

- [2026-05-18 — 규칙 드리프트 자동 점검 정합화](../decisions/2026-05-18-1200-rule-drift-auto-check-aligned.md)
