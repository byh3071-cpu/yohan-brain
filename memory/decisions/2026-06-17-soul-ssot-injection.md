---
title: SOUL SSoT 박제 — soul.yaml 신설 + 마커 멱등 주입 + get_context 런타임 배선
created: 2026-06-17T00:00:00+09:00
source: claude-code (노션 SOUL 설계실·배선 핸드오프 실행)
---

노션 SOUL 설계실(정체성·일하는 방식·선호 단일 SSoT)에서 렌더된 soul.yaml을 yohan-brain 기계 SSoT로 박고, `inject_core_rules`의 `CORE-RULES:START/END` 마커 방식을 본떠 각 레포 `.agents/SOUL.md`에 멱등 주입한다.

## 결정
1. `memory/soul.yaml` 신설 — 사용자 정체성·values·body_map·work_process·voice·preferences·guardrails·agent_roles의 단일 SSoT. 노션 SOUL에서 렌더, 직접 편집 금지.
2. `memory/profile.yaml` 흡수·deprecated 스텁화 — 고유 필드(`background`·`creative_margin`·`innovation_signals`)는 soul.yaml로 병합. profile.yaml은 `superseded_by: memory/soul.yaml` 포인터만 남김 (SoT 단일성).
3. `scripts/inject-soul.mjs` 신설 — `SOUL:START/END` 마커, 렌더 본문 SHA256을 START 태그에 박아 결과 동일 시 no-op(멱등). 기본 dry-run, `--write` 옵트인(외부 레포 capability gating). 대상: yohan-brain·vhk·vibe-starter-kit `.agents/SOUL.md`.
4. 런타임 배선 — yohan-brain 내장 `get_context`가 soul.yaml을 읽어 `payload.soul`로 live 서빙. yohan-mcp 독립 레포화는 나중 별도 과제.

## SoT 경계 (드리프트 방지)
- soul.yaml = 사용자/런타임 정체성·일하는 방식·선호·가드레일 (원본, 노션 SOUL 렌더).
- core-ruleset.yaml = 프로젝트 무관 범용 독트린 (별도 SSoT, 변경 없음).
- profile.yaml = deprecated 스텁 (포인터만, 새 필드 금지).
- 충돌 시: 안전·시크릿 > 레포 AGENTS.md > soul/core SSoT > 선호.

## 검증
- soul.yaml yaml 파서 로드 성공 (14키).
- tsc build 통과, get_context `soul_ok: true` 런타임 서빙 확인.
- 주입 2회 → diff 0 (동일 SHA no-op), 마커 밖 사람 작성분 보존 확인.
- secret scan 통과.

## 주의·후속
- `.gitignore`: `.agents/`가 local-only였으나 핸드오프가 yohan-brain `.agents/SOUL.md`를 git 주입 대상으로 지정 → `.agents/*` + `!.agents/SOUL.md`로 SOUL.md만 추적. CORE-RULES.md는 범위 밖(불변).
- vhk·vibe-starter-kit는 이 워크스페이스에 부재 → 주입 SKIP. `VHK_PATH`/`VIBE_STARTER_KIT_PATH` env 또는 형제 디렉터리로 해석.
- 노션 바이브코딩 스타터킷 sync(git 아님)는 별도 채널 — 미수행.
