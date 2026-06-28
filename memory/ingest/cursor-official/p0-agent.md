---
id: cursor-official-p0-agent
date: 2026-06-28
domain: ai-coding-tools
tags: [ingest, cursor, agent, cdocs]
related: [cursor, claude-code]
source: https://cursor.com/docs/agent/overview
source_fetched: 2026-06-28
# trust: 5 — 공식문서 (source-to-summary-protocol Step 4.7 신뢰도 기준)
trust: 5
status: active
---

# Cursor 공식문서 — Agent (핵심 요약)

> CDOCS-03. Cursor 공식 Agent 문서를 yohan-brain에 ingest한 정제 요약.
> 본문은 2026-06-28 fetch한 원문 전문(`https://cursor.com/docs/agent/overview`)에 근거하며,
> 확인되지 않은 항목은 "원문 미확인"으로 표기했다. (문서는 살아있는 문서라 시점에 따라 바뀔 수 있음.)
> 티켓 제목의 "(Composer/Chat)"은 구 UI 명칭이며 현 페이지엔 미등장 — 아래 "명칭 관련 주의" 참조.

## 목적

- Cursor **Agent**의 구성(Instructions/Tools/Model)·도구 10종·체크포인트·메시지 큐를 다시 찾지 않고 이 카드로 해결하려고. Yohan OS 에이전트 하네스(규칙=Instructions, MCP·내장툴=Tools, 모델 선택=Model)와 직접 대응되는 레퍼런스이며, 같은 폴더의 `p0-rules.md`(Rules)와 짝을 이룬다.

## 핵심 요약 (3줄)

- **Agent**는 Cursor의 어시스턴트로 복잡한 코딩 작업을 **독립적으로(independently)** 수행하고 터미널 명령 실행·코드 편집을 한다. 사이드페인에서 `Cmd+I`로 연다 (원문: "Agent is Cursor's assistant that can complete complex coding tasks independently, run terminal commands, and edit code. Access in sidepane with Cmd+I.").
- Agent는 **세 구성요소** 위에 만들어진다 — **Instructions**(시스템 프롬프트·규칙) / **Tools**(파일 편집·코드베이스 검색·터미널 실행 등) / **Model**(작업에 고른 agent 모델). Cursor가 각 frontier 모델에 맞춰 instruction·tool을 튜닝해 오케스트레이션한다.
- 도구는 Agent의 **building blocks**(원문 표현)로 10종 — semantic search, 파일/폴더 검색, web, Fetch Rules, read/edit files, run shell, browser, image generation, ask questions. 안전장치로 **Checkpoints**(Git과 별개인 로컬 스냅샷·되돌리기)와 **Queued messages**(작업 중 후속 지시 큐잉)를 제공한다.

## 핵심 키워드

- Agent, `Cmd+I`, sidepane, 세 구성요소(**Instructions / Tools / Model**), frontier model 튜닝·orchestrate, Semantic search(의미 기반), Search files and folders(grep류), Web, **Fetch Rules**(type·description 기반), Read files(이미지 지원·vision 모델), Edit files(자동 적용), Run shell commands(terminal profile), **Browser**(스크린샷·시각 검증), Image generation(`assets/`), Ask questions(비차단), **Checkpoints**(로컬·Git과 별개·`Restore Checkpoint`), **Queued messages**(`Enter` 큐 / `Cmd+Enter` 즉시)

## 본문

### 1. Agent란 / 동작 방식 (How Agent works)

- **정의(원문 첫 줄):** "Agent is Cursor's assistant that can complete complex coding tasks independently, run terminal commands, and edit code. Access in sidepane with `Cmd+I`." — 복잡한 코딩 작업을 **독립적으로** 수행, 터미널 명령 실행, 코드 편집. `Cmd+I`로 사이드페인에서 접근.
- **세 구성요소(원문 "An agent is built on three components"):**

| 구성요소 | 원문 설명 (verbatim) | 우리말 |
|----------|----------------------|--------|
| **Instructions** | "The system prompt and rules that guide agent behavior" | agent 행동을 안내하는 시스템 프롬프트와 규칙(=Rules) |
| **Tools** | "File editing, codebase search, terminal execution, and more" | 파일 편집·코드베이스 검색·터미널 실행 등 |
| **Model** | "The agent model you pick for the task" | 작업에 맞게 고른 agent 모델 |

- **오케스트레이션(원문):** "Cursor's agent orchestrates these components for each model we support, tuning instructions and tools specifically for every frontier model." — Cursor가 지원하는 각 모델별로 세 구성요소를 오케스트레이션하며, **모든 frontier 모델에 맞춰 instruction·tool을 구체적으로 튜닝**한다.
- **도구 호출 횟수(원문):** "There is no limit on the number of tool calls Agent can make during a task." — 한 작업 내 Agent의 tool call 횟수에는 **제한이 없다**(반복·자율 수행을 시사).

### 2. 도구 (Tools)

