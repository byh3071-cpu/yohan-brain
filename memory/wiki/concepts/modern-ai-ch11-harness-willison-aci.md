---
id: modern-ai-ch11-harness-willison-aci
type: concept
aliases: []
created: 2026-06-12
updated: 2026-06-12
source_insights: [modern-ai-ch11-harness-willison-aci]
related_entities: [claude-code]
related_concepts: [harness-engineering, agentic-engineering]
---
# 현대AI개론 Ch.11 — 하네스 (인사이트)

## 정의 (1~2문장)
- (TODO: 사용자가 정의 1~2문장 작성)

## Verified (소스 기반)
- 에이전트·MCP·룰 설계 시 재사용할 **하네스·ACI·검증 루프** 규칙 묶음. 교재 인용·수치·브랜드 서술은 원문·출처 맥락 유의. [source: modern-ai-ch11-harness-willison-aci]
- **로컬:** `memory/inbox/archive/md_files/현대AI개론/11-하네스.md` [source: modern-ai-ch11-harness-willison-aci]
- **챕터 끝 Source:** Cherny/Orosz; Willison 2026-03-16 등(원문 블록 참조). [source: modern-ai-ch11-harness-willison-aci]
- **한 줄:** 하네스는 LLM을 **보이지 않는 프롬프트**와 **호출 가능한 도구**로 확장하는 소프트웨어; **같은 모델**이라도 채팅봇 vs 에이전트는 **하네스 차이**(Willison 등 서술). [source: modern-ai-ch11-harness-willison-aci]
- **두 역할:** (1) 시스템·CLAUDE.md·도구 정의·대화 재전송 등 **숨은 컨텍스트 관리** (2) Read/Edit/Bash 등 **도구 실행 통로**. [source: modern-ai-ch11-harness-willison-aci]
- **무상태:** LLM은 턴마다 백지에 가깝고, **하네스가 매 턴 컨텍스트를 재구성**(토큰 캐시는 비용 완화일 뿐). [source: modern-ai-ch11-harness-willison-aci]

## Inferred (추론/연결) — TTL 30일
- Willison의 "에이전트 감독은 오전 11시면 정신적으로 지친다"(coding-agents-normal-technology 경유) — 하네스가 줄이려는 비용이 바로 이 **감독 부하**라는 수렴 증거. 하네스(자동 게이트·검증 루프)는 감독 노동의 자동화 장치. [source: coding-agents-normal-technology] [2026-06-12 역전파]
- created: 2026-06-12, expires: 2026-07-12

## Owner Notes
- (Yohan이 직접 작성)

## 관련 소스
- [modern-ai-ch11-harness-willison-aci](../../ingest/insights/modern-ai-ch11-harness-willison-aci.md)
