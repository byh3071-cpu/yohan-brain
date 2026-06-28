---
id: handoff-cursor-docs-ingest
date: 2026-06-28
tags: [handoff, cursor, docs, ingest, cdocs]
related:
  - docs/adr/ADR-005-harness-3-layer.md
  - memory/wiki/entities/cursor.md
status: in-progress
---

> **진행 (2026-06-28):** CDOCS-00 ✅ · CDOCS-01 🔀 cc-skills **PR #6** 머지 대기 — `cursor-docs/SKILL.md` 골격(cc-docs 미러), rules·context 실측 fetch 통과. index seed는 CDOCS-03으로. 다음: CDOCS-02 P0 ingest pilot.

# 핸드오프 — Cursor 공식문서 ingest (CDOCS)

> **상태:** 범위·우선순위 **확정 초안**. 구현 **미착수**.  
> **목표:** Claude `cc-docs`처럼 Cursor도 **근거 있는 답변** — 기억 추측 금지, 공식문서 fetch·인용.

---

## 왜 지금 (배경)

| 사실 | 의미 |
|------|------|
| tier S sprint ≠ docs ingest | harness 정렬과 **별도 트랙** |
| brain에 Cursor wiki·ingest **조각**만 있음 | 풀 커버리지 ❌ |
| `cc-docs` 스킬은 Claude Code만 | Cursor secondary batch에 **동급 도구 없음** |
| ADR-005 Phase 1 | 노션 3층 → `docs/` 내보내기 — **Cursor 공식과는 다른 축**, 병행 시 경계 명시 |

---

## 범위 (In / Out)

### ✅ In scope

| 층 | 내용 |
|----|------|
| **P0** | Yohan가 Cursor로 **실제 쓰는** 기능 문서 |
| **P1** | batch·에이전트·MCP·rules·context |
| **P2** | 나머지 공식 docs (아카이브·엣지) |
| **산출** | `cursor-docs` 스킬 + brain ingest 슬라이스 + (선택) references 인덱스 |

### ❌ Out of scope (1차)

- Cursor 공식 전 페이지 무차별 스크래핑
- 커뮤니티/Reddit/X 요약 (Lazyweb·last30days 축)
- Claude Code docs 중복 (已有 cc-docs)
- 노션 RULEBOOK 전체 자동 변환 (ADR-005 — **별 티켓**)

---

## 우선순위 — P0 → P2

### P0 — 매일 쓰는 것 (CDOCS-01~03)

| # | 주제 | 이유 | 공식 doc 추정 섹션 |
|---|------|------|---------------------|
| 1 | **Rules** (.cursor/rules, .mdc, AGENTS) | tier S harness 핵심 | Rules, Project Rules |
| 2 | **MCP** | yohan-mcp·lazyweb·vhk 연동 | MCP, mcp.json |
| 3 | **Agent / Composer** | secondary batch 본체 | Agent, Chat, Composer |
| 4 | **Context / @ symbols** | 컨텍스트 엔지니어링 | Context, Codebase Indexing |
| 5 | **Skills** (Cursor skills) | skills-cursor 패턴 | Skills (if documented) |
| 6 | **CLI** (cursor CLI / agent CLI) | contract `clients.secondary` | CLI |

### P1 — 주 1회 이상

| # | 주제 |
|---|------|
| 7 | Tab / inline edit |
| 8 | Background Agent / Cloud |
| 9 | Git · PR · review |
| 10 | Privacy · Security · ignore |
| 11 | Models · pricing (product_facts — **항상 fetch, 캐시 짧게**) |

### P2 — 아카이브

| # | 주제 |
|---|------|
| 12 | Enterprise / Team |
| 13 | API (있다면) |
| 14 | Changelog 전체 히스토리 |
| 15 | 레거시 .cursorrules 단독 문서 |

---

## 아키텍처 제안 (cc-docs 미러)

```
yohan-cc-skills/plugins/yohan-core/skills/cursor-docs/
  SKILL.md
  references/cursor-docs-index.md   # slug → URL 매핑 (수동 seed + llms.txt 갱신)

yohan-brain/memory/ingest/cursor-official/
  p0-rules.md
  p0-mcp.md
  ...                               # fetch 후 요약+출처URL (source-to-summary-protocol)
```

