# 핸드오프 — VHK (byh3071/vhk, Vibe Harness Kit CLI)

별도 레포. 아래는 VHK 레포에서 실행할 goal/이슈 후보. 기존 배치1~3·goal66~70은 **확정·재작업 금지**(노션 핸드오프 참조), 아래는 이번 흡수의 **신규 연결분**이다.

핵심 관계: **VHK init과 요한MCP inject_core_rules는 둘 다 코어 배포 채널 → 중복.** core-ruleset.yaml을 단일 원본으로 두고 VHK는 자체 보유 말고 **상속만**. 안 그러면 3중 드리프트(VHK 사본↔core-ruleset↔글로벌).

---

## V1. init이 core-ruleset 상속 (자체 복붙 제거)
- 무엇: `vhk init`이 생성하는 RULES.md/.cursorrules에 코어 규칙을 자체 하드코딩하지 말고, `yohan-brain/memory/core/core-ruleset.yaml`을 읽어 렌더(또는 요한MCP `inject_core_rules` 호출). 마커블록으로 멱등.
- 근거: 배치1 RULES.md 4계층은 이미 계획. 이번 신규 = "코어를 어디서 가져오나"의 단일화.
- 채널: VHK ← core-ruleset 상속
- 우선순위: P1 · 노력: M
- 완료기준: init 산출물에 `<!-- CORE-RULES:START -->` 마커, core-ruleset 버전 표기, 사람작성분 보존 sync.
- 변환: VHK goal 71 「init core-ruleset 상속(자체 복붙 제거)」 / 이슈 「init: inherit core-ruleset.yaml via marker block」

## V2. secure에 LLM 가드레일 체크 추가 (PAT-001/002/004)
- 무엇: `vhk secure` 체크 항목에 LLM 앱 가드레일 추가 — ①닫힌집합 필드 allowlist 대조 유무(PAT-001) ②LLM JSON raw parse 여부(PAT-002) ③LLM 진입점 입력 클램프(PAT-004). OWASP LLM01/05/08과 매핑.
- 근거: goal68(secure↔OWASP) 확장. PAT 3종이 구체 체크 룰.
- 채널: VHK 레포자체(+PAT 참조)
- 우선순위: P1 · 노력: M
- 완료기준: secure가 위 3패턴 위반을 grep/AST로 탐지, 위반 시 PASS/FAIL + PAT 링크 출력.
- 변환: VHK goal 72 「secure: LLM 가드레일 체크(PAT-001/002/004 ↔ OWASP)」 / 이슈 「secure: add LLM guardrail checks」

## V3. check --evals에 LLM-judge 품질게이트 (PAT-007)
- 무엇: golden-set 정적대조(goal66, v0) 다음 단계로 LLM-judge 도입 시 PAT-007 3요소(수치임계+시도상한+폴백) 강제. 무한 재시도 금지.
- 근거: goal66 자연 확장. youtube-summary mainline(QUALITY_THRESHOLD=78·MAX_REGEN=3)이 검증된 모범.
- 채널: VHK 레포자체(+PAT 참조)
- 우선순위: P1 · 노력: M
- 완료기준: check --evals --judge 모드가 임계/상한/폴백 상수 노출, 골든셋 회귀 가드 통과.
- 변환: VHK goal 73 「check --evals LLM-judge(PAT-007)」 / 이슈 「check: LLM-judge quality gate」

## V4. evolve 교훈 → PAT 환류
- 무엇: `vhk evolve`(Reflection)가 수집한 실패/교훈을 `docs/patterns/PAT-NNN` 후보로 제안(범용기준 ①타프로젝트 ②반복 ③해결명확 충족분).
- 근거: evolve=Reflection 포지셔닝 + 글로벌 "교훈→패턴사전" 원천 연결.
- 채널: VHK 레포자체
- 우선순위: P2 · 노력: M
- 완료기준: evolve 출력에 "PAT 후보" 섹션(증상/원인/해결 초안).
- 변환: VHK goal 74 「evolve: 교훈→PAT 후보 제안」 / 이슈 「evolve: surface PAT candidates」

## V5. init/COMMANDS에 산출물분류·스택핀 반영 (PAT-005/006)
- 무엇: init이 생성하는 Design/프론트 가이드에 "샌드박스 산출물 한정 스택핀·localStorage 금지(PAT-005/006)" + "자체호스팅엔 적용 금지" 경계 명시. vibe-starter-kit과 공유.
- 근거: 디자인 렌즈 흡수. 오적용(자체호스팅에 샌드박스 규칙) 방지가 핵심.
- 채널: VHK ← core-ruleset + PAT
- 우선순위: P2 · 노력: S
- 완료기준: 템플릿에 환경경계 1문단 + PAT 링크.
- 변환: VHK goal 75 「init: 산출물 스택핀 환경경계(PAT-005/006)」

---

## 기존 확정분 (재작업 금지 — 참조만)
배치1(init RULES.md 4계층·3공식·gate 1문장·툴콜스케일링·COMMANDS 예시쌍) · 배치1-B(.cursorrules 6종) · 배치2 goal66(check --evals v0) · 배치3 goal67~70(remind·secure↔OWASP·evolve 부정예시·MCP옵트인). 위 V2/V3는 goal68/66의 **확장**이지 대체 아님.
