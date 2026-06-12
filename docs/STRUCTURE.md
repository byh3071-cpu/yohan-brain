# 요한 브레인 (구 Yohan OS) — 폴더·파일 구조 스냅샷

> 스냅샷 일자: 2026-05-15 · 기준: git 트래킹 파일 (node_modules·dist 제외, 총 **508개**)
> 명칭 현행화 (2026-06-12): 이 레포 = **요한 브레인**; "요한 OS"는 별도 베어메탈 OS 프로젝트 — `docs/VISION-AND-REQUIREMENTS.md` §0.1

## 한 줄 정의

AI 1인 기업 백요한의 **생태계 두뇌(요한 브레인)** — 맥락·취향·지식·판단이 사는 집. 네 개의 축으로 구성된다.

| 축 | 위치 | 역할 |
| --- | --- | --- |
| **SoT** | `memory/` | 결정·규칙·인제스트·인박스·위키·메트릭 |
| **MCP 서버** | `src/` → `dist/` | `yohan-os` stdio 서버, 도구 16종 |
| **자동화 배치** | `scripts/` | 일배치, 주간 리포트, OCR, 스케줄러 |
| **운영 대시보드** | `dashboard/` | 별도 Next.js 워크스페이스 |

## 루트 레이아웃

| 경로 | 역할 |
| --- | --- |
| `AGENTS.md` | 에이전트 진입점. 1인 운영 원칙 7개 + 작업 순서 |
| `README.md` | 빠른 시작, MCP 트러블슈팅, 환경 변수, 노션·텔레그램·인제스천 가이드 |
| `.cursorrules` | Cursor 워크스페이스 디자인 시스템 + 코딩 규칙 |
| `.cursor/` | Cursor MCP 등록·rules·skills |
| `package.json` / `tsconfig.json` | 루트 MCP 서버 빌드 설정 |
| `src/` | MCP 서버 TypeScript 소스 |
| `scripts/` | 자동화 배치·헬스·Windows 스케줄러 |
| `launch/` | Windows 더블클릭 실행 (bot·dashboard·batch·RSS) — `launch/README.md` |
| `docs/` | 비전·스펙·하네스·파이프라인 문서 |
| `memory/` | **SoT (단일 진실 소스)** |
| `dashboard/` | Next.js 운영 대시보드 |
| `auto-pull-hidden.vbs` | 예약 작업 진입 → `%USERPROFILE%\git-auto-pull.vbs` 위임 |

## memory/ — SoT

```text
memory/
├── profile.yaml            # 사용자 프로필
├── active-project.yaml     # 진행 중 프로젝트
├── decisions/              # 결정 로그 (12개)
├── rules/                  # 운영 규칙 (17개)
├── templates/              # 양식 (4개)
├── ingest/                 # 외부 데이터 수집 (175개)
│   ├── rss/                #   RSS 7종 (132)
│   ├── url/                #   단일 URL (12)
│   └── insights/           #   자동 인사이트 (31)
├── inbox/                  # 임시 인박스 (121개)
│   ├── telegram/           #   텔레그램 일별
│   ├── md_files/           #   마크다운 임포트 (46)
│   ├── img_series/         #   스크린샷 시리즈 (9)
│   ├── pdf_files/          #   PDF 인박스 (7)
│   ├── codex/              #   Codex 세션 (7)
│   ├── claude/             #   Claude 세션 (7)
│   ├── notion-queue.md     #   노션 풀 큐 (SoT 병합 전)
│   └── telegram-inbox.md   #   레거시 단일 텔레그램 인박스
├── wiki/                   # 지식 레이어 (14개)
│   ├── index.md / log.md
│   ├── concepts/           #   7개 (PARA, second-brain, harness-engineering, …)
│   └── entities/           #   5개 (Karpathy, Claude Code, Cursor, Obsidian, RAG)
├── metrics/                # Evaluator 구조화 로그 (11개)
├── ops/                    # 일일 운영 노트
└── logs/                   # 세션 로그·자동화 배치 로그
```

### memory/rules/ — 17개 운영 규칙

