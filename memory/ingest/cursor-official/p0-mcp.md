---
id: cursor-official-p0-mcp
date: 2026-06-28
domain: ai-coding-tools
tags: [ingest, cursor, mcp, cdocs]
related: [cursor, claude-code]
source: https://cursor.com/docs/mcp
source_fetched: 2026-06-28
# trust: 5 — 공식문서 (source-to-summary-protocol Step 4.7 신뢰도 기준)
trust: 5
status: active
---

# Cursor 공식문서 — MCP (Model Context Protocol) (핵심 요약)

> CDOCS-03 (P0). Cursor 공식 MCP 문서를 yohan-brain에 ingest한 정제 요약.
> 본문은 2026-06-28 두 차례 fetch한 원문(`https://cursor.com/docs/mcp`, bare URL — `.md` 붙이면 404)에 근거한다.
> 핵심 문장은 1차·2차 fetch에서 **동일하게 재확인된 verbatim**만 `>` 인용 블록으로 표기했고,
> 표·코드 외 서술은 한국어 요약이다. 확인되지 않은 항목은 "원문 미확인"으로 표기했다.
> (살아있는 문서라 시점에 따라 바뀔 수 있음.)

## 목적

- Cursor에 MCP 서버를 붙일 때 `mcp.json` 위치·필드, transport 3종, OAuth 설정, 지원 프리미티브를 다시 찾지 않고 이 카드로 해결하려고. 이 레포가 직접 운영하는 MCP 서버 `yohan-os`(get_context 등)를 Cursor 클라이언트에 연결할 때의 직접 레퍼런스.

## 핵심 요약 (3줄)

- **MCP는 Cursor를 외부 도구·데이터소스에 연결하는 프로토콜.** 설정은 `mcpServers` 객체로, 프로젝트별 `.cursor/mcp.json` 또는 전역 `~/.cursor/mcp.json`에 둔다. 서버는 `stdout`로 출력하거나 HTTP 엔드포인트를 제공할 수 있는 어떤 언어로든(Python·JS·Go 등) 작성 가능.
- **Transport는 3종:** `stdio`(로컬·Cursor가 프로세스 관리·단일 사용자·수동 인증) / `SSE` / `Streamable HTTP`(뒤 둘은 로컬·원격 모두, 서버로 배포, 다중 사용자, OAuth). 로컬 CLI 서버는 `command`/`args`/`env`, 원격 서버는 `url`/`headers`(또는 OAuth `auth`)로 설정.
- **Cursor는 MCP 프리미티브 6종(Tools·Prompts·Resources·Roots·Elicitation·Apps)을 모두 "Supported".** Agent는 `Available Tools`의 MCP 도구를 관련 시 자동 사용하되 **기본적으로 사용 전 승인을 요구**한다(Run Modes의 allowlist에 있으면 즉시 실행).

## 핵심 키워드

- `mcp.json`(`.cursor/mcp.json` 프로젝트 / `~/.cursor/mcp.json` 전역), `mcpServers`, `command`/`args`/`env`/`envFile`, transport(`stdio`/`SSE`/`Streamable HTTP`), 원격 `url`/`headers`, OAuth `auth`(`CLIENT_ID`/`CLIENT_SECRET`/`scopes`), redirect URL, MCP primitives(Tools/Prompts/Resources/Roots/Elicitation/Apps), `Available Tools`, tool approval, Run Modes(Auto-review allowlist), Customize 토글, 변수 보간(`${env:NAME}`·`${workspaceFolder}`), Marketplace / `Add to Cursor` / cursor.directory, MCP Logs(`Cmd+Shift+U`)

## 본문

### 1. MCP란 / Cursor에서의 역할

> "Model Context Protocol (MCP) enables Cursor to connect to external tools and data sources."

- 즉 MCP는 Cursor를 외부 도구·데이터소스에 연결하는 표준. 프로젝트 구조를 매번 설명하는 대신 도구와 직접 통합한다(원문 취지: "Instead of explaining your project structure repeatedly, integrate directly with your tools").
- MCP 서버는 **`stdout`로 출력하거나 HTTP 엔드포인트를 서빙할 수 있는 어떤 언어로든**(Python·JavaScript·Go 등) 작성 가능.
- Cursor는 이 페이지 전체에서 **MCP 클라이언트(호스트)**로서 외부 MCP 서버에 연결한다. (Cursor 자체를 MCP 서버로 노출하는 방법은 이 페이지에 없음 — **원문 미확인**.)

