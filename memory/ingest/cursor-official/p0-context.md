---
id: cursor-official-p0-context
date: 2026-06-28
domain: ai-coding-tools
tags: [ingest, cursor, context, indexing, cdocs]
related: [cursor, claude-code, rag]
source:
  - https://cursor.com/help/customization/context
  - https://cursor.com/help/customization/indexing
source_fetched: 2026-06-28
# trust: 5 — 공식문서 (source-to-summary-protocol Step 4.7 신뢰도 기준)
trust: 5
status: active
---

# Cursor 공식문서 — Context(@ 멘션) & Codebase Indexing (핵심 요약)

> CDOCS-03 (P0). Cursor 공식 Help 문서 2종 — "@ mentions and context" + "Codebase indexing" — 을 yohan-brain에 ingest한 정제 요약 (2페이지 → 1파일).
> 본문은 2026-06-28 fetch한 원문(`https://cursor.com/help/customization/context`, `https://cursor.com/help/customization/indexing`)에 근거하며,
> 확인되지 않은 항목은 "원문 미확인"으로 표기했다. (Help 문서는 살아있는 문서라 시점에 따라 바뀔 수 있고, 구 `docs.cursor.com` 버전보다 축약돼 있음.)

## 목적

- Cursor Agent에 컨텍스트를 붙일 때 — `@` 멘션 종류, 코드베이스 인덱싱 동작·재인덱싱·`.cursorignore` — 를 다시 찾지 않고 이 카드로 해결하려고. yohan-brain의 컨텍스트 주입(MCP `get_context`, 규칙 내 `@file` 참조)·RAG/semantic search 설계와 직접 대응되는 레퍼런스.

## 핵심 요약 (3줄)

- **컨텍스트(@ 멘션):** 채팅 입력창에 `@`를 쳐서 특정 파일/폴더·문서(`@Docs`)·터미널(`@Terminals`)·과거 대화(`@Past Chats`)·diff(`@Commit`/`@Branch`)·브라우저(`@Browser`)를 대화에 첨부한다. 원문 가이드: **"어떤 파일이 관련 있는지 알 때"** 쓰고, 모르면 생략 — Agent가 자체 검색으로 찾는다.
- **코드베이스 인덱싱:** 프로젝트를 열면 Cursor가 소스 파일을 스캔·인덱싱해 **semantic search**를 가능케 하고 Agent에 코드베이스 맥락을 준다. 인덱스는 **약 5분마다**("roughly every five minutes") 동기화돼 변경을 반영한다. 자동 실행이라 별도 켤 필요 없음.
- **튜닝:** 대형 레포는 인덱싱이 오래 걸리므로 대형 생성물/폴더를 `.cursorignore`에 추가; `node_modules`·`dist` 등 빌드 산출물은 `.gitignore`에 있으면 **기본 제외**. 재인덱싱은 명령 팔레트에서 "Reindex".

## 핵심 키워드

- `@`-멘션, `@auth.ts`/`@src/components/`(files & folders, 폴더 선택 후 `/`로 하위 탐색), `@Docs`(`@Docs > Add new doc`), `@Terminals`, `@Past Chats`, `@Commit (Diff of Working State)`, `@Branch (Diff with Main)`, `@Browser`, codebase indexing, semantic search, 자동 인덱싱(프로젝트 오픈 시), ~5분 동기화, status bar 진행률, Reindex(Command Palette), `.cursorignore`, `.gitignore` 기본 상속, `node_modules`/`dist`

## 본문

> 본문은 **두 페이지를 함께** 다룬다: §1–§3 = Context(@ 멘션), §4–§8 = Codebase Indexing.

### 1. 컨텍스트 / @ 멘션이란 (Context page)

- 원문 H1: **"@ mentions and context"**.
- 원문 intro(verbatim): "Type `@` in the chat input to attach specific context to your conversation. This helps Agent focus on the right files and information."
- 해석: 채팅 입력창에 `@`를 쳐서 특정 컨텍스트(파일·정보 등)를 대화에 **첨부(attach)**하면 Agent가 올바른 파일·정보에 집중하게 된다. 즉 `@` 멘션은 Agent에게 "이걸 보라"고 **수동으로 컨텍스트를 지정**하는 입력 방식이다.

### 2. @ 멘션 종류 (원문 라벨·설명 그대로)

원문에 나열된 `@` 멘션과 각 용도(원문 설명을 그대로 옮김):

