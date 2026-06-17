---
id: PAT-009
패턴명: PowerShell 상태줄/스크립트 인코딩 (소스 ASCII + 출력 UTF-8)
카테고리: env
증상: Windows에서 Claude Code 상태줄·PS 스크립트의 가운뎃점 `·`(U+00B7) 등 비-ASCII가 `쨌`(파스 단계) 또는 `��`(출력 단계)로 깨짐
원인: PS5.1이 BOM없는 UTF-8 .ps1을 시스템 ANSI(CP949)로 파싱해 소스 리터럴이 실행 전 깨짐 + Claude Code는 상태줄 stdout을 UTF-8로 디코드하는데 스크립트가 [Text.Encoding]::Default(CP949) 바이트로 출력해 U+FFFD로 깨짐 (두 단계 서로 다른 불일치)
적용조건: Windows PowerShell 5.1 + Claude Code 상태줄/훅 스크립트 + 비-ASCII 출력 (PS7/BOM 저장 시 파스 문제만 완화)
출처프로젝트: yohan-cc-skills (statusline.ps1, 집컴 실측 — 같은 글자가 두 단계서 두 번 깨짐)
태그: [encoding, utf-8, cp949, powershell, statusline, windows, env]
발견일: 2026-06-18
출처DevLog: "[2026-06-18] 작업 패턴 분석 + yohan-cc-skills 마켓플레이스 구축"
---

## 증상
Windows에서 Claude Code 상태줄(또는 PS 훅) 스크립트를 만들면 `·`(U+00B7) 같은 비-ASCII가 깨진다. 두 가지 다른 모양으로:
- 파스 단계: `·` → `쨌`
- 출력 단계: `·` → `��`

## 원인 — 2단계, 서로 다른 인코딩 불일치
1. **파스(소스):** PowerShell 5.1은 BOM 없는 UTF-8 `.ps1`을 시스템 ANSI 코드페이지(한국어=CP949)로 파싱한다. 소스에 직접 박은 비-ASCII 리터럴/주석(`·`의 UTF-8 `C2 B7`)이 실행 전에 CP949 2글자로 깨진다. (도구가 UTF-8 no-BOM으로 저장하면 항상 재현)
2. **출력(stdout):** Claude Code는 상태줄 stdout을 UTF-8로 디코드한다. 그런데 스크립트가 `[Text.Encoding]::Default`(=CP949) 바이트로 쓰면 `·`가 `A1 A4`로 나가 UI에서 U+FFFD(`��`)가 된다.
3. **검증 함정:** 부모 PowerShell의 `[Console]::OutputEncoding`을 CP949로 맞춰 자식 출력을 디코드하면 "통과"처럼 보이지만, 실제 소비자(Claude Code=UTF-8)와 인코딩이 달라 **거짓 통과**다.

## 해결
- ✅ **소스는 순수 ASCII.** 비-ASCII는 코드포인트로 생성: `$sep = ' ' + [char]0x00B7 + ' '`. 주석도 영어. 확인: `([IO.File]::ReadAllBytes(path) | ?{$_-gt127}).Count -eq 0`.
- ✅ **출력은 UTF-8 바이트.** `[Text.Encoding]::UTF8.GetBytes($out)` (GetBytes는 BOM 안 붙임).
- ✅ **검증은 실제 소비자(UTF-8) 기준 raw 바이트.** `C2 B7` 존재 & `A1 A4`/`EF BF BD` 부재 확인.
- ❌ 소스에 `·` 직접 입력 + `Encoding.Default` 출력 + 부모 셸 인코딩 맞춰 자기참조 검증.
- 왜: 집컴 실측. 1차 `쨌`(파스) → `[char]0x00B7`로 해결, 2차 `��`(출력) → `UTF8.GetBytes`로 해결. 증상이 "출력 깨짐"처럼 보여도 원인이 파싱일 수 있으니 단계 분리 검증.

## 적용조건
- Windows PowerShell 5.1 + Claude Code 상태줄/훅 등 비-ASCII를 stdout으로 내보내는 PS 스크립트.
- PS7 또는 BOM 저장 시 파스 문제(1)는 완화되나, 출력 UTF-8 규칙(2)·실소비자 검증(3)은 동일 유지 권장.
- 일반 콘솔 출력(터미널이 CP949 렌더)과 혼동 주의 — 소비자가 UTF-8인지 먼저 확인.
