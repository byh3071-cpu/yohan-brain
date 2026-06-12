---
id: 2026-06-12-wiki-lint-cli
date: 2026-06-12
tags: [wiki, lint, automation, phase5]
related: [wiki-ops, 2026-06-12-rss-batch-24h-guard]
status: decided
---

# wiki:lint CLI 도입 — 구조 검사 자동화, --fix는 TTL expired 마킹·index 재집계만

## 결정

- `npm run wiki:lint` (`src/wiki/lint.ts`) — WIKI-SPEC-v2 §2 구조 검사 5종: 프론트매터 필수 필드·순서, Verified Source Lock([source:] 태그 + 원본 insight 실존), related_* 링크(자기참조 error·단방향 warning·고립 warning), Inferred TTL 만료, index.md 파일↔목록 정합. errors → exit 1.
- `--fix` 자동 수정 범위는 **비파괴 2종으로 한정**: 만료 Inferred 라인에 `— status: expired` 덧붙임(+frontmatter updated 갱신), index 통계 블록 재생성. 내용 삭제·링크 자동 추가는 하지 않음 (링크 의미 판단은 에이전트/사람).
- 의미 검증(Fact-Check, Verified 문장 ↔ 원본 대조)은 SKILL.md /wiki-lint 6번대로 에이전트 수동 유지.
- batch 루틴 알림에 `suggest_promotions` 상위 3건 표시 — 자동 승격은 하지 않음 (wiki-ops 불변 규칙: 승격은 사람/에이전트 확인 경유).

## 검증

- 도입 직후 기존 부채 전수 검출: cursor-skills frontmatter 깨짐(error), awesome-design 자기참조(error), 단방향 13건, 만료 TTL 14페이지, index 통계 불일치 — 전부 해소 후 0 errors / 0 warnings.
- CRLF 파일의 마지막 frontmatter 라인 `\r` 때문에 YAML 파싱이 전체 실패하는 함정 발견 → splitFrontmatter에서 정규화 (promote.ts의 regex fallback이 가려온 문제).
