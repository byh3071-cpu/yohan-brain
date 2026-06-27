---
id: ecosystem-tier-s-harness-sprint
date: 2026-06-28
tags: [ecosystem, harness, tier-s, vhk, claude-code, cursor, contract]
related:
  - memory/core/ecosystem-contract.yaml
  - memory/core/inheritance-registry.yaml
  - memory/core/core-ruleset.yaml
  - docs/CONTEXT-AND-HARNESS-SYSTEM.md
status: accepted
---

# Ecosystem Tier S Harness 스프린트 — E0~E6 결정·진행 맥락 (2026-06-28)

> **한 줄:** Yohan 4대 Core 레포(brain·mcp·vhk·cc-skills)에 **tier S harness**를 contract 기반으로 일괄 정렬했다. Claude Code = primary, Cursor = secondary batch는 **유지·강화**.

## 0. 왜 시작했나 (배경)

| 문제 | 증상 |
|------|------|
| 다레포 규칙 drift | AGENTS·cursorrules·ecosystem 경계가 레포마다 다름 |
| Cursor vs Claude 역할 혼선 | handoff·release-gate를 어느 클라이언트가 소유하는지 모호 |
| harness 깊이 불일치 | tier S인데 ecosystem.mdc만 있고 CORE-RULES·RULES·context 없음 |
| brain SoT 특수성 | yohan-brain은 RULES.md 패턴과 맞지 않음( memory/ 가 진입점 ) |

**아키텍처 합의 (변경 없음):**

| 역할 | 레포 |
|------|------|
| SoT | yohan-brain (`ecosystem-contract.yaml` + `inheritance-registry.yaml` + `core-ruleset.yaml`) |
| Nervous system | yohan-mcp |
| Scaffold | vhk |
| Claude ops | yohan-cc-skills (handoff · parallel · release-gate) |

**클라이언트:** Claude Code = primary · Cursor CLI = secondary batch (Composer 반복작업).

---

## 1. 티켓 타임라인 (처음 → 지금)