### 2. Transport 3종 (연결 방식)

> "Cursor supports three transport methods:"

| Transport | 실행(Execution) | 배포(Deployment) | 사용자(Users) | 입력(Input) | 인증(Auth) |
|-----------|-----------------|------------------|---------------|-------------|------------|
| **`stdio`** | Local | Cursor manages | Single user | shell command | Manual |
| **`SSE`** | Local/Remote | Deploy as server | Multiple users | URL to SSE endpoint | OAuth |
| **`Streamable HTTP`** | Local/Remote | Deploy as server | Multiple users | URL to HTTP endpoint | OAuth |

- **`stdio`**: Cursor가 직접 프로세스를 띄워 관리하는 **로컬·단일 사용자**용. 셸 명령으로 기동, 인증은 수동(env 등).
- **`SSE` / `Streamable HTTP`**: 서버로 배포해 **로컬/원격·다중 사용자**가 공유. 엔드포인트 URL을 가리키고 인증은 OAuth.

### 3. 설정 파일 위치 & `mcp.json` 형식

- **위치 2곳:**
  - 프로젝트 스코프: `.cursor/mcp.json`
  - 전역: `~/.cursor/mcp.json`
- 모든 서버는 최상위 `mcpServers` 객체 아래에 이름을 키로 등록.

**로컬 CLI 서버 — Node.js 예시 (원문 verbatim):**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

