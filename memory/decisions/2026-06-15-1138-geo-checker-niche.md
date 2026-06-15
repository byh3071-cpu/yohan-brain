---
id: decision-2026-06-15-1138
date: 2026-06-15
time: "11:38"
domain: web-growth
tags: [decision, product, geo, aeo, seo, niche-selection]
related: [geo-readiness-checker, aeo-seo-geo-playbook]
status: accepted
---

# 결정 — AEO/SEO/GEO 웹사이트 니치로 "GEO Readiness Checker" 선정

## 배경

검색이 클릭→직답·인용으로 이동하며 AEO·SEO·GEO 3축 최적화가 부상. 2026 데이터(스키마 시 AI Overview 3.2배, 통계 +22%·인용구 +37% 가시성, Reddit 40%·Wikipedia 26% 최다 인용, AI 검색이 정보성 질의 12~18% 처리·유기검색 165배 성장)를 근거로, "셋 다 + 바이럴 + 문제해결"을 만족하는 사이트를 1개 골라 기획하기로 함.

## 결정

**니치 = "GEO Readiness Checker"** (URL → AI 인용 가능성 0~100점 + 처방 무료 웹툴 + 분기 "State of GEO" 리포트). 상세는 `docs/projects/geo-readiness-checker.md`.

- 구현은 **라이브 LLM 엔진 쿼리 없이 정적 분석**(HTML·JSON-LD 파싱 + 룰 엔진)으로 MVP — 비용·안티봇·속도.
- 플레이북은 `docs/reference/aeo-seo-geo-playbook.md`로 별도 보존.

## 대안 검토

- **A안(채택): GEO Readiness Checker** — 도구(문제해결·바이럴·AEO) + 집계 데이터(GEO 자석) + 프로그래매틱(SEO) 5조건 충족. 요한 불공정 우위(GEO 리서치 완료·AI 에이전트 운영자). 정적 분석으로 1인 구현 가능.
- **B안: LLM 가격·토큰 계산기 + 지수** — 평이하나 시장 포화, 차별화 약함.
- **C안: 라이브 AI 인용 체커(엔진 직접 쿼리)** — 가장 강력하나 LLM 비용·안티봇·속도로 1인 MVP 부적합. → A안에 정적 분석으로 축소 반영.
- **D안: 니치 Q&A·용어사전** — 저비용이나 바이럴·도구성 약함.

## 영향

- 다음 산출물: 제품 기획안(draft) 확정. 착수 전 **경쟁 스캔 1회**가 선행 조건.
- `active-project.yaml`(현재 yohan-os-revival)은 **변경하지 않음** — 본 건은 신규 사이드 트랙, 별도 착수 결정 시 편입.

## 후속 작업

- 기획안 2단계(점수 룰셋 v0) 전 경쟁 도구 스캔.
- `[가설]` 점수 룰의 실제 인용 예측력은 베이스라인 측정 후 검증 (과대약속 금지).
