---
id: cursor-official-p0-cli
date: 2026-06-28
domain: ai-coding-tools
tags: [ingest, cursor, cli, cdocs]
related: [cursor, claude-code]
source: https://cursor.com/docs/cli/overview
source_fetched: 2026-06-28
# trust: 5 — 공식문서 (source-to-summary-protocol Step 4.7 신뢰도 기준)
trust: 5
status: active
---

# Cursor 공식문서 — CLI (핵심 요약)

> CDOCS-03 (P0). Cursor 공식 CLI Overview 문서를 yohan-brain에 ingest한 정제 요약.
> 본문은 2026-06-28 fetch한 원문(`https://cursor.com/docs/cli/overview`)에 근거하며,
> 확인되지 않은 항목은 "원문 미확인", 이 overview 페이지에 없는 항목은 "페이지 범위 밖"으로 구분 표기했다.
> (문서는 살아있는 문서라 시점에 따라 바뀔 수 있음. URL은 bare 형식이 정본 — `.md` 부착 시 404, 실측 확인.)

## 목적

- 터미널에서 Cursor 에이전트(`agent` 바이너리)를 띄울 때 설치 명령·실행 모드·세션 재개·print(비대화) 모드 플래그를 다시 찾지 않고 이 카드로 해결하려고. Claude Code CLI(`claude -p`, `--resume`)와 직접 대응되는 레퍼런스라 두 CLI를 오갈 때 멘탈모델 매핑용.

## 핵심 요약 (3줄)

- Cursor CLI는 **터미널에서 AI 에이전트와 상호작용해 코드를 작성·리뷰·수정**하는 도구다(원문: "Cursor CLI lets you interact with AI agents directly from your terminal to write, review, and modify code."). 설치 후 실행 바이너리는 리터럴 **`agent`** (`cursor-agent` 아님 — 페이지의 7개 예시 모두 `agent ...`).
- 실행 모드는 **대화형(interactive)** 과 **비대화형 print 모드(`-p`)** 가 있고, 동작 모드는 **Agent(기본) / Plan / Ask** 3가지(`--plan`·`/plan`·`--mode=plan` 등으로 전환). 모델은 `--model "gpt-5"` 식으로 지정.
- 세션은 **`agent ls`(목록) / `agent resume` / `--continue` / `--resume="chat-id"`** 로 재개하고, `&` 프리픽스로 **Cloud Agent에 핸드오프**해 백그라운드로 계속 돌릴 수 있다.

## 핵심 키워드

- `agent`(실행 바이너리), 설치(`curl https://cursor.com/install -fsS | bash` / Windows `irm 'https://cursor.com/install?win32=true' | iex`), Interactive mode, Modes(Agent 기본·Plan·Ask), Non-interactive / **print 모드**(`-p`, `--model`, `--output-format text`), **Cloud Agent handoff**(`&` 프리픽스), Sessions(`agent ls`/`agent resume`/`--continue`/`--resume`), Sandbox(`--sandbox enabled|disabled`, `/sandbox`), Max Mode(`/max-mode`), Sudo masked prompt(secure IPC channel)

## 본문

원문 페이지 섹션 순서(통독 확인): **Getting started → Interactive mode → Modes → Non-interactive mode → Cloud Agent handoff → Sessions → Sandbox controls → Max mode → Sudo password prompting**.

### 1. Cursor CLI란 / Getting started (설치·실행)

- 원문: "Cursor CLI lets you interact with AI agents directly from your terminal to write, review, and modify code." — 터미널에서 직접 AI 에이전트와 상호작용해 코드를 **쓰고·리뷰하고·수정**한다.
- 설치 후 실행 바이너리는 리터럴 **`agent`** 하나. (구 명칭 `cursor-agent`가 아님 — 이 페이지의 모든 실행 예시가 `agent`로 시작.)

**설치 명령 (원문 그대로):**

| 플랫폼 | 명령 |
|--------|------|
| macOS / Linux / WSL | `curl https://cursor.com/install -fsS \| bash` |
| Windows PowerShell | `irm 'https://cursor.com/install?win32=true' \| iex` |

- 설치 후: 대화형 세션은 `agent` 실행으로 시작.

### 2. Interactive mode (대화형)

- 원문: "Start a conversational session with the agent to describe your goals, review proposed changes, and approve commands:" — 목표 기술 → 제안된 변경 리뷰 → 명령 승인을 대화형으로 진행.
- 예시(원문):
  ```
  agent
  agent "refactor the auth module to use JWT tokens"
  ```
- 즉 `agent` 단독은 빈 대화형 세션, 인자로 프롬프트를 주면 그 작업으로 바로 시작.

### 3. Modes (동작 모드 — Agent / Plan / Ask)

| 모드 | 전환 방법(원문 그대로) | 비고 |
|------|------------------------|------|
| **Agent** | (기본값) `agent` | 기본 동작 모드 |
| **Plan** | `Shift+Tab`, `/plan`, `--plan`, `--mode=plan` | 계획 모드 |
| **Ask** | `/ask`, `--mode=ask` | 질의 모드 |

- 슬래시 형(`/plan`·`/ask`)은 세션 내 전환, 플래그 형(`--plan`·`--mode=plan`·`--mode=ask`)은 실행 시 지정. Plan은 단축키 `Shift+Tab`로도 토글.

### 4. Non-interactive mode (print 모드 / 비대화)

- 원문: "Use print mode for non-interactive scenarios like scripts, CI pipelines, or automation:" — **스크립트·CI 파이프라인·자동화** 같은 비대화 시나리오용 print 모드.
- 플래그(원문 노출): `-p`(프롬프트/print), `--model`(모델 지정), `--output-format text`(출력 포맷).
- 예시(원문):
  ```
  agent -p "find and fix performance issues" --model "gpt-5"
  ```
