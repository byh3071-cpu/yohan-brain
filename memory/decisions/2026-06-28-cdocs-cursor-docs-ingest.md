---
id: cdocs-cursor-docs-ingest
date: 2026-06-28
tags: [cdocs, cursor, docs, ingest, skill, bare-url]
related:
  - docs/handoffs/ecosystem-tier-s/handoff-cursor-docs-ingest.md
  - memory/ingest/cursor-official/
status: accepted
---

# CDOCS — Cursor 공식문서 ingest 착수·P0 풀커버 (2026-06-28)

> **한 줄:** cc-docs를 미러한 `cursor-docs` 스킬 + Cursor 공식문서 P0 6종 ingest. 핵심 교훈 = **bare URL**(llms.txt가 광고하는 `.md`는 404).

## 결정

1. **범위 P0 6종(A)** — Rules·MCP·Agent·Context·Skills·CLI. hooks·subagents·plugins는 P0.5 후보(기록만, Cursor batch 실사용 시 승격).
2. **fetch 패턴 = bare URL.** `cursor.com/docs/<slug>` · 헬프는 `cursor.com/help/customization/<slug>`. llms.txt가 `.md`를 광고하지만 404(실측). cc-docs(`.md` 서빙)와 반대.
3. **cursor-docs 스킬 = cc-docs 미러.** SKILL.md 1개 + llms.txt 폴백 + `references/cursor-docs-index.md` seed. skills 자동발견이라 plugin.json 수정 불필요.
4. **P0 ingest = 병렬 에이전트.** p0-rules.md 템플릿 미러, source-to-summary-protocol 준수, trust 5, "원문 미확인"/"페이지 범위 밖" 분리 표기.
5. **산출 위치:** 스킬·index = `yohan-cc-skills`, ingest 요약 = `yohan-brain/memory/ingest/cursor-official/`.

## 교훈

- **bare URL 함정:** 공식 llms.txt조차 작동 안 하는 URL(`.md`)을 광고할 수 있다 → ingest 전 **실제 fetch로 검증** 필수. file-exists ≠ file-correct, source URL은 grep으로 일괄 검증.
- **멀티세션 동시작업:** 6-28 병렬 세션이 p0-rules·일부 ingest를 동시 생성. untracked 파일/staged 충돌 → 명시적 `git add` 전체 지정으로 deterministic 커밋. 같은 파일 양쪽 수정 주의.
- **classifier 게이트:** 에이전트 자가머지·기본브랜치 직접푸시는 사람 승인 요구(우회 금지). 사용자 `!` 직접 실행이 통로.

## SoT 경계 (드리프트 방지)

- **진행상태** = `docs/handoffs/ecosystem-tier-s/handoff-cursor-docs-ingest.md`
- **원문 요약(ingest)** = `memory/ingest/cursor-official/p0-*.md` (6파일, source bare URL)
- **스킬** = `yohan-cc-skills/plugins/yohan-core/skills/cursor-docs/`

## 다음
CDOCS-04(P1 batch: tab·background agent·git) · CDOCS-05(ADR-005 경계문서 — 내부 harness vs Cursor 공식).
