---
id: transfer-prompt-ecosystem-tier-s
date: 2026-06-28
tags: [handoff, transfer-prompt, copy-paste]
---

# 전달 프롬프트 — 복붙용

아래 블록을 **새 세션 첫 메시지**로 붙여넣는다. 트랙별로 하나만 고른다.

---

## A. 범용 — "어디까지 했는지 읽고 이어가"

```
Yohan ecosystem tier S harness 작업 이어가자.

1) 먼저 읽기 (순서):
   - C:\Users\Public\dev\yohan-ecosystem\yohan-brain\HANDOFF.md
   - docs/handoffs/ecosystem-tier-s/handoff-closure-2026-06-28.md
   - memory/decisions/2026-06-28-ecosystem-tier-s-harness-sprint.md

2) 복원 확인:
   cd C:\Users\Public\dev\yohan-ecosystem\yohan-brain && git pull
   node scripts/check-ecosystem.mjs
   Core 4 git status clean인지 확인

3) 맥락:
   - Tier S (brain·mcp·vhk·cc-skills) harness 머지 완료, contract v0.2.4
   - Claude Code = primary, Cursor = secondary batch (변경 없음)
   - 로컬 정리 완료 (mcp.json.bak·.serena 삭제, mcp.json 로컬 유지)

4) 운영 원칙:
   - 한 티켓씩, 초안 보여주고 OK 받고 진행
   - 막 수정하지 말고 먼저 설명

5) 다음 후보 (우선순위):
   - Cursor 공식문서 ingest → handoff-cursor-docs-ingest.md
   - E7 A-tier → handoff-e7-a-tier.md (보류, pilot 조건부)

어디부터 할지 내가 고르기 전에 핸드오프 읽고 현재 상태 요약해줘.
```

---

## B. Cursor 공식문서 ingest — 다음 트랙 시작

```
Cursor 공식문서 ingest 프로젝트 시작하자.

핸드오프 SoT:
- C:\Users\Public\dev\yohan-ecosystem\yohan-brain\docs\handoffs\ecosystem-tier-s\handoff-cursor-docs-ingest.md
- 참고 패턴: yohan-cc-skills plugins/yohan-core/skills/cc-docs (Claude Code용, 동일 패턴으로 cursor-docs)

전제:
- tier S harness는 완료됨 — 이건 별도 프로젝트
- ADR-005 Phase 1(노션 3층 → Cursor docs/)과 정렬 검토
- 전체 문서 풀 스크래핑 ❌ — 우선순위 P0부터 단계 ingest

절차:
1) handoff-cursor-docs-ingest.md 읽고 범위·티켓(CDOCS-00~) 확인
2) CDOCS-00: 범위 확정 초안 → 내 OK
3) CDOCS-01: cursor-docs 스킬 골격 (cc-docs 미러) → 내 OK
4) P0 페이지 ingest 1회 pilot

막 구현하지 말고 CDOCS-00 초안부터 보여줘.
```

---

## C. E7 A-tier pilot — product 레포 harness

```
E7 A-tier bootstrap pilot 시작하자.

핸드오프:
- C:\Users\Public\dev\yohan-ecosystem\yohan-brain\docs\handoffs\ecosystem-tier-s\handoff-e7-a-tier.md

전제:
- Tier S Core 4 완료 (contract v0.2.4)
- pilot 1레포만 (권장: yohan-ai-dictionary)
- studio는 hand AGENTS 유지 옵션

절차:
1) handoff 읽고 로컬 audit
2) contract A-tier matrix 초안 (E7-00) → 내 OK
3) dictionary pilot (E7-01a) — CORE-RULES + context + ecosystem.mdc 최소

한 티켓씩, 초안 먼저.
```

---

## D. 로컬만 다시 맞추기 (다른 PC)

```
yohan-ecosystem Core 4 로컬 복원만 해줘.

경로: C:\Users\Public\dev\yohan-ecosystem\
레포: yohan-brain, yohan-mcp, yohan-cc-skills, vhk

1) 각 레포 git pull
2) brain: node scripts/check-ecosystem.mjs
3) .cursor/mcp.json 없으면 example 참고 복원 (gitignore)
4) git status clean 확인
5) HANDOFF.md 읽고 다음 할 일 1줄 요약

코드 변경·커밋 없이 검증만.
```
