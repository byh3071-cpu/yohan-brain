---
id: session-2026-06-16-notebooklm-mcp
date: 2026-06-16
tags: [session-log, mcp, config]
related:
  - docs/troubleshooting/2026-06-16-notebooklm-mcp-context-canceled.md
---

# NotebookLM MCP 서버 context canceled 타임아웃 오류 해결

## 한 일
- Gemini/Antigravity IDE의 `notebooklm` MCP 서버가 구동될 때 `: context canceled` 오류를 내며 정상 연결되지 않는 문제를 해결함.
- `notebooklm-mcp` 패키지를 시스템에 전역 설치함.
- `C:\Users\백요한\.gemini\antigravity-ide\mcp_config.json` 파일을 수정하여, `npx notebooklm-mcp@latest` 대신 전역 설치된 로컬 명령어의 절대 경로(`C:\Users\백요한\AppData\Roaming\npm\notebooklm-mcp.cmd`)를 직접 참조하도록 변경함.
- 이를 통해 MCP 서버 연결 시 NPM registry 패키지 확인 및 다운로드 과정이 생략되어 타임아웃이 발생하지 않고 정상 연결되도록 조치함.

## 변경 파일
- `C:\Users\백요한\.gemini\antigravity-ide\mcp_config.json` (modified)
- `docs/troubleshooting/2026-06-16-notebooklm-mcp-context-canceled.md` (added)

## 다음 세션
- 기존 작업(요한 OS 재가동, 텔레그램 수집 등) 진행.