| 영역 | 규칙 |
| --- | --- |
| 하네스·세션 | `agent-harness`, `session-log`, `decision-trigger`, `rule-review-cycle` |
| P/G/E | `pge-pipeline`, `evaluator-checklist` |
| 노션 동기 | `notion-sync`, `notion-ocr-pipeline` |
| 인박스·텔레그램 | `telegram-inbox` |
| 자동화 | `automation-runbook-v1`, `automation-ops-checklist` |
| 대시보드 | `dashboard-design-system`, `dashboard-quick-actions`, `dashboard-runtime-stability` |
| 위키·아카이브 | `wiki-ops`, `archiving-appraisal-feynman` |
| 저장소 메타 | `github-repo-why-how` |

## src/ — MCP 서버 `yohan-os`

```text
src/
├── index.ts                       # MCP stdio 엔트리 (도구 16종 등록)
├── paths.ts                       # 경로 헬퍼
├── evaluation-log.ts              # log_evaluation 도구
├── ingest/                        # 인제스천 코어
│   ├── frontmatter.ts
│   ├── geeknews.ts                #   GeekNews 전용 (레거시 진입)
│   ├── rss-feed.ts                #   RSS 공통 엔진
│   ├── rss-feed-config.ts         #   7종 피드 설정
│   ├── url.ts                     #   YouTube oEmbed + Readability
│   ├── openai-translate-ko.ts     #   영문 → 한글 요약 (선택)
│   └── recent-summary.ts          #   get_context.recent_ingest
├── ingest-*-cli.ts                # CLI 9개 (RSS 7종 + all-rss + URL)
│   ├── ingest-geeknews-cli
│   ├── ingest-yozm-cli
│   ├── ingest-aitimes-cli
│   ├── ingest-techreviewkr-cli
│   ├── ingest-paulgraham-cli
│   ├── ingest-samaltman-cli
│   ├── ingest-karpathy-cli
│   ├── ingest-all-rss-cli         #   RSS 7종 일괄 실행
│   └── ingest-url-cli
├── notion/
│   ├── notion-env.ts / notion-id.ts / notion-ocr-env.ts
│   ├── pull-queue.ts              #   노션 → notion-queue.md
│   ├── push-decisions.ts          #   decisions/ → 노션 DB (멱등 SoT Key)
│   └── push-ocr.ts                #   OCR 리소스+서머리 페어
├── notion-{pull,push,ocr-push}-cli.ts
├── notion-queue.ts
├── plan/
│   └── task-plan.ts               #   plan.v0 JSON 스텁 코어
├── plan-task-cli.ts
├── router/
│   ├── route-task.ts              #   라우팅 규칙 (스펙: docs/router-spec-v1.md)
│   └── execute-route.ts           #   라우트 실행
├── route-task-cli.ts              # 라우팅만
├── route-and-run-cli.ts           # 라우팅 + 실행
├── search/
│   └── memory-search.ts           #   memory/ 부분 문자열 검색 코어
├── search-memory-cli.ts
├── telegram-bot.ts                # 텔레그램 폴링 봇
└── telegram-ocr.ts                # 텔레그램 OCR 처리
```

**MCP 도구 16종**: `get_context`, `append_decision`, `log_evaluation`, `ingest_geeknews_rss`, `ingest_yozm_rss`, `ingest_aitimes_rss`, `ingest_techreviewkr_rss`, `ingest_paulgraham_rss`, `ingest_samaltman_rss`, `ingest_karpathy_rss`, `ingest_url`, `search_memory`, `plan_task`, `notion_push_decisions`, `notion_push_ocr_pair`, `notion_pull_to_queue`.

> 참고: `route_task` / `route_and_run`은 CLI 전용 (현재 MCP 미노출).

## scripts/ — 자동화 배치 (21개)

```text
scripts/
├── automation-batch.ts                    # 메인 배치 엔트리
├── automation/
│   ├── dedupe.ts / quality.ts / tags.ts   #   파이프라인 단계
│   ├── github.ts / notion.ts              #   외부 연동
│   ├── insight.ts                         #   인사이트 추출
│   ├── notify.ts / state.ts / types.ts    #   상태·알림
│   └── parse-telegram.ts                  #   텔레그램 파싱
├── check-rule-drift.ts                    # 규칙 일관성 점검
├── dashboard-dev-safe.mjs                 # 대시보드 안전 모드 실행
├── router-fixture-check.ts                # 라우터 픽스처 검증
├── telegram-ocr-batch.ts                  # 텔레그램 OCR 일괄 처리
├── weekly-health-report.ts                # 주간 헬스리포트
├── run-automation-batch.{cmd,ps1,vbs}     # Windows 스케줄러 트리거
└── task-scheduler-{setup,remove}.ps1      # Windows Task Scheduler 등록·해제
```

