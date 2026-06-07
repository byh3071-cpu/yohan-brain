---
vhk_format: 1
type: goal
id: 2
title: Wiki 4건 사용자 작성 마무리 (active-project A)
status: DONE
priority: P0
completed: 2026-06-07
---

# Goal 2: Wiki 4건 사용자 작성 마무리

## 배경

`active-project.yaml` **진행 A** — 승격한 tool wiki 4건의 정의·Inferred·Owner Notes·양방향 링크·index 한 줄 설명을 채운다.

## Units

| Unit | 대상 | 완료 기준 |
|------|------|-----------|
| **U1** | `llm-wiki-gist-why-how` | Inferred + Owner Notes, TODO 제거 |
| **U2** | `supabase-naver-oidc-proxy-github-why-how` | 정의·Inferred·Owner·related |
| **U3** | `awesome-design-md-github-why-how` | 정의·Inferred·Owner·related |
| **U4** | `anthropic-sdk-python-github-why-how` | 정의·Inferred·Owner·related |
| **U5** | `wiki/index.md` | 4건 한 줄 설명 TODO 제거 |
| **U6** | 게이트 | `scripts/verify-wiki-goal-2.ts` exit 0 |

## Forbidden

- insights 원문 본문 수정
- wiki 폴더 구조 변경
- finance 컨셉 3건(별도 Goal 후보)

## Completion Check

- [x] U1–U5 wiki TODO 0건 (4 entities + index)
- [x] `vhk goal check --id 2` 통과
