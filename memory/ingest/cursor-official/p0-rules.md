---
id: cursor-official-p0-rules
date: 2026-06-28
domain: ai-coding-tools
tags: [ingest, cursor, rules, cdocs]
related: [cursor, claude-code]
source: https://cursor.com/docs/rules
source_fetched: 2026-06-28
# trust: 5 — 공식문서 (source-to-summary-protocol Step 4.7 신뢰도 기준)
trust: 5
status: active
---

# Cursor 공식문서 — Rules (핵심 요약)

> CDOCS-02 파일럿. Cursor 공식 Rules 문서를 yohan-brain에 ingest한 정제 요약.
> 본문은 2026-06-28 fetch한 원문 전문(`https://cursor.com/docs/rules`)에 근거하며,
> 확인되지 않은 항목은 "원문 미확인"으로 표기했다. (문서는 살아있는 문서라 시점에 따라 바뀔 수 있음.)

## 목적

- Cursor에 규칙(Rules)을 붙일 때 `.cursor/rules` 구조·`.mdc` frontmatter·rule type·우선순위를 다시 찾지 않고 이 카드로 해결하려고. Yohan OS의 `AGENTS.md`/`memory/rules` 설계와 직접 대응되는 레퍼런스.

## 핵심 요약 (3줄)

- Cursor 규칙은 **네 종류(원문 표현 "four types of rules")**가 있다: **Project Rules / User Rules / Team Rules / AGENTS.md**. 적용 시 규칙 내용은 모델 컨텍스트 **맨 앞**에 삽입된다 (LLM은 completion 간 메모리가 없으므로 규칙이 영속·재사용 컨텍스트 역할).
- Project Rules는 `.cursor/rules` 안의 `.mdc` 파일이며 frontmatter(`description`·`globs`·`alwaysApply`)로 **적용 방식(rule type)**을 정한다. type은 `Always Apply / Apply Intelligently / Apply to Specific Files / Apply Manually` 4가지.
- 여러 규칙이 동시에 걸리면 **Team Rules → Project Rules → User Rules** 순서로 머지되고, 충돌 시 **앞 소스가 우선**한다.

## 핵심 키워드

- `.cursor/rules`, `.mdc`, frontmatter(`description`/`globs`/`alwaysApply`), AGENTS.md(중첩 지원), User Rules, Team Rules, rule type(적용 방식), glob 패턴, 우선순위(Team→Project→User), `@`-멘션, `/create-rule`, Remote Rule(GitHub import)

## 본문

### 1. 규칙(Rules)이란 / 동작 방식

- 규칙은 Agent에게 주는 **시스템 수준 지시**다. 프롬프트·스크립트 등을 묶어 팀 전체가 워크플로를 관리·공유하기 쉽게 한다.
- 원문: "Large language models don't retain memory between completions. Rules provide persistent, reusable context at the prompt level." — LLM은 completion 간 메모리가 없으므로, 규칙이 프롬프트 수준의 **영속·재사용 컨텍스트**를 제공한다.
- 적용되면 규칙 내용은 **모델 컨텍스트의 맨 앞(start)**에 포함되어, 코드 생성·편집 해석·워크플로 지원에 일관된 가이드를 준다.

### 2. 규칙의 네 종류 (kinds / sources)

원문 "Cursor supports four types of rules" 아래에 나열된 4종 (= 규칙의 출처/종류):

| 종류 | 저장 위치·범위 | 비고 |
|------|----------------|------|
| **Project Rules** | `.cursor/rules` 에 저장, 버전관리, 코드베이스에 스코프 | `.mdc` 파일 |
| **User Rules** | Cursor 환경 전역 | Agent(Chat)에서 사용 |
| **Team Rules** | 대시보드에서 관리되는 팀 전역 규칙 | Team·Enterprise 플랜 |
| **AGENTS.md** | 마크다운 형식 agent 지시 | `.cursor/rules`의 간단한 대안 |