## dashboard/ — Next.js 운영 대시보드

```text
dashboard/
├── README.md / AGENTS.md / CLAUDE.md      # 별도 워크스페이스 진입
├── package.json / next.config.ts / tsconfig.json
├── components.json                        # shadcn/ui 설정
├── eslint.config.mjs / postcss.config.mjs
├── public/ (7개 자산)
└── src/
    ├── app/        (10개 페이지 라우트)
    ├── components/ (24개 UI 컴포넌트)
    └── lib/        (8개 헬퍼)
```

> `dashboard/AGENTS.md`: "This is NOT the Next.js you know" — breaking changes 있으니 `node_modules/next/dist/docs/`를 먼저 읽으라는 강한 경고 포함.

## docs/ — 문서

| 파일 | 내용 |
| --- | --- |
| `VISION-AND-REQUIREMENTS.md` | 비전·요구사항 (Evaluator 게이트 기준) |
| `CONTEXT-AND-HARNESS-SYSTEM.md` | 컨텍스트 vs 하네스, 파이프라인 다이어그램 |
| `DASHBOARD-SPEC.md` | 대시보드 전체 스펙·로드맵·기술 스택 |
| `WIKI-SPEC-v2.md` | 위키 명세 |
| `CLAUDE-CONTEXT-BOOTSTRAP.md` | 타 클라이언트에 프로젝트 맥락 일괄 이관 |
| `IMPLEMENTATION-KICKOFF.md` | 킥오프 노트 |
| `PROJECT-PIPELINE-SPEC.md` | 프로젝트 파이프라인 |
| `automation-pipeline-v1-2026-04.md` | 자동화 파이프라인 v1 |
| `router-spec-v1.md` | 라우터 스펙 |
| `competitive-reference/membase-aristo.md` | 경쟁사 레퍼런스 |
| `examples/ocr-notion-payload.example.json` | OCR payload 예시 |
| **`STRUCTURE.md`** (이 문서) | 폴더·파일 구조 스냅샷 |

## .cursor/ — Cursor 통합

```text
.cursor/
├── mcp.json                                # yohan-os MCP 서버 등록
├── rules/
│   ├── evaluator-vision-gate.mdc           # Evaluator 비전 대조 게이트
│   └── session-start-get-context.mdc       # 세션 시작 시 get_context 자동 호출
└── skills/
    ├── yohan-os-workflow/SKILL.md
    ├── wiki-ops/SKILL.md
    └── ocr-refine/SKILL.md
```

## 데이터 흐름 한눈에

```text
[외부 소스]
  RSS 7종, URL, 텔레그램, 노션 DB, OCR 페이로드
        │
        ▼
[수집 레이어]  src/ingest-*, src/telegram-bot, src/notion/pull-queue
        │
        ▼
[인박스]  memory/inbox/, memory/ingest/
        │
        ├── 자동화 배치  scripts/automation-batch  →  memory/ingest/insights/
        │
        ▼
[SoT 본문]  memory/decisions, memory/rules, memory/wiki, memory/metrics
        │
        ├── MCP get_context  →  에이전트 (Cursor / Claude / Codex)
        ├── notion_push_decisions  →  노션 DB (멱등 SoT Key)
        └── 대시보드  dashboard/  ←  파일 시스템 직접 읽기
```

## 1인 운영 원칙 (AGENTS.md §0)

1. 코드보다 규칙·맥락 정비에 시간 쓴다
2. 진입 문서는 짧게, 세부는 분리
3. 대화에서 결정 나면 즉시 SoT에 기록
4. 경계는 5개 이하로 적고 강하게
5. Evaluator를 믿고, 사람 눈은 감각에만
6. 거창한 정리 대신 세션당 1개씩
7. 새 도구 도입 전 "에이전트가 읽을 수 있나?" 자문