- **인트로(원문):** "Tools are the building blocks of Agent. They are used to search your codebase and the web to find relevant information, make edits to your files, run terminal commands, and more." — 도구는 Agent의 빌딩블록이며, 코드베이스·웹 검색으로 정보를 찾고 파일을 편집하고 터미널 명령을 실행하는 데 쓰인다.

| 도구 (Tool) | 동작 (원문 verbatim → 우리말) |
|-------------|-------------------------------|
| **Semantic search** | "Perform semantic searches within your indexed codebase. Finds code by meaning, not just exact matches." → 인덱싱된 코드베이스에서 **의미 기반** 검색(문자열 정확 매치가 아니라 의미로 코드를 찾음). |
| **Search files and folders** | "Search for files by name, read directory structures, and find exact keywords or patterns within files." → 파일명 검색·디렉토리 구조 읽기·파일 내 정확한 키워드/패턴 찾기(grep류). |
| **Web** | "Generate search queries and perform web searches." → 검색 쿼리 생성·웹 검색 수행. |
| **Fetch Rules** | "Retrieve specific rules based on type and description." → type·description 기반으로 특정 규칙을 가져옴(= Rules 문서의 "Apply Intelligently" 선별 로딩과 연동). |
| **Read files** | "Intelligently read the content of a file. Also supports image files (.png, .jpg, .gif, .webp, .svg) and includes them in the conversation context for analysis by vision-capable models." → 파일 내용을 지능적으로 읽음. **이미지(.png/.jpg/.gif/.webp/.svg)**도 지원해 vision 모델 분석용으로 대화 컨텍스트에 포함. |
| **Edit files** | "Suggest edits to files and apply them automatically." → 파일 편집을 제안하고 **자동 적용**. |
| **Run shell commands** | "Execute terminal commands and monitor output. By default, Cursor uses the first terminal profile available." → 터미널 명령 실행·출력 모니터링. 기본으로 **사용 가능한 첫 terminal profile** 사용. |
| **Browser** | "Control a browser to take screenshots, test applications, and verify visual changes. Agent can navigate pages, interact with elements, and capture the current state for analysis. See the Browser documentation for details." → 브라우저 제어(스크린샷·앱 테스트·시각 변경 검증). 페이지 이동·요소 상호작용·현재 상태 캡처. 상세는 Browser 문서. |
| **Image generation** | "Generate images from text descriptions or reference images. Useful for creating UI mockups, product assets, and visualizing architecture diagrams. Images are saved to your project's `assets/` folder by default and shown inline in chat." → 텍스트/레퍼런스 이미지로 이미지 생성(UI 목업·제품 에셋·아키텍처 다이어그램). 기본 저장은 프로젝트 `assets/` 폴더, 채팅에 인라인 표시. |
| **Ask questions** | "Ask clarifying questions during a task. While waiting for your response, the agent continues reading files, making edits, or running commands. Your answer is incorporated as soon as it arrives." → 작업 중 명확화 질문. 답을 기다리는 동안에도 agent는 파일 읽기·편집·명령 실행을 **계속**하고, 답이 오면 즉시 반영(비차단). |

### 3. 체크포인트 (Checkpoints)

- **정의(원문):** "Checkpoints save snapshots of your codebase during an Agent session." — Agent 세션 동안 코드베이스 스냅샷을 저장.
- **자동 생성(원문):** "Agent automatically creates them before making significant changes, capturing the state of all modified files." — **중요한 변경 전 자동 생성**, 수정된 모든 파일 상태를 캡처.
- **되돌리기(원문):** "If Agent takes a wrong turn, click any checkpoint in the chat timeline to preview your files at that point, then restore to revert all files to that state." — Agent가 잘못된 방향으로 가면, 채팅 타임라인의 체크포인트를 클릭해 그 시점 파일을 미리보고 **restore로 그 상태로 전체 복원**.
- **추가 복원 경로(원문):** "You can also restore from the `Restore Checkpoint` button on previous requests or the `+` button when hovering over a message." — 이전 요청의 `Restore Checkpoint` 버튼, 또는 메시지 호버 시 `+` 버튼으로도 복원 가능.
- **용도(원문):** "useful for exploratory work, complex refactoring, and iterative development where you want safe rollback points." — 탐색적 작업·복잡한 리팩터링·안전한 롤백 지점이 필요한 반복 개발에 유용.
- ⚠️ **Git과의 관계(원문):** "Checkpoints are stored locally and separate from Git. Only use them for undoing Agent changes; use Git for permanent version control." — 체크포인트는 **로컬 저장이고 Git과 별개**. **Agent 변경 되돌리기 전용**이며, 영속 버전관리는 Git을 쓴다.

### 4. 큐된 메시지 (Queued messages)

- **정의(원문):** "Queue follow-up messages while Agent is working on the current task. Your instructions wait in line and execute automatically when ready." — Agent가 현재 작업을 하는 동안 후속 메시지를 큐에 넣음. 지시는 줄을 서서 준비되면 자동 실행.
- **사용법(원문):** "While Agent is working, type your next instruction. Press `Enter` to add it to the queue. Messages appear in order below the active task." — 작업 중 다음 지시를 타이핑하고 `Enter`로 큐에 추가. 메시지는 활성 작업 아래에 순서대로 표시.
- **재정렬·처리(원문):** "Drag to reorder queued messages as needed. Agent processes them sequentially after finishing." — 필요하면 드래그로 재정렬. Agent는 현재 작업을 끝낸 뒤 **순차 처리**.

