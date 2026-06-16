---
date: 2026-06-16
session: Fable5 흡수 실행 세션 #2 (코드 스프린트)
tags: [fable5, pat-001, pat-003, pat-006, dic1, allowlist, backtest-tag]
---

# Fable5 흡수 — 코드 작업 완료 결정

## 완료한 작업

### P0 — news-automation #1 (PAT-001 allowlist)
- `indicator.py`: `ALLOWED_SECTORS` 상수 신설 + f-string 프롬프트 단일 SoT + sectors 필터
- `main.py`: `ALLOWED_CATEGORIES` 상수 신설 + analyze 프롬프트 단일 SoT + 뉴스룸/단어장 두 함수 모두 검증·폴백("기타")
- **이전 행동:** `json.loads` 후 allowlist 없이 raw Notion 기입 → 환각값이 새 옵션으로 고착
- 커밋: `bc33ea3`

### P1 — yohan-dca-bot #2 (§23 백테스트 태그 + PAT-003 역링크)
- `telegram.py` `send_cycle_result` 푸터에 `[백테스트 기반 · 과거성과 무보증]` 추가
- `README.md` 핵심 철학에 `src/risk/lockout.py — PAT-003 정본` 역링크 1줄
- 커밋: `8c8d965`

### P1 — auto-trader #1 (WF2 백테스트 태그)
- `WF2_시그널_알림.json` JS 코드 메시지 푸터에 `[백테스트 기반 · 과거성과 무보증]` 추가
- 커밋: `ce31d5b`

### PAT-006 수정 (window.storage API 상세화)
- 패턴명: "브라우저 네이티브 스토리지 금지" → "샌드박스 스토리지 — localStorage 금지, window.storage 사용"
- `window.storage.setItem/getItem/removeItem` async API 예제 추가
- Fable 5 명시 사양: 키 형식 `table:id`, 비동기 Promise
- 커밋: `3f43fdc`

### yohan-ai-dictionary #1 — DIC1+2 (7종 용어)
신규 항목화:
1. `instruction-hierarchy.md` — 지시 계층
2. `tool-orchestration.md` — 도구 오케스트레이션
3. `capability-gating.md` — 역량 게이팅
4. `long-horizon-agent.md` — 장기 목표 에이전트
5. `eval-harness.md` — 평가 하네스
6. `claudeception.md` — 클로드셉션 (API-in-Artifact)
7. `artifact-storage.md` — 아티팩트 스토리지 (window.storage)
- 커밋: `ebe5046`

## 미완료 (다음 세션)

- vibe-starter-kit: `lib/artifact-llm.ts` Claudeception 보일러 추가 (레포 미설치)
- yohan-os: MCP1~3 이슈 (#1 P0, #2/#3 P1) — 노력 L/M으로 별도 세션 필요
- ai-router #1, shotgrade #1 — 다음 세션
- vhk #274~276 — goal71~73 (다음 세션)
- yohan-studio #12 — 다음 세션

## 결정 사항

1. news-automation 폴백 값: 환각 카테고리 → "기타"로 폴백 (가장 포괄적 옵션)
2. PAT-006: "전면 금지" → "localStorage/sessionStorage 금지, window.storage 사용 권장"으로 명확화
3. auto-trader 확신어 수정 범위: 급등/급락 단어 자체는 조건-사실형으로 유지, 면책 태그 추가로 충족
