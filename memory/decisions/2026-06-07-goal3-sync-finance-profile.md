---
id: 2026-06-07-goal3-sync-finance-profile
date: 2026-06-07
tags: [vhk, wiki, sync, profile]
related: [multi-pc-sync, wiki-stabilization-and-sync-guard]
status: decided
---

# Goal 3 — sync 가드 · finance wiki · profile.yaml

## 결정

- `profile.yaml` `forbidden_patterns` 내 따옴표·슬래시가 YAML 파서를 깨뜨리던 2줄(82, 84)을 전체 문자열 quoting으로 수정 → `get_context` profile 복구.
- `memory/rules/multi-pc-sync.md`를 `auto-pull-hidden.vbs` → `%USERPROFILE%\git-auto-pull.vbs` 체인 기준으로 현행화; `agent-harness.md` §5·§7에서 SoT 링크.
- Finance wiki concept 3건(`personal-finance-low-energy-top3`, `system-income-leverage-structure`, `self-made-wealth-five-elements`) 정의·Inferred·Owner·related 완료.

## 근거

- active-project `wiki-stabilization-and-sync-guard` 잔여 B + finance TODO + profile `_error` 일괄 처리.

## 검증

- `npx tsx scripts/verify-goal-3.ts` 통과
- `vhk goal done --id 3` 통과
