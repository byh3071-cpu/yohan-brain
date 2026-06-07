---
id: launch-readme
date: 2026-06-07
tags: [launch, windows, ops]
status: active
---

# Yohan OS — `launch/` 실행 스크립트

Windows 더블클릭·바로가기용. **SoT는 이 폴더** — 바탕화면/Workspace 바로가기는 `install-shortcuts`로 생성.

## 일상 (더블클릭)

| 파일 | 용도 | 창 |
|------|------|-----|
| **`bot.bat`** | 텔레그램 봇 (`npm run bot`) | 유지 (Ctrl+C 종료) |
| **`dashboard.bat`** | 대시보드 안정 모드 :4000 | 유지 |
| **`batch-once.bat`** | 인박스→insight 1회 처리 | 끝나면 Enter |
| **`ingest-rss.bat`** | RSS 전체 (`ingest:all`) | 끝나면 Enter |
| **`health-check.bat`** | 봇 API + smoke-get-context | 끝나면 Enter |

## 개발용

| 파일 | 용도 |
|------|------|
| **`dashboard-dev.bat`** | UI 수정 시 `dashboard:dev:safe` |

## 바로가기 설치

```powershell
# 바탕화면 + Yohan_Workspace\Yohan-Launch\
.\launch\install-shortcuts.bat

# 바탕화면만
powershell -File launch\install-shortcuts.ps1 -Target Desktop
```

생성 이름: `Yohan Bot.lnk`, `Yohan Dashboard.lnk`, …

## 환경

- `YOHAN_OS_ROOT` — 레po 경로 override (선택)
- `.env` — 레po 루트 (봇·배치)

## npm 대응

| launch | npm |
|--------|-----|
| bot.bat | `npm run bot` |
| dashboard.bat | build(필요 시) + `dashboard:start:4000` |
| dashboard-dev.bat | `npm run dashboard:dev:safe` |
| batch-once.bat | `npm run automation:batch` |
| ingest-rss.bat | `npm run ingest:all` |
| health-check.bat | `telegram:health` + `smoke-get-context.mjs` |

운영 SoT: `memory/rules/yohan-os-ops-cuesheet.md`
