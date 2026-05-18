---
id: llm-wiki-gist-why-how
type: entity
entity_type: tool
created: 2026-05-18
updated: 2026-05-18
source_insights: [llm-wiki-gist-why-how]
related_entities: [andrej-karpathy, obsidian]
related_concepts: [second-brain, layered-context, single-source-of-truth]
---

# llm-wiki (Karpathy gist) — 왜 쓰는지 · 어떻게 쓰는지

## 정의 (1~2문장)

- Karpathy가 제안한 운영 패턴으로, RAG로 매번 원문을 재검색하는 대신 LLM이 지속 갱신하는 마크다운 위키를 **소스(원문) ↔ 질의(컨텍스트)** 사이 중간 지식 레이어로 두는 방식이다.
- ingest/query/lint 3단계 루프로 지식을 누적해 세션 간 맥락 복구와 중복 정리 비용을 줄이는 것이 핵심이며, Yohan OS `memory/wiki/` 설계의 직접 영향원이다.

## Verified (소스 기반)

- **Gist:** [karpathy/llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) [source: llm-wiki-gist-why-how]
- **인제스트:** `memory/ingest/url/url-d84d4e72bd6545e5.md` — 아키텍처 3계층, ingest/query/lint 운영 루프, index/log 개념은 원문 기준으로 본다. [source: llm-wiki-gist-why-how]
- 문서를 매번 RAG로 재검색하는 대신, LLM이 지속적으로 갱신하는 마크다운 위키를 중간 계층으로 두어 지식을 누적시키는 운영 패턴 제안서다. [source: llm-wiki-gist-why-how]
- 질문할 때마다 자료를 처음부터 다시 찾는 방식 대신, 한 번 읽은 내용을 LLM이 위키 페이지로 정리하고 계속 업데이트해 “쌓이는 지식 베이스”로 쓰자는 아이디어다. [source: llm-wiki-gist-why-how]
- **내 일:** `memory/ingest/`\* 원문을 소스 레이어로 두고, `memory/ingest/insights/`\*를 누적 위키 레이어로 관리하면 세션이 바뀌어도 맥락 복구가 빨라지고 중복 정리 비용이 줄어든다. [source: llm-wiki-gist-why-how]
- 자동 편집 비중을 높일수록 잘못된 요약·링크 오염이 누적될 수 있어, 어떤 단계에서 사람 검토를 강제할지(ingest 단위/주간 lint 단위) 운영 규칙이 필요하다. [source: llm-wiki-gist-why-how]

## Inferred (추론/연결) — TTL 30일

- (TODO: 소스 간 연결로 도출한 추론을 적는다.)
- created: 2026-05-18, expires: 2026-06-17

## Owner Notes

- (Yohan이 직접 작성)

## 관련 소스

- [llm-wiki-gist-why-how](../../ingest/insights/llm-wiki-gist-why-how.md)