| `@` 멘션 (원문 라벨) | 용도 (원문 설명, verbatim) | 한국어 |
|----------------------|----------------------------|--------|
| `@auth.ts` · `@src/components/` | "to include files or folders (type `/` after selecting a folder to navigate deeper)" | 파일/폴더 첨부 — 폴더 선택 후 `/`로 더 깊이 탐색. (앞의 둘은 **파일/폴더 멘션 예시**일 뿐 고정 이름 아님) |
| `@Docs` | "to search indexed documentation, including your own (add via `@Docs > Add new doc`)" | 인덱싱된 문서 검색, 직접 추가한 문서 포함(`@Docs > Add new doc`으로 추가) |
| `@Terminals` | "to include terminal output as context" | 터미널 출력을 컨텍스트로 포함 |
| `@Past Chats` | "to reference context from a previous conversation" | 이전 대화의 맥락 참조 |
| `@Commit (Diff of Working State)` | "for uncommitted changes" | 커밋 안 된 변경(작업 상태 diff) |
| `@Branch (Diff with Main)` | "for your full branch diff" | 메인 대비 전체 브랜치 diff |
| `@Browser` | "to attach context from the built-in browser" | 내장 브라우저의 컨텍스트 첨부 |

> 주의: 위 표가 **이 Help 페이지(2026-06-28 fetch)에 실제로 등장하는 `@` 멘션 전부**다. 구 `docs.cursor.com`에 있던 `@Code`/`@Web`/`@Git`/`@Codebase`/`@Link`/`@Definitions`/`@Lint Errors`/`@Cursor Rules`/`@Notepads`/`@Recent Changes`는 **이 페이지엔 리터럴로 없음**(전문 통독 확인 — 아래 "원문 미확인" 섹션 참조).

### 3. @ 멘션 사용 가이드 (when to use / 다중 첨부)

- **언제 쓰나 (verbatim):** "Use them when you know which files are relevant." — 어떤 파일이 관련 있는지 **알 때** 쓴다.
- **모를 땐 (verbatim):** "If you're not sure which files matter, skip it — Agent finds relevant files through its own search." — 어떤 파일이 중요한지 **모르면 생략**하라; Agent가 자체 검색으로 관련 파일을 찾는다.
- **다중 첨부 (FAQ, verbatim):** "Yes. Type `@` multiple times to attach several files, folders, or other context items." — 한 메시지에서 `@`를 **여러 번** 쳐서 여러 파일·폴더·기타 항목을 첨부.
- 멘탈모델: `@` 멘션은 **선택적·표적** 컨텍스트 주입이고, Agent의 자동 검색이 기본 폴백이다(과도한 수동 첨부 불필요).

### 4. 코드베이스 인덱싱이란 (Indexing page)

- 원문 H1: **"Codebase indexing"**.
- 원문 intro(verbatim): "Cursor indexes your codebase so Agent can find relevant code quickly. Code indexing runs automatically when you open a project."
- 해석: Cursor가 코드베이스를 **인덱싱**해 Agent가 관련 코드를 빠르게 찾게 한다. 인덱싱은 **프로젝트를 열면 자동 실행**된다(수동 활성화 불필요).

### 5. 인덱싱 동작 방식 (how it works)

원문(verbatim): "When you open a project, Cursor scans and indexes your source files. This enables semantic search and gives Agent better context about your codebase. The index syncs periodically (roughly every five minutes) to pick up changes."

- 프로젝트 오픈 시 Cursor가 **소스 파일을 스캔·인덱싱**.
- 이로써 **semantic search**가 가능해지고, Agent에 코드베이스에 대한 **더 나은 컨텍스트**를 제공.
- 인덱스는 **주기적으로(약 5분마다)** 동기화되어 변경 사항을 반영.

### 6. 인덱싱 상태 확인 (status)

원문(verbatim): "Look at the status bar at the bottom of Cursor. It shows the indexing progress when a scan is running."

- Cursor **하단 status bar**를 보면, 스캔 진행 중일 때 **인덱싱 진행률**이 표시된다.

### 7. 재인덱싱 (reindex)

원문(verbatim): "Open the command palette (Cmd + Shift + P on Mac, Ctrl + Shift + P on Windows/Linux) and search for "Reindex." Select the reindex command to rebuild the index from scratch."

- **명령 팔레트** 열기: macOS `Cmd + Shift + P` / Windows·Linux `Ctrl + Shift + P`.
- "**Reindex**" 검색 → reindex 명령 선택 → 인덱스를 **처음부터 재구축**.

### 8. 대형 레포 최적화 & `.cursorignore`

