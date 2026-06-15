---
id: PAT-007
패턴명: LLM-as-judge 품질 게이트 3요소
카테고리: test
증상: AI 출력 품질을 점수화해 재생성하는 루프가 무한 재시도하거나, 기준 없이 첫 결과를 그대로 쓴다
원인: 품질 임계·시도 상한·폴백 경로 셋 중 하나가 빠짐
적용조건: LLM 출력을 LLM/룰로 채점해 재생성 여부를 결정하는 모든 self-improve 루프
출처프로젝트: youtube-summary(QUALITY_THRESHOLD=78·MAX_REGENERATION_ATTEMPTS=3, mainline)
태그: [llm, eval, llm-as-judge, quality-gate, retry]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 (Evals/측정 렌즈)
---

## 증상
"점수 낮으면 다시 생성" 루프가 임계를 못 넘으면 무한 재시도(비용·지연 폭증)하거나, 반대로 기준이 없어 저품질 첫 출력을 그대로 내보낸다.

## 원인
품질 루프는 3요소가 다 있어야 닫힌다: ①통과 기준(수치 임계) ②시도 상한 ③상한 도달 시 폴백. 하나라도 없으면 무한루프 또는 무품질.

## 해결
```ts
const QUALITY_THRESHOLD = 78;          // ① 수치 임계
const MAX_REGENERATION_ATTEMPTS = 3;   // ② 시도 상한
let best = null;
for (let i = 0; i < MAX_REGENERATION_ATTEMPTS; i++) {
  const out = await generate();
  const score = await judge(out);
  if (!best || score > best.score) best = { out, score };
  if (score >= QUALITY_THRESHOLD) return out;
}
return best.out;                       // ③ 상한 도달 → 최고점 폴백(무한재시도 금지)
```

- ✅ 이렇게: 임계 + 상한 + 최고점 폴백
- ❌ 이렇게 말고: `while (score < THRESHOLD) regenerate()` (상한 없음 → 무한루프)
- 왜: 측정·재시도·종료가 한 세트(mainline 검증).

## 적용조건
- LLM 자기개선 루프(요약·생성·분류 재생성). 단발 호출엔 불필요.
- 임계·상한은 상수로 노출, 폴백은 "최고점 결과"로(실패 throw보다 degrade가 UX에 나음).
- 골든셋(고정 회귀 케이스)과 결합하면 임계값 튜닝의 근거가 생긴다.
