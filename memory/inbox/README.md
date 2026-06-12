# 인박스 — 들어온 것의 대기열

> **역할 단 하나: 처리 대기.** 영구 보관 금지 — 처리했으면 archive 이동 또는 삭제 (`docs/KNOWLEDGE-LOOP.md` §1·§4).

## 구조

| 경로 | 용도 |
|------|------|
| `telegram/YYYY-MM-DD.md` | 텔레그램 봇 자동 append (규칙: `memory/rules/telegram-inbox.md`) |
| `quick-capture.md` | 텔레그램 외 수동 캡처 큐 — 떠오른 생각·링크·할 일을 마찰 없이 던지는 곳 |
| `archive/` | 반영 완료된 raw 보관 (노션에 안 올리고 로컬에 남기고 싶을 때) |

## 처리 흐름

1. 인박스에 쌓인 항목을 `memory/rules/source-to-summary-protocol.md`로 처리
   - 인사이트·자료 → `memory/ingest/insights/` (SUMMARY)
   - 결정 → `memory/decisions/`
   - 단순 할 일 → 실행 후 삭제
2. 처리 완료 블록은 archive로 이동 또는 삭제 — **살아 있는 큐만 남긴다**.
