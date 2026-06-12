---
id: agentic-engineering
type: concept
aliases: [에이전틱 엔지니어링, 에이전트 엔지니어링]
created: 2026-06-12
updated: 2026-06-12
source_insights: [coding-agents-normal-technology]
related_entities: [claude-code, cursor]
related_concepts: [harness-engineering, vibe-coding-pipeline, modern-ai-ch11-harness-willison-aci]
---

# Agentic Engineering

## 정의 (1~2문장)

- 인간이 결과에 대한 **통제와 책임을 유지한 채** 코딩 에이전트를 도구로 사용하는 실무 방식. vibe coding(지시 후 무감독·무검토)의 대척점이며, 둘은 이분법이 아니라 스펙트럼의 양끝.

## Verified (소스 기반)

- 대부분의 소프트웨어 엔지니어가 에이전트를 쓰는 표준 방식이며, "agentic engineering"이라는 용어가 업계에서 확산 중. [source: coding-agents-normal-technology]
- vibe coding과의 차이는 검증·책임 유무: vibe-coded 커밋은 인간 작성 대비 취약점 도입 9배(SWE-chat, 자기선택 표본 — 약한 증거), 에이전트 코드의 커밋 생존율 44%. [source: coding-agents-normal-technology]
- 감독은 공짜가 아님 — Willison "에이전트 감독하다 오전 11시면 정신적으로 지친다". 감독 부하를 낮추는 것이 하네스의 역할. [source: coding-agents-normal-technology]
- 고용 함의: 기업은 검증되지 않은 vibe coder를 엔지니어 대신 고용해 프로덕션 소프트웨어를 배포할 수 없음 — agentic engineering 역량(통제하며 위임)이 실무 요건. [source: coding-agents-normal-technology]

## Inferred (추론/연결) — TTL 30일

- Yohan OS의 P/G/E(Planner–Generator–Evaluator) + 하네스 구조는 agentic engineering의 1인 운영 구현체 — 결정(active-project·goals)과 전달(Evaluator·게이트)을 사람이 쥐고 실행만 에이전트에 위임. 기존 insights의 "바이브 코딩" 표기는 실제로는 이 개념에 해당(용어 정정 2026-06-12).
- created: 2026-06-12, expires: 2026-07-12

## Owner Notes

- (Yohan이 직접 작성)

## 관련 소스

- [coding-agents-normal-technology](../../ingest/insights/coding-agents-normal-technology.md)
