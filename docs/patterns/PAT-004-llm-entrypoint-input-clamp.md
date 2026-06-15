---
id: PAT-004
패턴명: LLM 진입점 입력 클램프
카테고리: auth
증상: server action·webhook·cron이 외부 임의 인자로 호출돼 LLM에 과대 입력·비용 폭증·남용이 발생
원인: 진입점이 입력 범위·토큰 예산·호출 빈도를 신뢰하고, 클라이언트가 보낸 값을 그대로 LLM에 전달
적용조건: 외부에서 트리거 가능한 모든 LLM 호출부(server action, API route, webhook, cron, MCP 도구)
출처프로젝트: youtube-summary(BRIEFING_CANDIDATES_CAP=50, mainline)
태그: [llm, input-validation, cost, rate-limit, trust-boundary]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 (Instruction Hierarchy + 토큰예산)
---

## 증상
공개 진입점(server action·webhook)은 누구나 임의 인자로 호출할 수 있다. `count: 100000`을 보내면 LLM에 거대 입력이 들어가 토큰비 폭증·타임아웃·남용.

## 원인
진입점을 "신뢰 경계"로 보지 않고, 외부 입력을 LLM 호출에 직결. Instruction Hierarchy 위반(외부=최하위 신뢰인데 상위 자원을 무제한 소비).

## 해결
LLM 호출 **직전**에 코드로 3중 클램프:
1. **범위 클램프** — `Math.min(input, CAP)`
2. **토큰 예산 상한** — 입력 길이/항목 수 상한
3. **호출 빈도** — rate limit(사용자별/IP별)

```ts
const BRIEFING_CANDIDATES_CAP = 50;
const n = Math.min(Math.max(requested ?? 10, 1), BRIEFING_CANDIDATES_CAP);
// 이후 n개만 LLM에 전달
```

- ✅ 이렇게: `Math.min(requested, CAP)` + rate limit + 토큰 상한
- ❌ 이렇게 말고: `await llm(items.slice(0, requested))` (requested 무검증)
- 왜: 진입점은 신뢰 경계. 상수 CAP로 최악 비용을 코드가 못박는다(mainline 검증).

## 적용조건
- 외부 트리거 가능한 LLM 호출 전부. 내부 전용 스크립트엔 완화 가능.
- CAP 값은 비용·UX 균형으로 결정하고 상수로 노출(매직넘버 금지).
- PAT-003(자동화 안전)과 결합: 진입 클램프(입력) + 4중 안전(실행).
