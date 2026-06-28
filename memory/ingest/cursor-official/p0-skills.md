---
id: cursor-official-p0-skills
date: 2026-06-28
domain: ai-coding-tools
tags: [ingest, cursor, skills, cdocs]
related: [cursor, claude-code]
source: https://cursor.com/docs/skills
source_fetched: 2026-06-28
# trust: 5 — 공식문서 (source-to-summary-protocol Step 4.7 신뢰도 기준)
trust: 5
status: active
---

# Cursor 공식문서 — Skills (핵심 요약)

> CDOCS-03 (P0). Cursor 공식 Agent Skills 문서를 yohan-brain에 ingest한 정제 요약.
> 본문은 2026-06-28 fetch한 원문(`https://cursor.com/docs/skills`, bare URL — `.md` 붙이면 404)에 근거하며,
> 확인되지 않은 항목은 "원문 미확인"으로 표기했다. (살아있는 문서라 시점에 따라 바뀔 수 있음.)

## 목적

- Cursor에 Skill을 붙일 때 `SKILL.md` 구조·frontmatter 필드·디렉토리 위치·호출 방식을 다시 찾지 않고 이 카드로 해결하려고. 특히 yohan-brain이 이미 쓰는 Claude Code skills(`.claude/skills`, plugin skills)와 Cursor Skills의 **관계(동일 오픈 표준)**를 정리한 레퍼런스. p0-rules.md(Rules)와 짝을 이루는 P0 카드.

## 핵심 요약 (3줄)

- Cursor Skills는 **Agent Skills 오픈 표준**(원문 "open standard", `agentskills.io`)의 구현이다. Skill = 원문 표현 "portable, version-controlled package"로, `SKILL.md` 파일 하나(YAML frontmatter `name`·`description` **필수**)로 정의하고 skill 디렉토리(`.agents/skills/`·`.cursor/skills/` 등)에 둔다.
- 동작: Cursor 시작 시 skill 디렉토리를 **자동 발견(automatically discovers)**, Agent가 context 기반으로 관련성을 판단해 자동 적용. 또는 채팅에서 `/`-멘션(`/skill-name`)으로 **수동 호출**. `disable-model-invocation: true` 면 전통적 슬래시 커맨드처럼 수동 호출 전용.
- **Claude Code 호환(핵심 차별점):** Cursor는 호환성(compatibility)을 위해 `.claude/skills/`·`.codex/skills/`(및 `~/` 전역)도 로드한다 → 동일 오픈 표준이므로 Claude/Codex용 skill을 그대로 공유·인식.

## 핵심 키워드

- Agent Skills(open standard, `agentskills.io`), `SKILL.md`, frontmatter(`name`/`description`/`paths`/`disable-model-invocation`/`metadata`), 디렉토리 `.agents/skills`·`.cursor/skills`(+ `.claude/skills`·`.codex/skills` 호환 로드), nested/monorepo skills, `paths` glob 스코프, progressive loading(load resources on demand), 옵션 폴더 `scripts/`·`references/`·`assets/`, `/`-멘션 수동호출, `/migrate-to-skills`(Cursor 2.4), Remote Rule(GitHub import), Customize → Skills("Agent Decides" 섹션)

## 본문

### 1. Skill이란 / 핵심 속성 (What are skills?)

- 원문 lead: "Agent Skills is an open standard for extending AI agents with specialized capabilities. Skills package domain-specific knowledge and workflows that agents can use to perform specific tasks." — Agent Skills는 AI 에이전트를 전문 능력으로 확장하는 **오픈 표준**이며, Skill은 도메인 지식·워크플로를 패키징한다.
- 원문 정의: "A skill is a **portable, version-controlled package** that teaches agents how to perform domain-specific tasks. Skills can include scripts, templates, and references that agents may act on using their tools." — Skill은 에이전트에게 도메인 작업 수행법을 가르치는 **이식 가능·버전관리되는 패키지**이며, 에이전트가 도구로 실행할 수 있는 스크립트·템플릿·레퍼런스를 포함할 수 있다.

**4대 속성 (원문 그대로):**

| 속성 | 원문 설명 |
|------|-----------|
| **Portable** | "Skills work across any agent that supports the Agent Skills standard." (표준 지원 에이전트면 어디서나 동작) |
| **Version-controlled** | "Skills are stored as files and can be tracked in your repository, or installed via GitHub repository links." (파일로 저장·레포 추적·GitHub 링크 설치) |
| **Actionable** | "Skills can include scripts, templates, and references that agents act on using their tools." (도구로 실행 가능한 스크립트·템플릿·레퍼런스 포함) |
| **Progressive** | "Skills load resources on demand, keeping context usage efficient." (리소스를 **온디맨드 로드**해 컨텍스트 효율 유지) |

