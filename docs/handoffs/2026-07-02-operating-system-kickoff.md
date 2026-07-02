# 핸드오프 2026-07-02 — 요한 운영체계 v0.1 킥오프 (노트북 → 집 PC 저녁 세션)

> 작성: 노트북 세션 (Claude Fable 5). 이 문서 하나로 집 PC 세션이 맥락 0에서 바로 이어받는 것이 목적.
> 정본 참조: [`docs/OPERATING-SYSTEM-v0.1.md`](../OPERATING-SYSTEM-v0.1.md) (master `3a3fc5b`, 전 결정란 확정)

---

## 0. 전달 프롬프트 (집 PC 새 Claude 세션에 그대로 붙여넣기)

```
집 PC 저녁 세션 시작. C:\Users\Public\dev\yohan-ecosystem\yohan-brain\docs\handoffs\2026-07-02-operating-system-kickoff.md 를 읽고 이어서 작업해줘.

오늘 목표 = §6 "집 PC 할일" 1~5번 순서대로 (6번 WSL2+tmux는 시간·체력 남으면).
시작 전 확인 2개: ① vhk·yohan-brain 이 최신인지 (auto-pull 안 돌았으면 git pull) ② 운영체계 정본 docs/OPERATING-SYSTEM-v0.1.md §0 확정 결정 훑기.

주의: §8 함정 목록 준수 — 특히 yohan-brain 기본 브랜치는 master(main 아님·main 은 오늘 삭제됨), vhk 는 main. silent fallback 금지·측정 먼저·완료 주장 대신 증거. 막히면 blockers 기록하고 다음 항목으로.
```

---

## 1. 왜 시작했나 (배경 — 오늘 아침의 흐름)

1. 백요한이 GitHub 37개 레포 + 노션 전체 파악 → 우선순위 보고를 요청.
2. 1차 보고(콘텐츠 루프 P0)에 피드백: **"코드·개발 중점으로, 역질문으로 끄집어내달라"** → 역질문 4개(병목 순간·밤샘 걱정·문서 낡음·멀티도구 의미).
3. 답변에서 실병목 4개가 구체적 사건과 함께 드러남:
   - **검수가 최대 병목** — AI 산출물 불신(할루시네이션·보안·스파게티), 검수는 필수.
   - **밤샘 멈춤 실사건** — 7/1 새벽 vhk 자동 Goal 루프를 돌려놓고 잤는데 멈춰 있었음(원인 미상, "툴 호출 관련" 추정).
   - **낡은 문서 회수 사건** — "노션 파악해줘" 하면 이미 끝난 일(VHK G1)이 P0 로 보고됨.
   - **멀티도구 규칙 분열** — Claude Code Max x20(메인) + Cursor Pro + Codex Plus(보조)인데 CLAUDE.md/AGENTS.md/.cursorrules 가 따로 놀고, 메인 도구 교체 시 무너질 구조.
4. 1차 수렴(밤샘 디버깅 단독)이 **편향**이라는 백요한 지적 → 4답을 동등하게 **4트랙 운영체계**로 재구성.
5. 백요한 선언: **"AI 가 일하기 좋은 구조·나 없이도 돌아가는 시스템 > 제품개발·수익화"** — 6/30 노션 닻 문서("다 짓지 말고 한 바퀴부터")를 공식 개정. "너가 다 해주는 게 아니라 내 생각과 의도가 담긴 시스템"이 조건 → 결정란 방식 채택.

## 2. 무엇을 결정했나 (전 결정 — 상세는 정본 문서)

