# Fable 5 흡수 — 레포별 핸드오프 백로그

출처: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석(2026-06-15, 결정로그 `memory/decisions/2026-06-15-1212-fable5-absorption-pat-core-ruleset.md`).
원천 자산: `docs/patterns/PAT-001~007`, `memory/core/core-ruleset.yaml`.

이 폴더는 **등록 가능한 핸드오프**다. 각 항목은 그대로 GitHub 이슈 / VHK goal / 노션 백로그로 변환할 수 있게 `변환:` 줄을 포함한다.

## 등록 변환 가이드
- **GitHub 이슈**: `변환:` 줄의 제목 + 본문(무엇·근거·완료기준)을 `gh issue create -R <repo>`로. (외부·되돌림 비용 → 사람 확인 후)
- **VHK goal**: VHK 레포 `goals/NN-{slug}.md` frontmatter. 한 PR = 한 goal. 다음 빈 id = 71(노션 기준 67~70 백로그 다음).
- **노션**: 노뚝이(노션 AI)가 백로그/DB 등록. 패턴사전 DB는 PAT 파일을 노뚝이가 등록(직접 주입 금지).

## 핵심 사상
**core-ruleset.yaml = 단일 원본 → N레포 상속**. 대부분 레포는 `inherit_core=true`(코어 상속만, 레포 신규규칙 0). `inherit_core=false`인 레포만 특화 항목이 있다.

## 우선순위 한눈에 (검증된 것만)
| # | 레포 | 항목 | P | 노력 | 검증 |
|---|---|---|---|---|---|
| 1 | yohan-mcp | get_core_ruleset/inject_core_rules + get_context core_digest | P0 | L | 설계완료(구현 대기) |
| 2 | news-automation | 닫힌어휘 allowlist 역이식(PAT-001) | P0 | S | ✅코드확인(indicator.py·main.py allowlist 부재) |
| 3 | shotgrade | 3단게이트(PAT-002) master 머지 | P1 | S | ✅코드확인(feedback-correction 브랜치에만) |
| 4 | VHK | secure에 LLM 가드레일 항목(PAT-001/002/004) | P1 | M | 기존 goal68 확장 |
| 5 | VHK | init이 core-ruleset 상속 | P1 | M | 신규 |
| 6 | auto-trader | §23 면책 → WF2 JSON 텔레그램 노드(264-267) | P1 | S | ✅코드확인(n8n JSON·LLM 0건) |
| 7 | yohan-ai-dictionary | Fable5 신규용어 5종 항목화 | P1 | M | 신규 |
| 8 | VHK | check --evals에 PAT-007 LLM-judge | P1 | M | 기존 goal66 확장 |
| 9 | dca-bot | 면책(공개배포만)+확신어금지+백테스트 태그 | P1 | S | ✅4중안전 이미 실재 |
| 10 | vibe-starter-kit | core 상속 한 줄 + llm-json 보일러 + Design 골격 | P1 | M | 신규 |

## 도메인별 핸드오프
- [handoff-vhk.md](handoff-vhk.md) — VHK 커맨드별 + goal 71~ 후보
- [handoff-automation.md](handoff-automation.md) — news-automation · auto-trader · yohan-dca-bot · youtube-summary
- [handoff-frontend.md](handoff-frontend.md) — yohan-studio · mova · shotgrade · notion-uiux
- [handoff-infra-mcp.md](handoff-infra-mcp.md) — ai-router · yohan-ai-dictionary · yohan-mcp · snapcontext · changeopradar · vibe-starter-kit

## 토이/기타 — 코어상속만 (특화 0, 등록 불필요)
dopamine-runner · flexible-world · yohan-profile-card · idea-bank · game1 · pixel-payday · bizfund · fakenuri · vibenotepad · what-leftover · mazinpro.
예외(1줄 작업): three 3D 토이 → PAT-005(스택핀) · hamster-damagochi·haruchi-game(Notion 동기화) → 동기화 구간 테스트 · snapcontext-worker(CF Worker) → 프로토콜 통합 테스트.

## 정직 주의
- 유출본 진위 검증불가 → 설계사상만, 원문복사 금지.
- §23 투자면책: 1인 자가용 봇은 확신어금지+백테스트 태그만, **법적 footer는 공개배포 시점 한정**.
- three r128 함정(PAT-005)은 유출 진술 → 적용 전 실동작 확인.
- 미검증 항목엔 `[미확인]` 표기. 적용 전 해당 코드 확인 선행.
