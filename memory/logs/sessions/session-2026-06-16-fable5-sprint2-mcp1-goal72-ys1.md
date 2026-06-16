---
id: session-2026-06-16-fable5-sprint2-mcp1-goal72-ys1
date: 2026-06-16
tags: [session-log, fable5, mcp, vhk, yohan-studio, mcp1, goal72, ys1, pr-merge]
related:
  - memory/logs/sessions/session-2026-06-16-fable5-absorption-code-sprint.md
  - docs/handoffs/fable5-absorption/handoff-session2-2026-06-16.md
---

# Fable5 흡수 2차 스프린트 — MCP1 + goal72 + YS1 + PR 머지

이전 세션(session-2026-06-16-fable5-absorption-code-sprint) 직후 연속 작업.
PR #13 리뷰·머지 → Notion Dev Log → 핸드오프 생성까지.

## 한 일

### YS1 — yohan-studio .agents/CORE-RULES.md (PR #13)

- `yohan-studio/.agents/CORE-RULES.md` (신규): core-ruleset v0.1.0 마커블록 + 프로젝트 특화 섹션
  - 마커: `<!-- CORE-RULES:START v0.1.0 ... -->` ... `<!-- CORE-RULES:END -->`
  - 내용: 정체성·NON-NEGOTIABLE·코딩실행·규칙설계·판단라우팅·안전·비용효율·측정진화 8섹션
  - 마커 아래: yohan-studio 특화 (protected files, branch policy, build gate, DB prefix, stack pin, Dev Log trigger)
- `yohan-studio/goals/8-core-rules.md` (신규): T8 DONE 골 추적 파일
- PR #13 squash 머지: `Add .agents/CORE-RULES.md via YS1 (goal71 marker pattern)` → 2026-06-16T05:43:07Z
- 충돌 사고: 구형 stash(2026-05-25)가 `git stash pop`으로 풀려 README.md 등 4파일 UU 충돌
  - 수동 해결: 사용자가 `git reset --hard HEAD && git stash drop` 직접 실행

### MCP1 — yohan-brain get_core_ruleset + inject_core_rules

- `src/index.ts` 변경:
  - `CoreRuleset` 타입 모듈 레벨로 승격 (get_context 핸들러 내부 인라인 → 공용)
  - 마커 상수: `CORE_RULES_START_TAG`, `CORE_RULES_END_TAG`
  - 헬퍼: `renderCoreRulesetMd(data)` — 8섹션 md 렌더, `applyMarkerBlockMcp(existing, newBlock)` — 멱등 마커 교체
  - `get_core_ruleset` 도구: core-ruleset.yaml 읽기 → `{version, yaml_path, rendered_md}` 반환
  - `inject_core_rules` 도구: `target_path` + `confirm: true` (capability gate) → `{target_path}/.agents/CORE-RULES.md` 기록
  - `TOOL_NAMES` 19→21개 (두 신규 도구 추가)
- 커밋: `feat(mcp): get_core_ruleset + inject_core_rules 도구 추가 (MCP1)` → 248fdda → ✓ master

### goal72 — vhk secure PAT-001/002/004 LLM 가드레일 스캔

- `vhk/src/lib/scan-llm-guardrails.ts` (신규):
  - LLM 지표 파일만 대상 (LLM_INDICATOR regex)
  - PAT-001: closed-vocab select 쓰기 + ALLOWED_ 없음 → warn
  - PAT-002: JSON.parse(content) / json.loads(content) + extract 없음 → warn
  - PAT-004: 노출 진입점 + LLM 호출 + Math.min/CAP 없음 → warn
- `vhk/src/commands/secure.ts` 수정:
  - `import { scanLlmGuardrails }` 추가
  - early return 제거 → 두 스캔(시크릿 + LLM) 모두 실행 후 순차 출력
  - LLM 가드레일 섹션 추가 (byPat 그룹핑, patDesc 설명, 권고 조치)
  - `printNextStep`: 두 스캔 모두 0건일 때만 호출
- 커밋: `feat(secure): PAT-001/002/004 LLM 가드레일 휴리스틱 스캔 (goal72)` → 2aa4f08 → ✓ main
- 스모크 테스트 (news-automation): PAT-001 1건(briefing.py:240, false-positive 후보), PAT-002 3건(실제 위반)

### 핸드오프 문서

- `docs/handoffs/fable5-absorption/handoff-session2-2026-06-16.md` (신규): 잔여 작업 전체 기록
  - P1: goal73(vhk check --evals LLM-judge), gate CI 경고
  - P2: goal74(evolve → PAT 환류), goal75(init 환경경계), vibe-starter-kit Claudeception, shotgrade/ai-router
  - P3: news-automation PAT-002 실제 적용
  - 재진입 포인트 + 아키텍처 현황 + 주의사항

## 변경 레포

| 레포 | 커밋 | push |
|---|---|---|
| yohan-brain (MCP1) | 248fdda | ✓ master |
| vhk (goal72) | 2aa4f08 | ✓ main |
| yohan-studio (YS1 PR #13) | squash | merged master |
| yohan-brain (handoff) | 이번 커밋 | ✓ |

## 검증 결과

- MCP1: `npm run build` 성공, TOOL_NAMES 21개 일치 확인
- goal72: `pnpm build` 성공, news-automation 스모크 PAT-002 3건 감지
- YS1: PR #13 squash merge 확인 (GitHub API 검증)
- early return 제거: `secure.ts` LLM 섹션 항상 실행 확인

## 미처리 (다음 세션)

- goal73: vhk check --evals --judge (PAT-007 품질게이트) — goal66 선행 필요
- goal74: evolve → PAT 후보 섹션
- goal75: init 환경경계 (PAT-005/006)
- gate CI bypass 원인 파악
- vibe-starter-kit Claudeception 보일러플레이트 (로컬 미클론)
- shotgrade #1, ai-router #1 (로컬 미클론)
- news-automation PAT-002 실제 코드 픽스
