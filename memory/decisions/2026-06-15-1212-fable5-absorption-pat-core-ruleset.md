---
title: Fable 5 흡수 — 범용 코어 독트린을 PAT 패턴사전 + core-ruleset.yaml로 자산화
created: 2026-06-15T12:12:00+09:00
source: claude-code (Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 2라운드 후 실행)
---

CL4R1T4S `CLAUDE-FABLE-5.md`(유출본·진위 검증불가, **설계 사상만 차용·원문 복사 금지**) + 노션 분석 3종을 다중 렌즈(설계·구조·기획·보안·비용·원리·디자인·자동화·코딩)로 흡수. 1·2라운드 워크플로(33에이전트) + 4레포 실코드 검증을 거쳐 아래를 결정한다.

## 핵심 사상
"범용 코어 1회 작성 → N레포 자동 상속". 요한MCP/요한브레인은 흡수의 종착지 2개일 뿐이고, 진짜 목표는 **모든 바이브코딩·새 프로젝트에 영구 주입되는 재사용 자산**이다. 배포 채널: 글로벌 `~/.claude/CLAUDE.md` / `docs/patterns/PAT-NNN` / `core-ruleset.yaml`(신설) / vibeinit·.cursorrules 템플릿 / 요한브레인 memory/rules.

## 실코드 검증 결과 (적용 근거)
- `news-automation` indicator.py:185-189(multi_select)·main.py:111-113/160-162(select): LLM 출력을 raw `json.loads` 후 Notion에 직접 기입, **allowlist 없음** → 환각값이 Notion 옵션 무단 생성. (안티패턴 정본)
- `yohan-dca-bot` src/risk/lockout.py: 4중 안전장치(하드수치한도·연속실패 자동정지·인간명시재개·에러분류) 코드+테스트 실재. (결정론 정본)
- `youtube-summary` src/lib/llm-json.ts·summarize.ts(QUALITY_THRESHOLD=78·MAX_REGENERATION_ATTEMPTS=3·CAP=50): **mainline 머지 확인** → 안정 모범.
- `shotgrade` lib/analyze.ts extractJsonObject: **미머지 브랜치(feedback-correction)** → "참고"로 격하, master는 fallback 없음.
- `auto-trader`: Python 0줄, n8n JSON 2개, **LLM 노드 0건** → 결정론 정본. 면책 삽입 위치는 WF2 JSON Code 노드(라인 264-267)이지 "코드 푸터"가 아님.
- 자체: `docs/patterns/`·`core-ruleset.yaml` **둘 다 부재**(신규 정당). profile.yaml forbidden_patterns(과한존댓말)·dashboard-design-system.md(4.5:1·다크/라이트·10px·PALETTE)는 **이미 커버** → 중복 생성 금지.

## 결정
1. `docs/patterns/` 신설 + 코드 검증된 범용 패턴 7종을 **PAT-001~007**로 자산화(글로벌 규칙 형식 준수, 노션 DB 직접 주입 금지 — 노뚝이가 등록).
2. `memory/core/core-ruleset.yaml` 신설 — N레포 상속의 단일 발신처. 단, 상속 기구(`inject_core_rules`)가 미실현이면 빈 SoT가 되므로 **발신처+상속기구를 한 묶음**으로 본다(이번엔 발신처+설계노트까지, 도구 구현은 yohan-mcp 분리 시).
3. 글로벌 `~/.claude/CLAUDE.md`에 산출물 분류·"실패비용 high 자동화는 LLM을 결정경로에서 제외"·frontend-design 매핑 표 추가.

## 제외·주의 (정직성)
- §17 과도사과·Design System은 기존 커버 → 추가 안 함(횡전개만).
- §20 지도(도메인 부재)·§21 ask_user_input(1인운영 선커버)은 흡수가치 0 → 제외.
- §23 투자 면책: 1인 자가용 봇은 확신어 금지+백테스트 "과거성과" 태그만, 법적 footer는 **공개배포 시점 한정**(§14와 동일 잣대).
- three r128 함정(PAT-005)은 유출 진술 미검증 → 적용 전 실동작 확인 단서를 적용조건에 명시.
- SoT 중복 위험: core-ruleset.yaml ↔ profile.yaml/agent-harness/AGENTS.md. 코어는 "어느 것이 원본이고 누가 누구를 생성하는가"를 명시해 드리프트 방지.