- 모델 예시로 `gpt-5`가 등장. (Claude Code의 `claude -p ...`와 대응되는 헤드리스 실행 패턴.)

### 5. Cloud Agent handoff (`&` 프리픽스)

- 원문: "Push your conversation to a Cloud Agent to continue running while you're away. Prepend `&` to any message:" — 대화를 **Cloud Agent로 넘겨** 자리를 비운 동안에도 계속 실행. 메시지 앞에 `&`를 붙이면 됨.
- 예시(원문):
  ```
  & refactor the auth module and add comprehensive tests
  ```

### 6. Sessions (세션 재개)

- 원문: "Resume previous conversations to maintain context across multiple interactions." — 여러 상호작용에 걸쳐 맥락을 유지하기 위해 이전 대화를 재개.

| 명령(원문 그대로) | 동작 |
|-------------------|------|
| `agent ls` | 이전 대화 목록 조회 |
| `agent resume` | 가장 최근 대화 재개 |
| `agent --continue` | 이전 세션 이어가기 |
| `agent --resume="chat-id-here"` | 특정 대화(chat-id) 재개 |

### 7. Sandbox controls (샌드박스)

- 슬래시/플래그 형: `/sandbox`, `--sandbox <mode>`.
- mode 값: `enabled` 또는 `disabled`.

### 8. Max mode

- 원문: "Toggle Max Mode on models that support it using `/max-mode`." — Max Mode를 **지원하는 모델**에 한해 `/max-mode`로 토글.

### 9. Sudo password prompting (보안)

- 원문: "When a command needs `sudo`, Cursor displays a secure, masked password prompt. Your password flows directly to `sudo` via a secure IPC channel; the AI model never sees it." — 명령이 `sudo`를 요구하면 **마스킹된 보안 프롬프트**가 뜨고, 비밀번호는 **secure IPC channel**로 `sudo`에 직접 전달되어 **AI 모델은 절대 보지 못함**.

## 적용·주의 (Yohan OS)

- **Windows 환경 정합:** Yohan OS는 Windows 11 / PowerShell 기준. Cursor CLI도 PowerShell 전용 설치 경로(`irm 'https://cursor.com/install?win32=true' | iex`)를 제공하므로 그대로 도입 가능. (bash 경로 `curl ... | bash`는 WSL/Linux용.)
- **Claude Code 대응 멘탈모델:** `agent -p "..."`(print) ↔ `claude -p`, `agent --resume="chat-id"` ↔ `claude --resume`, `agent --continue` ↔ `claude --continue`. 헤드리스/자동화 파이프라인 설계 시 동일 패턴으로 추상화 가능.
- **에이전트 보안:** `sudo`를 secure IPC로 모델에 노출하지 않는 설계는 우리 "비밀·토큰 평문 금지" 원칙과 정합 — 자동화 시 sudo 단계는 모델 비가시 채널로 두는 게 맞음.
- **Cloud handoff(`&`):** 장시간 작업을 백그라운드 클라우드로 넘기는 패턴 → 로컬 세션 점유 없이 병렬화. 다만 코드/맥락이 클라우드로 푸시되므로 민감 레포에선 주의.

## 페이지 범위 밖 / 원문 미확인 (추측 금지)

**(가) 이 overview 페이지 범위 밖 — CLI 하위 문서 별도 ingest 필요 (이 페이지엔 부재 확인):**

- **인증/로그인** (login·logout·status·API key 환경변수) — 이 overview 페이지에 없음.
- **모델 목록**(지원 모델 전체) — `--model "gpt-5"` 예시만 노출, 전체 리스트는 없음.
- **MCP 지원** — 이 페이지에 언급 없음.
- **Rules / AGENTS.md / config** — 이 페이지에 언급 없음(별도 `cursor.com/docs/rules` ingest는 `p0-rules.md` 참조).
- **슬래시 커맨드 전체 목록** — `/plan`·`/ask`·`/sandbox`·`/max-mode`만 본문에 등장, 전체 카탈로그는 없음.
- → 위 항목들은 Cursor CLI의 **다른 하위 문서**(예: reference/authentication 등)에 있을 것으로 보이며, CDOCS 후속 ingest 대상.

**(나) 원문 미확인 (페이지에 일부만 노출, 전체 미확정):**

- `--output-format`의 허용 값: 이 페이지엔 **`text` 예시만** 등장. `json`·`stream-json` 등 다른 포맷 값은 이 페이지에서 **확인 불가(원문 미확인)** — 단정하지 말 것.
- `--model`의 허용 모델 전체: `gpt-5` 예시 외 미확인.

## 트리플 맵 (in-file)

- `Cursor CLI` --실행바이너리--> `agent`
- `agent` --비대화실행--> `print 모드 (-p, --model, --output-format text)`
- `agent` --동작모드--> `Agent(기본) / Plan / Ask`
- `agent 세션` --재개--> `agent ls / resume / --continue / --resume="chat-id"`
- `메시지 & 프리픽스` --핸드오프--> `Cloud Agent (백그라운드 실행)`
- `sudo 요청` --보안전달--> `secure IPC channel (모델 비가시)`

## 소스 출처

- 원문: https://cursor.com/docs/cli/overview (fetch: 2026-06-28, WebFetch 2회 — 본문 추출 + 핵심 문장 verbatim 확인)
- URL 주의: bare URL이 정본. `.md` 부착 시 404 (실측 확인).
- 신뢰도: 5 (공식문서)

source: https://cursor.com/docs/cli/overview
