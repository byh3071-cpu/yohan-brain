---
id: session-2026-06-28-cdocs-cursor-docs
date: 2026-06-28
tags: [session, cdocs, cursor-docs, ingest, vhk, pr, handoff]
related:
  - docs/handoffs/ecosystem-tier-s/handoff-cursor-docs-ingest.md
  - memory/decisions/2026-06-28-cdocs-cursor-docs-ingest.md
  - memory/ingest/cursor-official/
---

# 세션 로그 — CDOCS Cursor 공식문서 ingest (2026-06-28)

> **한 줄:** 할일 전수검사 브리핑으로 시작 → A 트랙(vhk PR #409 머지 + CDOCS P0 풀커버) 완수 + 정합성 정리.

## 무엇을 했나

### 1. 양방향루프 PHASE 1 마감
- vhk **PR #409** 머지 (CLAUDE.md 템플릿 사전조회 규칙, squash `5cbafea`, CI 올그린)

### 2. CDOCS-00 — 범위·선행조사
- 범위 **원안 6종 확정(A)**: Rules/MCP/Agent/Context/Skills/CLI. hooks·subagents·plugins는 P0.5 후보.
- 선행조사 실측: base = `cursor.com/docs` (docs.cursor.com 308 이전), llms.txt = `cursor.com/llms.txt`(루트)

### 3. CDOCS-01 — cursor-docs 스킬
- cc-skills clone 복원 (이 노트북에 부재)
- `cursor-docs/SKILL.md` (cc-docs 미러, bare URL) → **PR #6** 머지 `ac4a148`
- 완료기준(fetch+인용) rules·context 실측 통과

### 4. CDOCS-02 — p0-rules 정비
- 병렬 세션 산출 `p0-rules.md`의 source URL `.md`→bare 4곳 정정

### 5. CDOCS-03 — P0 6종 ingest
- 병렬 5에이전트: mcp·agent·context·skills·cli (p0-rules 템플릿 미러)
- index seed `cursor-docs-index.md` → **PR #8** 머지 `c6fc51a`
- source URL 6/6 bare 검증(grep)

### 6. 정합성 정리
- HANDOFF·active-project 현행화(ecosystem-cdocs), cc-skills 로컬 정리(브랜치 2개 삭제), remote URL 대소문자 정정

## 핵심 결정·교훈

- **bare URL 함정:** Cursor llms.txt가 `.md`를 광고하지만 그 경로는 404. bare(`cursor.com/docs/<slug>`)가 정답. cc-docs(`.md` 씀)와 **반대**. → ingest 전 실제 fetch 검증 필수.
- **병렬 에이전트 ingest:** p0-rules.md 템플릿 미러 + 멀티세션 충돌방지(기존 파일 Read 후 Write).
- **멀티세션 동시작업:** 6-28 병렬 세션이 p0-rules·일부 ingest 동시 생성. untracked/staged 충돌 주의.

## 산출물

| 레포 | 산출 | 커밋/PR |
|------|------|---------|
| vhk | 양방향루프 PHASE 1 | PR #409 `5cbafea` |
| cc-skills | cursor-docs 스킬 + index | PR #6 `ac4a148`, PR #8 `c6fc51a` |
| brain | ingest 6파일 + 핸드오프 + active-project | `8da1f27`·`46cabce`·`f8b1647`·`418839d` |

## 막힌 것 (참고)
- master 직접푸시·자가머지는 classifier 차단 → 사용자 `!` 직접 실행으로 처리(설계상 정상).