> 주의(명칭 구분): 이 "four types"는 **규칙의 출처/종류**다. 아래 4번의 "rule type"(Always Apply 등)은 **개별 규칙의 적용 방식**으로, 서로 다른 축이다.

### 3. Project Rules & `.cursor/rules` 디렉토리 구조

- Project Rules는 `.cursor/rules` 안의 `.mdc` 파일이며 **버전관리**된다. 경로 패턴으로 스코프되거나, 수동 호출되거나, 관련성에 따라 포함된다.
- 용도(원문): 코드베이스 도메인 지식 인코딩 / 프로젝트별 워크플로·템플릿 자동화 / 스타일·아키텍처 결정 표준화.
- **파일 규칙:** 각 규칙은 `.mdc` 파일이고 이름은 자유. 반드시 `.mdc` 확장자여야 한다. `.cursor/rules` 안의 **순수 `.md` 파일은 무시**된다 — frontmatter(`description`·`globs`·`alwaysApply`)가 없기 때문. 순수 마크다운을 쓰려면 AGENTS.md를 사용.
- **중첩(nested) 폴더 지원** — 하위 폴더로 규칙을 조직화 가능:

```
.cursor/rules/
  react-patterns.mdc       # Recognized as a project rule
  api-guidelines.md        # Ignored (wrong extension)
  frontend/                # Organize rules in folders
    components.mdc
```

### 4. `.mdc` 파일 형식 & Rule Type (적용 방식 4가지)

- 각 규칙 = **frontmatter 메타데이터 + 본문 content**. type 드롭다운으로 적용 방식을 정하며, 이는 frontmatter 3개 필드(`description`, `globs`, `alwaysApply`)를 바꾼다.

**Rule Type 표 (원문 그대로):**

| Rule Type (드롭다운) | 적용 시점 (원문) | 대응 frontmatter 조건 | 예시 코드블록 제목(원문) |
|----------------------|------------------|------------------------|--------------------------|
| `Always Apply` | Apply to every chat session | `alwaysApply: true` (globs·description 무시) | "Always applied" |
| `Apply Intelligently` | When Agent decides it's relevant based on description | `alwaysApply: false` + `description` 제공, `globs` 생략 → Agent가 description 읽고 관련 시 가져옴 | "Agent-selected based on description" |
| `Apply to Specific Files` | When file matches a specified pattern | `alwaysApply: false` + `globs` 제공 → 매칭 파일이 컨텍스트에 있으면 자동 첨부(Auto-attached) | "Auto-attached by file pattern" |
| `Apply Manually` | When @-mentioned in chat (e.g., `@my-rule`) | `alwaysApply: false` + `description`·`globs` 모두 생략 → 채팅에서 `@`-멘션 시에만 포함 | "Manual — only via @-mention" |

**frontmatter 필드 (3개):**
- `alwaysApply` (boolean) — true면 모든 채팅 세션에 항상 포함(globs·description 무시).
- `description` (text) — Agent가 이 설명을 읽고 적용 여부를 판단.
- `globs` (pattern) — 파일 패턴. 매칭 파일이 컨텍스트에 있으면 자동 첨부. 여러 패턴은 콤마로 구분.

**최소 형식 예 (원문 "Rule file format" 섹션):**

```markdown
---
description: "This rule provides standards for frontend components and API validation"
alwaysApply: false
---

...rest of the rule content
```

- glob 패턴 예시(원문 표 일부): `*`(파일명 한 세그먼트), `**`(디렉토리 재귀), `**/*.ts`(모든 디렉토리의 .ts), `src/**/*.tsx`, `docs/**/*.md, docs/**/*.mdx`(콤마 다중) 등.
- 규칙 본문에서 `@filename.ts` 로 **다른 파일을 컨텍스트에 참조** 가능 (예: `@migration-template.sql`, `@service-template.ts`).

### 5. AGENTS.md

