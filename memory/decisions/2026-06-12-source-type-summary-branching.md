---
id: 2026-06-12-source-type-summary-branching
date: 2026-06-12
tags: [protocol, summary, telegram, ingest, knowledge-management]
related: [source-to-summary-protocol, telegram-workflow, 2026-06-12-knowledge-loop-local]
status: decided
---

# 원문→요약 프로토콜에 입력 타입별 분기 확장 (텔레그램 인제스트 기준)

## 결정

- `source-to-summary-protocol.md`의 "입력 타입별 분기"를 9개 타입(텍스트·이미지·아티클·GitHub·YouTube·네이버 블로그·SNS·기타 영상·RSS)별 **원문 확보 방법 + 실패 폴백 + RESOURCE/SUMMARY 특칙**으로 확장.
- **공통 대원칙 신설: 확보된 원문 텍스트에서만 요약** — 링크 제목·썸네일 기반 추측 요약 금지. 원문 확보 실패 = 요약 보류 → `automation-review.md` 큐.
- 자동 추출 불가 소스 구분 명시: 네이버 블로그(iframe → Readability 실패), Threads·X·인스타(로그인 장벽), 유튜브 외 영상(자막 도구 없음) → **캡처 시점에 본문 복붙/스크린샷 동봉**이 사람 쪽 1규칙.
- 블로그·SNS 포스트는 "외부에서 사라질 수 있는 원문"으로 간주 → 확보 본문 전문 보존 (Step 1 예외 조항 적용).
- GitHub은 표준 요약 구조 대신 why-how 카드 구조, 영상 메모 기반 요약은 `source_basis: memo`로 자막 기반과 신뢰도 구분.
- `telegram-workflow.md`에서 타입별 요약 규칙의 단일 SoT로 링크.

## 근거

- 사용자 요청(2026-06-12): 텔레그램으로 들어오는 링크·이미지·글·영상이 인제스트→요약될 때 노션 원문→요약 프로토콜 기반으로 타입별 절차가 필요.
- 코드 실측: `ingest_url`은 아티클(Readability)·YouTube(자막)만 자동, GitHub은 batch why-how 카드, 네이버 블로그·SNS·기타 영상은 자동 추출 불가 — 규칙 없이는 "링크만 와서 요약 못 하는" 블록이 review 없이 유실됨.

## 검증

- 프로토콜 §입력 타입별 분기 표 9행 + 특칙 + 캡처 규칙 1줄로 정리, KNOWLEDGE-LOOP 불변 경계와 충돌 없음 (원본 보존·inbox 비우기 유지).
