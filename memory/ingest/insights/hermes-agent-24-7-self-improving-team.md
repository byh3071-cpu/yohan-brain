---
id: hermes-agent-24-7-self-improving-team
date: 2026-06-15
domain: ai-agents
tags: [hermes-agent, nous-research, self-improving, closed-learning-loop, skill-md, soul-md, multi-agent, kanban, vps, docker, gateway, context-engineering, 24-7-agent]
related:
  - "출처: https://www.youtube.com/watch?v=h_6jRAkMATI (실밸개발자)"
  - "../../profile.yaml"
  - "../../rules/agent-harness.md"
  - "../../rules/source-to-summary-protocol.md"
  - "../../rules/telegram-inbox.md"
  - "../../wiki/entities/hermes-agent.md"
  - "../../wiki/concepts/closed-learning-loop.md"
  - "../../wiki/entities/nous-research.md"
  - "../../knowledge-hub/24-7-self-improving-agents.md"
status: insight
source_basis: 자막
# 자막=자동생성 → 신뢰도 3. 고유명사·수치는 교차 정정/미검증 표기.
---

# Hermes Agent — 노트북 꺼도 24시간 일하는 자가 개선 AI 직원 (실밸개발자)

[학습 의도] Hermes의 컨텍스트 엔지니어링(SOUL/USER/AGENTS/MEMORY 4파일 + 딥 인터뷰)과 자가 개선 루프(SKILL.md)를 흡수해, 요한 브레인의 `profile.yaml`·`AGENTS.md`·`memory/` 문서를 100% 최적화 설계하는 데 쓴다.

## 목적

- 요한 브레인의 에이전트 정체성·사용자 컨텍스트 문서를 손볼 때, 그리고 "24/7 상주 에이전트를 도입할까?"를 판단할 때 다시 연다.

## 핵심 요약 (3줄)

1. **Hermes Agent**는 Nous Research의 오픈소스(MIT, 자막상 2025-07 공개) 자율 에이전트 시스템으로, 노트북이 아니라 **서버(VPS+Docker)에 상주**하며 메시징(Discord·Telegram) 게이트웨이로 24/7 응답한다 — "AI 비서"보다 "AI 직원"에 가깝다.
2. 차별점은 **닫힌 학습 루프(Closed Learning Loop)**: 복잡한 작업을 풀면 그 과정을 `SKILL.md`로 **스스로** 저장·재사용하고, `SOUL.md / USER.md / AGENTS.md / MEMORY.md` 4파일에 글자수 하드리밋을 걸어 가득 차면 자가 정리한다 → 쓸수록 똑똑해진다.
3. 영상의 실전 포인트 둘: ① 시작부터 **4파일을 딥 인터뷰로 잘 채우면** 학습 곡선을 건너뛴다(처음부터 높은 출발선), ② 내장 **칸반 보드**에 목표 하나만 던지면 dispatcher가 일을 분해·할당해 멀티에이전트로 실행한다.

## 핵심 키워드

Hermes Agent · Nous Research · Closed Learning Loop · SKILL.md · 4계층 두뇌(SOUL/USER/AGENTS/MEMORY) · 글자수 하드리밋 메모리 · 멀티플랫폼 게이트웨이(Discord·Telegram) · VPS + Docker 격리 · 멀티 에이전트 프로필 · Kanban(dispatcher/decomposer) · OpenClaw 대비 · 모델 무관(GPT·Claude·Grok·로컬) · 딥 인터뷰 · proactiveness · 하네스→루프 엔지니어링

## 타임라인 (자막 구간 기준)

