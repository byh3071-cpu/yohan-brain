---
id: multi-pc-sync
date: 2026-05-18
domain: ops
tags: [git, sync, scheduled-task, windows, multi-pc]
related: [agent-harness, decision-trigger]
status: active
---

# 멀티 PC Sync 운영 규칙

## 전제
- Yohan OS는 노트북·집컴 두 기기에서 같은 레포(`master`)로 작업한다.
- 런타임 SoT는 `memory/`이며, Git이 유일한 동기 채널이다.

## 자동 동기 구성 (Windows)
- `auto-pull.ps1` — `git pull origin master --ff-only`만 실행. 결과를 `C:\Users\user\git-autopull.log`에 기록.
- 예약 작업
  - `YohanAutoPull` — `auto-pull.ps1` 주기 호출 (pull-only, 충돌 위험 낮음).
  - `YohanOS-AutomationBatch-30min` — 30분 주기. `scripts/run-automation-batch.ps1` → `npm run automation:batch`. **git 명령은 호출하지 않음** (검증됨, 2026-05-18).

## 작업 시작 시 필수
1. **풀 먼저:** `git pull --rebase origin master`. 자동 작업은 보조이며 사람 작업의 선행 조건은 아니다.
2. **상태 확인:** `git status -b --short`로 ahead/behind 확인.
3. **분기 시작 직전 SoT 검증:** 필요 시 `node scripts/smoke-get-context.mjs`로 `get_context`가 현재 PC에서 정확한 맥락을 반환하는지 확인.

## 작업 중 가드
- 수동 커밋 작업 중 다른 세션(다른 Claude/Cursor/사람)이 같은 워크트리에서 자동 커밋을 일으키면 인덱스 충돌이 발생할 수 있다.
- 의심 신호: `git status` 결과가 짧은 시간 내 자체적으로 바뀜, 스테이지한 파일이 사라짐.
- 대응 순서
  1. `git log --since="10 minutes ago" --pretty=fuller`로 다른 작성자 커밋 확인.
  2. `Get-ScheduledTask | Where-Object {$_.TaskName -like "Yohan*"}`로 활성 작업 상태 점검.
  3. 같은 시각의 다른 IDE/터미널 창 있는지 직접 확인. 발견되면 직렬화한다.
  4. 위 어느 것도 아니면 백그라운드 node 프로세스(`Get-Process node`)와 그 시작 시각을 기준으로 후보를 좁힌다.

## 작업 종료 시 필수
- `git push origin master` 후 `git status -b --short`로 ahead 0 확인.
- 반대 기기에서 `git pull --rebase origin master` 실행 후 대시보드/`get_context` 재확인.

## 알려진 이슈
- `YohanAutoPull` 비활성화 시 일반 사용자 권한에서 `Access denied`가 발생할 수 있음. 관리자 PowerShell에서 재시도하거나 작업 재등록으로 해결한다 (조사 대기).
- `auto-pull.ps1`의 `$repoPath`가 실제 폴더와 일치해야 한다. 변경 시 두 PC 모두 동기 수정 (참고: `memory/decisions/2026-05-18-1430-auto-pull-path-fix-and-index-lock.md`).

## 변경 절차
- 자동화 스크립트·예약 작업 변경은 결정 로그로 남기고 양 PC에서 검증한다.
- 본 규칙 갱신은 `memory/rules/rule-review-cycle.md` 절차를 따른다.
