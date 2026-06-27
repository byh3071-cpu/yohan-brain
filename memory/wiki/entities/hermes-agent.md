---
id: hermes-agent
type: entity
entity_type: tool
created: 2026-06-15
updated: 2026-06-15
source_insights: [hermes-agent-24-7-self-improving-team]
related_entities: [nous-research, claude-code, cursor]
related_concepts: [closed-learning-loop, harness-engineering, layered-context, agentic-engineering]
---

# Hermes Agent

## 정의 (1~2문장)
- Nous Research의 오픈소스(MIT) 자율 에이전트 시스템. 노트북이 아니라 서버(VPS+Docker)에 상주하며 메시징(Discord·Telegram) 게이트웨이로 24/7 응답하고, 4파일 컨텍스트(SOUL/USER/AGENTS/MEMORY)와 SKILL.md 자가 개선 루프로 쓸수록 똑똑해진다. 모델 무관(GPT·Claude·Grok·로컬 끼워쓰기).

## Verified (소스 기반)
- 서버 상주형 자율 에이전트 — Discord/Telegram 게이트웨이로 24/7 대기·응답, "AI 비서"보다 "AI 직원". [source: hermes-agent-24-7-self-improving-team]
- 모델 무관 — 코딩=Codex, 기획=Claude, 트위터=Grok 등 취사선택해 라우팅. [source: hermes-agent-24-7-self-improving-team]
- 4계층 두뇌: SOUL.md(정체성)·USER.md(사용자)·AGENTS.md(작업 규칙)·MEMORY.md(단기 기억). [source: hermes-agent-24-7-self-improving-team]
- 내장 칸반 보드 — 목표 1장 → dispatcher가 To-Do로 분해·전문 프로필 자동 배정 → 백그라운드 병렬 실행. [source: hermes-agent-24-7-self-improving-team]
- 멀티 프로필 = 영역별 독립 직원(메모리 격리), `/meeting`으로 프로필끼리 회의. [source: hermes-agent-24-7-self-improving-team]
- 설치 권장: 로컬 랩탑(보안 비권장)보다 VPS+Docker 격리 — allowed user 목록에 본인 ID 필수. [source: hermes-agent-24-7-self-improving-team]
- OpenClaw(메시지 라우팅 중앙 관제탑)와 유사, OpenClaw→Hermes 마이그레이션 스크립트 제공. [source: hermes-agent-24-7-self-improving-team]

## Inferred (추론/연결) — TTL 30일
- 스타 19만·2025-07 공개·GPT-5.5 연동은 자막/커뮤니티발 [미검증] — 영상 자체가 "과장 수치 거르라" 경고.
- 요한 브레인의 Cursor/Claude/Codex 하네스 + `telegram-inbox` + `automation:batch`로 기능 상당 부분 이미 구현 → **제품 도입보다 개념(컨텍스트 엔지니어링·딥 인터뷰) 차용**이 "오케스트레이션 중복 거부" 취향과 정합.
- created: 2026-06-15, expires: 2026-07-15 (Owner 검증 대기)

## Owner Notes
- (Yohan이 직접 작성)

## 관련 소스
- [hermes-agent-24-7-self-improving-team](../../ingest/insights/hermes-agent-24-7-self-improving-team.md)