| 구간 | 내용 |
|------|------|
| 인트로 | "노트북 끄면 멈춤" 문제 제기. **Hermes 모델(Nous의 LLM) ≠ Hermes 에이전트(오늘 주제)** 구분. 에이전트는 모델 무관(끼워 쓰기). |
| Part 1 | 자가 개선이란 — 챗봇(매 턴 프롬프트 필요) vs 에이전트(24/7 대기·실행·학습). 닫힌 학습 루프 = SKILL.md 자동 저장. "학습 루프 내장 유일" 주장은 [과장] — Claude Code·Codex도 skill/memory 있음. **차이는 "시키지 않아도 스스로" 저장한다는 점.** |
| OpenClaw vs Hermes | OpenClaw = 메시지 라우팅 중앙 관제탑(오케스트레이션·멀티프로필 특화). Hermes = 작업 실행 + 자가 개선 특화(메모리·스킬 자가 갱신). 거의 비슷, OpenClaw→Hermes 마이그레이션 스크립트 제공. |
| Part 2 설치 | 설치 위치 3선: ①로컬 랩탑(개인정보 노출 위험 → 비권장) ②자가 서버(맥미니 등, 격리되나 초기비용 큼) ③**클라우드 VPS(권장)**. 발표자는 Hostinger VPS(KVM 2, 자막상 월 $8.99~$13.99, 24개월 $215 [미검증])에 Docker 원클릭 배포. |
| 모델 연결 | `hermes setup` → full setup. 모델 취사선택(코딩=Codex, 기획=Claude, 트위터=Grok 등). **Claude Code는 구독제 불가 → API 과금**이라, 발표자는 OpenAI 구독으로 **Codex(GPT-5.5 [미검증]) 연결**. |
| Discord 연결 | Discord Developer Portal에서 봇 생성 → Bot Token 발급 → **Privileged Gateway Intents의 Message Content Intent ON** → OAuth URL 생성(권한: 메시지 전송·히스토리 읽기·채널 보기 등) → 서버에 봇 초대 → User ID 등록. |
| 게이트웨이 24/7 | 수동 `gateway run`은 연결 끊기면 멈춤 → **Docker 컨테이너 restart**하면 24/7 상주. 노트북 꺼도 응답 확인. |
| VS Code 접속 | Remote-SSH 확장으로 VPS의 Docker 프로젝트 폴더 접속. `config`에서 `require_mention`을 false로 바꿔 멘션 없이 대화. |
| 보안 필수 | **allowed user 목록에 내 User ID 반드시 등록** — 안 하면 누구나 게이트웨이와 소통 가능. |
| Under the Hood | 4계층 두뇌: `SOUL.md`(정체성·성격) · `USER.md`(나에 대한 정보) · `AGENTS.md`(작업 규칙=CLAUDE.md류) · `MEMORY.md`(단기 기억). 4파일이 곧 컨텍스트 엔지니어링 = 성능 좌우. |
| 딥 인터뷰 데모 | Hermes에게 "딥 인터뷰로 SOUL/USER/AGENTS 만들어줘" 요청 → 라운드별 질문(어떤 사람이냐/핵심 키워드/내가 원하는 존재상/절대 하지 말 방식 등) → 4파일 자동 작성. 이후 "나에 대해 3개 알려줘" → 핵심 정체성·중요 프로젝트·**선호하는 일하는 방식** 응답. ← **이 화면이 요한이 처음 캡처해 온 그 스크린샷.** |
| 멀티 프로필 | 프로필 1개 = 독립 AI 직원(메모리 안 섞임). 삶의 영역별(유튜브·개인·사이드·직장) 프로필 → 메인 오케스트레이터가 위임·보고 체계. `/meeting`으로 프로필끼리 회의 가능. (이 영상선 미시연) |
| 칸반 데모 | 대시보드 Kanban에 "Claude Code 강의 랜딩 페이지 만들어줘" 카드 1장 → dispatcher가 To-Do로 분해(UI 설계→구현→반응형·접근성→SEO·메타→QA 검수 5단계) → In-Progress→Done 자동 진행 → 랜딩 페이지 산출. Spec-driven과 유사(스펙 자세할수록 결과 좋음). |
| 일상 자동화 | 대시보드에서 세션·로그·크론·스킬·MCP·채널·프로필·설정 관리. 크론으로 매일 아침 Gmail+캘린더 읽어 모닝 브리핑, CI 실패 시 10분마다 자동 수정 PR, GitHub 이슈 자던 사이 처리 등. |
| 현실 체크 | ①권한 관리 중요(VPS+Docker 격리로 완화) ②학습 루프 만능 아님 — 스킬·메모리를 **어떻게** 바꾸는지는 블랙박스, 승인 안 받음 → 가끔 스킬/메모리 개선 품질 수동 점검 권장 ③커뮤니티 과장 수치 거르기. |

## 본문 — 논지 전개

**1) 챗봇 → 에이전트 → 자가 개선 에이전트.** 챗봇은 매번 사람이 프롬프트를 넣어야 움직인다. 에이전트는 24/7 대기하며 말 걸면 즉시 실행·학습한다. Hermes의 한 발 더: 결과에서 배워 `SKILL.md`를 **자율적으로** 만들고 다음에 꺼내 쓴다(같은 실수 반복 X, 같은 작업 점점 빨라짐). 공식 "학습 루프 내장 유일" 주장은 발표자도 [과장]으로 지적 — Claude Code/Codex에도 skill·memory가 있다. 진짜 차이는 **사용자 지시 없이 스스로 저장·정리**한다는 자율성.

