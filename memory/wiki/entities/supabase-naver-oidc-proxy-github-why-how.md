---
id: supabase-naver-oidc-proxy-github-why-how
type: entity
entity_type: tool
created: 2026-05-18
updated: 2026-06-07
source_insights: [supabase-naver-oidc-proxy-github-why-how]
related_entities: []
related_concepts: [single-source-of-truth]
---
# supabase-naver-oidc-proxy — 왜 쓰는지 · 어떻게 쓰는지

## 정의 (1~2문장)

- Supabase Auth가 기대하는 OIDC `userinfo` 형식과 Naver API 응답(`response` 래핑) 차이를 **Edge Function 프록시**로 맞춰, Custom Provider 로그인 실패를 줄이는 오픈소스 레포다.
- 백엔드 전체를 교체하지 않고 **한국 SNS 로그인(Naver)** 만 Supabase에 붙일 때 쓰는 **중간 어댑터**로 이해하면 된다.

## Verified (소스 기반)
- **GitHub:** [sapsaldog/supabase-naver-oidc-proxy](https://github.com/sapsaldog/supabase-naver-oidc-proxy) [source: supabase-naver-oidc-proxy-github-why-how]
- **README 인제스트:** `memory/ingest/url/url-3d22403c3d5a828b.md` — Naver 앱 설정·Supabase Custom Provider 필드·트러블슈팅 상세는 여기 기준으로 본다. [source: supabase-naver-oidc-proxy-github-why-how]
- Supabase Auth가 기대하는 OIDC `userinfo` 형식과 Naver 응답 포맷 차이를, Supabase Edge Function 프록시로 중간 변환해 로그인 실패를 줄이는 레포다. [source: supabase-naver-oidc-proxy-github-why-how]
- Supabase는 표준 OIDC 모양의 사용자 정보를 기대하는데, Naver는 응답을 `response` 안에 감싸서 준다. 이 레포는 그 포장을 벗겨 Supabase가 이해하는 형태로 다시 전달한다. [source: supabase-naver-oidc-proxy-github-why-how]
- **내 일:** 한국 사용자 로그인에서 Naver를 붙여야 하는데 Supabase Custom Provider가 바로 동작하지 않을 때, 백엔드 전체를 갈아엎기보다 Edge Function 하나로 우회해 인증 플로우를 맞출 수 있다. [source: supabase-naver-oidc-proxy-github-why-how]
- 배포 환경에서 `--no-verify-jwt`를 쓰는 구성과 스코프(`profile`만) 제약이 보안·운영 정책과 어떻게 충돌하지 않는지, 실제 서비스 기준 점검 항목을 따로 정리할 필요가 있다. [source: supabase-naver-oidc-proxy-github-why-how]

## Inferred (추론/연결) — TTL 30일

- Yohan OS 본체는 로컬·1인 운영이라 당장 필수는 아니지만, **한국 사용자-facing 앱**을 Supabase로 만들 때 북마크할 **인증 우회 패턴**으로 보관한다.
- Edge Function 프록시는 MCP·SoT와 무관한 **앱 레이어** 도구 — wiki에 두는 이유는 “같은 문제 재발 시 검색”용이다.
- created: 2026-06-07, expires: 2026-07-07

## Owner Notes

- 실제 서비스에 붙이기 전 `--no-verify-jwt`·스코프 제한은 보안 체크리스트로 따로 검토할 것.

## 관련 소스
- [supabase-naver-oidc-proxy-github-why-how](../../ingest/insights/supabase-naver-oidc-proxy-github-why-how.md)
