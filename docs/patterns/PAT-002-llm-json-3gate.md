---
id: PAT-002
패턴명: LLM JSON 출력 3단 게이트 + 관용 추출기
카테고리: state
증상: LLM이 코드펜스(```json)·서론("다음은 결과입니다")을 섞어 반환해 raw JSON.parse가 깨진다
원인: 모델 출력을 신뢰해 바로 파싱하고, 깨지면 예외 전파 또는 부분 데이터 삽입
적용조건: provider가 strict JSON 모드(response_format/responseSchema)를 보장하지 못하는 모든 LLM JSON 수신부
출처프로젝트: youtube-summary(src/lib/llm-json.ts, mainline 모범), shotgrade(lib/analyze.ts, 참고-미머지 브랜치)
태그: [llm, json, parsing, guardrail, robustness]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석
---

## 증상
Gemini·OpenAI(스키마 미사용 시)·로컬 모델은 JSON을 코드펜스나 서론과 섞어 반환한다. `JSON.parse(raw)`가 `SyntaxError`로 깨지거나, 부분 파싱 결과가 그대로 저장소에 들어간다.

## 원인
LLM 출력은 확률적 텍스트다. "JSON만 반환하라"는 프롬프트는 대부분 지켜지지만 항상은 아니다. **2차 방어선이 코드에 없으면** 1%의 펜스 섞임이 파이프라인을 멈춘다.

## 해결
3단 게이트로 받는다.

1. **추출(extract)** — 코드펜스·서론 벗기고 가장 바깥 `{...}` 슬라이스
2. **검증(validate)** — 필수 키 존재 + 타입 검사
3. **실패시 폐기(reject)** — 검증 실패면 통째 버림(부분 삽입 금지), 폴백 경로로

```ts
export function extractJsonObject(raw: string): string {
  const fenced = raw.replace(/```(?:json)?/gi, "");
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no json object");
  return fenced.slice(start, end + 1);
}
// parse → 필수키/타입 검증 실패 시 throw(부분 결과 반환 금지)
```

- ✅ 이렇게: extract → parse → 필수키·타입 검증 → 실패면 폐기+폴백
- ❌ 이렇게 말고: `const data = JSON.parse(rawLLMOutput)` (펜스/서론에 깨짐)
- 왜: strict 모드 없는 provider 대비 범용 2차 방어선. mainline 검증 자산(youtube-summary).

## 적용조건
- response_format `json_object`/responseSchema를 쓰면 1차 방어는 되지만, **그래도 추출기를 2차로 둔다**(provider 교체·모델 변경 대비).
- vibeinit 스타터에 `lib/llm-json.{ts,py}` 보일러플레이트로 동봉(PAT가 발신처, vibeinit은 사본).
