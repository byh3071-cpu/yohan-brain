---
id: handoff-e7-a-tier
date: 2026-06-28
tags: [handoff, ecosystem, tier-a, e7, deferred]
related:
  - memory/core/ecosystem-contract.yaml
  - memory/core/inheritance-registry.yaml
status: deferred
---

# 핸드오프 — E7 A-tier bootstrap (보류)

> **상태:** ⏸ **보류** — Cursor batch로 product 레포 작업 **시작할 때** 1개 pilot.  
> **이유:** tier S 완료 직후 ROI 낮음. dictionary/studio는 Claude primary 또는 가끔 Cursor.

---

## A-tier란 (contract 기준)

| vs Tier S | Tier A |
|-----------|--------|
| Core 4 (brain·mcp·vhk·cc-skills) | product 레포 (studio, dictionary, snapcontext, …) |
| FULL harness (RULES·AGENTS·CORE-RULES·context·mdc) | **경량** — CORE-RULES + context + ecosystem.mdc (AGENTS sync optional) |
| contract enforce 대상 | registry tier A + `vhk inject-bootstrap` 확장 |

---

## 로컬 audit (2026-06-28, partial)

| 레포 | RULES | AGENTS | CORE-RULES | context | mdc |
|------|:-----:|:------:|:----------:|:-------:|:---:|
| yohan-studio | ❌ | ✋ hand | ❌ | ❌ | ❌ |
| yohan-ai-dictionary | ❌ | ❌ | ❌ | ❌ | ❌ |
| snapcontext / shotgrade / talos | not cloned locally | | | | |

---

## pilot 권장

**1순위: `yohan-ai-dictionary`**

- Phase 3 진행 중 (`memory/projects/yohan-ai-dictionary/`)
- harness 없음 → greenfield pilot 깔끔
- AGENTS sync **허용** (hand 유지 불필요)

**2순위: `yohan-studio`**

- AGENTS **수기 유지** (brain과 동형)
- `repo_entry_overrides` 패턴 재사용

---

## 티켓 큐 (착수 시)

| 티켓 | 내용 | 완료 기준 |
|------|------|-----------|
| **E7-00** | contract A-tier harness matrix YAML | `tiers.A.harness` 명시 |
| **E7-01a** | dictionary pilot inject-bootstrap | CORE-RULES + mdc + context |
| **E7-01b** | studio pilot (hand AGENTS) | overrides + mdc + CORE-RULES |
| **E7-02** | `vhk start` A-tier dogfood | 1레포 E2E |

**변환:** vhk goal 「E7-00 A-tier harness matrix」

---

## 착수 조건 (하나라도 해당 시)

- [ ] 해당 product 레포에서 **Cursor batch** 2세션 이상 예정
- [ ] harness drift 이슈 (ecosystem 경계 혼선) 실제 발생
- [ ] CDOCS 또는 tier S **안정 1주** 후 여유

---

## 전달 프롬프트

→ [TRANSFER-PROMPT.md § C](TRANSFER-PROMPT.md)

---

## SoT

- `memory/core/inheritance-registry.yaml` — tier A repo 목록
- `memory/decisions/2026-06-28-ecosystem-tier-s-harness-sprint.md` §8
- vhk `inject-bootstrap.ts` — tier S 구현 (A는 축소판)
