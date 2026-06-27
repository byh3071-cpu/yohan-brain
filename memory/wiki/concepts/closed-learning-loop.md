---
id: closed-learning-loop
type: concept
aliases: [닫힌 학습 루프, Closed Learning Loop, 자가 개선 루프]
created: 2026-06-15
updated: 2026-06-15
source_insights: [hermes-agent-24-7-self-improving-team]
related_entities: [hermes-agent, claude-code]
related_concepts: [cursor-skills, harness-engineering, agentic-engineering]
---

# 닫힌 학습 루프 (Closed Learning Loop)

## 정의 (1~2문장)
- 에이전트가 작업 결과에서 배워 해결 과정을 재사용 문서(SKILL.md)로 **스스로** 저장·갱신하고, 컨텍스트 메모리를 자가 정리하여 쓸수록 성능이 오르는 자가 개선 루프. Hermes Agent의 핵심 셀링 포인트.

## Verified (소스 기반)
- 복잡한 작업 해결 과정을 SKILL.md로 자동 저장 → 유사 작업서 본인이 꺼내 재사용(같은 실수 반복 X, 같은 작업 점점 빨라짐). [source: hermes-agent-24-7-self-improving-team]
- 사용자가 "저장해/기억해"라고 지시하지 않아도 **자율적으로** 저장·정리하는 점이 일반 skill/memory와의 차이(발표자 주장). [source: hermes-agent-24-7-self-improving-team]
- "학습 루프 내장 유일"이라는 공식 주장은 [과장] — Claude Code·Codex에도 skill·memory가 있다(발표자 지적). [source: hermes-agent-24-7-self-improving-team]
- 컨텍스트 4파일(SOUL/USER/AGENTS/MEMORY)에 글자수 하드리밋 → 가득 차면 자가 통합 정리. [source: hermes-agent-24-7-self-improving-team]

## Inferred (추론/연결) — TTL 30일
- 요한 브레인 대응물: `docs/patterns/PAT-NNN` + wiki 복리 루프 + `knowledge-loop`. 단 요한 쪽은 수동 트리거(승격·역전파)이고 자율 저장은 아님.
- 자가 개선의 방향·품질은 블랙박스(발표자도 "어떻게 바꾸는지 모른다, 가끔 점검하라"고 인정) → 요한 취향은 "검증은 문서 말고 자동 게이트로"라 결정 로그·CI 게이트로 가시화하는 쪽.
- created: 2026-06-15, expires: 2026-07-15 (Owner 검증 대기)

## Owner Notes
- (Yohan이 직접 작성)

## 관련 소스
- [hermes-agent-24-7-self-improving-team](../../ingest/insights/hermes-agent-24-7-self-improving-team.md)
