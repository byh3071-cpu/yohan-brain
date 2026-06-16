# 핸드오프 — Fable5 흡수 2차 세션 잔여 작업

> 작성: 2026-06-16 | 이전 세션: "Fable5 시스템 프롬프트 해부"  
> 완료된 것, 남은 것, 재진입 포인트를 빠짐없이 기록한다.

---

## 이번 세션에서 완료된 것 (재작업 금지)

| 항목 | 레포 | 커밋/PR |
|---|---|---|
| PAT-001 LLM allowlist (news-automation) | news-automation | bc33ea3 |
| 백테스트 태그 + PAT-003 레퍼런스 | yohan-dca-bot | 8c8d965 |
| WF2 면책 태그 | auto-trader | ce31d5b |
| Fable5 신규용어 7종 | yohan-ai-dictionary | ebe5046 |
| PAT-006 window.storage 상세 | yohan-brain | 3f43fdc |
| MCP2: get_context + core_rules_digest + available_tools | yohan-brain | 76b8f50 |
| goal71: vhk init CORE-RULES.md 마커블록 상속 | vhk | 9106ec1 |
| MCP1: get_core_ruleset + inject_core_rules 도구 | yohan-brain | 248fdda |
| YS1: yohan-studio .agents/CORE-RULES.md (PR #13 머지) | yohan-studio | merged |
| goal72: vhk secure PAT-001/002/004 LLM 가드레일 스캔 | vhk | 2aa4f08 |

---

## 남은 작업 — 우선순위 순

### 🔴 P1 — goal73: vhk check --evals LLM-judge (PAT-007)

**무엇**: `vhk check --evals --judge` 모드 — LLM-judge 품질게이트 PAT-007 강제
- 수치 임계(`QUALITY_THRESHOLD`), 시도 상한(`MAX_REGEN`), 폴백 강제
- 모범: youtube-summary `QUALITY_THRESHOLD=78·MAX_REGEN=3`

**선행 필요**: `goal66`(check --evals v0) 로컬 확인 필수
```bash
cd yohan-ecosystem/vhk && cat goals/66-*.md   # 로컬 확인
pnpm vhk check --evals                        # 현재 동작 확인
```

**완료 기준**: check --evals --judge 플래그가 임계/상한/폴백 상수 노출, 골든셋 회귀 통과
**레퍼런스**: `docs/handoffs/fable5-absorption/handoff-vhk.md` §V3, PAT-007

---

### 🔴 P1 — vhk gate CI 경고 원인 파악

**증상**: vhk PR push 시 `Required status check "gate" is expected` 경고 발생 (bypass됨)
```
remote: Bypassed rule violations for refs/heads/main:
remote:   - Required status check "gate" is expected.
```

**조치**: `.github/workflows/` CI 파일 확인 → gate job이 왜 bypass되는지 파악 → 실제 gate 실행되도록 수정 또는 문서화
```bash
cd vhk && cat .github/workflows/*.yml | grep -A5 "gate"
```

---

### 🟡 P2 — goal74: vhk evolve → PAT 후보 제안

**무엇**: `vhk evolve` 출력에 "PAT 후보" 섹션 추가 — 반복 실패/교훈을 패턴사전 후보로 제안
- 판단 기준: ①타 프로젝트 적용 가능 ②반복 발생 ③해결 명확

**완료 기준**: evolve 결과에 증상/원인/해결 초안 포함 PAT 후보 섹션
**레퍼런스**: `docs/handoffs/fable5-absorption/handoff-vhk.md` §V4

---

### 🟡 P2 — goal75: vhk init 산출물 스택핀 환경경계 (PAT-005/006)

**무엇**: init 템플릿에 "샌드박스 한정" 경계 명시
- localStorage 금지(PAT-006), 단일파일 스택핀(PAT-005)는 **샌드박스 전용** — 자체호스팅 오적용 방지
- 환경경계 1문단 + PAT 링크

**완료 기준**: 생성된 RULES.md에 환경경계 섹션 포함
**레퍼런스**: `docs/handoffs/fable5-absorption/handoff-vhk.md` §V5

---

### 🟡 P2 — vibe-starter-kit Claudeception 보일러플레이트

**무엇**: Artifact가 Anthropic API를 직접 호출하는 "Claudeception" 패턴 보일러플레이트
- `claude.ai/artifacts` sandbox에서 `window.storage` API 사용
- `yohan-brain/docs/terms/claudeception.md` 참조

**선행**: vibe-starter-kit 로컬 클론 필요 (`git clone`)
```bash
cd yohan-ecosystem && git clone https://github.com/byh3071-cpu/vibe-starter-kit
```

---

### 🟡 P2 — shotgrade #1, ai-router #1

**무엇**: 각 레포의 Fable5 흡수 이슈 (handoff-automation.md, handoff-infra-mcp.md 참조)

**선행**: 로컬 클론 필요
```bash
cd yohan-ecosystem
git clone https://github.com/byh3071-cpu/shotgrade
git clone https://github.com/byh3071-cpu/ai-router
```

**레퍼런스**: `docs/handoffs/fable5-absorption/handoff-automation.md`, `handoff-infra-mcp.md`

---

### 🟢 P3 — news-automation PAT-002 실제 적용

**증상**: `vhk secure` 스캔 결과 PAT-002 3건 감지 (briefing.py·indicator.py·main.py)
```
json.loads(content) — extract→validate 게이트 없음
```

**조치**: `extractJsonObject()` 래퍼 + 필수키 검증 추가 (PAT-002 정본 참조)
**레퍼런스**: `yohan-brain/docs/patterns/PAT-002-llm-json-3gate.md`

---

## 재진입 포인트

```bash
# 1. 현재 MCP 컨텍스트 로드
get_context()   # core_rules_digest + available_tools 포함 (MCP2)

# 2. goal73 시작 전 goal66 상태 확인
cd yohan-ecosystem/vhk
cat goals/66-*.md
pnpm vhk check --evals 2>&1 | head -20

# 3. gate CI 경고 확인
cat .github/workflows/*.yml | grep -B2 -A10 "gate\|check"
```

---

## 아키텍처 현황 (2026-06-16 기준)

```
core-ruleset.yaml (SoT)
├── MCP2: get_context → core_rules_digest 주입 (컴팩션 리마인더)
├── MCP1: inject_core_rules → {target}/.agents/CORE-RULES.md (마커블록)
├── vhk goal71: vhk init → .agents/CORE-RULES.md 자동 생성
└── YS1: yohan-studio .agents/CORE-RULES.md (수동 적용 완료)

vhk secure (확장됨)
├── 기존: 시크릿 유출 검사
└── goal72 신규: PAT-001/002/004 LLM 가드레일 휴리스틱 스캔

미구현:
├── goal73: LLM-judge 품질게이트 (PAT-007)
├── goal74: evolve → PAT 환류
└── goal75: init 환경경계
```

---

## 주의사항

- **yohan-studio 구형 stash**: 세션 중 2026-05-25 stash가 남아있어 충돌 발생. `git stash pop` 전 `git stash list` 확인 필수.
- **vhk gate bypass**: main 브랜치 push 시 CI gate 미충족 경고. 원인 파악 후 조치 필요.
- **goal66 선행**: goal73 시작 전 반드시 `goals/66-*.md` 읽고 현재 구현 상태 파악.
- **레포 클론 필요**: vibe-starter-kit, shotgrade, ai-router는 로컬에 없음.