**2) 노트북 종속 탈피.** 핵심 가치는 "어디 사느냐". VPS+Docker에 격리하면 ①개인정보와 분리된 안전한 상시 가동 ②메시징 게이트웨이로 폰에서 지시. 발표자는 로컬 랩탑 설치를 보안상 비권장하고, 자가 서버(맥미니)는 초기비용 부담, **클라우드 VPS(Hostinger)**를 실사용. = "남의 맥미니를 월세로 빌려 거기에 직원을 들인다".

**3) 컨텍스트 엔지니어링이 성능을 가른다.** 4파일(SOUL/USER/AGENTS/MEMORY)을 LLM이 자가 개선하긴 하나, **처음부터 딥 인터뷰로 잘 채우면** 곡선을 타고 올라가는 대신 처음부터 높은 출발선에서 시작 → 시간 절약. 그래서 발표자는 Hermes와 라운드 인터뷰를 거쳐 4파일을 채운 뒤 "나에 대해 3개" 질의로 컨텍스트 생성을 검증한다.

**4) 멀티에이전트 = 프로필 + 칸반.** 프로필 하나가 독립 직원(메모리 격리). 칸반은 Hermes가 만든 멀티에이전트 오케스트레이션 레이어 — 목표 1장 → dispatcher 분해 → 전문 프로필 자동 배정 → 백그라운드 병렬 실행, 포그라운드 대화 유지.

**5) 진짜 메시지(마무리 철학).** "AI에게 일을 시켜 잘하는 건 당연. 이제는 **에이전트의 proactiveness를 끌어올려** 에이전트가 나에게 인사이트·할 일을 먼저 던지게 만들어야 한다." 크론으로 트렌드 조사→인사이트 푸시. 단, **"인텐트만 주면 끝"은 환상** — 사람 taste가 들어가야 하는 일(특히 UI)은 중간 검수 없이 끝까지 가면 99% 마음에 안 든다. human-in-the-loop·iterative 필수.

## 내 생각 (설득되는 점 / 경계할 점)

### 설득되는 점

- 4파일 컨텍스트 엔지니어링 = 요한 브레인이 이미 하는 SoT 3축·`memory/` 구조와 정확히 같은 사상. "처음부터 잘 채워라"는 요한 브레인의 *"코드보다 규칙·맥락 정비 우선"*(AGENTS.md §0) 원칙과 1:1.
- 딥 인터뷰로 USER/SOUL을 채우는 방식은 `profile.yaml` 고도화에 바로 차용 가능 — 이번 Phase 2의 핵심.
- proactiveness 강조는 요한 브레인의 RSS ingest·automation:batch·knowledge-loop 복리와 같은 방향(에이전트가 인사이트를 먼저 가져옴).

### 경계할 점 (저자 편향·급소)

- "쓸수록 똑똑해진다"는 자가 개선 루프의 **품질·방향은 블랙박스** — 발표자 본인도 "어떻게 바꾸는지 모른다, 가끔 점검하라"고 인정. 요한 브레인은 이걸 *기계 강제 게이트·결정 로그*로 가시화하는 쪽이 취향(취향 DB: "검증은 문서 말고 자동 게이트로").
- 수치(스타 19만, $215, GPT-5.5)는 자막·커뮤니티발 → [미검증]. 영상 자체가 "과장 수치 거르라" 경고.
- **Hermes 자체 도입은 요한 취향과 충돌 가능** — 요한은 *"오케스트레이션 레이어 중복 거부"*(취향 DB). 이미 Cursor/Claude/Codex + telegram-inbox + automation:batch로 24/7 일부 구현됨. → 제품 도입보다 **개념 차용**이 결이 맞음.
- 실전 결론: 도구(Hermes)를 깔기보다, **그 컨텍스트 엔지니어링 기법을 요한 브레인 문서에 이식**하는 게 ROI 최대.

## 인사이트 → 적용

- 딥 인터뷰 → `profile.yaml`(USER)·신규 SOUL 레이어 고도화. (Phase 2에서 너랑 질문으로 진행)
- 4파일 모델을 요한 브레인 기존 구조에 매핑(아래 표) → 빠진 레이어(SOUL=에이전트 정체성)만 보강 판단.
- proactiveness: 크론 인사이트 푸시(이미 automation:batch 2회/일 보유)에 "AI 트렌드·내 프로젝트 인사이트 선제 제안" 추가 검토.

## Yohan 브레인 적용 (외부 개념 ↔ 내 시스템 매핑)

