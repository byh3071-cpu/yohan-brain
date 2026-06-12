# 세션 로그 — 원문→요약 프로토콜 실전 UAT (2026-06-12)

## 입력

- 사용자 실험: GeekNews 링크(https://news.hada.io/topic?id=30421) + 본문 복붙 동봉 — 타입 #3(아티클 URL).

## 파이프라인 실행

| 단계 | 결과 |
|------|------|
| Step 0-Pre | A등급 (복붙 본문 + Readability 추출 123줄, 전체 확보) |
| Step 1 RESOURCE | `npm run ingest:url` → `memory/ingest/url/url-358aef6c82120c0e.md` ✅ 자동 |
| Step 2 SUMMARY | `memory/ingest/insights/coding-agents-normal-technology.md` (표준 구조 + 학습 의도 추론) |
| Step 4.5 교차검증 | **용어 충돌 발견:** 기존 `vibe-coding-*` insights의 "바이브 코딩"은 원문 정의상 agentic engineering — SUMMARY에 정정 기록. `vibe-coding-planning-importance`와 결정 층 주장 수렴 확인 |
| Step 4.5 승격 체크 | 후보 1건: `agentic engineering` → wiki concept (사용자 확인 대기) |
| Step 4.6 역전파 (체크포인트 1) | **진행 추천·사용자 확인 대기** — 후보: `wiki/concepts/harness-engineering.md` (agentic engineering 용어·샌드위치 근거 추가), `wiki/concepts/modern-ai-ch11-harness-willison-aci.md` (Willison 감독 피로 수렴 증거) |
| Step 4.7 온톨로지 (체크포인트 2) | **진행** — 트리플 6건 등록 (Subject 전수 신규, 충돌 없음). 키워드: 스킵 (개념성 용어 — 프롬프트 영향 키워드 아님) |
| Step 5 아카이브 | 해당 없음 (inbox 미경유 — 세션 직접 입력) |

## 후속: 노션 DB 등록 (2026-06-12, 사용자 요청)

이번 세션 추출 지식을 노션 DB별로 등록 (각 DB 등록 프로토콜 준수):

| DB | 등록 | 비고 |
|----|------|------|
| SUMMARY | 아티클노트 1건 (37d9740a-…e8a9) | SoT는 로컬 insight, 노션은 사본 명시 |
| 트리플 맵 | 6건 (출처 SUMMARY 연결) | 로컬 triple-map.md와 동일 내용 |
| AI 사전 | 에이전틱 엔지니어링·결정-실행-전달 샌드위치·AI 워싱 3건 | ①~⑨ 형식·근거 태그·상호 Relation 연결 |
| 인물 DB | 사이먼 윌리슨 (⚡주요, 초안) | 반복 등장 기준 충족 (ch11·ch15·본 아티클). Narayanan은 1회 등장 — 보류 |
| 키워드 DB | 스킵 | 개념성 용어뿐, 프롬프트 영향 키워드 없음 |

## 프로토콜 자체에 대한 관찰

- 2차 출처(한국어 요약 경유) 수치는 `[미검증]` 일괄 태그로 처리 — 프로토콜 Step 4.5-C와 부합.
- 아티클 타입은 ingest:url 자동 확보가 정상 동작 — 폴백 불필요했음.