| 티켓 | 상태 | 산출 | PR |
|------|:----:|------|-----|
| **E0-02** | ✅ merged | ecosystem-contract v0.2.0 draft | brain |
| **E0-03** | ✅ merged | `status: active` (enforce ON) | brain |
| **E3-01** | ✅ merged | `vhk start` 5단계(sync 포함) | vhk#411 |
| **E4-01** | ✅ merged | mcp `core/paths.py` → brain memory | mcp#4 |
| **E0-03 gap** | ✅ merged | contract v0.2.1 | brain#8 |
| **E1-02** | ✅ merged | `ecosystem.mdc` v1.1 + `vhk inject-bootstrap` | vhk#412, brain#9 (v0.2.2) |
| **E5-01** | ✅ merged | Core 4 `ecosystem.mdc` + registry `harness_version` | brain#10, mcp#5, vhk#413, cc-skills#4 (v0.2.3) |
| **E6-01** | ✅ merged | `vhk sync` → AGENTS **Ecosystem block** 자동 삽입 | [vhk#414](https://github.com/byh3071-cpu/vhk/pull/414) |
| **E5-02** | ✅ merged | Core 4 `.agents/CORE-RULES.md` (core-ruleset 상속) | vhk#414 + mcp#6 + cc-skills#5 + brain#11 |
| **E5-03** | ✅ merged | mcp·cc-skills **RULES → sync → AGENTS** | mcp#6, cc-skills#5 |
| **E5-04** | ✅ merged | `.vhk/context.md` seed + `.cursor/mcp.json.example` | 4 PR |
| **E5-05** | ✅ merged | brain `repo_entry_overrides` + contract **v0.2.4** | [brain#11](https://github.com/byh3071-cpu/yohan-brain/pull/11) |
| **E7-01** | ⏸ deferred | A-tier bootstrap — pilot 조건부 | `docs/handoffs/ecosystem-tier-s/handoff-e7-a-tier.md` |
| **CDOCS** | 📋 planned | Cursor 공식문서 ingest | `docs/handoffs/ecosystem-tier-s/handoff-cursor-docs-ingest.md` |

**운영 원칙:** 한 티켓씩 초안 → Yohan OK → PR. 이번 턴은 "전부 검증하고 ㄱㄱ"로 E6-01~E5-05 일괄 구현.

---

## 2. contract v0.2.4 핵심 변경 (E5-05)

```yaml
repo_entry_overrides:
  yohan-brain:
    tier: S
    harness:
      skip:
        - rules_md
        - vhk_sync_agents
    note_ko: "SoT 레포 — RULES.md 생략, AGENTS.md 수기 유지, memory/ 직접"
```

- registry Core 4 `harness_version`: `ecosystem-mdc-v1` → **`tier-s-v1`**
- brain tracked `.cursor/mcp.json` **제거** (시크릿·머신경로) → `mcp.json.example`만 커밋

---

## 3. vhk 도구 변경 (E6-01 + E5-02/04)

### E6-01 — `toAgentsMd()` 고정 블록

Loop Protocol 직후 삽입:

```markdown
## Ecosystem (cross-repo)
> Contract SoT: yohan-brain memory/core/ecosystem-contract.yaml (obey when status=active).
- Tier: inheritance-registry.yaml
- Cursor: .cursor/rules/ecosystem.mdc (vhk inject-bootstrap)
- 금지: AGENTS.md 손수 편집 → RULES.md + vhk sync
```

brain은 `repo_entry_overrides`로 sync AGENTS **제외** (수기 AGENTS 유지).

### E5-02/04 — `vhk inject-bootstrap` 확장

| 산출물 | 역할 |
|--------|------|
| `.cursor/rules/ecosystem.mdc` | Cursor-only cross-repo 경계 |
| `.agents/CORE-RULES.md` | `core-ruleset.yaml` 마커블록 상속 |
| `.vhk/context.md` | tier S context seed (없을 때만) |
| `.cursor/mcp.json.example` | 커밋 가능 샘플 (`vhk mcp-init`은 로컬 생성) |

---

## 4. Core 4 harness 최종 매트릭스 (PR 머지 후 목표)

| 파일 | brain | mcp | vhk | cc-skills |
|------|:-----:|:---:|:---:|:---------:|
| ecosystem.mdc | ✅ | ✅ | ✅ | ✅ |
| CORE-RULES.md | ✅ PR | ✅ PR | ✅ PR | ✅ PR |
| RULES.md | ⏭ skip | ✅ PR | ✅ | ✅ PR |
| AGENTS.md | ✋ 수기 | ✅ sync | ✅ sync | ✅ sync |
| .cursorrules | ✋ 수기 | ✅ PR | ✅ | ✅ PR |
| .vhk/context.md | ✅ PR | ✅ PR | 로컬* | ✅ PR |
| mcp.json.example | ✅ PR | ✅ PR | ✅ PR | ✅ PR |

\* vhk dogfood: `.vhk/.gitignore`가 context.md 로컬 전용 — 의도적

---

## 5. 검증 결과 (2026-06-28)

| 검증 | 결과 |
|------|------|
| vhk `vitest` sync + inject-bootstrap | 31 pass |
| vhk PR#414 CI gate | **pass** (ubuntu/windows × node 22/24, dogfood, CodeQL) |
| brain `check-ecosystem.mjs` | pass (v0.2.4) |
| 4 PR mergeable | 모두 MERGEABLE |

**권장 머지 순서:** vhk#414 → mcp#6 · cc-skills#5 → brain#11 (contract bump 마지막)

---

## 6. Claude Code 충돌·정합성 검토

### ✅ 충돌 없음 (설계상 분리)

| 층 | Claude Code | Cursor (batch) |
|----|-------------|----------------|
| Primary 진입 | `plugins/yohan-core/CLAUDE.md` + skills | `AGENTS.md` + `.cursorrules` + `ecosystem.mdc` |
| Claude-only ops | handoff · parallel · release-gate (`yohan-cc-skills`) | ecosystem.mdc가 **금지** 명시 |
| Cross-repo SoT | brain `memory/` + MCP digest | contract + registry (ecosystem block) |
| 코어 독트린 | `core-ruleset.yaml` → CORE-RULES.md | 동일 CORE-RULES 상속 |

contract `clients.primary: claude-code` · `clients.secondary: cursor-cli`와 **일치**. cc-skills RULES/AGENTS의 "Claude-only ops — Cursor duplicate 금지"도 ecosystem.mdc 1번 줄과 **정합**.

### ⚠️ 주의 (블로커 아님, 후속 권장)

| 항목 | 내용 | 조치 |
|------|------|------|
| AGENTS boilerplate | cc-skills/mcp AGENTS가 `docs/context/agent-compact.md` 참조 — **파일 없음** | ✅ vhk#414 `resolveAgentCompactRel` — 파일 없으면 포인터 생략 |
| Loop 이중 표현 | cc-skills `plugins/yohan-core/loop.md`(세션 점검) vs AGENTS Loop Protocol(vhk goal 루프) | **스코프 다름** — loop.md=운영 감시, AGENTS=goal 워크플로 |
| brain mcp.json untrack | Claude/Cursor 로컬 MCP 설정 **수동 복원** 필요 | `mcp.json.example` → `vhk mcp-init` 또는 수동 merge |
| CORE-RULES vs CLAUDE.md | yohan-core CLAUDE.md(말투·훅·MCP) + CORE-RULES(전역 독트린) | layering 원칙 준수 — 중복 시 CORE-RULES 우선(절대 규칙) |

### Claude Code 사용자 액션 (머지 후)

1. brain: `.cursor/mcp.json` 로컬 재생성 (example 참고, Lazyweb 등 개인 서버는 env 참조)
2. mcp/cc-skills에서 RULES 변경 시: `vhk sync` (Cursor batch 작업 시)
3. tier 확인: `memory/core/inheritance-registry.yaml` → repo `harness_version: tier-s-v1`

---

## 7. PR 머지 (완료)

| PR | 레포 | HEAD (2026-06-28) |
|----|------|-------------------|
| #414 | vhk | `a2c1c4b` |
| #6 | yohan-mcp | `d8c71a0` |
| #5 | yohan-cc-skills | `e9b233f` |
| #11 | yohan-brain | `a40b635` |

**로컬:** Core 4 clean · brain mcp.json 복원 · `.bak`/`.serena` 삭제 · `check-ecosystem` pass.

---

## 8. 다음 트랙

| 우선 | 트랙 | 핸드오프 |
|------|------|----------|
| 1 | **CDOCS** Cursor 공식문서 ingest | `docs/handoffs/ecosystem-tier-s/handoff-cursor-docs-ingest.md` |
| 2 | **E7** A-tier pilot (보류) | `docs/handoffs/ecosystem-tier-s/handoff-e7-a-tier.md` |

- agent-compact dead link — ✅ vhk sync `resolveAgentCompactRel` (2026-06-28)
- **세션 이어하기:** `HANDOFF.md` · `TRANSFER-PROMPT.md`

---

## 관련 SoT

- `memory/core/ecosystem-contract.yaml` — v0.2.4 + `maintenance.decision_log`
- `memory/core/inheritance-registry.yaml` — 37 GitHub repos + tier
- `docs/CONTEXT-AND-HARNESS-SYSTEM.md` — 컨텍스트 vs harness 개념
- `memory/decisions/2026-06-15-1212-fable5-absorption-pat-core-ruleset.md` — CORE-RULES 선행 결정
