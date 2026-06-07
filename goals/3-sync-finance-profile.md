---
vhk_format: 1
type: goal
id: 3
title: 멀티 PC sync · finance wiki · profile.yaml (active-project 잔여)
status: DONE
priority: P0
completed: 2026-06-07
---

# Goal 3: Sync · Finance Wiki · Profile

## Units

| Unit | 내용 |
|------|------|
| **U1** | `profile.yaml` YAML 파싱 오류 수정 → `get_context` profile 복구 |
| **U2** | `multi-pc-sync.md` 현행화 (`auto-pull-hidden.vbs`·경로) |
| **U3** | `agent-harness.md` §5 → `multi-pc-sync.md` 링크 |
| **U4–U6** | finance wiki 3건 정의·Inferred·Owner·related |
| **U7** | `wiki/index.md` finance TODO 제거 |
| **U8** | `verify-goal-3.ts` + `active-project.yaml` 갱신 |

## Forbidden

- `memory/` 폴더 구조 변경
- `package.json` / `tsconfig.json` 변경

## Completion Check

- [ ] U1–U8 완료
- [ ] `vhk goal check --id 3` 통과
