# 핸드오프 — 프론트/웹 도메인

핵심 경계: **샌드박스 산출물(아티팩트/canvas)** vs **자체호스팅 웹앱(Next.js/Vite)**. PAT-005/006(스택핀·localStorage 금지)은 ★샌드박스 한정★ — 아래 자체호스팅 레포엔 적용 금지(가장 흔한 오적용).

---

## shotgrade (에스프레소 채점, Next.js + Claude Vision + Supabase)

### S1. LLM JSON 3단게이트 master 머지 (PAT-002) ★검증으로 발견
- 무엇: `lib/analyze.ts`의 `extractJsonObject`(가장바깥 {} 슬라이스 + try-catch 폴백)가 **feedback-correction 브랜치에만** 있음. master는 `stripCodeFence`+`parseAnalysisJson`만(fallback 없이 JSON.parse 직접) → 펜스/서론에 깨질 위험.
- 근거: ✅코드확인 — 3단게이트 완성본이 미머지.
- 채널: 레포자체(PAT-002)
- 우선순위: P1 · 노력: S
- 완료기준: feedback-correction의 3함수 master 머지, Vision JSON 수신부 전부 경유.
- 변환: 이슈 「analyze.ts 3단 JSON 게이트 master 머지(PAT-002)」

### S2. 이미지 입력 정규화 + Vision 결정론 프롬프트
- 무엇: Vision 입력 이미지 정규화(크기·포맷), 등급 판정 프롬프트 결정론화.
- 채널: 레포자체 / core-ruleset(api_input_validation)
- 우선순위: P2 · 노력: M
- 변환: 이슈 「Vision 입력 정규화 + 결정론 등급 프롬프트」

> 주의: shotgrade는 자체호스팅 → localStorage 정상. PAT-006 적용 금지.

---

## yohan-studio (1인 풀스택, Next.js, 블로그+포폴+스토어)

### YS1. core 상속 + 프론트 특화 유지
- 무엇: 코어(non_negotiable·코딩규율) 상속. 레포특화는 유지: Tailwind v4 CSS-first 토큰(@theme)·다크모드 FOUC 방지·페이즈 보호(007~010 신규경로만).
- 채널: core 상속(inherit) + 레포자체(특화)
- 우선순위: P1 · 노력: M
- 완료기준: `.agents/CORE-RULES.md` 마커블록 상속 + 기존 특화 규칙 마커 밖 보존.
- 변환: 이슈 「core-ruleset 상속(마커) + 프론트 특화 보존」

---

## mova (보이스 AI 랜딩 생성기)

### M1. core 상속 — 단, 소스에서
- 무엇: NEVER 12항 가드레일 + Show-don't-tell 라우터 사상은 core/글로벌과 합치. **주의: 규칙 파일이 vhk sync 자동생성** → 산출물 직접편집 금지, VHK 소스에서.
- 채널: core 상속(VHK sync 경유)
- 우선순위: P2 · 노력: S
- 완료기준: vhk sync가 core-ruleset 상속분을 mova에 반영.
- 변환: 이슈 「mova: core 상속(vhk sync 경유, 산출물 직접편집 금지)」

---

## notion-uiux (노션 UI/UX, HTML)

### NU1. 단일HTML 패턴 (자체호스팅 임베드)
- 무엇: 단일HTML + cdnjs + CSS Variables 테마 + Notion API 프록시·KST 타임존 강제.
- 주의: **자체호스팅 임베드** → localStorage 정상 사용(PAT-006 적용 금지). 빌드 있으면 PAT-005도 비적용.
- 채널: core 상속(코딩규율만) + 레포자체
- 우선순위: P2 · 노력: S
- 변환: 이슈 「Notion API 프록시·KST 강제 정리 + core 코딩규율 상속」
