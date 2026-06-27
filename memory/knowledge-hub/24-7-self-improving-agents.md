---
id: 24-7-self-improving-agents
category: 🔧 시스템·아키텍처
status: 초안
created: 2026-06-15
updated: 2026-06-15
related_summaries: [hermes-agent-24-7-self-improving-team]
related_wiki: [hermes-agent, closed-learning-loop, nous-research, harness-engineering]
---

# 24/7 자가 개선 에이전트 — 서버 상주 + 컨텍스트 엔지니어링

## 한 줄 정의

노트북에 묶이지 않고 서버에 상주하며, 컨텍스트 파일(정체성·사용자·규칙·기억)과 자가 개선 루프(SKILL.md)로 쓸수록 똑똑해지는 "AI 직원" 아키텍처. 요한 브레인이 이미 추구하는 SoT 3축·하네스 사상의 외부 구현 사례(Hermes Agent)에서 도입 가능 포인트를 추린다.

## 핵심 구조

```
[메시징 게이트웨이] Discord/Telegram → [서버 상주 에이전트(VPS+Docker)]
        │
        ├─ 컨텍스트 4파일: SOUL(정체성) · USER(사용자) · AGENTS(규칙) · MEMORY(단기)
        ├─ 자가 개선 루프: 작업 → SKILL.md 자동 저장 → 재사용 (+ 글자수 하드리밋 자가 정리)
        ├─ 멀티 프로필: 영역별 독립 직원(메모리 격리) + 오케스트레이터 위임
        └─ 칸반: 목표 1장 → dispatcher 분해 → 전문 프로필 자동 배정 → 병렬 실행
```

- **컨텍스트 엔지니어링이 성능을 가른다** — 4파일을 처음부터 딥 인터뷰로 잘 채우면 학습 곡선을 건너뛰고 높은 출발선에서 시작.
- **proactiveness가 다음 단계** — "시키면 잘하는 것"을 넘어 에이전트가 인사이트·할 일을 먼저 던지게(크론 트렌드 푸시 등). 단 사람 taste가 필요한 일은 human-in-the-loop 필수("인텐트만 주면 끝"은 환상).

## 출처별 관점 (교차검증)

| 소스 | 핵심 주장 | 수렴/충돌 |
|------|----------|----------|
| Hermes Agent 영상 (실밸개발자) | 서버 상주 + 자가 개선 4파일이 24/7 직원을 만든다 | 요한 SoT 3축·하네스와 **수렴** |
| harness-engineering (wiki) | 모델=CPU, 하네스=OS. 환경·규칙·피드백 루프가 핵심 | 4파일 = 하네스 구현체로 **수렴** |
| karpathy-llm-wiki-pattern (hub) | raw 불변 / 가공 분리, 지식 구조화가 성능 상한 | "처음부터 잘 채워라"와 **수렴** |
| 취향 DB (요한) | 오케스트레이션 레이어 중복 거부, 검증은 자동 게이트 | Hermes **제품** 도입과는 **충돌** → 개념만 차용 |

## Yohan OS 적용

**외부(Hermes) ↔ 요한 브레인 매핑**

| Hermes | 요한 브레인 | 상태 |
|--------|-------------|------|
| USER.md | `profile.yaml` | ✅ → 딥인터뷰 고도화 (P0) |
| AGENTS.md | `AGENTS.md`+`rules/` | ✅ 성숙 |
| MEMORY.md | `decisions/`·`logs/`·`active-project.yaml` | ✅ |
| **SOUL.md** | 전용 파일 없음(`differentiation.voice` 산재) | ⚠️ 갭 (P0) |
| SKILL.md 자가루프 | `patterns/PAT-NNN`+wiki 복리+knowledge-loop | ✅ 유사(수동) |
| 24/7 게이트웨이 | `YohanOS-TelegramBot`+`telegram-inbox` | △ 노트북 종속 |
| 크론 모닝 브리핑 | `automation:batch`(09·21시) | ✅ |

- **바로 적용 (P0):** 딥 인터뷰로 `profile.yaml`(USER) 고도화 + SOUL 레이어 갭 설계 결정.
- **실험 후보 (P1):** proactive 인사이트 푸시(automation:batch 확장), 24/7 상주(텔레그램 봇 VPS/맥미니 전환 — 수요 생길 때).
- **보류 (P2):** Hermes/OpenClaw 제품 도입 (하네스로 대체 가능 + 중복 거부 취향).

## 변경 이력

- 2026-06-15 생성 (출처: hermes-agent-24-7-self-improving-team / 실밸개발자 영상 youtu.be/h_6jRAkMATI)