**동작 (cc-docs와 동일):**

1. 주제 slug를 `references/cursor-docs-index.md`에서 찾음
2. 없으면 `https://docs.cursor.com` (또는 공식 llms.txt) WebFetch
3. 원문 읽고 요약 + **출처 URL 필수**
4. 불확실하면 추측 금지

**배치 위치:** `yohan-cc-skills` (Cursor·Claude 공용 skills) + brain ingest (장기 기억)

---

## 티켓 큐 (한 장씩)

| 티켓 | 내용 | 완료 기준 |
|------|------|-----------|
| **CDOCS-00** | 범위·P0 목록 Yohan OK | ✅ 완료 2026-06-28 — 원안 6종(A) 승인 + 선행조사 박제 |
| **CDOCS-01** | `cursor-docs` SKILL 골격 (cc-docs 미러) | 🔀 cc-skills PR #6 — rules·context 실측 fetch+인용 통과. index seed는 CDOCS-03 |
| **CDOCS-02** | brain ingest P0 1페이지 pilot (Rules) | `memory/ingest/cursor-official/p0-rules.md` + 출처 |
| **CDOCS-03** | P0 나머지 5종 ingest | 6파일 + index 동기화 |
| **CDOCS-04** | P1 batch (우선 3종) | — |
| **CDOCS-05** | ADR-005와 경계 문서 1장 | 내부 harness vs Cursor 공식 구분 |

**변환:** yohan-brain 이슈 「CDOCS-00: Cursor official docs ingest scope」

---

## 선행 조사 — ✅ 완료 (2026-06-28)

| 확인 | 결과 |
|------|------|
| base URL | `docs.cursor.com` → **`cursor.com/docs`** (308 영구이전). fetch는 새 base 고정 |
| llms.txt | **`cursor.com/llms.txt`** 유효(루트). `cursor.com/docs/llms.txt`는 404 → cc-docs llms.txt 패턴 재사용 가능 |
| raw 원문 패턴 | 모든 페이지 `{url}.md` 접미사로 markdown 직접 fetch (예: `cursor.com/docs/rules.md`) |
| P0 slug | 6종 전부 확정 (아래) |

### P0 6종 확정 slug

| P0 | 주제 | URL (`.md` = 원문) |
|----|------|---------------------|
| 1 | Rules | `cursor.com/docs/rules.md` |
| 2 | MCP | `cursor.com/docs/mcp.md` |
| 3 | Agent | `cursor.com/docs/agent/overview.md` |
| 4 | Context/인덱싱 | `cursor.com/help/customization/context.md` · `indexing.md` (**help 축** — docs와 base 다름) |
| 5 | Skills | `cursor.com/docs/skills.md` |
| 6 | CLI | `cursor.com/docs/cli/overview.md` |

### P0.5 후보 (범위 밖 — 기록만, 2026-06-28 결정 A)

- `cursor.com/docs/hooks.md` · `subagents.md` · `plugins.md` (Customizing 섹션) — Cursor batch에서 hooks/subagents 실사용 시 P0 승격.
- Agent 하위 풍부: `plan-mode.md` · `design-mode.md` · `agent/tools/{terminal,browser,search}.md` · `configuration/worktrees.md`.

---

## 성공 기준

- Cursor 기능 질문 시 **training data 추측 없이** 공식 URL 인용
- tier S harness 문서와 **역할 분리** 명확 (내부 contract vs Cursor product)
- ingest 파일에 YAML frontmatter + `source:` URL

---

## 관련 SoT

| 경로 | 역할 |
|------|------|
| `plugins/yohan-core/skills/cc-docs/` | **미러 패턴** |
| `memory/wiki/entities/cursor.md` | 기존 개념 (ingest 후 갱신) |
| `docs/adr/ADR-005-harness-3-layer.md` | 내부 3층 vs 외부 Cursor docs |
| `memory/rules/source-to-summary-protocol.md` | ingest 형식 |
