# 세션 로그 — 2026-06-12 지식 복리 루프 로컬 구축

## 변경 요약

- **신규** `docs/KNOWLEDGE-LOOP.md` — 지식 레이어 단일 구조 명세 (한 폴더=한 역할 / 복리 루프 8단계 / 노션↔로컬 이중 원천 대응표 / 불변 경계 5개)
- **신규** `memory/rules/source-to-summary-protocol.md` — 노션 원본→요약+역전파+온톨로지 프로토콜 로컬판 (체크포인트 2개, 키워드·인물·AI사전 등록 포함)
- **신규** `memory/knowledge-hub/` — index.md(카테고리 4종) · triple-map.md(Relation 팔레트 19종 + 시드 트리플 4건) · keywords.md · TEMPLATE.md
- **신규** `memory/inbox/README.md` + `quick-capture.md` — 인박스 역할 명문화 + 범용 캡처 큐
- **갱신** `memory/wiki/index.md` — 도메인 그룹핑, 통계 재집계(엔티티 10/컨셉 11), Inferred TTL 만료 14페이지 표기
- **갱신** `memory/wiki/log.md` append, `AGENTS.md` §1-4 지식 레이어 진입점 교체
- **결정** `memory/decisions/2026-06-12-knowledge-loop-local.md`

## 결과: 성공

## 교훈

- AGENTS.md가 세션 중 외부에서 갱신될 수 있음 (ADR-006 SoT 3축 추가됨) — 편집 전 재읽기 필요했음. KNOWLEDGE-LOOP의 SoT 문구를 ADR-006과 충돌하지 않게 "이중 원천(만든 곳이 원천 + SoT Key 멱등)"으로 정렬함.
