---
id: 2026-06-12-automation-batch-twice-daily
date: 2026-06-12
tags: [automation, telegram, scheduler, ops]
related: [multi-pc-sync, yohan-os-ops-cuesheet, telegram-workflow]
status: decided
---

# automation:batch 예약을 매시 정각 24회 → 하루 2회(09:00·21:00)로 축소

## 결정

- Windows 예약 작업 `YohanOS-AutomationBatch`의 트리거를 매시 정각 24개에서 **09:00·21:00 두 개**로 재등록 (XML export → 수정 → `schtasks /create /f`).
- `scripts/task-scheduler-setup.ps1` 동기화: 작업명 `YohanOS-AutomationBatch-30min` → `YohanOS-AutomationBatch`, 트리거 48개(30분 간격) → 2개(09:00·21:00). 다른 PC에서 재실행해도 같은 주기가 되도록.
- 규칙 문서 현행화: `multi-pc-sync.md` · `yohan-os-ops-cuesheet.md` · `telegram-workflow.md` · `agent-harness.md`의 `-30min` 작업명·"30분마다" 표기 제거.
- 배치 내부 루틴 알림 쿨다운(`ROUTINE_NOTIFY_INTERVAL_MS` 2h)은 유지 — 실행이 하루 2회라 알림도 자연히 하루 최대 2회. 검토/실패 알림은 즉시 발송 유지.

## 근거

- 사용자 요청: 텔레그램 완료 알림이 잦아(체감 30분마다) 피로 — 하루 1~2회만 원함.
- 실측: 매시 실행 + 2시간 쿨다운 = 하루 최대 12회 루틴 알림.

## 검증

- `schtasks /query /tn YohanOS-AutomationBatch` — 트리거 2개, Next Run 2026-06-12 21:00 확인.
