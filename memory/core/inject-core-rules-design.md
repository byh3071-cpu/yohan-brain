---
id: inject-core-rules-design
status: design
created: 2026-06-15
---

# inject_core_rules — 코어 상속 기구 설계노트

`core-ruleset.yaml`(단일 발신처)을 N개 레포로 자동 상속시키는 MCP 도구 설계.
**도구 구현은 yohan-mcp 분리 시점.** 그 전까지는 이 명세가 SoT이고, 수동 적용도 이 규약을 따른다.
(비판검증 권고: 발신처만 있고 상속 기구가 없으면 "빈 SoT"가 된다 → 둘을 한 묶음으로 본다.)

## 도구 2개
### get_core_ruleset() — 읽기
- 반환: `core-ruleset.yaml` 파싱본(version + sections + pattern_refs).
- 용도: 에이전트가 세션 중 코어 규칙을 조회. get_context payload의 `core_rules_digest`도 이걸 압축 인용.

### inject_core_rules(target_repo, mode) — 쓰기 [외부쓰기·옵트인]
- `mode=create`: `{target}/.agents/CORE-RULES.md` 신규 렌더.
- `mode=sync`: 기존 파일의 **마커 블록만** 교체.
- capability gating: 외부 레포 쓰기이므로 **명시 승인 필수**(must_not: 확인 없는 쓰기). 대상·diff 보고 후 대기.

## 멱등성 (핵심)
렌더 결과는 마커로 감싼다. sync는 마커 안만 교체하고 **사람 작성분은 보존**한다.

```markdown
<!-- CORE-RULES:START v0.1.0 (generated from yohan-brain/memory/core/core-ruleset.yaml — 직접 편집 금지) -->
... core-ruleset.yaml 렌더링 본문 ...
<!-- CORE-RULES:END -->

## 이 프로젝트 특화 (사람이 작성, 동기화가 건드리지 않음)
- ...
```

- 마커 밖 = 레포 특화(상속이 보존).
- version 불일치 시 drift 경고(check:drift와 동일 축).
- mock 금지: 실제 파일 쓰기 성공 확인 후에만 "주입됨" 보고.

## 렌더링 규칙
- `core-ruleset.yaml` → 마크다운: identity/non_negotiable/coding_execution/... 섹션을 그대로 4계층 순서로.
- `pattern_refs`는 PAT 요약 1줄 + 링크(전문은 yohan-brain/docs/patterns/, 또는 패턴사전 노션).
- `domain_addons`는 레포 성격에 맞는 것만(예: 투자 봇만 finance_disclaimer) — 주입 시 `domains=[finance,api,...]` 인자로 선택.

## 상속 대상 (예시)
- 신규 바이브코딩 프로젝트(vibeinit 직후) → `mode=create`.
- 기존 레포(ai-router·shotgrade·news-automation 등 inherit_core=true) → `mode=sync`.
- 토이/게임 → 코어상속만(특화 0).
- VHK·vibe-starter-kit → 코어를 복붙하던 것을 이 호출 한 줄로 수렴(중복 유지보수 제거).

## 미해결·후속
- core-ruleset.yaml ↔ profile.yaml/AGENTS.md SoT 경계는 파일 헤더에 선언했으나, 자동 드리프트 검사(check:core-drift)는 별도 goal.
- get_context의 `core_rules_digest` 주입은 yohan-os MCP get_context(src/index.ts) 변경 — 함수 시그니처 영향 적은 payload 1필드 추가로(강제 revise 회피).