### 2. 동작 방식 (How skills work) & 호출

- 원문: "When Cursor starts, it automatically discovers skills from skill directories and makes them available to Agent. The agent is presented with available skills and decides when they are relevant based on context. Skills can also be manually invoked by typing `/` in Agent chat and searching for the skill name."
- 정리:
  1. **자동 발견:** Cursor 시작 시 skill 디렉토리에서 skill을 자동 발견해 Agent에 제공.
  2. **자동 적용(관련성 판단):** Agent가 가용 skill 목록을 보고 **context 기반으로 관련성**을 판단해 사용.
  3. **수동 호출:** Agent 채팅에서 `/` 입력 후 skill 이름 검색(`/skill-name`)으로 직접 호출.

### 3. Skill 디렉토리 (위치 + Claude/Codex 호환)

- 원문: "Skills are automatically loaded from these locations:"

| 위치(Location) | 스코프(Scope) |
|----------------|---------------|
| `.agents/skills/` | Project-level |
| `.cursor/skills/` | Project-level |
| `~/.agents/skills/` | User-level (global) |
| `~/.cursor/skills/` | User-level (global) |

- **호환 로드(핵심):** 원문 "For compatibility, Cursor also loads skills from Claude and Codex directories: `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, and `~/.codex/skills/`." → Cursor는 호환성을 위해 **Claude·Codex 디렉토리의 skill도 로드**한다.

기본 디렉토리 구조 (원문 예):

```text
.agents/
└── skills/
    └── my-skill/
        └── SKILL.md
```

### 4. 중첩(nested)·모노레포 디렉토리

- 원문: "Skill directories can be organized into subdirectories. ... Cursor walks the skills root recursively and picks up any `SKILL.md` it finds:" — skill 루트를 **재귀 순회**하며 발견되는 모든 `SKILL.md`를 가져온다(카테고리·팀·도메인별 그룹화에 유용).

```text
.cursor/
└── skills/
    ├── shipping/
    │   ├── land-it/
    │   │   └── SKILL.md
    │   └── careful-merge-conflicts/
    │       └── SKILL.md
    ├── debugging/
    │   └── using-datadog-mcp/
    │       └── SKILL.md
    └── workflow/
        └── tdd/
            └── SKILL.md
```

- 원문: "Cursor also discovers skills inside nested project subdirectories. A `.cursor/skills/` (or `.agents/skills/`) folder anywhere inside your repository is picked up, so monorepos can colocate skills with the package they apply to:" — 레포 내부 어디든 `.cursor/skills/`(또는 `.agents/skills/`) 폴더면 인식 → **모노레포는 패키지 옆에 skill을 같이 둘 수 있다.**

```text
my-monorepo/
├── .cursor/skills/         # repo-wide skills
│   └── land-it/SKILL.md
└── apps/
    └── web/
        └── .cursor/skills/  # app-specific skills
            └── deploy-web/SKILL.md
```

- 원문: "Skills in nested project directories are automatically scoped to files inside that directory." — 중첩 디렉토리의 skill은 **그 디렉토리 내부 파일에 자동 스코프**된다.

### 5. SKILL.md 파일 형식

- 각 skill = `SKILL.md` 하나(YAML frontmatter + 마크다운 본문). 원문 기본 예시:

```markdown
---
name: my-skill
description: Short description of what this skill does and when to use it.
---

# My Skill

Detailed instructions for the agent.

## When to Use

- Use this skill when...
- This skill is helpful for...

## Instructions

- Step-by-step guidance for the agent
- Domain-specific conventions
- Best practices and patterns
- Use the ask questions tool if you need to clarify requirements with the user
```

### 6. Frontmatter 필드 (5개, 원문 설명 그대로)

| 필드 | 필수 | 원문 설명 |
|------|------|-----------|
| `name` | **Yes** | "Skill identifier. Lowercase letters, numbers, and hyphens only. Must match the parent folder name." (소문자·숫자·하이픈만, **부모 폴더명과 일치**해야 함) |
| `description` | **Yes** | "Describes what the skill does and when to use it. Used by the agent to determine relevance." (무엇을·언제 쓰는지 기술 → Agent가 **관련성 판단**에 사용) |
| `paths` | No | "Glob patterns that scope the skill to matching files. Accepts a comma-separated string or a list. When set, the skill is only surfaced when the agent works with files that match." |
| `disable-model-invocation` | No | "When `true`, the skill is only included when explicitly invoked via `/skill-name`. The agent will not automatically apply it based on context." |
| `metadata` | No | "Arbitrary key-value mapping for additional metadata." (임의 key-value 메타데이터) |