| ID | 결정 | 비고 |
|---|---|---|
| R0 | 6/30 닻 공식 개정 — 평일=운영체계, 주말=콘텐츠 루프 | 노션 원문에 개정 콜아웃 반영 완료 |
| R1 | 트랙 순서 **A신뢰 → B규칙 → C지식 → D지휘** | |
| R2 | 트랙 A 첫 조각 = 멈춤 수사 + `vhk watch`(수준 2) · 수준 3 은 "같은 원인 3회+무해 문서화" 케이스만 화이트리스트 승격 | 구현 완료 #441 |
| 채널 | 사람 알림=텔레그램(brain 봇 겸용 확정·개통 테스트 성공), 에이전트 공간=디스코드, 슬랙 도입 안 함, 헤르메스·오픈코드는 트랙 D 때 평가 | |
| A-1 | 검수 = 증거 패키지 3종(receipt+diff 요약+실행 증거) 고정 | 추천안 수용 |
| A-2 | receipt T2 는 watch 1주 관찰 후 | 〃 |
| B-1 | 전역 규칙 SSoT = yohan-brain core-ruleset (cc-skills 는 배포 채널) | 〃 |
| B-2 | 합류 = 전역 규칙을 각 레포 RULES.md 에 마커 섹션 주입 → 기존 `vhk sync` 가 8개 도구 파일 컴파일 (vhk 무수정) | 〃 — 다음 세션 파일럿 |
| B-3 | 우선순위: 레포 > 전역, 단 soul.yaml guardrails 는 절대 | 〃 |
| B-4 | 전파 = 드리프트 감지·안내까지 자동, 쓰기는 사람 승인 | 〃 |
| B-5 | 분기 1회 "코덱스 단독 리허설"로 교체 내성 실증 | 〃 |
| C-1 | ADR-006 개정은 이행 실적 후 (소망 선행 금지) | 〃 |
| C-2 | 이행 1단계 = **decisions 는 brain 에 먼저 쓰고 노션 push** | 〃 — 오늘부터 실천 |
| C-3 | 신선도 = `verified: 날짜+커밋` 스탬프, 14일 초과 회수 시 코드·깃 대조 후 인용, 삭제는 사람만 | 〃 |
| C-4 | 벡터(control-tower 인제스트)는 실질의 쌓인 뒤 하이브리드+측정으로 재개 | 재확인 |
| R5 | 지휘 = 분배(mission)→실행(tmux/worktree)→수거(증거 패키지)→판정(사람) | 방향 동의 |

**원칙 5개** (사건에서 추출, 정본 §1): ① silent fallback 금지 ② 무인 가동 진행신호 의무 ③ 완료/멈춤 정직 알림 ④ 측정 먼저 ⑤ 낡은 기록 회수 시 검증.

## 3. 무엇을 만들었나 (산출물)

