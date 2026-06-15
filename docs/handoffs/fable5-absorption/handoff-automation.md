# 핸드오프 — 자동화/봇 도메인

가장 흡수가치 큰 도메인. 한 생태계 안에 **정본(dca-bot)·최악(news-automation)·결정론(auto-trader)**이 공존. 코드 검증 완료.

---

## news-automation (RSS→OpenAI→Notion, Python, GitHub Actions)

### N1. 닫힌어휘 allowlist 역이식 (PAT-001) ★최고가치
- 무엇: LLM이 뱉는 분류값을 코드에서 화이트리스트 대조 후 Notion 기입. 미매칭은 폴백 상수로(새 옵션 자동생성 차단).
  - `indicator.py:185-189` "영향 섹터" multi_select → `ALLOWED_SECTORS` 필터
  - `main.py:111-113`·`160-162` "기사 카테고리" select → `ALLOWED_CATEGORIES` 필터
- 근거: ✅코드확인 — 양쪽 다 `json.loads` 후 allowlist 없이 raw 기입. Notion이 미존재 name을 새 옵션으로 자동 생성 → 환각값 고착.
- 채널: 레포자체(PAT-001 적용)
- 우선순위: P0 · 노력: S
- 완료기준: 두 필드에 allowlist 상수 + 미매칭 드롭/폴백, 프롬프트 보기목록을 상수에서 생성(단일 SoT).
- 변환: 이슈 「indicator.py·main.py: LLM 분류값 allowlist 강제(환각 옵션 차단)」

### N2. LLM JSON 2차 방어선 (PAT-002)
- 무엇: 현재 OpenAI `response_format: json_object` 사용(1차 OK)이나, 추출기+필수키 검증 2차 방어 추가.
- 근거: provider 교체·모델 변경 대비.
- 우선순위: P2 · 노력: S
- 변환: 이슈 「llm-json 추출기 2차 방어선 도입(PAT-002)」

---

## auto-trader (n8n + Supabase + Telegram, KR→US→Crypto)

### A1. §23 면책 → WF2 텔레그램 노드
- 무엇: 투자 신호 알림에 면책/확신어 금지 적용. **Python 코드 아님** → `Autotreder WF2_시그널_알림.json`의 Code 노드(라인 264-267, 메시지 생성부)에서.
- 근거: ✅코드확인 — Python 0줄, n8n JSON 2개, **LLM/AI 노드 0건**(결정론 정본 → 가드레일 제외 정당).
- 채널: 레포자체(core-ruleset finance_disclaimer 참조)
- 우선순위: P1 · 노력: S
- 완료기준: WF2 메시지에 확신어 금지(조건-사실형) + 백테스트 "과거성과" 태그. 법적 footer는 공개배포 시점만.
- 변환: 이슈 「WF2 텔레그램 메시지: 확신어 금지·백테스트 태그(§23)」

---

## yohan-dca-bot (바이낸스 트레이딩 봇, Python)

### D1. 면책·확신어 (4중안전은 이미 정본)
- 무엇: 4중 안전장치(`src/risk/lockout.py`)는 ✅코드+테스트 실재 → **변경 없음, PAT-003 레퍼런스 정본**. 추가 작업은 알림 텍스트만: 확신어 0(이미 깨끗)·백테스트 "과거성과" 태그. 법적 footer는 공개배포 시점 한정(1인 자가용엔 생략).
- 채널: 레포자체
- 우선순위: P1 · 노력: S
- 완료기준: telegram.py 알림에 백테스트 태그, README에 "위험 통제=lockout.py(PAT-003 정본)" 1줄.
- 변환: 이슈 「알림 백테스트 태그 + README PAT-003 레퍼런스 명시」

### D2. lockout.py를 PAT-003 정본으로 문서화
- 무엇: 4중안전 구현을 PAT-003 출처프로젝트로 이미 기록함(yohan-brain). dca-bot README/주석에 역링크만.
- 우선순위: P2 · 노력: S

---

## youtube-summary (유튜브 요약, TS, Next.js)

### Y1. 이미 모범 — 보일러플레이트 출처화
- 무엇: `src/lib/llm-json.ts`(✅mainline) = PAT-002 모범. `summarize.ts` QUALITY_THRESHOLD=78·MAX_REGEN=3·CAP=50(✅mainline) = PAT-004/007 모범. 변경 없음. vibe-starter-kit 보일러플레이트의 **출처**로 지정.
- 채널: (출처 제공) → vibeinit
- 우선순위: P2 · 노력: S
- 완료기준: vibe-starter-kit `lib/llm-json.{ts,py}`가 이 구현 참조.
- 변환: 이슈(vibe-starter-kit) 「llm-json 보일러: youtube-summary src/lib/llm-json.ts 기반」

### Y2. 특화(요한브레인 참고용)
failure-kind 분류(auth vs unavailable)·중층 레이트리밋·RLS user_id 강제 = 엔터프라이즈급 특화. 코어 아님, 운영 참고만.
