---
id: handoff-ecosystem-tier-s-closure
date: 2026-06-28
tags: [handoff, ecosystem, tier-s, closure, merged]
related:
  - memory/decisions/2026-06-28-ecosystem-tier-s-harness-sprint.md
  - memory/core/ecosystem-contract.yaml
status: done
---

# 핸드오프 — Ecosystem Tier S Harness 마감 (2026-06-28)

> **한 줄:** Core 4(brain·mcp·vhk·cc-skills) tier S harness **머지 완료**, 로컬 **clean**, 다음은 Cursor docs ingest 또는 E7 pilot.

---

## 이번까지 완료 (재작업 금지)

| 티켓 | 산출 | PR | HEAD (머지 후) |
|------|------|-----|----------------|
| E6-01 | `vhk sync` → AGENTS Ecosystem block | vhk#414 | vhk `a2c1c4b` |
| E5-02 | `.agents/CORE-RULES.md` | 4 PR | — |
| E5-03 | mcp·cc-skills RULES→sync→AGENTS | mcp#6, cc-skills#5 | mcp `d8c71a0`, cc-skills `e9b233f` |
| E5-04 | context seed + mcp.json.example | 4 PR | — |
| E5-05 | brain overrides + contract v0.2.4 | brain#11 | brain `a40b635` |

**머지 순서 (실행됨):** vhk#414 → mcp#6 · cc-skills#5 → brain#11

---

## 핵심 결정 (왜)

| 결정 | 이유 |
|------|------|
| brain `repo_entry_overrides`: RULES·sync AGENTS skip | SoT 레포 — `memory/` 진입, AGENTS 수기 |
| mcp.json untrack + example만 커밋 | 시크릿·머신경로 유출 방지 |
| Claude primary / Cursor secondary **유지** | harness는 진입점 **분리 보강**, 역할 변경 없음 |
| E7 A-tier **보류** | product 레포에 Cursor batch 안 쓰면 ROI 낮음 |
| Cursor 공식문서 **별도 프로젝트** | tier S sprint ≠ docs ingest |

---

## Core 4 harness 최종

| 파일 | brain | mcp | vhk | cc-skills |
|------|:-----:|:---:|:---:|:---------:|
| ecosystem.mdc | ✅ | ✅ | ✅ | ✅ |
| CORE-RULES.md | ✅ | ✅ | ✅ | ✅ |
| RULES.md | ⏭ skip | ✅ | ✅ | ✅ |
| AGENTS.md | ✋ 수기 | ✅ sync | ✅ sync | ✅ sync |
| .cursorrules | ✋ 수기 | ✅ | ✅ | ✅ |
| .vhk/context.md | ✅ | ✅ | 로컬* | ✅ |
| mcp.json.example | ✅ | ✅ | ✅ | ✅ |

\* vhk dogfood: `.vhk/.gitignore`가 context.md 로컬 전용

---

## 검증 (2026-06-28, post-merge)

| 검증 | 결과 |
|------|------|
| Core 4 `git pull` | fast-forward, remote in-sync |
| brain `check-ecosystem.mjs` | ALL PASSED v0.2.4 |
| vhk vitest (sync + inject-bootstrap) | pass |
| mcp pytest paths | pass |
| `inject-bootstrap` Core 4 | unchanged (의도) |
| Claude Code 충돌 | 블로킹 없음 |

---

## 로컬 정리 (후속 세션, 2026-06-28)

| 작업 | 결과 |
|------|------|
| `yohan-brain/.cursor/mcp.json.bak` 삭제 | mcp.json과 해시 동일 확인 후 제거 |
| `yohan-brain/.serena/` 삭제 | Serena 임시 캐시 제거 |
| Core 4 git status | **전부 clean** |
| `mcp.json` 로컬 | 유지 (gitignore) — yohan-os + lazyweb + vhk global |

**주의:** `.serena/`는 Serena 재사용 시 다시 생길 수 있음 → 재등장 시 `.gitignore` 추가 검토.

---

## brain 로컬 MCP 복원 (이미 완료)

pull 시 tracked mcp.json 삭제됨 → `.bak`에서 복원 → bak 삭제.

없을 때 복원:

```powershell
# example 기반 + 개인 서버(lazyweb env 등) 수동 merge
copy .cursor\mcp.json.example .cursor\mcp.json
# 또는: vhk mcp-init (레포별)
```

---

## ⚠️ 알려진 비블로커

| 항목 | 상태 |
|------|------|
| agent-compact dead link | ✅ vhk `resolveAgentCompactRel` |
| cc-skills loop.md vs AGENTS Loop | 스코프 다름 — 충돌 아님 |
| global vhk CLI 구버전 | 로컬 `vhk/dist` 빌드 후 사용 권장 |

---

## 다음 (이 핸드오프 폴더)

1. **Cursor docs ingest** — `handoff-cursor-docs-ingest.md` (P1)
2. **E7 pilot** — `handoff-e7-a-tier.md` (조건부)

---

## 산출물 포인터

| 항목 | 경로 |
|------|------|
| 결정 (전체 타임라인) | `memory/decisions/2026-06-28-ecosystem-tier-s-harness-sprint.md` |
| 세션 로그 | `memory/logs/sessions/session-2026-06-28-ecosystem-harness.md` |
| 진입 HANDOFF | `HANDOFF.md` |
| 전달 프롬프트 | `docs/handoffs/ecosystem-tier-s/TRANSFER-PROMPT.md` |
