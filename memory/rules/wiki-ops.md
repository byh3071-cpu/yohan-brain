---
id: wiki-ops
date: 2026-04-12
domain: knowledge-management
tags: [wiki, ops]
related: [archiving-appraisal-feynman, wiki-spec-v2]
status: active
---

# Wiki 운영 규칙

## 위치
- 위키: memory/wiki/ | 명세: docs/WIKI-SPEC-v2.md | 스킬: .cursor/skills/wiki-ops/SKILL.md

## 트리거
- 새 insights (standard+ & status:insight) → /wiki-ingest
- 주간 리뷰 → /wiki-lint
- 지식 질문 → /wiki-query → (선택) /wiki-answer
- 단건 승격 (insight → wiki) → MCP `promote_to_wiki` 또는 `npm run promote-wiki`
- 승격 후보 스캔 → MCP `suggest_promotions`

## 승격 파이프라인 (insights → wiki)

### MCP: `promote_to_wiki`
- 입력
  - `insight_path` (필수): insight 파일 경로 (절대 또는 레포 루트 기준 상대)
  - `type`: `concept` | `entity` (기본 `concept`)
  - `entity_type`: `person | company | technology | tool | other` (type=entity 때)
  - `id`: wiki id 슬러그 override (생략 시 insight id 그대로)
- 동작
  1. insight 프론트매터에서 `id`·`tags`·본문 H1 제목 추출
  2. `memory/wiki/{entities|concepts}/{id}.md` 생성 — WIKI-SPEC-v2 §2 형식 (Verified/Inferred/Owner Notes/관련 소스)
  3. Verified 섹션은 본문 상위 불릿 최대 6개 시드 + `[source: {insight-id}]` 자동 부여
  4. Inferred TTL 30일 만료일 자동 기록
  5. `wiki/index.md` 해당 섹션에 한 줄 자동 등록
  6. `wiki/log.md`에 `**PROMOTE** {insight-id} → {folder}/{id}.md` 추가
- 출력: `wiki_path` / `wiki_rel` / `id` / `type` / `index_updated` / `log_updated`
- 거부 조건
  - 파일 없음, 같은 id 이미 wiki에 존재, `telegram-ocr*` insight (자동 승격 금지)

### MCP: `suggest_promotions`
- 입력: `limit` (기본 10), `include_draft` (기본 false)
- 출력: insights 디렉토리 스캔 → wiki 미등록 항목을 `archive_tier`(long_term>standard>light) → 최근 수정순 정렬
- 제외: `telegram-ocr*`, wiki의 `source_insights:`에 이미 등록된 id, `status: draft` (include_draft=true로 포함 가능)

### CLI

```bash
npm run promote-wiki -- <insight 경로> [--type concept|entity] [--entity-type tool] [--id slug]
npm run promote-wiki -- --suggest [--limit 10] [--include-draft]
```

### 사용 후 점검
- 생성된 wiki 페이지의 `## 정의` 빈 곳 채우기
- Verified 시드 불릿 검수 (자동 추출은 시작점일 뿐, Source Lock 사실 검증 필요)
- `related_entities`/`related_concepts` 양방향 링크 수동 보강 (WIKI-SPEC-v2 §3.4)

## 불변 규칙
- insights 본문 수정 금지 (프론트매터 related만 추가).
- Verified 문장은 [source:] 태그 필수.
- Inferred TTL 30일 초과 → expired.
- Cap 초과 시 병합 후보 제시 → 사용자 Yes/No.
- 엔티티/컨셉 삭제 전 사용자 확인 필수.

## 내재화
- 주 1회 MVI. Level 1(30초) 필수, Level 2~3 선택.
- /wiki-query 후 "한 줄 생각?" 프롬프트 → Owner Notes.

## 감사
- 분기 1회 랜덤 5건 수동 대조 (15분).