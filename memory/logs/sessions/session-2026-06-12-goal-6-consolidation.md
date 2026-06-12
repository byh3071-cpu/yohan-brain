# 세션 로그 — 2026-06-12 Goal 6: 자동화 상시화 + Wiki 정비 + 대시보드 백로그 마감

## 변경 요약

- **WP1 (173d4c4)** 텔레그램 봇 Windows 상시 등록 — `YohanOS-TelegramBot` 로그온 태스크(재시작 x3), `scripts/run-telegram-bot.ps1`·`-hidden.vbs`·`task-scheduler-bot-{setup,remove}.ps1`, 큐시트·multi-pc-sync 갱신. 병렬 세션 dd558a9가 PID 거짓 양성 수정으로 보완.
- **WP2 (adb5ce3)** RSS ingest 24h 가드를 automation:batch에 통합 — `src/ingest/rss-all.ts` 모듈화, `scripts/automation/rss.ts` 가드, catch-up `ingest:all -- 50` (5/6 피드 OK).
- **WP3 (eea5242)** batch 루틴 알림에 wiki 승격 후보 표시 (`suggest_promotions` limit 3, 자동 승격 없음).
- **WP4 (0f63a0a)** `npm run wiki:lint` CLI — 구조 검사 5종 + `--fix`(TTL expired 마킹·index 재집계만).
- **WP5 (5052be0·abecf53)** modern-ai-ch10·ch11 승격 + 양방향 링크, lint 부채 전부 해소 (0 errors/0 warnings), `wiki/answers/` 신설.
- **WP6 (f55f57f)** 대시보드 DB-101~401 전체 AC 코드 검증 + `dashboard:build` 통과 — AC 미달 없음, SPEC §12·백로그 진행 메모 동기화. **백로그 완료, 다음 마일스톤 v4.**
- **WP7 (본 커밋)** active-project·goals/6·결정 2건·evaluator 3건 + RSS catch-up 산출물·런타임 메트릭 커밋.
- **결정** `2026-06-12-rss-batch-24h-guard.md` · `2026-06-12-wiki-lint-cli.md`

## 검증 게이트

verify-goal-5 · check:drift · telegram:health --require-lock · wiki:lint(0/0) · dashboard:build — 전부 PASS (WP7 커밋 직전 실행).

## 결과: 성공

## 교훈

- **CRLF 함정**: wiki frontmatter 마지막 라인의 `\r`가 YAML 파서 전체 실패를 유발 — promote.ts의 regex fallback이 4월부터 가려온 문제를 lint 도입이 드러냄. frontmatter 파싱은 항상 `\r` 정규화 선행.
- **병렬 세션 인터리브**: 같은 워크트리에서 다른 세션(knowledge-loop 작업)이 커밋 사이에 끼어듦(0e59d52·dd558a9). 충돌은 없었으나 스테이징은 항상 파일 명시(`git add <paths>`)로, `git add -A` 금지. 멀티 PC뿐 아니라 **동일 PC 멀티 세션**도 multi-pc-sync 가드 대상.
- 예약 작업 실태가 레포 스크립트와 다를 수 있음 — 등록 전 `Get-ScheduledTask` 실태 확인 필수 (이번엔 이미 통일돼 있어 계획했던 재등록 절차 생략).

## 다음 세션 / UAT

1. 텔레그램 1건 전송 → 인박스 → 배치 처리 확인 (사람)
2. 노트북 재부팅 → 봇 자동 기동 확인 (사람)
3. themilk 피드 URL 교체/제거 결정 — 현재 24h마다 failed 알림 1회
4. wiki Owner Notes 14건 채우기 + 주 1회 MVI 시작
5. 대시보드 v4 (STT·내보내기) 착수 여부 결정