- 원문(verbatim): "For large repositories, indexing can take time." — 대형 레포는 인덱싱이 오래 걸릴 수 있다.
- 원문 권장(verbatim): "Add large generated files and folders to `.cursorignore`" / "Exclude `node_modules`, `dist`, and other build artifacts (these are ignored by default if in `.gitignore`)."

| 항목 | 동작 (원문 근거) |
|------|------------------|
| 트리거 | 프로젝트 열면 자동 ("runs automatically when you open a project") |
| 동기화 | 주기적, "roughly every five minutes" |
| 상태 확인 | 하단 status bar에 진행률 표시 (스캔 중일 때) |
| 재인덱싱 | Command Palette(`Cmd`/`Ctrl + Shift + P`) → "Reindex" → 처음부터 재구축 |
| 대형 레포 | 대형 생성물/폴더를 `.cursorignore`에 추가 |
| 기본 제외 | `node_modules`·`dist` 등 빌드 산출물은 `.gitignore`에 있으면 default로 무시 |

## 적용·주의 (yohan-brain)

- **컨텍스트 주입 정합:** yohan-brain은 MCP `get_context`로 세션 SoT를 주입하고, 규칙 본문에서 `@file` 참조를 쓴다(p0-rules.md §4와 동일선상). Cursor `@` 멘션의 "관련 파일 알 때만 첨부, 모르면 Agent 검색에 맡김"은 우리 `cost-guard`(표적 검색·부분 읽기) 원칙과 정합.
- **인덱싱 ≈ RAG/semantic search:** 코드베이스 인덱싱은 wiki/지식 레이어의 임베딩 검색과 같은 멘탈모델. 자동 인덱싱 + ~5분 동기화는 "정본은 살아있고 주기적으로 재색인" 개념 — `related: rag`로 연결.
- **`.cursorignore` ≈ 컨텍스트 예산:** 대형 생성물 제외는 `layered-context`/토큰 효율과 정합. `.gitignore` 기본 상속이라 별도 설정 최소화 가능.

## 원문 미확인 / 이 페이지 범위 밖

이 2개 Help 페이지(2026-06-28 fetch)에는 **다음이 등장하지 않음** (구 `docs.cursor.com` 버전엔 있었을 수 있으나 본 ingest 범위 밖, 리터럴 부재는 전문 통독으로 확인):

- **추가 `@` 멘션:** `@Code`, `@Web`, `@Link`, `@Git`, `@Codebase`, `@Definitions`, `@Lint Errors`, `@Cursor Rules`, `@Notepads`, `@Recent Changes` → **현 Help "context" 페이지엔 리터럴 부재.**
- **Max Mode / context window 크기 / 토큰·가격 함의** → **원문 미확인**(두 페이지 모두 미언급).
- **인덱싱 내부:** embeddings(임베딩) 저장 위치, privacy/서버 업로드 여부, git history 연동, 머신 간 동기화, Indexing 전용 Settings 패널 → **원문 미확인**(리터럴 부재 확인; "semantic search"만 명시).
- **인덱싱 전용 ignore 파일**(예: `.cursorignoreindexing` 류) → **원문 미확인**(이 페이지엔 `.cursorignore`만 등장). 별도 "Ignore files" 문서는 본 ingest 범위 밖.

## 트리플 맵 (in-file)

- `@`-멘션 --첨부--> `파일/폴더 · @Docs · @Terminals · @Past Chats · @Commit · @Branch · @Browser`
- `@` 멘션 --사용시점--> `관련 파일을 알 때 (모르면 생략)`
- `Agent` --파일모를때--> `자체 search로 관련 파일 발견`
- `프로젝트 오픈` --자동--> `codebase indexing → semantic search`
- `인덱스` --동기화주기--> `~5분 (roughly every five minutes)`
- `대형 레포` --제외--> `.cursorignore (+ .gitignore 기본 상속)`
- `재인덱싱` --명령--> `Command Palette > Reindex (처음부터 재구축)`

## 소스 출처

- 원문 1 (Context/@ 멘션): https://cursor.com/help/customization/context — fetch 2026-06-28 (WebFetch 2패스: 요약 + verbatim 추출)
- 원문 2 (Codebase Indexing): https://cursor.com/help/customization/indexing — fetch 2026-06-28 (WebFetch 2패스: 요약 + verbatim 추출)
- 신뢰도: 5 (공식문서)
- 원문 하단 관련 링크(본 ingest 범위 밖): Context 페이지 → "Rules" / "Ignore files"; Indexing 페이지 → "Semantic search reference" / "Ignore files".
