---
vhk_format: 1
type: goal
id: 1
title: 대시보드 문서 경로 하드닝 (코드리뷰 후속)
status: DONE
priority: P0
completed: 2026-06-07
---

# Goal 1: 대시보드 문서 경로 하드닝

## 배경

교재 `inbox/archive/md_files` 스캔 복구 이후 코드리뷰에서 아래 4건이 남았다.
하나의 Goal 안에서 **작은 Unit**으로 쪼개 우선순위대로 처리한다.

## Units

| Unit | 우선순위 | 내용 | 완료 기준 |
|------|----------|------|-----------|
| **U1** | P0 | `MEMORY_ROOT` cwd 의존 제거 | `getMemoryDir()`가 `YOHAN_OS_ROOT`·`memory/` 존재 probe로 repo root 해석 |
| **U2** | P1 | `doc-preview` fetch race·404 UX | `AbortController` + `r.ok`·status별 메시지 |
| **U3** | P1 | 문서 스캔 경로 단일 SoT | `DOC_SOURCES`에서 prefix·category derive |
| **U4** | P2 | 경로 allowlist 스모크 게이트 | `scripts/verify-dashboard-doc-paths.ts` 통과 |

## Forbidden (이 Goal)

- `memory/` 폴더 구조 변경·파일 이동
- `package.json` / `tsconfig.json` 변경
- MCP 도구 시그니처 변경

## Completion Check

- [x] U1 — `memory.ts`·`sot-draft/route.ts`가 `@/lib/paths` 사용
- [x] U2 — 빠른 문서 전환 시 stale preview 없음
- [x] U3 — `DOC_SCAN_PREFIXES`·`CATEGORY_MAP` 이중 정의 제거
- [x] U4 — verify 스크립트 exit 0
- [x] `npm run dashboard:build` 성공
- [x] `vhk goal check --id 1` 통과
