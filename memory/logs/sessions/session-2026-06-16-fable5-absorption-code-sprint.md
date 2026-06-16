---
id: session-2026-06-16-fable5-absorption-code-sprint
date: 2026-06-16
tags: [session-log, fable5, mcp, vhk, news-automation, yohan-dca-bot, auto-trader, yohan-ai-dictionary]
related:
  - memory/decisions/2026-06-16-1500-fable5-absorption-code-sprint.md
  - memory/decisions/2026-06-15-1212-fable5-absorption-pat-core-ruleset.md
  - docs/patterns/PAT-006-browser-storage-ban-sandbox.md
---

# Fable5 시스템 프롬프트 해부 — 흡수 코드 스프린트

## 한 일

### P0 — news-automation #1 (PAT-001 LLM 닫힌어휘 allowlist)
- `indicator.py`: `ALLOWED_SECTORS` 상수 + LLM 프롬프트 f-string 동적 삽입 + 응답 후 필터
- `main.py`: `ALLOWED_CATEGORIES` 상수 + 두 함수(create_newsroom_item, create_vocabulary_item) allowlist 검증

### P1 — yohan-dca-bot #2 (백테스트 태그 + PAT-003 레퍼런스)
- `src/notifier/telegram.py`: `send_cycle_result` 말미에 `<i>[백테스트 기반 · 과거성과 무보증]</i>` 추가
- `README.md`: `src/risk/lockout.py` PAT-003 정본 레퍼런스 추가

### P1 — auto-trader #1 (WF2 JSON 면책 태그)
- `workflows/Autotreder WF2_시그널_알림.json`: JS 코드 블록에 `[백테스트 기반 · 과거성과 무보증]` 메시지 삽입

### P1 — yohan-ai-dictionary #1 (Fable5 신규용어 7종)
- 신규 term 파일 7개 생성: instruction-hierarchy, tool-orchestration, capability-gating,
  long-horizon-agent, eval-harness, claudeception, artifact-storage

### PAT-006 업데이트
- `docs/patterns/PAT-006-browser-storage-ban-sandbox.md`: window.storage API 상세(async setItem/getItem/removeItem, 키 형식 table:id) 추가

### MCP2 — yohan-brain get_context 강화
- `src/index.ts`: `TOOL_NAMES` 상수(19개) 선언 + `get_context` 페이로드에 `core_rules_digest` + `available_tools` 주입
- `core_rules_digest`: version, non_negotiable[], instruction_hierarchy, tool_budget — core-ruleset.yaml에서 Promise.all 로 읽기

### goal71 — vhk init core-ruleset 마커블록 상속
- `src/lib/core-rules.ts` (신규): loadCoreRuleset(YOHAN_BRAIN_ROOT → 라이브/폴백 번들), renderCoreRuleset(8섹션 md), applyMarkerBlock(멱등 마커 교체), generateCoreRulesContent
- `src/templates/core-ruleset-snapshot.ts` (신규): v0.1.0 번들 스냅샷
- `src/lib/core-rules.test.ts` (신규): vitest 10개 (렌더·마커·멱등·폴백)
- `src/commands/init.ts`: generateFiles에 `.agents/CORE-RULES.md` 생성 추가
- `package.json`: yaml@2.9.0 의존성 추가

## 변경 레포

| 레포 | 커밋 | push |
|---|---|---|
| news-automation | bc33ea3 | ✓ main |
| yohan-dca-bot | 8c8d965 | ✓ main |
| auto-trader | ce31d5b | ✓ main |
| yohan-ai-dictionary | ebe5046 | ✓ main |
| yohan-brain | 76b8f50 | ✓ master |
| vhk | 9106ec1 | ✓ main |

## 검증 결과
- news-automation: allowlist 필터 정상 동작 (코드 리뷰 통과)
- yohan-dca-bot: 백테스트 footer HTML italic 정상
- auto-trader: WF2 JSON 면책 문구 삽입 확인
- yohan-brain MCP2: TOOL_NAMES 19개 = 실제 등록 13정적+6RSS = 일치
- vhk goal71: pnpm build 성공, vitest 10/10 통과, 마커 멱등 검증

## 다음 세션
- YS1 (yohan-studio #12): .agents/CORE-RULES.md 마커 상속
- goal72 (vhk secure): PAT-001/002/004 LLM 가드레일 grep/AST 검출
- MCP1 (yohan-brain): get_core_ruleset + inject_core_rules 도구
- goal73 (vhk check): LLM-judge 품질게이트 PAT-007
- vhk gate status check bypass 원인 확인 (CI gate 미충족 경고)