### 7. 특정 파일에 스코프 (`paths`)

- 원문: "Use the `paths` field to limit a skill to files that match one or more glob patterns. The skill is then only surfaced to the agent when it is reading or editing matching files." → `paths` glob에 매칭되는 파일을 **읽거나 편집할 때만** Agent에 노출.
- 리스트 형식:

```markdown
---
name: react-component-patterns
description: Conventions for writing React components in this codebase.
paths:
  - "**/*.tsx"
  - "packages/ui/**/*.ts"
---
```

- 콤마 구분 단일 문자열도 가능 (원문 "You can also pass a single comma-separated string"):

```markdown
---
name: python-style
description: Style rules for Python files.
paths: "**/*.py, scripts/**/*.py"
---
```

- 원문: "Patterns follow standard glob syntax. Leave `paths` unset for a skill that should be available regardless of which files are open." → 표준 glob 문법. **파일과 무관하게 항상 가용**하게 하려면 `paths`를 비워 둠.

### 8. 자동 호출 비활성화 (Disabling automatic invocation)

- 원문: "By default, skills are automatically applied when the agent determines they are relevant. Set `disable-model-invocation: true` to make a skill behave like a traditional slash command, where it is only included in context when you explicitly type `/skill-name` in chat."
- 즉 기본은 Agent가 관련성 판단해 자동 적용. `disable-model-invocation: true` 면 **전통적 슬래시 커맨드처럼 `/skill-name` 명시 입력 시에만** 컨텍스트에 포함.

### 9. 스크립트 포함 (`scripts/`) & 옵션 디렉토리

- 원문: "Skills can include a `scripts/` directory containing executable code that agents can run. Reference scripts in your `SKILL.md` using relative paths from the skill root." → `SKILL.md`에서 **skill 루트 기준 상대경로**로 스크립트 참조.

```markdown
---
name: deploy-app
description: Deploy the application to staging or production environments. Use when deploying code or when the user mentions deployment, releases, or environments.
---

# Deploy App

Deploy the application using the provided scripts.

## Usage

Run the deployment script: `scripts/deploy.sh <environment>`

Where `<environment>` is either `staging` or `production`.

## Pre-deployment Validation

Before deploying, run the validation script: `python scripts/validate.py`
```

- 원문: "Scripts can be written in any language—Bash, Python, JavaScript, or any other executable format supported by the agent implementation." → 스크립트 언어 무관(Bash·Python·JS 등).

**옵션 디렉토리 (원문 표):**

| 디렉토리 | 용도(원문) |
|----------|------------|
| `scripts/` | "Executable code that agents can run" |
| `references/` | "Additional documentation loaded on demand" (온디맨드 로드되는 추가 문서) |
| `assets/` | "Static resources like templates, images, or data files" |

- 가이드(원문): "Keep your main `SKILL.md` focused and move detailed reference material to separate files." → `SKILL.md`는 초점 있게 짧게 유지하고 **세부 레퍼런스는 별도 파일로** 분리.

확장 구조 (원문 예):

```text
.agents/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        ├── references/
        └── assets/
```

### 10. Skill 보기 / GitHub에서 설치

- **보기(Viewing):** 원문 "To view discovered skills, open **Customize** in the sidebar and go to **Skills**. Skills installed from plugins or your project appear alongside rules in the **Agent Decides** section." → 사이드바 **Customize → Skills**. 플러그인·프로젝트에서 설치된 skill은 rules와 함께 **"Agent Decides"** 섹션에 표시.
- **GitHub 설치(원문 절차):**
  1. Open **Customize** in the sidebar
  2. Go to **Rules** and click **Add Rule**
  3. Select **Remote Rule (Github)**
  4. Enter the GitHub repository URL

### 11. 규칙·커맨드 → Skill 마이그레이션 (`/migrate-to-skills`)