**로컬 CLI 서버 — Python 예시 (원문 verbatim):**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "python",
      "args": ["mcp-server.py"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

**원격 서버 예시 (원문 verbatim):**

```json
{
  "mcpServers": {
    "server-name": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "API_KEY": "value"
      }
    }
  }
}
```

### 4. STDIO 서버 설정 필드

| 필드 | 필수 | 설명 | 예시 |
|------|------|------|------|
| `type` | Yes | 서버 연결 타입 | `"stdio"` |
| `command` | Yes | 서버 실행 명령 | `"npx"`, `"node"`, `"python"`, `"docker"` |
| `args` | No | 명령에 넘길 인자 배열 | `["server.py", "--port", "3000"]` |
| `env` | No | 서버에 줄 환경변수 | `{"API_KEY": "${env:api-key}"}` |
| `envFile` | No | 환경변수 파일 경로 | `".env"`, `"${workspaceFolder}/.env"` |

> 주의(관찰된 불일치): 필드표는 `type`을 **Required=Yes**로 명시하나, 3번의 CLI 예시 JSON에는 `type` 키가 없다. `command` 유무로 `stdio`가 추론되는 것으로 보이나, 이 추론 자체는 **원문 미확인**. 표의 Required 값(2차 fetch 재확인)은 원문 그대로 옮긴 것.

**변수 보간(interpolation) 구문** (원문 config 섹션 — 1차 fetch 기준, 2차 재확인 안 됨):

| 토큰 | 의미 |
|------|------|
| `${env:NAME}` | 환경변수 |
| `${userHome}` | 홈 폴더 경로 |
| `${workspaceFolder}` | 프로젝트 루트 |
| `${workspaceFolderBasename}` | 프로젝트 루트 이름 |
| `${pathSeparator}` / `${/}` | OS 경로 구분자 |

보간 예시(원문):

```json
{
  "mcpServers": {
    "local-server": {
      "command": "python",
      "args": ["${workspaceFolder}/tools/mcp_server.py"],
      "env": {
        "API_KEY": "${env:API_KEY}"
      }
    }
  }
}
```

### 5. MCP 서버 설치 (Marketplace / 원클릭)

- **Marketplace 원클릭 설치:** Customize에서 공식 플러그인을 **one-click install** 하거나, `mcp.json`으로 커스텀 서버를 직접 설정. (원문 취지: "Browse the Cursor Marketplace for official plugins with one-click install from Customize, or configure custom servers with mcp.json.")
- **`Add to Cursor`:** 마켓플레이스 항목의 `Add to Cursor` 버튼을 누르면 설치 후 **OAuth로 인증**.
- 커뮤니티 서버는 **cursor.directory**에서 제공.

### 6. OAuth (원격 서버 인증)

**정적 OAuth 설정 예시 (원문 verbatim):**

```json
{
  "mcpServers": {
    "oauth-server": {
      "url": "https://api.example.com/mcp",
      "auth": {
        "CLIENT_ID": "your-oauth-client-id",
        "CLIENT_SECRET": "your-client-secret",
        "scopes": ["read", "write"]
      }
    }
  }
}
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `CLIENT_ID` | Yes | MCP 제공자가 발급한 OAuth 2.0 Client ID |
| `CLIENT_SECRET` | No | OAuth 2.0 Client Secret |
| `scopes` | No | 요청할 OAuth scope |

- **고정 Redirect URL:** `https://www.cursor.com/agents/mcp/oauth/callback`  (1차·2차 fetch 동일 확인)

### 7. 지원 프리미티브 (MCP Protocol Support)

| 기능 | 지원 | 설명 |
|------|------|------|
| **Tools** | Supported | AI 모델이 실행하는 함수 |
| **Prompts** | Supported | 템플릿화된 메시지·워크플로 |
| **Resources** | Supported | 읽기/참조 가능한 구조화 데이터 소스 |
| **Roots** | Supported | 서버가 개시하는 URI/파일시스템 조회 |
| **Elicitation** | Supported | 서버가 사용자 정보를 요청 |
| **Apps (extension)** | Supported | MCP 도구가 띄우는 인터랙티브 UI 뷰 |

> 행 이름·"Supported" 상태는 1차·2차 fetch에서 동일 확인. 각 행의 한국어 설명은 1차 fetch의 서술을 옮긴 것(요약).

### 8. 채팅에서 MCP 사용 (Agent 동작)

- **자동 사용:** Cursor는 `Available Tools`에 나열된 MCP 도구를 관련 있을 때 자동으로 쓴다. (원문 취지: "Cursor automatically uses MCP tools listed under Available Tools when relevant.")
- **승인(approval) 기본값:** "Cursor asks for approval before using MCP tools by default." — **기본적으로 MCP 도구 사용 전 승인을 요구**.
- **Run Modes:** MCP는 터미널 명령과 **같은 Run Modes**를 따른다. 예: Auto-review 모드에서는 **allowlist에 오른 MCP 도구가 즉시 실행**.
- **토글:** 사이드바 Customize에서 MCP 서버를 켜고/끌 수 있다.
- **도구 개수 상한:** 이 페이지에는 도구 최대 개수 제한(예: "40 tools" 류)이 **명시되어 있지 않음 — 원문 미확인**(2차 fetch에서 "NOT ON PAGE" 확인).

### 9. 이미지 컨텍스트 반환

- MCP 서버는 base64 인코딩 이미지를 도구 결과로 돌려줄 수 있다(원문 예시, JS):

```js
const RED_CIRCLE_BASE64 = "/9j/4AAQSkZJRgABAgEASABIAAD/2w...";

server.tool("generate_image", async (params) => {
  return {
    content: [
      {
        type: "image",
        data: RED_CIRCLE_BASE64,
        mimeType: "image/jpeg",
      },
    ],
  };
});
```

### 10. 보안 고려 (Security)

원문 보안 권고(요약):
- **출처 검증:** 신뢰할 수 있는 개발자의 MCP 서버만 설치.
- **권한 검토:** 서버가 접근할 데이터·API 확인.
- **API 키 제한:** 최소 권한의 제한된 키 사용.
- 경고: **"MCP servers can access external services and execute code on your behalf"** — MCP 서버는 외부 서비스 접근 및 사용자 대신 코드 실행이 가능.

### 11. 트러블슈팅 / FAQ

- **로그 확인:** Output 패널(`Cmd+Shift+U`) → 드롭다운에서 **"MCP Logs"** 선택 → 연결 오류·인증·크래시 확인.
- **임시 비활성화:** 제거하지 않고 Customize에서 서버 토글 off.
- **서버 크래시 시:** Cursor가 채팅에 에러 표시, 해당 tool call은 실패 처리, **다른 MCP 서버는 정상 동작**.
- **서버 업데이트(npm):** 제거 → `npm cache clean --force` → 재추가.
- **민감 데이터:** 비밀은 환경변수로(하드코딩 금지), 민감 서버는 **`stdio` transport로 로컬 실행**.

## 적용·주의 (Yohan)

- **`yohan-os` MCP 연결 직접 적용:** 이 레포는 자체 MCP 서버 `yohan-os`(예: `get_context`)를 운영한다. Cursor에서 쓰려면 단일 사용자·로컬이므로 **`stdio` transport**가 정답(표의 "stdio = Local / Cursor manages / Single user")이고, 프로젝트 스코프면 `.cursor/mcp.json`, 개인 전역이면 `~/.cursor/mcp.json`에 `command`/`args`로 등록. Claude Code 쪽 `.mcp.json`과 별개 파일임에 주의.
- **비밀 관리 — 우리 규칙과 정합:** AGENTS.md/CLAUDE.md의 "토큰·API 키 평문 금지"는 Cursor의 `${env:NAME}` 보간 + `envFile`로 그대로 구현 가능 → `mcp.json`에 키 리터럴을 박지 말고 환경변수/`.env` 참조. 원격 서버면 정적 토큰 대신 OAuth(`auth`) 권장.
- **승인·Run Modes = 하네스 안전장치:** "기본 승인 요구 + allowlist만 즉시 실행"은 우리 P/G/E·자동실행 정책과 같은 결. 위험 도구는 allowlist에서 빼 수동 승인 유지, 안전·반복 도구만 allowlist로 올려 토큰·왕복 절감.
- **프리미티브 활용 여지:** Resources·Prompts가 "Supported"이므로, `yohan-os`가 SoT 컨텍스트를 단순 tool 응답이 아니라 **Resource**(참조형)나 **Prompt**(템플릿)로도 노출하면 Cursor에서 `@`-참조/워크플로로 더 매끄럽게 쓸 수 있음 — 설계 검토 대상.
- **하지 말 것:** 신뢰 안 된 서드파티 MCP 서버를 무검증 설치(코드 실행 위임 위험). 광범위 권한 키 사용. `mcp.json`에 시크릿 평문 커밋.

## 트리플 맵 (in-file)

- `Cursor` --역할--> `MCP 클라이언트(호스트)`
- `MCP 설정` --위치--> `.cursor/mcp.json (프로젝트) / ~/.cursor/mcp.json (전역)`
- `mcp.json` --루트키--> `mcpServers`
- `로컬 CLI 서버` --transport--> `stdio (command/args/env)`
- `원격 서버` --transport--> `SSE / Streamable HTTP (url + OAuth)`
- `원격 인증` --방식--> `OAuth auth(CLIENT_ID/CLIENT_SECRET/scopes)`
- `Cursor MCP` --지원프리미티브--> `Tools/Prompts/Resources/Roots/Elicitation/Apps`
- `MCP 도구 실행` --기본정책--> `사용 전 승인 요구 (allowlist만 즉시)`
- `yohan-os MCP` --권장연결--> `stdio + ${env} 비밀보간`

## 원문 미확인 (추측 금지 — 확인된 미확인 목록)

- **도구 개수 상한:** 이 페이지에 수치 제한 명시 없음(2차 fetch "NOT ON PAGE").
- **`type` 필드:** 필드표는 Required=Yes이나 CLI 예시 JSON엔 부재 → `command`/`url` 유무로 추론된다는 해석은 원문 미확인.
- **변수 보간표:** 1차 fetch에만 등장(2차 재확인 안 함). 토큰 자체는 VS Code류 표준과 일치하나 verbatim 재확인은 미수행.
- **Cursor를 MCP 서버로 노출:** 이 페이지 범위 밖(원문 미확인).

## 소스 출처

- 원문: https://cursor.com/docs/mcp  (fetch: 2026-06-28, WebFetch 2회 — 1차 전체 추출 + 2차 고위험 항목 verbatim 재확인)
- 신뢰도: 5 (공식문서)

source: https://cursor.com/docs/mcp
