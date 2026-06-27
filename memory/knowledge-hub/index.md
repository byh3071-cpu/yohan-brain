---
id: knowledge-hub-index
updated: 2026-06-12
---

# 요한 지식 허브 (로컬 SoT)

> 노션 「요한 지식 허브 DB」의 로컬 원천. 여러 소스를 종합한 **주제별 지식 문서**가 모이는 곳.
> 단일 개념·도구·인물 카드는 여기가 아니라 `memory/wiki/`에 둔다 (역할 구분: `docs/KNOWLEDGE-LOOP.md` §1).
> 노션 동기화: MCP `sync_to_notion` — `SoT Key`(경로 SHA-256) 멱등.

## 카테고리 (노션 DB와 동일)

| 카테고리 | 다루는 것 |
|----------|----------|
| 🔧 시스템·아키텍처 | 요한 OS 구조, 자동화, 인프라 (ADR·트러블슈팅은 `docs/`가 원천) |
| 🧭 전략·방향 | 사업·커리어·포지셔닝, 로드맵 |
| 📐 규격·방법론 | 프레임워크, 워크플로우, 기법 |
| 💭 성찰·철학 | 가치관, 자기이해, 회고에서 나온 원리 |

## 상태 흐름

`초안` → `검토` → `안정` → `확정` (폐기 시 `폐기` — 삭제하지 않고 표기)

## 문서 목록

### 🔧 시스템·아키텍처
- [지식 복리 루프 — 왜 이 구조인가](knowledge-compounding-loop.md) — 승격·역전파·트리플 대조·재사용 4메커니즘의 근거와 측정 지표. (ADR·트러블슈팅은 `docs/adr/`·`docs/troubleshooting/`에서 sync_to_notion으로 등재됨)
- [24/7 자가 개선 에이전트 — 서버 상주 + 컨텍스트 엔지니어링](24-7-self-improving-agents.md) — Hermes Agent 사례에서 추린 4파일 컨텍스트·자가 루프·게이트웨이 도입 포인트와 요한 브레인 매핑(P0~P2).

### 🧭 전략·방향
- [팔란티어 온톨로지 — 요한 OS의 전략적 원형](palantir-ontology.md) — 로우데이터→온톨로지→지식그래프 = RESOURCE→SUMMARY→트리플맵, 3레이어 OS 재해석.

### 📐 규격·방법론
- [Karpathy LLM Wiki 패턴](karpathy-llm-wiki-pattern.md) — raw 불변/wiki 가공 분리, 탐색 vs 검색, 크로스링크 = 가치 단위.

### 💭 성찰·철학
- (아직 없음)

## 부속 자산

- [triple-map.md](triple-map.md) — 트리플 맵 (지식 그래프, append-only)
- [keywords.md](keywords.md) — 키워드 DB (프롬프트 영향 키워드 전용)
- [TEMPLATE.md](TEMPLATE.md) — 허브 문서 템플릿

## 등록 규칙

1. 생성·보강은 `memory/rules/source-to-summary-protocol.md`의 승격(Step 4.5-B)·역전파(Step 4.6) 경유 — 즉흥 생성 금지.
2. 새 문서 생성 시 이 index의 해당 카테고리에 한 줄 등록 (`- [제목](파일.md) — 한 줄 요약`).
3. 파일명: `{kebab-case-주제}.md` (날짜 접두어 없음 — 주제 문서는 날짜가 아니라 주제로 찾는다).
