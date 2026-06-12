---
id: wiki-log
updated: 2026-06-12
---

# Wiki Change Log (append-only)

## 2026-04-12

- **INIT** Phase 1 완료: `memory/wiki/` 구조 생성 (entities/, concepts/, answers/, index.md, log.md).
- **Phase 2** insights 31개 스캔. draft 20개 스킵, insight 11개 처리. 엔티티 5 + 컨셉 7 추출 → 사용자 확인 완료.

## 2026-04-13

- **Phase 3** Entity 5개 생성: andrej-karpathy, obsidian, cursor, rag, claude-code.
- **Phase 3** Concept 7개 생성: para-method, exploration-vs-exploitation, layered-context, single-source-of-truth, second-brain, vibe-coding-pipeline, harness-engineering.
- **Phase 3** index.md 갱신 (5/80 entities, 7/50 concepts, 12 Inferred).
- **Phase 4** insights 7개 프론트매터에 역링크(wiki id) 추가.
- **Phase 5** `memory/rules/wiki-ops.md` 생성. `.cursor/skills/wiki-ops/SKILL.md` 배치 완료. `AGENTS.md` wiki 경로 등록. Evaluator: **pass**.
- **QA** 전수 검증 수행. 이슈 2건 수정: cursor.md 양방향 참조 누락(andrej-karpathy 추가), exploration-vs-exploitation insight 역링크 보완. Concept 7개 전항 PASS.

## 2026-04-16

- **Insight → Wiki:** `root-ai-harness-engineering-youtube-intro` 승격(`status: insight`) 후 `concepts/harness-engineering.md`에 Verified 병합·`source_insights`·관련 소스 링크 갱신.
- **Insight → Wiki:** `modern-ai-ch18-knowledge-management-karpathy-wiki` 승격. Verified·`source_insights`·관련 소스: `harness-engineering`, `second-brain`, `rag`, `single-source-of-truth`, `layered-context`, `andrej-karpathy`, `para-method`. `index.md` 통계 Inferred 12→15 재집계.

## 2026-04-16 (Ch.15–17)

- **Insight → Wiki:** `modern-ai-ch15-mcp-gateway-willison` — 신규 엔티티 `mcp.md`. `harness-engineering`·`cursor`·`claude-code` 양방향 `related_*` 갱신.
- **Insight → Wiki:** `modern-ai-ch16-skills-packaging` — 신규 컨셉 `cursor-skills.md`. `harness-engineering`·`vibe-coding-pipeline` `related_concepts` 갱신.
- **Insight → Wiki:** `modern-ai-ch17-rag-select-pipeline` — `entities/rag.md`, `concepts/layered-context.md` Verified 병합·`source_insights`·관련 소스.
- `index.md` 엔티티 5→6, 컨셉 7→8, Inferred 불릿 합계 갱신(대략 15→17).

## 2026-05-18

- **PROMOTE** system-income-leverage-structure → concepts/system-income-leverage-structure.md
- **PROMOTE** self-made-wealth-five-elements → concepts/self-made-wealth-five-elements.md
- **PROMOTE** personal-finance-low-energy-top3 → concepts/personal-finance-low-energy-top3.md
- **PROMOTE** llm-wiki-gist-why-how → entities/llm-wiki-gist-why-how.md
- **PROMOTE** supabase-naver-oidc-proxy-github-why-how → entities/supabase-naver-oidc-proxy-github-why-how.md
- **PROMOTE** awesome-design-md-github-why-how → entities/awesome-design-md-github-why-how.md
- **PROMOTE** anthropic-sdk-python-github-why-how → entities/anthropic-sdk-python-github-why-how.md

## 2026-06-07

- **Goal 2 (VHK):** wiki tool 4건 사용자 작성 마무리 — `llm-wiki-gist`, `supabase-naver-oidc-proxy`, `awesome-design-md`, `anthropic-sdk-python` 정의·Inferred·Owner Notes·양방향 related 갱신. `index.md` 한 줄 설명 TODO 제거.
- **Goal 3 (VHK):** finance concept 3건 완료 — `personal-finance-low-energy-top3`, `system-income-leverage-structure`, `self-made-wealth-five-elements`. `harness-engineering` ↔ system-income related. `multi-pc-sync.md` 현행화.

## 2026-06-12

- **REORG** `index.md` 도메인 그룹핑 (AI·개발 도구/인물/지식관리/개발 워크플로우/재무) + 통계 재집계: 엔티티 10, 컨셉 11, Inferred TTL 만료 14페이지·유효 7페이지. 만료분 주간 리뷰 처리 항목으로 표기.
- **STRUCT** 지식 레이어 역할 분리 명세 신설: `docs/KNOWLEDGE-LOOP.md` — wiki=사전(개념·도구·인물 카드), `memory/knowledge-hub/`=주제 종합 문서+트리플맵+키워드. 원문→요약 프로토콜 로컬판: `memory/rules/source-to-summary-protocol.md`.
- **PROMOTE** modern-ai-ch10-context-engineering-karpathy → concepts/modern-ai-ch10-context-engineering-karpathy.md
- **PROMOTE** modern-ai-ch11-harness-willison-aci → concepts/modern-ai-ch11-harness-willison-aci.md
