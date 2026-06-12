---
id: karpathy-llm-wiki-pattern
category: 📐 규격·방법론
status: 초안
created: 2026-06-12
updated: 2026-06-12
related_summaries: [llm-wiki-gist-why-how, karpathy-obsidian-para-workflow, modern-ai-ch18-knowledge-management-karpathy-wiki]
related_wiki: [andrej-karpathy, llm-wiki-gist-why-how, para-method, second-brain, rag]
---

# Karpathy LLM Wiki 패턴 — raw/wiki 분리 지식 누적 방법론

## 한 줄 정의

문서를 매번 RAG로 재검색하는 대신, **원본(raw)은 불변으로 보존하고 LLM이 지속 갱신하는 위키를 중간 계층**으로 두어 지식을 복리로 누적시키는 운영 패턴. Yohan Brain `memory/ingest/`(raw) ↔ `memory/wiki/`(가공)의 설계 원형이다.

## 핵심 구조

| 계층 | 역할 | 규칙 | Yohan Brain 대응 |
|------|------|------|------------------|
| raw (소스) | 원문 스냅샷 | **불변** — 수정하면 출처 추적 붕괴 | `memory/ingest/` (url·rss·insights) |
| wiki (가공) | 요약·엔티티·크로스링크 | LLM이 갱신, 개념=파일, 용어 통일 | `memory/wiki/` (entities·concepts) |
| 운영 루프 | ingest → 위키 갱신 → 질의 결과 재저장 → 주기 lint | index·log 유지, 모순·고아 점검 | `/wiki-ingest`·`/wiki-lint`·`wiki/log.md` |

- **탐색 vs 검색:** 위키는 사전 구조로 **탐색**(경로를 따라감), RAG는 질의 시점 **검색**. RAG가 실패하면 답도 실패하지만, 위키는 구조 자체가 안전망.
- **크로스링크가 가치의 단위** — 링크 적음 = 미탐구 신호, 링크 많음 = 허브. 새 노트는 최소 2링크.
- **구조화 → 토큰 효율** — 필요한 위키 페이지만 선별 주입하면 불필요 컨텍스트가 줄어 KV-Cache·비용·성능이 개선된다.

## 출처별 관점 (교차검증)

| 소스 | 핵심 주장 | 수렴/충돌 |
|------|----------|----------|
| llm-wiki gist (Karpathy 원문) | 패턴 제안 수준 — 구현 세부는 로컬 규칙으로 구체화 필요 | 수렴: 세 소스 모두 raw 불변 + 가공층 분리 |
| Karpathy 옵시디언 워크플로우 | 병목 6종(정리 과다·재구글·반복 질문·전역 업데이트·백링크 미활용·개발 맥락 단절) → PARA 수렴 | 수렴: 병목이 위키 패턴의 존재 이유 |
| 현대AI개론 Ch.18 | 지식 구조가 RAG·청킹·에이전트 성능의 **상한**을 정함. 벡터만 쌓으면 창고 | 보완: 패턴을 "선택"이 아니라 "전제"로 격상 |

- 공통 경고: 자동 편집 비중이 높아질수록 "정리된 오류"가 장기 축적됨 → 사람 검토 강제 지점(주간 lint·분기 감사) 필요.

## Yohan OS 적용

- 바로 적용: 본 레포가 이미 이 패턴의 구현체 — `docs/KNOWLEDGE-LOOP.md`가 raw/wiki/허브 경계를 고정.
- 실험 후보: `/wiki-query` 답변 재저장(answers/)을 실제로 가동해 "질의 결과도 자산화" 단계 완성.

## 변경 이력

- 2026-06-12 생성 (출처: insights 3건 종합 — 허브 파일럿 1호)
