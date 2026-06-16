---
id: ts-2026-06-16-notebooklm-mcp-context-canceled
date: 2026-06-16
tags: [troubleshooting, mcp, notebooklm, timeout]
related:
  - C:\Users\백요한\.gemini\antigravity-ide\mcp_config.json
---

# NotebookLM MCP 서버 context canceled 타임아웃 오류

## 증상
Gemini/Antigravity IDE 구동 시 NotebookLM MCP 서버가 연결되었으나 곧바로 `: context canceled` 오류와 함께 종료됨:
```
notebooklm: ╔══════════════════════════════════════════════════════════╗
...
✅ [03:10:50] ✅ MCP Server connected via stdio
✅ [03:10:50] 🎉 Ready to receive requests from Claude Code!
...
: context canceled
```

## 원인
기존 `mcp_config.json`에 MCP 실행 명령어가 `npx notebooklm-mcp@latest`로 설정되어 있었음.
1. `npx` + `@latest` 사용으로 인해 구동 시마다 NPM 레지스트리 검색 및 패키지 다운로드/해결(resolution) 과정이 추가되어 초기 연결에 수 초 이상의 상당한 지연이 발생함.
2. `notebooklm-mcp` 서버가 구동되면서 브라우저 세션을 백그라운드에서 초기화하는 시간이 누적되어, Antigravity IDE의 MCP 서버 초기화 타임아웃 제한 시간을 초과함.
3. 이에 따라 클라이언트(IDE)에서 자체적으로 연결 컨텍스트를 취소(`context canceled`)하고 프로세스를 종료시킴.

## 해결
1. `notebooklm-mcp` 패키지를 시스템에 전역 설치하여 `npx` 네트워크 체크 및 다운로드 지연을 제거:
   ```powershell
   npm install -g notebooklm-mcp
   ```
2. 전역 설치된 로컬 실행 파일 경로(`C:\Users\백요한\AppData\Roaming\npm\notebooklm-mcp.cmd`)를 직접 참조하도록 `mcp_config.json` 설정을 갱신:
   ```json
   {
     "mcpServers": {
       "notebooklm": {
         "command": "C:\\Users\\백요한\\AppData\\Roaming\\npm\\notebooklm-mcp.cmd",
         "args": []
       }
     }
   }
   ```
3. 수정 후, 무거운 `npx` 원격 업데이트 체크 단계가 생략되어 MCP 서버가 타임아웃 없이 정상 구동됨을 확인함.

## 교훈
- IDE의 MCP 서버로 `npx <package>@latest`를 사용하면 구동 속도가 느려 타임아웃 오류를 유발할 수 있으므로, 상시 구동하는 MCP 서버는 전역/지역적으로 미리 설치한 후 로컬 실행 파일을 직접 참조하도록 설정하는 것이 안전하다.
