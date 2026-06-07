---
id: yohan-os-ops-cuesheet
date: 2026-06-07
updated: 2026-06-07
domain: ops
tags: [telegram, ingest, bot, rss, daily-ops, launch]
related: [telegram-workflow, telegram-inbox, multi-pc-sync, agent-harness]
status: active
---

# Yohan OS 일상 운영 큐시트

> **역할 분담:** 텔레그램 = 던지기 · Yohan OS = 받기·정제 · Cursor = 검토·wiki·결정
> **더블클릭 실행:** `launch/` — `launch/README.md` · 바로가기 `launch\install-shortcuts.bat`

---

## 1. 하루 최소 (노트북)

| 언제 | 너 (PC) | Yohan OS (자동) |
|------|---------|-----------------|
| 노트북 켤 때 | `launch\bot.bat` (또는 `npm run bot`) | — |
| 스크린·URL·메모 볼 때 | 텔레그램 @yohanos_bot 전송 | → `memory/inbox/telegram/YYYY-MM-DD.md` |
| (대기) | **안 해도 됨** | 30분마다 `automation:batch` |
| 주 1회 | `launch\ingest-rss.bat` | RSS → `memory/ingest/rss/` |
| Cursor 세션 | `get_context` | SoT 주입 |

**봇은 PC 1대만** — 기본: **노트북**. 집 PC에서는 텔레그램만 보내도 됨.

---

## 2. 텔레그램 — 네가 하는 것

| 보내는 것 | Yohan OS 처리 |
|-----------|---------------|
| 스크린샷 | OCR → `ingest/insights/` · (설정 시) 노션 |
| URL (GitHub 등) | URL ingest · GitHub why-how |
| 짧은/긴 텍스트 | 인박스 → 배치 정제 |

**텔레그램에서 안 함:** wiki 편집, git, 폴더 정리.

---

## 3. Yohan OS — 알아서 하는 것

| 자동 | 주기/조건 |
|------|-----------|
| 인박스 append | 봇 켜진 상태 + 메시지 수신 |
| OCR·insight·노션 | `YohanOS-AutomationBatch-30min` |
| git pull (부팅) | `%USERPROFILE%\git-auto-pull.ps1` (커스텀, Workspace 전체) |
| 텔레gram 완료 알림 | 2시간 1회 (review/failed는 즉시) |

**수동만:** RSS (`npm run ingest:all`), **봇 기동** (`npm run bot`).

---

## 4. PC — 가끔 하는 것

| 상황 | 명령 |
|------|------|
| 즉시 처리 | `launch\batch-once.bat` |
| 봇 상태 | `launch\health-check.bat` |
| 봇 필수 확인 | `npm run telegram:health -- --require-lock` |
| 검토 큐 | `memory/inbox/automation-review.md` |
| 실패 | `memory/logs/errors/` |
| SoT 스모크 | `node scripts/smoke-get-context.mjs` |
| PC 변경 | `git pull` → 작업 → `git push` |
| commit 중 | `Disable-ScheduledTask -TaskName YohanOS-AutomationBatch-30min` |

---

## 5. Cursor(에이전트)

| 요청 | 처리 |
|------|------|
| wiki 승격 | `promote_to_wiki` / wiki 작성 |
| 맥락 | `get_context` · `search_memory` |
| 결정 | `append_decision` |
| 개발 | VHK Goal · verify 게이트 |

---

## 6. 점검 3줄 (세션 시작)

```powershell
npm run telegram:health
Get-ScheduledTask -TaskName YohanOS-AutomationBatch* | Select TaskName,State
node scripts/smoke-get-context.mjs
```

---

## 7. 관련 SoT

- 플로우 상세: `memory/rules/telegram-workflow.md`
- 인박스·아카이브: `memory/rules/telegram-inbox.md`
- Git·멀티 PC: `memory/rules/multi-pc-sync.md`
- Goal 5: `goals/5-yohan-os-revival-cuesheet.md`
