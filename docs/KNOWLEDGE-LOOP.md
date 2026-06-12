# Yohan Brain 지식 복리 루프 (Knowledge Compounding Loop)

> **이 문서가 요한 브레인 지식 레이어의 단일 구조 명세다.**
> 목적: ① 지식이 선순환·복리로 쌓이는 루프 정의 ② 사람과 AI 모두 헷갈리지 않는 "한 폴더 = 한 역할" 경계 고정.
> 운영 절차(어떻게 실행하는가)는 `memory/rules/source-to-summary-protocol.md` 참조.

---

## 1. 한 폴더 = 한 역할 (혼동 방지 경계)

| 폴더 | 역할 (단 하나) | 노션 대응 | 수정 규칙 |
|------|---------------|----------|----------|
| `memory/inbox/` | **대기열** — 들어온 raw가 처리를 기다리는 곳 | 빠른 캡처 (인박스) | 처리 후 비움 (archive/ 이동 또는 삭제) |
| `memory/ingest/` | **원본 보존** — RESOURCE(rss/url/raw 메타+링크) + SUMMARY(insights/ 정제 요약) | RESOURCE DB + SUMMARY DB | append-only. insights 본문 수정 금지 (frontmatter related만 추가) |
| `memory/wiki/` | **사전** — 개념·도구·기술·인물의 카드 (Karpathy LLM Wiki 패턴, Cap 있음) | AI 사전 + 스택 사전 + 인물 DB | 승격(promote)으로만 생성. Verified는 [source:] 필수 |
| `memory/knowledge-hub/` | **주제 지식 문서 + 그래프** — 주제별 종합 문서, 트리플 맵, 키워드 | 요한 지식 허브 DB + 트리플 맵 DB + 키워드 DB | 역전파·승격으로 성장. 상태(초안→확정) 관리 |
| `memory/rules/` | **운영 규칙** — 어떻게 일하는가 | PROTOCOL DB / RULEBOOK | 결정 후 즉시 갱신 |
| `memory/decisions/` + `memory/logs/` | **기록** — 무엇을 했고 왜 결정했는가 | EXECUTION LOG DB | append-only |
| `docs/` | **명세** — 시스템이 어떻게 생겼는가 (스펙·ADR·트러블슈팅) | 지식 허브 DB(🔧 시스템·아키텍처) | ADR은 불변, 스펙은 버전업 |

**판단이 헷갈릴 때 1초 규칙:**
- "아직 안 읽었다/안 정리했다" → `inbox/`
- "원본이거나 원본의 요약이다" → `ingest/`
- "하나의 개념·도구·사람이다 (명사 카드)" → `wiki/`
- "여러 소스를 종합한 주제 문서다" → `knowledge-hub/`
- "절차·규칙이다" → `rules/` · "결정·작업 기록이다" → `decisions/`·`logs/`

## 2. 복리 루프 (선순환 구조)

```
        ① 캡처               ② 원본 보존          ③ 요약·정제
  텔레그램·퀵캡처  ──→  ingest/(rss·url·raw)  ──→  ingest/insights/
  memory/inbox/          = RESOURCE                = SUMMARY
                                                       │
  ⑧ 노션 동기화                                        ▼ 원문→요약 프로토콜
  sync_to_notion                              ④ 교차검증 + 승격
  (지식허브·EXECUTION LOG)                     wiki/ (사전) · knowledge-hub/ (주제)
        ▲                                              │
        │                                              ▼
  ⑦ 재사용 (복리 발생 지점)                    ⑤ 역전파 (Backfill)
  get_context · /wiki-query ·                 새 지식 → 기존 wiki·hub·rules
  세션 시작 컨텍스트 주입                       구버전 교체·누락 보강
        ▲                                              │
        │                                              ▼
        └──────────────────────────────  ⑥ 온톨로지 (Triple)
                                          knowledge-hub/triple-map.md
                                          Subject 대조 → 충돌·보완 발견
```

**복리가 발생하는 메커니즘:**
- ④ 승격: 1회성 요약이 재사용 가능한 자산(사전·허브 문서)으로 전환
- ⑤ 역전파: 새 지식 1건이 기존 문서 N건을 갱신 → 자산 가치가 늙지 않음
- ⑥ 트리플 대조: 지식 A+B의 연결에서 새 지식 C 발견 → C가 다시 A·B와 연결
- ⑦ 재사용: 다음 세션·작업이 축적된 자산 위에서 시작 → 같은 것을 재조사하지 않음

## 3. 노션 ↔ 로컬 대응표 (이중 원천 — 만든 곳이 원천)

> SoT 3축(AGENTS.md·ADR-006): 코드=Git · 지식·기획 정본=노션 · 에이전트 런타임 맥락=`memory/`.
> **원천 규칙:** 레포 세션에서 만든 지식(아래 "로컬" 열)은 Git이 원천 → `sync_to_notion`으로 푸시. 노션 세션(노뚝이)에서 만든 지식은 노션이 원천 → 필요한 것만 로컬로 가져와 등재. 같은 항목을 양쪽에서 동시에 키우지 않는다 (멱등 키 `SoT Key`로 충돌 방지).

| 노션 | 로컬 | 동기화 |
|------|---------|--------|
| 빠른 캡처 | `memory/inbox/` | 수동 (텔레그램 봇은 자동 append) |
| RESOURCE DB | `memory/ingest/` (rss/url/raw) | OCR 원문은 노션 보존 (notion-ocr-pipeline.md) |
| SUMMARY DB | `memory/ingest/insights/` | 서머리 DB는 노션 쪽 표현, SoT 아님 |
| AI 사전·스택 사전·인물 DB | `memory/wiki/` (entities·concepts) | 수동. 공개판: `yohan-ai-dictionary/` |
| 요한 지식 허브 DB | `memory/knowledge-hub/` | `sync_to_notion` (SoT Key 멱등) |
| 트리플 맵 DB | `memory/knowledge-hub/triple-map.md` | 수동 (Phase 2에서 자동화 검토) |
| 키워드 DB | `memory/knowledge-hub/keywords.md` | 수동 |
| EXECUTION LOG DB | `memory/logs/sessions/` + `memory/decisions/` | `sync_to_notion` |
| 아이디어 허브·취향 DB·가계부 | (로컬 미러 없음 — 노션 전용) | — |

## 4. 불변 경계 (5개 이하, 강하게)

1. **inbox는 비우는 곳** — 영구 보관 금지. 처리했으면 archive 또는 삭제.
2. **ingest는 다시 쓰지 않는 곳** — 원본·insights 본문 수정 금지.
3. **wiki·hub 문서는 승격·역전파로만 성장** — 즉흥 생성 금지 (프로토콜 경유).
4. **같은 지식을 두 곳에 쓰지 않는다** — 로컬 SoT 1곳 + 노션은 동기화 사본.
5. **루프를 끊지 않는다** — 요약했으면 최소한 승격·역전파·온톨로지 체크포인트 질문까지 (스킵은 가능, 생략은 불가).