- 프로젝트 루트에 두는 **단순 마크다운** 파일로 agent 지시를 정의. `.cursor/rules`의 간단한 대안.
- Project Rules와 달리 **메타데이터/복잡한 설정 없는 순수 마크다운**. 구조화된 규칙의 오버헤드 없이 간단·가독성 위주일 때 적합.
- Cursor는 **프로젝트 루트 + 하위 디렉토리** 모두에서 AGENTS.md를 지원.
- **Nested AGENTS.md:** 어떤 하위 디렉토리에든 둘 수 있고, 그 디렉토리(및 하위)의 파일 작업 시 자동 적용. 상위 디렉토리 지시와 **결합**되며 **더 구체적인(하위) 지시가 우선**.

```
project/
  AGENTS.md              # Global instructions
  frontend/
    AGENTS.md            # Frontend-specific instructions
    components/
      AGENTS.md          # Component-specific instructions
  backend/
    AGENTS.md            # Backend-specific instructions
```

### 6. User Rules

- **Customize → Rules**에서 정의하는 **전역 선호** (모든 프로젝트에 적용).
- **Agent(Chat)에서만 사용**. 선호 커뮤니케이션 스타일·코딩 컨벤션 설정에 적합. 형식은 순수 텍스트(plain markdown):

```md
Please reply in a concise style. Avoid unnecessary repetition or filler language.
```

- (FAQ 확인) User Rules는 **Inline Edit(Cmd/Ctrl+K)에는 적용되지 않음** — Agent(Chat) 전용.

### 7. Team Rules

- Team·Enterprise 플랜에서 **Cursor 대시보드**로 조직 전체에 규칙 생성·강제. 관리자가 각 규칙의 필수 여부 설정.
- **형식:** 자유 형식 텍스트. Project Rules의 폴더 구조를 쓰지 않음. **glob 패턴 지원**(예: `**/*.py` 설정 시 매칭 파일이 컨텍스트에 있을 때만 적용; glob 없으면 모든 대화에 적용).
- **활성화/강제:** "Enable this rule immediately"(미체크 시 draft로 저장, 나중에 활성화) / "Enforce this rule"(강제 시 멤버가 Customize에서 끌 수 없음; 비강제면 멤버가 Team Rules에서 토글 가능).
- 적용 위치: 활성화된 Team Rule은 해당 팀의 **모든 레포·프로젝트**에서 Agent(Chat) 모델 컨텍스트에 포함.

### 8. 적용 범위 · 우선순위 (Precedence)

- 원문(Team Rules 섹션): "Rules are applied in this order: **Team Rules → Project Rules → User Rules**. All applicable rules are merged; earlier sources take precedence when guidance conflicts."
- 즉 **모든 적용 가능한 규칙은 머지**되고, 가이드가 **충돌하면 앞 소스(= Team이 가장 우선)**가 이긴다.

| 우선순위 | 소스 |
|----------|------|
| 1 (최상) | Team Rules |
| 2 | Project Rules |
| 3 (최하) | User Rules |

### 9. 규칙 생성 / 가져오기

- **생성 (2가지, 원문):**
  1. 채팅에서 `/create-rule` 입력 → Agent가 원하는 바를 듣고 frontmatter 포함한 규칙 파일을 생성해 `.cursor/rules`에 저장.
  2. **Customize → Rules → Add Rule** → `.cursor/rules`에 새 규칙 파일 생성. Customize에서 모든 규칙·상태 확인 가능.
  - (FAQ) "채팅에서 규칙 만들 수 있나?" → 예, agent에게 새 규칙 만들어 달라고 요청 가능.
- **Importing Rules — Remote rules (via GitHub):** Customize → Rules → Add Rule → **Remote Rule (Github)** → GitHub 레포 URL 붙여넣기 → Cursor가 레포의 모든 `.mdc` 스캔·동기화. 가져온 규칙은 `.cursor/rules/imported/<repoName>` 아래에 상대 경로 유지하며 배치.

### 10. 베스트 프랙티스 / FAQ 핵심

