# 2026-06-12 — 지식 복리 루프 로컬 구축 (노션 지식 시스템 이식)

## 결정

1. **노션 「원본→요약 프로토콜」(+역전파+온톨로지 추출)을 로컬에 이식** — `memory/rules/source-to-summary-protocol.md`. 역전파·온톨로지(트리플)·키워드·인물·AI사전 등록을 로컬 경로에 매핑해 레포에서도 동일 파이프라인 실행 가능.
2. **`memory/knowledge-hub/` 신설** — 노션 「요한 지식 허브 DB」의 로컬 SoT. 카테고리 4종(시스템·아키텍처/전략·방향/규격·방법론/성찰·철학)·상태 흐름(초안→확정) 동일. 부속: `triple-map.md`(트리플 맵 DB 로컬판, Relation 팔레트 19종), `keywords.md`(프롬프트 영향 키워드 전용), `TEMPLATE.md`.
3. **`docs/KNOWLEDGE-LOOP.md` 신설** — 전체 지식 레이어의 단일 구조 명세. "한 폴더 = 한 역할" 경계표 + 복리 루프 8단계 + 노션↔로컬 대응표 + 불변 경계 5개. 사람·AI 혼동 방지가 목적.
4. **역할 분리 확정:** inbox=대기열(비우는 곳) / ingest=원본 보존(RESOURCE+SUMMARY, append-only) / wiki=사전(개념·도구·인물 카드, AI사전·인물DB 로컬판) / knowledge-hub=주제 종합 문서+그래프 / rules=절차 / decisions·logs=기록.
5. **인박스 정비** — `memory/inbox/README.md` + `quick-capture.md`(텔레그램 외 범용 캡처 큐) 추가. 기존 텔레그램 인박스 규칙 유지.

## 근거

- 노션에서 검증된 파이프라인(EXECUTION LOG 100+건)이 로컬에는 없어 레포 지식이 복리화되지 않았음.
- wiki는 존재하나 index 통계 미집계·Inferred TTL 만료 14건 방치·도메인 혼재 — 구조 경계가 불명확하면 사람·AI 모두 잘못된 폴더에 지식을 쌓음.

## 후속

- [x] wiki 만료 Inferred 청산 (2026-06-12 같은 날 완료 — 16불릿: Verified 승격 8 + TTL 재발급 8, 재발급분 Owner 검증은 ~7/12 주간 리뷰에서)
- [x] knowledge-hub 첫 문서 등재 + `sync_to_notion` 실동작 검증 (파일럿 3건 푸시 성공, frontmatter 카테고리 매핑 확인, 멱등 재실행 skip 확인. sync-records.ts에 knowledge-hub kind 추가 + CLI `--files` 플래그 신설)
- [x] 프로토콜 실전 1회전 (samaltman-productivity — insight·인물 카드·역전파 1건·트리플 6건·키워드 스킵 보고. 인물 감지 훅 자율 세션 보완 패치)
- [ ] 트리플 30건+ 축적 시 자동화(온톨로지 추출 Phase 2) 검토 (현재 23건)
- [ ] paulgraham RSS 50건 본문 수집 실패(헤더만 존재) — ingest 파이프라인 수정 후보
