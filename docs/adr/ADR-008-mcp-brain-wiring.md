---
id: ADR-008
date: 2026-06-25
tags: [adr, mcp, architecture, brain, vhk, wiring, yohan-mcp]
status: Proposed
related:
  - docs/adr/ADR-004-mcp-server-architecture.md
  - docs/adr/ADR-006-notion-as-sot-mirror.md
  - docs/adr/ADR-002-qdrant-vector-db.md
  - docs/handoffs/fable5-absorption/handoff-infra-mcp.md
---

# ADR-008: yohan-mcp(배관) ↔ 브레인(원천) 배선 완성 — MCP 분리 마무리 계획

- **상태:** Proposed (구조는 확정, 실행은 단계적 — 본 ADR은 계획 박제)
- **날짜:** 2026-06-25
- **작성자:** Yohan (Claude Code 정찰·정리)

## 맥락 (Context)

Claude Code 셋업 중 `yohan-core` 플러그인(= `yohan-mcp` 번들)을 켜다가, **yohan-mcp와 yohan-brain이 지식·Notion·인제스트에서 크게 겹치는** 것이 보였다. 3개 레포(brain·yohan-mcp·VHK)를 병렬 정찰한 결과, 겹침의 정체가 확인됐다:

- **경쟁·중복이 아니라 "분리 진행 중인 한 시스템"이다.** ADR-004가 세운 MCP 단일접점(배관)을 `yohan-os`(이 레포 내 TS MCP, `src/index.ts`)에서 **별도 private 레포 `yohan-mcp`(Python)로 분리**하는 중이며(VISION §0.1·§0.2, 노션 2026-06-12 합의), 분리 전까지 TS MCP 이름 `yohan-os`를 레거시로 유지한다.
- 생태계 지도(VISION §0.2)가 역할을 못 박았다: **🧠 브레인(원천) → 💉 MCP(배관) → ⚙️ VHK(공정)**.
- yohan-mcp 스키마 `schemas/_links.json`이 브레인 KNOWLEDGE-LOOP와 **1:1 대응**한다: `ingest → resource → summary → decision / published_as(studio) / promoted_to(ai-dict)`, `triple → connects(*)`. 즉 yohan-mcp는 브레인 지식루프를 **schema-first + 거버넌스(Verifiability Envelope·Policy Engine·Protocol Engine)**로 재구현한 것.

**문제:** 분리가 미완이라 배관(yohan-mcp)이 아직 원천(brain)에 꽂혀 있지 않다. 그대로 두면 두 시스템이 각자 저장소·Notion·로그를 갖고 갈라진다 — SoT 원칙 위반.

## 결정 (Decision)

생태계 지도대로 **브레인=원천 / yohan-mcp=배관 / VHK=공정**을 재확인하고, **배관을 원천에 배선**하는 것을 목표로 한다. yohan-mcp는 자체 지식저장소를 두지 않고 **브레인의 `memory/` + Notion 54-DB 위에서** 동작하며, 브레인이 못 가진 것(시맨틱검색·자율 트리거·발행·품질게이트)을 그 위에 얹는다.

실행은 **단계적**으로 하고 본 ADR은 계획을 박제한다(즉시 구현 아님).

### 설계 ↔ 현재 갭

| # | 갭 | 영향 |
|---|---|---|
| 1 | yohan-mcp가 자기 빈 저장소를 봄 (brain 미연결) | 배관이 원천에 안 꽂힘 — 최우선 |
| 2 | `get_context`가 brain(TS)·mcp(Python) 양쪽에 따로 | 성공정의 "어떤 툴이든 동일 get_context" 깨짐 |
| 3 | memory 포맷 차이 (brain=`.md`+frontmatter / mcp=구조화 schema) | 단순 공유 불가 → 번역 어댑터 필요 |
| 4 | 실행로그 3중 (yohan-core 훅 + brain `post-session.sh` + mcp execlog) | 한 세션에 Notion 로그 2~3개 |
| 5 | 규칙배포 VHK(정적파일) vs mcp `inject_core_rules`(런타임) 역할 미정 | handoff-infra-mcp.md가 직접 플래그 |

## 대안 (Alternatives)

| 대안 | 장점 | 단점 | 판정 |
|------|------|------|------|
| **Layer (채택)** — brain=SoT, mcp=그 위 실행/검색 엔진 | 생태계 지도와 일치, 중복→보완(brain의 미구현 Qdrant 충당) | 어댑터·배선 작업 필요 | ✅ 설계대로 |
| Consolidate — mcp 엔진을 brain(yohan-os)에 흡수, 서버 하나 | 가장 단순한 최종형 | TS↔Python 포팅 과대, 분리 합의(2026-06-12) 역행 | ❌ |
| Coexist — 둘 다 두고 lane만 구분 | 작업 최소 | SoT 갈라짐 위험, 임시방편 | ❌ |

## 결과 (Consequences)

- **장점:** 배관이 원천을 단일 `get_context`로 모든 도구에 주입(성공정의 충족). brain의 미구현 벡터층(ADR-002)을 yohan-mcp Qdrant가 충당. 거버넌스(게이트·정책·트리거)가 지식파이프라인에 결합.
- **단점·트레이드오프:** memory 포맷 번역 어댑터가 실제 dev 부담. 분리 컷오버까지 TS/Python MCP 일시 공존 관리 필요.

### 후속 작업 (= handoff-infra-mcp.md 백로그와 매핑)

**A. 가벼운 정렬 (저위험·고레버리지, 먼저):**
1. **mcp→brain 연결**: yohan-mcp `MEMORY_DIR` → 브레인 `memory/`, `NOTION_*_DB_ID`(resource/summary/triple/ai-dict/execlog) → 브레인 54-DB의 **동일 ID**.
2. **로그 일원화**: `yohan-core/hooks/log-session.ps1`(Claude Code 훅, PowerShell) 비활성 → 브레인 `post-session.sh`/mcp execlog 경로로 통일.
3. **역할분담 문서화**: VHK=정적 레포파일(`vhk sync`) / yohan-mcp=런타임 `get_context`·`inject_core_rules`. 둘 다 원천 = 브레인 `memory/core/core-ruleset.yaml`.

**B. 본작업 (멀티스텝 dev):**
4. `get_context` 통일 + `core_rules_digest`·`available_tools` 주입 (handoff MCP2, P1).
5. `get_core_ruleset()`/`inject_core_rules()` 구현 — 멱등·옵트인·capability gating (handoff MCP1, **P0**).
6. memory 번역 어댑터 (brain `.md`+frontmatter ↔ mcp 구조화 schema).
7. TS `yohan-os` → Python `yohan-mcp` 컷오버 (클라이언트 등록 전환, 레거시 정리).

## 관련 결정·문서

- ADR-004: MCP 서버 아키텍처 (배관 = 단일접점)
- ADR-006: 노션 = SoT 미러
- ADR-002: Qdrant 벡터 DB (brain 미구현 → yohan-mcp가 충당)
- `docs/handoffs/fable5-absorption/handoff-infra-mcp.md`: yohan-mcp 백로그(MCP1~3) 원본
- VISION-AND-REQUIREMENTS §0.1~0.3: 명칭·생태계 지도·SoT 3축
