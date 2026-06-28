---
id: handoff-entry
date: 2026-06-28
tags: [handoff, ecosystem, cursor-docs, entry]
status: active
---

# HANDOFF — 현재 이어갈 작업

> **1차 진실:** 이 파일 + `docs/handoffs/ecosystem-tier-s/` 아래 핸드오프. 노션 단독 복원 약함.

## 로컬 베이스

```
C:\Users\Public\dev\yohan-ecosystem\
├── yohan-brain\     master (SoT)
├── yohan-mcp\
├── yohan-cc-skills\
└── vhk\
```

## Tier S 스프린트 — **완료·머지·로컬 clean**

| 항목 | 포인터 |
|------|--------|
| **마감 핸드오프 (전체 맥락)** | [handoff-closure-2026-06-28.md](docs/handoffs/ecosystem-tier-s/handoff-closure-2026-06-28.md) |
| **전달 프롬프트 (복붙)** | [TRANSFER-PROMPT.md](docs/handoffs/ecosystem-tier-s/TRANSFER-PROMPT.md) |
| 결정 로그 | `memory/decisions/2026-06-28-ecosystem-tier-s-harness-sprint.md` |
| 세션 로그 | `memory/logs/sessions/session-2026-06-28-ecosystem-harness.md` |
| dev log | `docs/log/2026-06-28-ecosystem-tier-s-closure.md` |
| Contract | `memory/core/ecosystem-contract.yaml` v0.2.4 |

## 다음 트랙 (우선순위)

| # | 트랙 | 핸드오프 | 상태 |
|---|------|----------|------|
| 1 | **Cursor 공식문서 ingest** | [handoff-cursor-docs-ingest.md](docs/handoffs/ecosystem-tier-s/handoff-cursor-docs-ingest.md) | ✅ **P0 풀커버** (CDOCS-00~03: cursor-docs 스킬·index·P0 6종 ingest) · CDOCS-04/05(P1·경계) 남음 |
| 2 | **E7 A-tier bootstrap** | [handoff-e7-a-tier.md](docs/handoffs/ecosystem-tier-s/handoff-e7-a-tier.md) | ⏸ **보류** — Cursor로 product 레포 작업 시작 시 1개 pilot |

## 복원 체크 (새 세션·다른 PC)

```powershell
cd C:\Users\Public\dev\yohan-ecosystem\yohan-brain
git pull
node scripts/check-ecosystem.mjs
# mcp.json 없으면: .cursor/mcp.json.example 참고해 로컬 생성 (gitignore)
```

## Claude vs Cursor (변경 없음)

- **Primary:** Claude Code (`yohan-cc-skills` CLAUDE.md + skills)
- **Secondary batch:** Cursor (`AGENTS.md` + `.cursorrules` + `ecosystem.mdc`)
