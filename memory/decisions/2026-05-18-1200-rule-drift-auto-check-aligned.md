---
id: decision-2026-05-18-1200
date: 2026-05-18
time: "12:00"
domain: governance
tags: [decision, rule-drift, automation, on-demand]
related: [check-rule-drift, notion-sync, telegram-inbox, rule-review-cycle]
status: accepted
---

# 결정 — 규칙 드리프트 자동 점검 정합화 (on-demand 큐 화이트리스트 + 아카이브 경로 반영)

## 배경

2026-05-18 `scripts/check-rule-drift.ts` 첫 자동 실행 결과 broken-link 6건이 보고됨. 분석 결과 두 종류로 갈렸다.

1. **on-demand 생성 파일에 대한 거짓 양성**
   - `memory/inbox/notion-queue.md`는 `src/paths.ts:23-27 getNotionQueuePath`가 풀 트리거 시 생성하는 큐 파일.
   - 규칙(`memory/rules/notion-sync.md`)·부트스트랩(`docs/CLAUDE-CONTEXT-BOOTSTRAP.md`)이 정상적으로 같은 경로를 인용.
   - 코드·규칙 모두 정합하지만 검사기가 on-demand 파일 개념을 몰라 broken-link로 잡음.

2. **실제 경로 드리프트**
   - `memory/inbox/telegram-inbox.md`는 commit `56810ef`(inbox 121건 아카이브)에서 `memory/inbox/archive/telegram-inbox.md`로 이관.
   - `memory/rules/telegram-inbox.md`가 "과거 단일 파일" 설명에서 옛 경로를 그대로 인용.

## 결정

1. `scripts/check-rule-drift.ts`의 `ON_DEMAND` 화이트리스트에 `notion-queue.md`를 추가한다. (기존 `automation-dead-letter.md`, `automation-review.md`와 동일 처리)
2. `memory/rules/telegram-inbox.md`의 과거 단일 파일 인용 경로를 실제 아카이브 위치(`memory/inbox/archive/telegram-inbox.md`)로 갱신하고 이관 시기를 명시한다.
3. 본 결과는 `memory/metrics/rule-drift-2026-05-18.md`에 회차 메트릭으로 남기고, 차후 회차마다 같은 형식으로 누적한다.
4. `package.json`의 `check:drift` 스크립트는 기존 그대로 유지(이미 존재) — CI/주기 호출 시 동일 경로 사용.

## 대안 검토

- **A안: 아카이브된 파일 복원** — 의미 없는 옛 raw 로그를 SoT에 다시 두는 결과. 기각.
- **B안: 규칙에서 과거 단일 파일 설명 자체 삭제** — 운영 히스토리 단절. 사용자가 옛 데이터 위치를 찾을 단서를 잃음. 기각.
- **C안(채택): 규칙의 인용 경로만 아카이브로 정정** — SoT·아카이브 분리 원칙과 정합.
- **D안: 검사기를 더 똑똑하게(코드 AST에서 경로 사용처 자동 추출)** — 비용 대비 효용 낮음. 화이트리스트로 충분.

## 영향

- 드리프트 점검이 **거짓 양성 0**으로 안정화 → 향후 양성 보고는 진짜 드리프트로 신뢰 가능.
- on-demand 파일 정책이 코드(`paths.ts`)·규칙(`notion-sync.md`)·검사기(`check-rule-drift.ts`) 세 곳에서 일치.

## 후속 작업

- on-demand 큐 파일이 더 늘면 `ON_DEMAND` 배열 대신 **선언 manifest**(예: `memory/rules/on-demand-paths.yaml`) 도입 검토.
- 규칙 정기 점검 사이클(`memory/rules/rule-review-cycle.md`)에 본 자동 점검을 회차 항목으로 편입할지 차회 회고에서 결정.
