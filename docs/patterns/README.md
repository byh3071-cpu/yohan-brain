# 패턴 사전 (PAT) — 요한 생태계 범용 코딩 패턴

프로젝트 무관 재사용 패턴. 범용 기준 ①다른 프로젝트에서도 발생 ②반복 가능 ③해결책 명확.
출처 정본은 코드로 검증된 레퍼런스. **노션 패턴사전 DB 직접 주입 금지** — 파일만 생성, 노뚝이(노션)가 DB 등록.

| ID | 패턴 | 카테고리 | 핵심 |
|----|------|---------|------|
| [PAT-001](PAT-001-llm-field-allowlist.md) | 닫힌어휘 LLM 필드 allowlist 강제 | state | 프롬프트 제약 말고 코드가 허용값 대조 (환각 옵션 무단생성 차단) |
| [PAT-002](PAT-002-llm-json-3gate.md) | LLM JSON 3단 게이트 + 추출기 | state | extract→validate→reject. raw parse 금지 |
| [PAT-003](PAT-003-irreversible-automation-4safeguards.md) | 되돌릴수없는 자동화 4중 안전장치 | state | 한도·서킷·수동재개·에러분류 |
| [PAT-004](PAT-004-llm-entrypoint-input-clamp.md) | LLM 진입점 입력 클램프 | auth | 외부 트리거 = 신뢰경계. 범위·예산·빈도 코드강제 |
| [PAT-005](PAT-005-single-file-artifact-stack-pin.md) | 단일파일 산출물 스택핀+함정 | build | ★샌드박스 한정★ 자체호스팅엔 적용 금지 |
| [PAT-006](PAT-006-browser-storage-ban-sandbox.md) | 브라우저 스토리지 금지(샌드박스) | browser-api | ★샌드박스 한정★ 자체호스팅 웹앱 정상 |
| [PAT-007](PAT-007-llm-judge-quality-gate.md) | LLM-as-judge 품질게이트 3요소 | test | 임계+상한+폴백 (무한재시도 금지) |
| [PAT-008](PAT-008-multimachine-git-autosync.md) | 멀티머신 git 부팅 자동풀 | git | 전체fetch+다중clean-FF+외부config+자기배포(문법게이트). push 수동 |

> 채번: NNN = 기존 최대값+1(3자리, 없으면 001). 기존 `{카테고리}-{영문명}.md`는 개명 금지(append-only). 발견 출처: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석(2026-06-15).
