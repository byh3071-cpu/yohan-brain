# 핸드오프 — 인프라/MCP/툴 도메인

코어 발신처(yohan-mcp)와 코어 소비자(ai-router 등), 용어 자산(dictionary)이 모인 도메인.

---

## yohan-mcp (_hold, MCP 분리 예정 레포)

### MCP1. 코어 주입 도구 2개 구현 (P0, 분리 시) ★
- 무엇: `get_core_ruleset()`(읽기) + `inject_core_rules(target_repo, mode, domains)`(외부쓰기·옵트인). 멱등(마커블록만 교체·사람작성분 보존). 원천 = yohan-brain `memory/core/core-ruleset.yaml`. 설계 = `memory/core/inject-core-rules-design.md`.
- 채널: 요한MCP
- 우선순위: P0 · 노력: L
- 완료기준: 두 도구 + 마커 멱등 + capability gating(승인 전 외부쓰기 금지) + 실제 쓰기 성공 확인 후에만 보고(mock 금지).
- 변환: 이슈 「get_core_ruleset/inject_core_rules 도구(멱등·옵트인)」

### MCP2. get_context에 core_rules_digest 주입
- 무엇: get_context payload(STABLE 최상단)에 `core_rules_digest`(must_not·instruction_hierarchy·tool_budget·non_negotiable[]) + `available_tools`(동적) 추가. 컴팩션 리마인더 역할. payload 1필드 추가 → 시그니처 영향 최소(강제revise 회피).
- 채널: 요한MCP (현재는 yohan-os MCP src/index.ts)
- 우선순위: P1 · 노력: M
- 변환: 이슈 「get_context: core_rules_digest + available_tools 주입」

### MCP3. 설계 메타패턴 (분리 시 거버넌스 문서화)
- 무엇: Verifiability Envelope(6항목 품질체크) · Policy-Based Auto-Approval(always_gate→limits→auto_approve→default + policy_log) · Protocol Engine(step체인+멱등 게이트) · Schema-First(JSON Schema 2020-12).
- 우선순위: P1 · 노력: L
- 변환: 이슈 「MCP 거버넌스: 검증봉투·정책엔진·step체인 문서화」

---

## ai-router (요청→소스/도구/출력 라우터, TS)

### AR1. core 상속(API 입력검증·confidence)
- 무엇: governance 부재 → core 상속만으로 대응. 추가: RouteDecision에 confidence(0~1)·escalate_to_human, 신호충돌 시 confidence<0.6 escalate. API enum·범위·필수필드 검증(core api_input_validation).
- 채널: core 상속(inherit) + 레포자체(confidence)
- 우선순위: P1 · 노력: M
- 변환: 이슈 「core 상속 + route confidence·escalation + 입력검증」

---

## yohan-ai-dictionary (AI 용어 검증사전, Astro Starlight)

### DIC1. Fable5 신규용어 5종 항목화 ★사전 직결
- 무엇: Instruction Hierarchy · Tool Orchestration · Capability Gating · Long-horizon Agent · Eval Harness 등재(+ Context Engineering·Stable→Context→Volatile·Instruction-as-Data·shorter=safer). 검증사전 형식(Verified/Inferred), 출처 Fable5는 "설계사상·진위검증불가" 명기.
- 채널: 레포자체(content) + core 상속(거버넌스)
- 우선순위: P1 · 노력: M
- 완료기준: 5종+ 용어 페이지, status enum(용어 생명주기), SoT 추적 메타데이터.
- 변환: 이슈 「Fable5 신규용어 5종 항목화(진위검증불가 명기)」

---

## snapcontext (컨텍스트 캡처 도구, +snapcontext-worker CF)

### SC1. context-pack 스키마 버저닝
- 무엇: typesafe-messaging-hub · storage-abstraction · context-pack 스키마 버저닝(브라우저 확장 런타임 특화). Memory↔Storage 분리 사상.
- 채널: 레포자체 + core 상속
- 우선순위: P2 · 노력: M
- 변환: 이슈 「context-pack 스키마 버저닝 + storage 추상화」

---

## changeopradar

### CO1. 패턴 재사용
- 무엇: Self-Healing 제한 재시도(3회, PAT-007 사촌)·선언형 규칙계층(.cursor/rules mdc)·Multi-Agent Role. 성숙단계라 패턴 재사용 목적.
- 채널: core 상속 + 레포자체
- 우선순위: P2 · 노력: M
- 변환: 이슈 「제한 재시도·선언형 규칙계층 정리」

---

## vibe-starter-kit (_sandbox, 스타터킷)

### VSK1. core 상속 한 줄로 수렴 + 보일러 + Design 골격
- 무엇: 코어를 복붙하던 것을 `inject_core_rules`(또는 core-ruleset 렌더) 한 줄로 수렴(중복 유지보수 제거). + `lib/llm-json.{ts,py}` 보일러(youtube-summary 기반) 동봉 + Design System 골격(다크/라이트·4.5:1·10px금지·PALETTE) + 산출물 스택핀 환경경계(PAT-005/006).
- 채널: 레포자체 + core 상속 + PAT
- 우선순위: P1 · 노력: M
- 완료기준: 스타터가 core-ruleset 상속, 자체 코어 복붙 제거, 보일러+Design 골격 포함.
- 변환: 이슈 「core 상속 수렴 + llm-json 보일러 + Design 골격(PAT-005/006)」

> 주의: VHK init과 기능 겹침 → 둘의 역할 분담 명확화(starter=초기 1회, vhk init=CLI 재생성).
