---
id: PAT-001
패턴명: 닫힌어휘 LLM 필드 코드측 allowlist 강제
카테고리: state
증상: LLM이 정해진 보기(select/multi_select/enum) 밖의 값을 뱉어 DB·스토어에 무단 옵션이 고착된다
원인: 프롬프트의 "이 중에서 고르라" 제약만 믿고, 코드에서 허용값 대조 없이 LLM 출력을 그대로 기입
적용조건: LLM 출력이 닫힌 집합 필드(Notion select/multi_select, enum 컬럼, 상태머신 상태)로 흘러가는 모든 경로
출처프로젝트: news-automation(안티패턴), youtube-summary(해결 모범)
태그: [llm, guardrail, structured-output, notion, hallucination]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 (노션 2026-06-15 AI OS / 06-11 프로덕션 패턴)
---

## 증상
LLM 출력의 분류값(카테고리·섹터·태그·상태)을 코드가 검증 없이 저장소에 기입 → 환각값이 영구 옵션으로 박힌다. Notion select/multi_select는 존재하지 않는 `name`을 보내면 **새 옵션을 자동 생성**하므로, 한 번 새면 DB 분류 체계가 오염된다.

## 원인
프롬프트에 "부동산·증권·IT·수출·내수·금융 6개 중 선택"이라 명시해도, LLM은 프롬프트를 무시하고 "반도체"를 반환할 수 있다. 제약은 프롬프트가 아니라 **코드가 집행**해야 한다. (Instruction Hierarchy: 출력 검증은 코드 = 상위 권한)

실측: `news-automation/indicator.py:185-189`(영향 섹터 multi_select), `main.py:111-113·160-162`(기사 카테고리 select) — 둘 다 `json.loads(content)` 후 allowlist 없이 그대로 기입.

## 해결
LLM 호출 직후 닫힌집합 필드를 **코드에서 화이트리스트 대조**하고, 미매칭은 폴백 상수로 치환(절대 새 옵션 생성 금지).

```python
ALLOWED_SECTORS = {"부동산", "증권", "IT", "수출", "내수소비", "금융"}
FALLBACK_SECTOR = "기타"

def clean_sectors(raw: list[str]) -> list[str]:
    cleaned = [s for s in raw if s in ALLOWED_SECTORS]
    return cleaned or [FALLBACK_SECTOR]   # 빈 결과면 폴백 1개
```

- ✅ 이렇게: `ALLOWED` 집합 대조 → 미매칭 드롭/치환 → 검증된 값만 기입
- ❌ 이렇게 말고: `"multi_select": [{"name": s} for s in llm_output]` (raw 직접 기입)
- 왜: 프롬프트 제약은 확률적, allowlist 대조는 결정적. 환각 1건이 분류 체계를 영구 오염시킨다.

## 적용조건
- LLM → 닫힌집합 필드 경로 전부. select·multi_select·enum·상태값.
- 자유 텍스트 필드(제목·요약 본문)에는 불필요.
- allowlist는 프롬프트의 보기 목록과 **단일 SoT**로 공유(상수에서 프롬프트 문자열 생성).