- **좋은 규칙:** 초점이 있고 실행 가능하며 스코프됨. 500줄 이하 / 큰 규칙은 여러 조합 가능한 규칙으로 분할 / 구체적 예시·참조 파일 / 모호한 지시 회피 / 파일은 복사 대신 참조(`@file`)해 짧고 stale 안 되게.
- **피할 것:** 스타일 가이드 통째 복사(린터 쓰기) / 모든 명령 문서화(Agent가 npm·git·pytest 등 앎) / 드문 엣지케이스 / 코드베이스 중복(정본 예시를 가리키기).
- 처음엔 단순하게, Agent가 같은 실수를 반복할 때만 규칙 추가. 규칙은 git에 체크인해 팀 공유. GitHub 이슈/PR에 `@cursor` 태그해 Agent가 규칙을 갱신하게 할 수도 있음.
- (FAQ) 규칙이 Cursor Tab·기타 AI 기능에는 **영향 없음**.

## 적용·주의 (Yohan OS)

- **AGENTS.md 정합:** Yohan OS는 이미 `AGENTS.md`/`memory/rules`를 쓴다. Cursor의 "nested AGENTS.md(하위가 우선)"와 "규칙=실행가능·참조형(`@file`)" 원칙은 우리 규칙 작성 기준(`insight-summary-quality`, 하네스 Ch.11의 "좋은 CLAUDE.md")과 동일선상.
- **컨텍스트 예산:** `alwaysApply: true` 남발은 매 세션 컨텍스트를 먹음 → glob/description 기반 선별 로딩이 토큰 효율적(= `layered-context` 원칙과 정합).
- **우선순위 설계:** 조직 표준은 Team Rules(최우선), 레포 규칙은 Project Rules, 개인 취향은 User Rules로 분리하는 멘탈모델을 그대로 차용 가능.
- **하지 말 것:** 규칙에 스타일가이드/전체 코드 복붙(린터·정본 참조로 대체).

## 명칭 관련 주의 (티켓 대비 — 추측 금지 확인)

- 티켓의 rule type 예시는 "Always / Auto Attached / Agent Requested / Manual"였으나, **2026-06-28 fetch 기준 현 문서의 드롭다운 명칭**은 **`Always Apply` / `Apply Intelligently` / `Apply to Specific Files` / `Apply Manually`**다.
- 개념 대응(원문 동작 설명 기준): `Apply to Specific Files` = glob 매칭 시 "Auto-attached"(≈ 구 명칭 Auto Attached), `Apply Intelligently` = description 기반 "Agent-selected"(≈ 구 명칭 Agent Requested). 다만 **리터럴 문자열 "Auto Attached"/"Agent Requested"는 fetch한 전문에서는 그대로 등장하지 않음**(전문 통독 확인).
- **원문 미확인 항목:**
  - 티켓이 언급한 생성 명령 "New Cursor Rule" / "Generate Cursor Rules" / "/Generate Cursor Rules" → 현 fetch 문서에는 없음(문서는 `/create-rule`, Customize→Rules→Add Rule만 명시). **원문 미확인.**
  - "Memories" 섹션 → 이 문서(`rules.md`)에는 없음(별도 Memories 문서가 따로 있을 가능성은 본 ingest 범위 밖). **원문 미확인.**

## 트리플 맵 (in-file, 외부 triple-map.md 등록은 파일럿 범위 밖 — 보류)

- `Cursor Rules` --저장위치--> `.cursor/rules/*.mdc`
- `.mdc 규칙` --적용방식결정--> `frontmatter(description/globs/alwaysApply)`
- `규칙 우선순위` --순서--> `Team Rules > Project Rules > User Rules`
- `AGENTS.md` --대안--> `.cursor/rules (순수 마크다운)`
- `User Rules` --미적용--> `Inline Edit(Cmd/Ctrl+K)`

## 소스 출처

- 원문: https://cursor.com/docs/rules (fetch: 2026-06-28, WebFetch 전문 통독)
- 신뢰도: 5 (공식문서)

source: https://cursor.com/docs/rules
