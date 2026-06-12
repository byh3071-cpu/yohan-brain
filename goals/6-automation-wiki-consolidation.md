---
vhk_format: 1
type: goal
id: 6
title: 자동화 상시화 + Wiki 정비 + 대시보드 백로그 마감 (전수 실행)
status: DONE
completed: 2026-06-12
priority: P1
---

# Goal 6: Automation · Wiki · Dashboard Consolidation

> Goal 5(재가동 큐시트) 이후 남은 4영역 전수 실행. 사용자 승인 범위: "전부".

## 진단 (2026-06-12 세션 시작)

| 구간 | 상태 | 처리 |
|------|------|------|
| `npm run bot` | 미실행 (락 stale, PID 사망) | **WP1** 상시 등록 |
| RSS ingest | 37일 정지 (마지막 5/6) | **WP2** batch 통합 + catch-up |
| wiki Phase 5 | lint/answers 미구현, 부채 (만료 TTL 14·깨진 frontmatter·자기참조) | **WP4·WP5** |
| 대시보드 백로그 | DB-101~401 코드 존재하나 AC 미검증·스펙 §12 미동기 | **WP6** |

## 작업 패키지 (커밋 단위)

| WP | 내용 | 커밋 |
|----|------|------|
| WP1 | `YohanOS-TelegramBot` 로그온 태스크 (재시작 x3, hidden vbs) + 큐시트·multi-pc-sync 갱신 | 173d4c4 (+병렬 dd558a9 PID 보완) |
| WP2 | RSS ingest 24h 가드를 automation:batch에 통합 — `src/ingest/rss-all.ts` 모듈화, `last-rss-ingest.json` 메트릭 | adb5ce3 |
| WP3 | batch 루틴 알림에 `suggest_promotions` 후보 표시 (자동 승격 없음) | eea5242 |
| WP4 | `npm run wiki:lint` CLI — frontmatter/Source Lock/TTL/양방향 링크/index 정합 (+`--fix`) | 0f63a0a |
| WP5 | ch10·ch11 승격 + lint 부채 해소 (0 errors/0 warnings) + `wiki/answers/` 신설 | 5052be0 · abecf53 |
| WP6 | DB-101~401 전체 AC 코드 검증 + build 통과 + SPEC §12·백로그 동기화 | f55f57f |
| WP7 | SoT 위생 — active-project·세션로그·결정·evaluator + 런타임 메트릭 커밋 | (본 커밋) |

## 검증 게이트

- `npx tsx scripts/verify-goal-5.ts` PASS
- `npm run check:drift` PASS
- `npm run telegram:health -- --require-lock` PASS (PID 락 생존)
- `npm run wiki:lint` 0 errors / 0 warnings
- `npm run dashboard:build` PASS

## UAT (사람)

1. 텔레그램 1건 전송 → `inbox/telegram/` append → 다음 배치에서 처리 확인
2. 노트북 재부팅 → 봇 자동 기동(`telegram:health --require-lock`) 확인
3. themilk 피드 URL 결정 (`www.the-mill.kr` ENOTFOUND — 매 RSS 주기마다 failed 알림 발생)
4. wiki Owner Notes 채우기 + 주 1회 MVI 시작
