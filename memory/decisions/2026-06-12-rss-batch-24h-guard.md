---
id: 2026-06-12-rss-batch-24h-guard
date: 2026-06-12
tags: [rss, automation, batch, ingest]
related: [yohan-os-ops-cuesheet, 2026-06-12-automation-batch-twice-daily, 2026-06-12-telegram-bot-alwayson-pid-fix]
status: decided
---

# RSS ingest를 automation:batch에 24h 가드로 통합 (별도 예약 작업 기각)

## 결정

- `automation-batch.ts`가 인박스 처리 후 `isRssDue()`(마지막 실행 24h 경과) 판단 → due면 `ingestAllRssFeeds(20)` 실행. 가드 메트릭: `memory/metrics/automation/last-rss-ingest.json`.
- 피드 루프는 `src/ingest/rss-all.ts`로 모듈화 — CLI(`npm run ingest:all`)와 batch가 공유. 수동 실행은 가드와 무관(멱등).
- 가드 파일은 **시도 시점**에 기록 — 부분 실패여도 갱신해 깨진 피드를 배치 주기마다 재시도하지 않음. 피드별 실패는 needs-attention 텔레그램 알림으로 즉시 표면화.
- 별도 Windows 예약 작업 방식은 기각: 기존 배치 스케줄러·로그·알림 배관 재사용이 OS 아티팩트 추가보다 단순.

## 검증

- dry-run에 due/skip 표시, 라이브 1회에 `RSS=신규0/스킵90` + 가드 파일 생성, 직후 재실행 스킵 확인.
- catch-up `npm run ingest:all -- 50` 완료 (5/6 피드 OK).

## 메모

- **themilk 피드 실패**: `www.the-mill.kr` ENOTFOUND — 피드 URL 사망 추정. RSS 주기(24h)마다 failed 알림 1회 발생하므로 URL 교체 또는 피드 제거 결정 필요 (UAT).
