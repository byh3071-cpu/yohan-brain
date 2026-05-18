# Yohan OS — Claude 진입 요약

먼저 AGENTS.md를 읽어라.

이 레포는 Yohan 1명과 AI 에이전트가 함께 운영하는 개인 AI 운영체제다. 핵심 SoT는 `memory/`이며, MCP `yohan-os`의 `get_context`가 세션 시작 맥락을 공급한다.

## 필수 기준

- 루트 규칙은 `AGENTS.md`가 우선이다.
- 사용자 프로필과 금지사항은 `memory/profile.yaml`을 참조한다.
- 현재 작업 맥락은 `memory/active-project.yaml`을 참조한다.
- 결정이 생기면 `memory/decisions/`에 즉시 남긴다.
- 평가와 회고는 `memory/metrics/evaluations/`와 `memory/rules/evaluator-checklist.md`를 기준으로 한다.

## 작업 순서

1. `AGENTS.md`를 읽어 전체 운영 원칙을 확인한다.
2. `memory/rules/agent-harness.md`를 읽어 세션 시작, SoT, P/G/E, 결정 로그 규칙을 확인한다.
3. 대시보드 작업이면 `docs/DASHBOARD-SPEC.md`를 함께 본다.
4. Wiki/지식 레이어 작업이면 `docs/WIKI-SPEC-v2.md`와 `memory/rules/wiki-ops.md`를 함께 본다.
5. MCP를 사용할 수 있으면 먼저 `get_context`로 현재 SoT를 확인한다.

## 운영 원칙 요약

- 진입 문서는 짧게 유지하고 세부 규칙은 `memory/rules/`와 `docs/`로 분리한다.
- 코드보다 규칙과 맥락 정비가 우선이다.
- 사용자 비밀, 토큰, API 키는 문서나 커밋에 평문으로 남기지 않는다.
- Windows 11 / PowerShell 환경을 기준으로 작업하며 bash/sh 문법을 쓰지 않는다.
- 확인되지 않은 MCP 연결 상태는 신뢰하지 말고 실제 API 호출 또는 빌드/실행으로 검증한다.