| 산출물 | 위치 | 상태 |
|---|---|---|
| `vhk watch` — 무인 세션 정지 감시 (TDD 11 tests·CI 전 green·`--once` 실기동 검증) | vhk main `68ea30c` (#441) | ✅ 머지 |
| 운영체계 v0.1 설계 문서 (결정란 전부 확정) | brain master `3a3fc5b` (#15) | ✅ 머지 |
| 6/30 닻 문서 개정 콜아웃 | 노션 페이지 상단 | ✅ 반영 — C-3 "낡은 결정 처리" 1호 적용 |
| v2.9.0 릴리즈 준비 (package.json+CHANGELOG) | vhk PR #442 | 🔶 CI 대기 → 머지·태그는 노트북 세션이 처리 예정 |
| 텔레그램 채널 개통 | 노트북 사용자 env `VHK_TG_TOKEN`·`VHK_TG_CHAT_ID` (brain 봇 재사용) | ✅ 실발송 테스트 성공 |
| brain 잔존 main 브랜치 삭제 | origin/main 삭제됨 | ✅ (고유 커밋 = 문서 1개뿐, master 재반영 확인 후) |
| 성공 기록 | `vhk win` s1 (노트북 로컬 memory) | ✅ |
| 딥리서치 리포트 | 정본 문서 §8 요약 반영 (원본: 노트북 세션 tasks/w0095u6tq) | ✅ 23주장 3-0 검증 |

## 4. 무엇을 발견·규명했나

1. **밤샘 멈춤 사건 계보 (7/1)**: 01:21 커밋 후 overnight-autoloop 가동 → **Workflow `args` 하네스 직렬화 버그로 스크립트에 args 미전달 → 조용히 기본 레포로 폴백 → 2회 오실행**(부산물: yohan-mcp #18·19, control-tower #14~17 — 열려 있음, 사람 머지 대기) → 8.5h 무감지 → 09:54 사람 발각 → 하드코딩으로 3회차 성공(#432·#433). 기록: vhk `docs/log/2026-07-01-win-reinforce-overnight.md`. **"멈춘 정확한 순간"은 집 PC 세션 로그에만 있음 — §6-3.**
2. **신규 용의자**: Claude Code 공식 — Stop hook 이 8회 연속 차단되면 override 후 세션 종료. /goal 무인 실행 메커니즘과 함께 확인 필요.
3. **TS-005 확장**: 노트북(Node v24.13.0)에서 rmSync 가 파일·디렉토리 모두 silent exit 127 — vitest 워커 즉사로 이 머신에서 vhk 스위트 실행 불가였던 근본 원인. 우회 = unlink+rmdir 재귀. 집 PC 도 동일한지 §6-4 에서 확인 가치.
4. **brain main/master 드리프트**: 노트북 클론이 master 단일 fetch 설정이라 main 존재를 몰랐고, 문서 PR 을 main 에 머지하는 실수 → master 재반영(#15)으로 정정, main 삭제, refspec 정상화. 교훈 = PR base 는 `gh repo view --json defaultBranchRef` 로 확인.
5. **아침 조사의 정정**: "yohan-brain 4일 멈춤"은 오보 가능성 — master 만 본 조사였음. 별자리 2D 그래프뷰 등 최근 작업 존재.
6. **긍정 발견**: vhk sync 는 업계 주류 패턴(Ruler 2.8k★)과 동형 구조였음. 생태계는 AGENTS.md 로 수렴 중(.cursorrules 사망) — B-2 파일럿 후 원본 포맷 재평가 항목.

## 5. 최종 목표 (북극성)

**"믿고 맡길 수 있는 무인 가동"** — 백요한이 안 끼어도 되는 지점을 계속 늘리는 것.
- 신뢰(A): AI 가 "됐다"고 하면 증거가 따라오고, 밤새 돌다 서면 폰이 운다.
- 규칙(B): 어느 도구(Claude·Codex·Cursor·미래 도구)를 열어도 같은 헌법·같은 규칙. 메인 교체에도 안 무너짐.
- 지식(C): 기억의 정본은 brain(git), 노션은 사람용 뷰. 낡은 기록은 회수 시 걸러짐.
- 지휘(D): 그 위에서 멀티세션·멀티에이전트를 한 사람이 지휘.
이 체계 안에서 제품(주말 콘텐츠 루프 → 스튜디오 → 수익화)이 굴러가는 것이 최종 그림.

## 6. 집 PC 할일 (오늘 저녁, 순서대로)

### 1) 동기화 확인 (5분)
```powershell
# auto-pull 이 이미 했을 수 있음 — 확인만
cd C:\Users\Public\dev\yohan-ecosystem\vhk ; git checkout main ; git pull
cd C:\Users\Public\dev\yohan-ecosystem\yohan-brain ; git checkout master ; git pull
```
- vhk main 에 `68ea30c`(watch) + v2.9.0 릴리즈 커밋(#442, 노트북에서 머지 예정)이 있는지 확인.

### 2) vhk 2.9.0 npm 발행 (사람 전용, 5분)
```powershell
cd C:\Users\Public\dev\yohan-ecosystem\vhk   # 반드시 main 에서 (가드 #119)
pnpm build ; pnpm vitest run --pool=threads  # 스위트 확인 (집 PC 에서 정상 돌면 그대로)
npm publish --ignore-scripts                  # 2FA 보안키 — 실터미널에서만, Claude `!` 불가
```
- 발행 후 `npm view @byh3071/vhk version` = 2.9.0 확인.

### 3) 멈춤 순간 로그 확정 (Claude 에게 위임, ~30분) ← 핵심
- 대상: 7/1 01:21~09:54 사이 vhk 프로젝트 세션 로그.
```
~/.claude/projects/C--Users-Public-dev-yohan-ecosystem-vhk/ 에서 7/1 새벽 mtime 의 *.jsonl 찾기
→ 마지막 3~5 이벤트 tail 로 확인: 마지막이 무엇으로 끝났나
  (a) tool_use 후 결과 없음 → 어느 도구? (Workflow? 권한 프롬프트 대기?)
  (b) stop_hook 이벤트 연속 → Stop hook 8연속 차단 종료 가설 확정
  (c) API 에러 → 재시도 없이 종료?
```
- 판정 결과를 운영체계 문서 §3 A-3(수준 3 화이트리스트)의 근거로 기록 — brain 에 decision 파일 추가(C-2 실천: brain 먼저, 노션 push).

### 4) overnight-autoloop fail-fast 정식화 (Claude 위임, ~1h)
- 정본 위치 확인: 노트북엔 없었음 — 집 PC 의 `~/.claude/skills/` 또는 scratchpad 사본. `grep -r "overnight-autoloop" ~/.claude` 로 수색.
- 패치: 스크립트 시작부에 **REPOS/SCOPE/CAP 미수신 시 즉사 + 명시 에러** (silent fallback 금지 원칙 1호 적용). 하드코딩 임시방편을 정식 파라미터 검증으로.
- 가능하면 vhk 레포에 정본으로 승격(스킬 or docs) — 재발 방지의 완결.

### 5) 텔레그램 env + watch 가동 테스트 (10분)
```powershell
# brain .env 에서 복사 (값 화면 노출 없음) — 노트북에서 쓴 스크립트 로직:
$e = Get-Content 'C:\Users\Public\dev\yohan-ecosystem\yohan-brain\.env'
$t = ($e | Select-String '^TELEGRAM_BOT_TOKEN=(.+)$').Matches[0].Groups[1].Value.Trim('"')
$c = ($e | Select-String '^TELEGRAM_CHAT_ID=(.+)$').Matches[0].Groups[1].Value.Trim('"')
setx VHK_TG_TOKEN $t | Out-Null ; setx VHK_TG_CHAT_ID $c | Out-Null
# 새 터미널에서:
vhk watch --once     # 활성 세션 보이는지
```
- 이후 밤샘 루프 돌릴 땐 별도 터미널에 `vhk watch` 상주.

### 6) (선택) WSL2 + tmux 셋업 — "길 2"
- 노션 가이드 그대로: [2026-07-01] WSL2+tmux 세팅 가이드 → wsl --install → nvm+claude-code+gh+tmux → 활성 레포만 ~/dev 에 선별 clone.
- 하이브리드 원칙: WSL=작업장, 윈도우 C:\Users\Public\dev=auto-pull 미러(읽기 전용 취급), boot-auto-pull-setup 개발은 윈도우 유지.
- 평가 후보: workmux(1.7k★, tmux+worktree+에이전트 대시보드 — 딥리서치 발견).

## 7. 그 다음 큐 (내일~주말)

| 슬롯 | 작업 |
|---|---|
| 다음 개발 세션 | **B-2 파일럿**: inject_core_rules → 레포 RULES.md 전역 마커 섹션 주입 → vhk sync 8파일 컴파일 확인 (1개 레포, vhk 또는 brain) |
| 다음 개발 세션 | vhk 선재버그: evolve 한글 서브별칭 CLI 차단 (cli-args.ts:255·command-registry.ts:23 — 핸드오프 docs/log/2026-07-01-followup-handoff.md) |
| 짬 | 밤샘 부산물 6 PR 처리(yohan-mcp #18·19 / control-tower #14~17 — 로컬 검증 완료 상태, 사람 머지만) · vhk Recall@5 대화형 라벨링 |
| 주말 | 콘텐츠 루프 1바퀴: SnapContext 0.2.0 블로그(95%) → 스튜디오 MDX → 플랫폼 1~2개 → 역유입 |
| 그 후 | receipt T2(watch 1주 관찰 후) · C-3 신선도 스탬프 파일럿 · Stripe live 키 교체(사람) |

## 8. 함정 목록 (주의사항)

1. **yohan-brain 기본 브랜치 = master** (main 은 2026-07-02 삭제됨). vhk = main. PR base 는 `gh repo view --json defaultBranchRef -q .defaultBranchRef.name` 으로 확인.
2. **rmSync 금지** (TS-005 확장): 노트북에서 파일·디렉토리 모두 silent exit 127. 테스트 cleanup 은 unlink+rmdir 재귀(`vhk tests/watch.test.ts` `rmTree()`). 집 PC 재현 여부는 §6 에서 확인.
3. **Workflow args 하네스 버그**: JSON 문자열/객체 어느 쪽도 스크립트에 미전달된 사례(7/1) — 워크플로 스크립트는 args 의존 대신 검증+즉사, 중요 파라미터는 스크립트 본문 확인.
4. **vhk `goal next`/`work` 가 docs/state/next-task.md 를 덮어씀** — 수동 편집 직후 실행 주의.
5. **PS 5.1/bash 인계 함정**: bash 에서 powershell -Command 로 `$변수` 넘기면 bash 가 먼저 삼킴 — 스크립트 파일(.ps1)로 우회. 한글 포함 .ps1 은 BOM 문제 — ASCII 로 작성.
6. **publish 는 main 에서만 + 사용자 실터미널 2FA** (Claude `!`·`--otp` 불가).
7. 노션 문서 기반 계획 전 **코드·깃 상태 대조** (원칙 ⑤ — 오늘 "VHK G1 오보고" 재발 방지).

---
- verified: 2026-07-02 (vhk `68ea30c`+PR#442 · brain master `3a3fc5b` 기준)
