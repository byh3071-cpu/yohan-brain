---
vhk_format: 1
type: goal
id: 4
title: 멀티 PC sync 코드리뷰 후속 (가드·YohanAutoPull·get_context 게이트)
status: DONE
priority: P0
completed: 2026-06-07
---

# Goal 4: Sync Guard Code-Review Follow-up

## 배경

Goal 3 code-review에서 3건 Medium: AutomationBatch staged 충돌 가드 누락, `YohanAutoPull` 레포 재현 불가, `get_context` E2E 미검증.

## Units

| Unit | 내용 |
|------|------|
| **U1** | `multi-pc-sync.md` — AutomationBatch + 수동 git **직렬화/비활성화** 가드 (decision 2026-05-18 근거) |
| **U2** | `multi-pc-sync.md` — 레포 vs `%USERPROFILE%` 경계·설치 절차 표 |
| **U3** | `scripts/git-auto-pull.template.vbs` + `scripts/install-git-auto-pull.ps1` |
| **U4** | `scripts/task-scheduler-auto-pull-setup.ps1` — `YohanAutoPull` 등록 (repo `auto-pull-hidden.vbs`) |
| **U5** | `smoke-get-context.mjs` — `profile`/`active_project` `_error` assert → exit 1 |
| **U6** | `verify-goal-4.ts` + `check-goal-4.mjs` |
| **U7** | `docs/STRUCTURE.md` — 삭제된 `auto-pull.ps1` 참조 정정 |
| **U8** | `active-project.yaml` · decision · `verify-goal-3` 회귀 없음 확인 |

## Forbidden

- `memory/` 폴더 구조 변경
- `package.json` / `tsconfig.json` 변경

## Completion Check

- [ ] U1–U8
- [ ] `vhk goal check --id 4` 통과
