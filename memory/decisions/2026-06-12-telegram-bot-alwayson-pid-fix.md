---
id: 2026-06-12-telegram-bot-alwayson-pid-fix
date: 2026-06-12
tags: [telegram, bot, scheduler, windows, bugfix]
related: [yohan-os-ops-cuesheet, multi-pc-sync, 2026-06-12-automation-batch-twice-daily]
status: decided
---

# 텔레그램 봇 상시 등록(노트북) + Windows PID 생존 체크 버그 수정

## 결정

- `YohanOS-TelegramBot` 예약 작업 등록 (로그온 트리거, 실패 시 5분 간격 3회 재시작, hidden vbs) — `scripts/task-scheduler-bot-setup.ps1`. **봇 PC(노트북) 1대에서만 등록.**
- `isPidAlive`를 `src/pid-alive.ts`로 추출하고 Windows에서 `tasklist` 교차 검증 추가. `src/telegram-bot.ts`(락 충돌 판정)와 `scripts/telegram-health.ts`(`--require-lock` 게이트) 공용.

## 근거

- 5일 방치 진단(2026-06-12): 봇 PID 20928이 6/7에 죽었는데 `process.kill(pid, 0)`이 Windows에서 true를 반환 → `telegram:health`가 "PID alive" 거짓 양성 → 봇 다운을 헬스체크로 감지 못함. `tasklist`/`Get-Process` 교차 확인으로 실제 사망 검증.
- 봇이 수동 기동(`npm run bot`) 의존이라 사람이 안 켜면 텔레그램 수집이 전면 중단 (마지막 수집 5/2).

## 검증

- `npm run build` 통과.
- 스테일 락 삭제 후 `telegram:health` → "Local lock: none" 정확 보고 (수정 전엔 죽은 PID를 alive로 오판).
- 작업 기동 후 락 생성(PID 36980)·`telegram:health --require-lock` 통과·단일 인스턴스 확인.

## 메모

- 기동 직후 락 파일이 한 번 사라지는 현상 1회 관찰 (등록 시점 자동 기동 + 직전 수동 락 삭제 + OneDrive 동기화 겹침으로 추정). 프로세스 kill 후 재기동에선 재현 안 됨. 재발 시 레포를 OneDrive 밖으로 옮기는 옵션 검토.
