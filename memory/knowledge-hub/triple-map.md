---
id: triple-map
updated: 2026-06-12
---

# 트리플 맵 (지식 그래프, append-only)

> `[주어] --관계--> [목적어]` 형식의 의미 관계 저장소. 노션 「트리플 맵 DB」의 로컬판.
> 등록 절차: `memory/rules/source-to-summary-protocol.md` Step 4.7.
> 등록 전 반드시 이 파일에서 Subject 검색 — 중복(Subject+Relation 동일)은 스킵, 관점 충돌(Subject 동일+Relation 상이)은 등록 + SUMMARY에 메모.

## 표준 Relation 팔레트

| 코드 | 의미 | | 코드 | 의미 |
|------|------|-|------|------|
| `is_a` | ~의 하위 개념 | | `solves` | ~를 해결한다 |
| `part_of` | ~의 구성요소 | | `addresses` | ~를 다룬다 (부분 해결) |
| `related_to` | ~와 관련 (불확실 시 기본값) | | `exposes` | ~를 드러낸다 |
| `complementary_to` | ~와 상보적 | | `signals` | ~의 신호이다 |
| `implements` | ~를 구현한다 | | `enables` | ~를 가능케 한다 |
| `created_by` | ~가 만들었다 | | `blocks` | ~를 방해한다 |
| `applies_to` | ~에 적용된다 | | `triggers` | ~를 촉발한다 |
| `depends_on` | ~에 의존한다 | | `transforms_into` | ~로 전환된다 |
| `evolved_from` | ~에서 발전했다 | | `precondition_of` | ~의 전제조건 |
| | | | `opposite_of` | ~와 대립된다 |

- 도메인: `AI/자동화` `비즈니스` `개발` `자기이해` `학습`
- 신뢰도: 공식문서=5 / 전문가 강의=4 / 분석글=3 / 추론=2 / 인상=1
- `solves`/`addresses`/`exposes`는 "내가 해결하는 문제의 지도" 구축용 — 적극 활용.

## 트리플 (최신이 아래)

| Subject | Relation | Object | 도메인 | 신뢰도 | 출처 (insight id 또는 경로) | 등록일 |
|---------|----------|--------|--------|--------|------------------------------|--------|
| Karpathy LLM Wiki 패턴 | implements | raw/wiki 분리 (ingest↔wiki) | AI/자동화 | 4 | llm-wiki-gist-why-how | 2026-06-12 |
| 역전파 프로토콜 | solves | 기존 문서의 구버전화 | AI/자동화 | 4 | source-to-summary-protocol | 2026-06-12 |
| 트리플 대조 | exposes | 지식 간 관점 충돌·보완 | 학습 | 4 | source-to-summary-protocol | 2026-06-12 |
| 지식 복리 루프 | depends_on | 승격·역전파·재사용 순환 | AI/자동화 | 3 | docs/KNOWLEDGE-LOOP.md | 2026-06-12 |
| 요한 OS | is_a | 팔란티어의 축소판 (데이터→온톨로지→그래프) | AI/자동화 | 3 | palantir-ontology | 2026-06-12 |
| 온톨로지 3레이어 | comprises | 시멘틱+카이네틱+다이나믹 | AI/자동화 | 4 | palantir-ontology | 2026-06-12 |
| AI 환각 | signals | 시스템 불일관성 (프로토콜·DB 진단 신호) | AI/자동화 | 3 | palantir-ontology | 2026-06-12 |
| 문제 지도 트리플 (solves·addresses) | enables | 다음 제품 방향 자동 도출 | 비즈니스 | 3 | palantir-ontology | 2026-06-12 |
| 지식 구조화 | precondition_of | RAG·에이전트 성능 상한 | AI/자동화 | 4 | karpathy-llm-wiki-pattern | 2026-06-12 |
| 폴더 역할 혼동 | blocks | 지식 복리 (연결 단절) | AI/자동화 | 3 | knowledge-compounding-loop | 2026-06-12 |
| agentic engineering | opposite_of | vibe coding (무감독·무검토) | AI/자동화 | 3 | coding-agents-normal-technology | 2026-06-12 |
| decide-execute-deliver 샌드위치 | exposes | AI 대규모 해고 서사의 허점 | AI/자동화 | 3 | coding-agents-normal-technology | 2026-06-12 |
| AI 코딩 에이전트 | addresses | 실행 층 압축 (코드 8배·릴리스 30%) | AI/자동화 | 3 | coding-agents-normal-technology | 2026-06-12 |
| 인간 통제·책임 유지 | precondition_of | 프로덕션 에이전트 코딩 | AI/자동화 | 3 | coding-agents-normal-technology | 2026-06-12 |
| 소프트웨어 가격 탄력성 (Jevons) | enables | AI 비용 하락 → 소프트웨어 수요 증가 | 비즈니스 | 3 | coding-agents-normal-technology | 2026-06-12 |
| AI washing | signals | 해고 명분과 실제 원인(재무 압박)의 불일치 | 비즈니스 | 3 | coding-agents-normal-technology | 2026-06-12 |