- 원문: "Cursor includes a built-in `/migrate-to-skills` skill in **2.4** that helps you convert existing dynamic rules and slash commands to skills." → Cursor **2.4**의 내장 `/migrate-to-skills`가 기존 규칙·커맨드를 skill로 변환.
- 변환 대상(원문):
  - **Dynamic rules:** "Apply Intelligently" 설정 규칙 — `alwaysApply: false`(또는 미정의) + `globs` 미지정 규칙 → 표준 skill로 변환. (cf. p0-rules.md §4의 `Apply Intelligently`)
  - **Slash commands:** user-level·workspace-level 커맨드 모두 → `disable-model-invocation: true` skill로 변환(명시적 호출 동작 보존).

## 적용·주의 (Yohan OS)

- **Claude skill 호환 활용:** yohan-brain은 이미 Claude Code 네이티브 skills(`.claude/skills`, plugin skills: `yohan-core`·`workflow`·`pm-*` 등)를 쓴다. Cursor가 `.claude/skills/`·`~/.claude/skills/`를 **호환 로드**하므로, 우리 `SKILL.md`는 별도 포팅 없이 Cursor에서도 동작한다(동일 오픈 표준). 단, Cursor 고유 frontmatter(`paths`·`disable-model-invocation`)는 Claude 측 해석 여부가 본 문서 범위 밖 — **원문 미확인**.
- **Rules vs Skills 멘탈모델:** Rules(p0-rules.md)는 "항상/선별 주입되는 시스템 컨텍스트", Skills는 "Agent가 필요 시 펼치는 **실행 가능 패키지**(progressive, `scripts/` 포함)". `disable-model-invocation: true` = 슬래시 커맨드 동치.
- **컨텍스트 예산:** progressive loading(load resources on demand) → `SKILL.md`는 짧게, 세부는 `references/`로. p0-rules.md §10의 "500줄/`@file` 참조" 및 하네스 `layered-context` 원칙과 정합.
- **스코프 일관:** `paths`(glob 스코프)는 Rules의 `globs`(Apply to Specific Files)와 같은 발상 — 토큰 효율적 선별 로딩.
- **하지 말 것:** `SKILL.md`에 전체 문서 복붙(→ `references/`·`@file` 참조). `name`은 **부모 폴더명과 반드시 일치**(불일치 시 미인식 위험).

## Cursor Skills ↔ Claude Code(Anthropic Agent Skills) 관계 (원문 근거)

- **같음(공유 표준):** 둘 다 `agentskills.io` **"Agent Skills" 오픈 표준**. 핵심 단위가 `SKILL.md` + frontmatter `name`/`description`로 동일. 원문이 명시한 호환성: Cursor가 `.claude/skills/`·`~/.claude/skills/`(및 `.codex/skills/`)를 로드 → **Claude용 skill을 그대로 인식**.
- **Cursor 고유(이 문서가 정의):** 디렉토리 `.cursor/skills`·`.agents/skills`; frontmatter `paths`(glob 스코프)·`disable-model-invocation`·`metadata`; UI Customize → Skills("Agent Decides" 섹션); `/migrate-to-skills`(2.4)로 기존 Cursor rules/commands 변환; GitHub Remote Rule import.
- **원문 미확인(추측 금지):** Claude Code 측 고유 frontmatter 필드(예: `allowed-tools`)·progressive disclosure 세부 단계 등 **Anthropic 쪽 내부 명세는 이 Cursor 문서에 없음**. 본 문서가 명시한 비교는 "오픈 표준 공유 + Claude/Codex 디렉토리 호환 로드"까지다. 그 이상의 Claude Code skill 세부는 별도 Claude Code 문서 ingest 대상(본 카드 범위 밖).

## 트리플 맵 (in-file)

- `Cursor Skills` --구현--> `Agent Skills 오픈표준 (agentskills.io)`
- `Skill` --정의단위--> `SKILL.md (frontmatter name+description 필수)`
- `SKILL.md` --위치--> `.cursor/skills | .agents/skills (+ .claude/.codex 호환 로드)`
- `name` --일치제약--> `부모 폴더명`
- `Skill` --자동발견·관련성판단--> `Agent (context 기반)`
- `disable-model-invocation:true` --동치--> `슬래시 커맨드 (/skill-name 수동호출)`
- `paths(glob)` --스코프--> `매칭 파일 작업 시에만 노출`
- `SKILL.md` --온디맨드 참조--> `scripts/ · references/ · assets/`
- `/migrate-to-skills (2.4)` --변환--> `Apply-Intelligently rules + slash commands → skills`

## 소스 출처

- 원문: https://cursor.com/docs/skills (fetch: 2026-06-28, WebFetch 3회 — 섹션별 verbatim 통독)
- 신뢰도: 5 (공식문서)

source: https://cursor.com/docs/skills
