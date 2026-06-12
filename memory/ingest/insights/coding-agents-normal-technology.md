---
id: coding-agents-normal-technology
date: 2026-06-12
domain: ai-engineering
tags: [ai-agents, software-engineering, labor, agentic-engineering, vibe-coding]
related: [ingest/url/url-358aef6c82120c0e.md, vibe-coding-pipeline, vibe-coding-planning-importance, harness-engineering, modern-ai-ch11-harness-willison-aci]
status: insight
---

# AI가 소프트웨어 엔지니어를 대체하지 않(았)는 이유 — 샌드위치 모델과 agentic engineering

[학습 의도] Yohan OS 자체가 "1인 + 에이전트" 운영 시스템 — 이 글의 샌드위치 모델·agentic engineering 정의가 우리 운영 철학(하네스·Evaluator)의 외부 근거가 되는지 검증.

## 핵심 요약 (3줄)

- AI발 대규모 해고 서사는 증거로 지지되지 않음 — Block·Snap·Intuit 사례 모두 실제 배경은 재무 압박·비용 절감이고 AI는 명분("AI washing"). 뉴욕주 WARN Act 공시에서 AI 영향 해고는 약 0.2%(원문 기준).
- 소프트웨어 개발은 **결정(무엇을 만들지)–실행(코드 작성)–전달(검증·책임)의 샌드위치 구조**. AI는 실행 층을 크게 압축했지만(코드 생성 8배) 결정·전달 층은 능력 한계가 아니라 책임·판단의 문제라 자동화에 저항(릴리스는 30%만 증가 — NBER w35275, 원문 기준).
- **vibe coding(감독·검토 없음) ≠ agentic engineering(인간이 통제·책임 유지)** — 실제 엔지니어 표준은 후자. vibe-coded 커밋은 취약점 도입이 9배(SWE-chat, 자기선택 표본이라 약한 증거).

## 핵심 키워드

`decide-execute-deliver 샌드위치` · `agentic engineering` · `AI washing` · `Jevons paradox(소프트웨어 가격 탄력성)` · `실행 층 압축`

## 인사이트 → 적용

- **코드 작성량은 노동 대체의 지표가 아니다** — 병목은 원래 코딩이 아니었음(개발자 코딩 시간 9~61%, 원문 기준). "AI가 코드 N% 작성" 류 주장은 결정·전달 층을 무시한 수사.
- 소프트웨어는 가격 탄력성이 높아 생산 비용이 떨어지면 수요가 늘어남(Jevons) — 총수요는 유지·증가 가능하나 **개인 경력은 구조 변화에 노출**: 필요 역량 = 소프트웨어 기술 + AI 기술 + 도메인 전문성 조합.
- 민주화 반론: FORTRAN·COBOL·SQL도 "프로그래밍 민주화" 기대를 받았지만 실현 안 됨 — 장벽은 문법이 아니라 **책임지며 좋은 결정을 내리는 숙련 판단력**.

## Yohan OS 적용

- 바로 적용 가능한 것: 이 글은 Yohan OS 운영 철학의 외부 검증 — AGENTS.md "코드보다 규칙·맥락 정비"(=결정 층), Evaluator 게이트(=전달 층 검증·책임), 에이전트 실행 위임(=실행 층 압축)이 샌드위치 모델과 정확히 대응.
- **용어 정정 (교차검증 발견):** 기존 insights(`vibe-coding-pipeline`, `vibe-coding-planning-importance`)가 말하는 "바이브 코딩"은 원문 정의상 **agentic engineering**에 해당 — SoT·Evaluator·사람 검증을 유지하기 때문. 원문의 vibe coding(무감독·무검토)과 구분해 쓸 것.
- 수렴: `vibe-coding-planning-importance`의 "무엇을 만들지·완료 조건은 사람이 고정" = 결정 층 자동화 저항과 동일 주장 (2026-04-08에 이미 도달한 결론).
- Willison의 "에이전트 감독은 오전 11시면 정신적으로 지친다" — 감독도 비용. 하네스(자동 게이트)로 감독 부하를 낮추는 현 방향 유효 (`modern-ai-ch11-harness-willison-aci` 참조).

## 트리플 맵

| Subject | Relation | Object |
|---------|----------|--------|
| agentic engineering | opposite_of | vibe coding (무감독·무검토) |
| decide-execute-deliver 샌드위치 | exposes | AI 대규모 해고 서사의 허점 |
| AI 코딩 에이전트 | addresses | 실행 층 압축 (코드 8배·릴리스 30%) |
| 인간 통제·책임 유지 | precondition_of | 프로덕션 에이전트 코딩 |
| 소프트웨어 가격 탄력성 (Jevons) | enables | AI 비용 하락 → 소프트웨어 수요 증가 |
| AI washing | signals | 해고 명분과 실제 원인(재무 압박)의 불일치 |

### 판단 근거

- "Yohan OS의 P/G/E 구조는 샌드위치 모델과 동형" — 근거: `인간 통제·책임 유지 --precondition_of--> 프로덕션 에이전트 코딩`(신뢰도 3), `decide-execute-deliver 샌드위치 --exposes--> 해고 서사 허점`(신뢰도 3).

## 소스 출처

- RESOURCE: `memory/ingest/url/url-358aef6c82120c0e.md` (GeekNews #30421, Readability 추출)
- 원문: https://news.hada.io/topic?id=30421 → normaltech.ai "Coding agents as normal technology" (Narayanan·Kapoor 계열 AI as Normal Technology 블로그)
- 주의: 본 요약의 수치(WARN 0.2%, 코드 8배/릴리스 30%, 취약점 9배 등)는 **GeekNews 한국어 요약 경유 2차 출처** — 인용 시 normaltech.ai 원문 대조 권장 `[미검증]`.