### 5. 키보드 단축키 (Keyboard shortcuts)

| 단축키 | 동작 | 근거 |
|--------|------|------|
| `Cmd+I` | Agent를 사이드페인에서 열기 | 원문 "Access in sidepane with `Cmd+I`" |
| `Enter` | (Agent 작업 중) 메시지를 큐에 추가 | §4 Queued messages |
| `Cmd+Enter` | 큐를 건너뛰고 메시지 즉시 전송 | 원문 "Send message immediately, bypassing the queue" |
| `Cmd/Ctrl+Shift+P` | Command Palette 열기 | 원문 언급(맥락은 일반 Command Palette) |

### 6. 관련 하위/참조 문서 (원문 내 링크)

> 아래는 원문 본문이 링크한 문서들. **표기는 bare URL**(이 카드 fetch처럼 `.md` 접미사는 404 위험 → 절대 붙이지 말 것).

- how agents work — `https://cursor.com/learn/agents`
- rules — `https://cursor.com/docs/rules` (← `p0-rules.md` ingest 대상)
- tool calling fundamentals — `https://cursor.com/learn/tool-calling`
- Browser documentation — `https://cursor.com/docs/agent/tools/browser`

## 적용·주의 (Yohan OS)

- **3분할 매핑:** Cursor Agent의 **Instructions / Tools / Model** 삼분할은 우리 하네스에 그대로 대응 — 규칙(`AGENTS.md`/`memory/rules`)=Instructions, MCP·내장툴=Tools, 모델 선택=Model. 에이전트 하네스를 설명할 때 같은 멘탈모델을 차용 가능.
- **Checkpoints ≠ Git:** "Agent 변경 되돌리기는 로컬 체크포인트, 영속 이력은 Git" 원칙은 우리 SoT(코드 정본=Git, ADR-006) 원칙과 정합. 체크포인트를 버전관리로 오해하지 말 것.
- **Fetch Rules ↔ Rules 선별 로딩:** Agent의 `Fetch Rules`("based on type and description")는 `p0-rules.md`의 **Apply Intelligently**(description 기반 선별)와 직접 연결. `alwaysApply: true` 남발 대신 description/glob로 선별하라는 컨텍스트 예산 원칙과 같은 축.
- **Queued messages 활용:** 장시간 멀티스텝 작업 중 후속 지시를 끊지 않고 큐로 쌓는 패턴은 우리 작업 흐름(P/G/E, 결정 로그)과 잘 맞는다.
- **하지 말 것:** 이 페이지가 직접 명시하지 않은 모드·기능(아래 "명칭 관련 주의")을 추측으로 채우지 말 것 — 별도 문서 ingest로 보강.

## 명칭 관련 주의 (추측 금지 확인)

- 티켓 제목은 **"Agent (Composer/Chat)"**지만, **2026-06-28 fetch 기준 이 페이지의 제목은 그냥 "Agent"**이며 본문에 **"Composer"·"Chat" 문자열은 등장하지 않음**(전문 통독 확인). "(Composer/Chat)"은 구 Cursor UI 명칭(Composer=에이전트 패널, Chat=대화 모드)을 가리키는 **티켓 측 표기**로 보이며, **현 공식문서에는 미등장 → 원문 미확인**.
- 이 페이지에는 **"Agent mode / Ask mode / Manual mode / Custom mode / Plan mode" 같은 모드 구분이 등장하지 않음**(별도 모드 문서가 따로 있을 가능성은 본 ingest 범위 밖). **원문 미확인.**
- **H2 섹션은 정확히 4개:** How Agent works / Tools / Checkpoints / Queued messages (전문 통독 확인). 그 외 섹션 없음.

## 트리플 맵 (in-file)

- `Cursor Agent` --구성--> `Instructions + Tools + Model`
- `Agent` --연다(open)--> `사이드페인 (Cmd+I)`
- `Agent Tools` --포함--> `Semantic search / Search files·folders / Web / Fetch Rules / Read files / Edit files / Run shell / Browser / Image generation / Ask questions`
- `Fetch Rules` --연동--> `Rules: Apply Intelligently (description 기반)`
- `Checkpoints` --별개(separate from)--> `Git (로컬 저장·되돌리기 한정)`
- `Queued messages` --처리--> `순차 실행 (Enter=큐 / Cmd+Enter=즉시)`

## 소스 출처

- 원문: https://cursor.com/docs/agent/overview (fetch: 2026-06-28, WebFetch 전문 통독, 4회 교차 확인)
- 신뢰도: 5 (공식문서)
- 참조 하위 문서(원문 내 링크): cursor.com/learn/agents · cursor.com/docs/rules · cursor.com/learn/tool-calling · cursor.com/docs/agent/tools/browser

source: https://cursor.com/docs/agent/overview
