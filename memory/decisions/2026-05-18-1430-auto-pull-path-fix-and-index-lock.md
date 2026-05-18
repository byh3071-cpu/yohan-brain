---
title: auto-pull 경로 버그 수정 + 자동화 배치 index.lock 충돌 해소
created: '2026-05-18T14:30:00.000Z'
source: manual.session
---

## 증상
노트북과 집 컴퓨터의 Yohan OS 대시보드가 서로 다른 상태로 보임. 양쪽에서 commit/push/pull을 했음에도 불일치 지속.

## 원인 분석
1. **`auto-pull.ps1` 경로 오류** — `$repoPath`가 `C:\Users\user\Desktop\AI 1인 기업\Yohan OS`로 설정되어 있었으나 실제 경로는 `C:\Users\user\Desktop\01_AI_프로젝트\AI 1인 기업\Yohan OS`. `Set-Location` 실패 후 `git pull`이 잘못된 cwd에서 실행되어 자동 동기화가 작동하지 않음.
2. **`YohanOS-AutomationBatch-30min` 인덱스 리셋** — 30분 주기 배치가 수동 `git add` 직후 인덱스를 리셋하는 충돌을 일으킴. 작업 중 두 차례 staged 변경이 사라지는 현상 관찰.
3. **미추적 로컬 전용 파일** — `.agents/`, `.claude/`, `sot-snapshot.md`, `generate-snapshot.ps1`, `skills-lock.json`, `ntn-install.sh`가 원격으로 전파되지 않아 기기별 환경 차이 누적.

## 조치
- `.gitignore`에 위 로컬 전용 경로 추가.
- `auto-pull.ps1`의 `$repoPath`를 실제 경로로 수정.
- 자동화 배치를 일시 비활성화한 뒤 9개 누적 커밋을 `origin/master`로 푸시 (`d79ae66..e3d12bb`).
- 배치 작업 재활성화 후 동기 상태 확인 (양 기기 동일 HEAD).

## 후속 확인
- 노트북에서 `git pull --rebase origin master` 실행 후 대시보드 상태 일치 확인.
- `YohanAutoPull` 작업은 Access denied로 비활성화 실패 — 권한 문제 별도 조사 필요. 단, pull 전용이라 인덱스 충돌과 무관.
- 30분 배치가 staged 변경을 리셋하는 동작은 작업 흐름 침해 가능성. 수동 작업 중에는 비활성화 권장 또는 트리거 로직 재검토.