| Hermes 개념 | 요한 브레인 대응 | 상태 / 도입 판단 |
|-------------|------------------|------------------|
| `USER.md` (나에 대한 정보) | `memory/profile.yaml` | ✅ 보유. **딥 인터뷰로 고도화 = P0** |
| `AGENTS.md` (작업 규칙) | `AGENTS.md` + `memory/rules/` | ✅ 보유. 충분히 성숙 |
| `MEMORY.md` (단기 기억) | `memory/decisions/`·`logs/`·`active-project.yaml` | ✅ 보유 (분산형) |
| `SOUL.md` (에이전트 정체성·성격) | `profile.yaml`의 `differentiation.voice`에 일부 산재, **전용 파일 없음** | ⚠️ 갭 — **신설 여부 Phase 2 결정 = P0** |
| Closed Learning Loop / `SKILL.md` 자동화 | `docs/patterns/PAT-NNN` + wiki 복리 루프 + `knowledge-loop` | ✅ 유사(수동 트리거). 자율 저장은 미보유 |
| 글자수 하드리밋 자가 정리 | `rule-review-cycle`·컨텍스트 관리 | △ 부분. 하드리밋 메모리 아이디어 차용 가능 |
| 24/7 게이트웨이(Discord/Telegram) | `YohanOS-TelegramBot` + `telegram-inbox` | △ 보유하나 **노트북 종속** (VPS/맥미니 미전환) |
| 크론 모닝 브리핑·proactive 푸시 | `automation:batch`(09:00·21:00) | ✅ 보유. proactive 인사이트 강화 여지 |
| 멀티 프로필(영역별 직원) | `profile.yaml.agent_roles`(claude_code/codex/gemini/notion_ai) | ✅ 역할 분담 보유 |
| Kanban dispatcher/decomposer | P/G/E 파이프라인 + `goals/` + spec-driven | ✅ 유사 사상 |
| VPS+Docker 격리 / 맥미니 | 취향 DB: "하드웨어는 필요할 때 + 맥미니 선호" / 보안 게이트 | ✅ 취향과 일치 |
| Hermes 제품 자체 도입 | — | ❌ 중복 오케스트레이션 거부 취향과 충돌 → **개념만 차용 권장** |

### 우선순위 (P0~P2)

- **P0** — 딥 인터뷰로 `profile.yaml`(USER 레이어) 고도화. (영상의 핵심 기법, 이번 세션 Phase 2)
- **P0** — SOUL 레이어(에이전트 정체성) 갭: 신설할지 / `profile.yaml`·`AGENTS.md`에 흡수할지 설계 결정.
- **P1** — proactive 인사이트 푸시: `automation:batch`에 트렌드·프로젝트 선제 제안 추가 검토.
- **P1** — 24/7 상주: 텔레그램 봇의 노트북 종속 → VPS/맥미니 전환은 *실제 수요 생길 때*(취향 DB 타이밍 원칙).
- **P2** — Hermes/OpenClaw 제품 도입: 보류. 요한 브레인 하네스로 대체 가능 + 중복 거부 취향.

## 트리플 맵

- Hermes Agent --is_a--> 서버 상주 자가개선 자율 에이전트 (AI/자동화, 신뢰도 3)
- Hermes Agent --implements--> 닫힌 학습 루프 (SKILL.md 자가 저장) (AI/자동화, 3)
- 컨텍스트 4파일(SOUL/USER/AGENTS/MEMORY) --precondition_of--> 24/7 에이전트 성능 (AI/자동화, 3)
- 딥 인터뷰 --enables--> USER/SOUL 초기 컨텍스트 고출발선 (AI/자동화, 3)
- 에이전트 proactiveness --enables--> 인사이트 선제 제안 (AI/자동화, 3)
- Hermes 제품 도입 --opposite_of--> 오케스트레이션 레이어 중복 거부 취향 (자기이해, 3) 🔥 요한 취향과 충돌 — 제품 도입보다 개념 차용

> `triple-map.md`에 6건 등록 완료 (2026-06-15).

## 소스 출처

- 영상: https://www.youtube.com/watch?v=h_6jRAkMATI — 실밸개발자 "헤르메스 에이전트 - 노트북 꺼도 24시간 일하는 AI 팀 만들기"
- 제품: Hermes Agent (Nous Research) https://hermes-agent.nousresearch.com · MIT
- 원문 기반: 영상 설명 + 자동생성 자막 (source_basis: 자막, 신뢰도 3). 고유명사 정정: BPS→VPS, 도커, Hostinger, Nous Research, Kanban, dispatcher, Grok, GPT-5.5[미검증], 스타 19만[미검증].
