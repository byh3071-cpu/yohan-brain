---
id: 2026-06-12-themilk-feed-replacement
date: 2026-06-12
tags: [rss, ingest, feed, themilk, techreviewkr]
related: [2026-06-12-rss-batch-24h-guard]
status: decided
---

# themilk RSS 피드 → MIT 테크놀로지 리뷰 코리아로 교체

## 결정

- `RSS_FEED_THEMILK`(`https://www.the-mill.kr/rss`) 제거, `RSS_FEED_TECHREVIEWKR`(`https://www.technologyreview.kr/feed/`, feedKey `techreviewkr`) 신설. CLI `ingest:techreviewkr`, MCP `ingest_techreviewkr_rss`로 대응 교체.
- 슬롯 성격(실리콘밸리·테크 심층, 한국어) 유지 — 사용자 선택 (후보: MIT TR 코리아 / Stratechery / 바이라인네트워크 중).

## 근거 (부활 시도 결과 — 전부 사망 확인)

- 원본 URL `www.the-mill.kr`은 DNS 미해석(ENOTFOUND)이며 `memory/ingest/rss/themilk/` 인제스트 이력 0건 — **처음부터 작동한 적 없는 오주소**.
- `themiilk.com`(실제 도메인): `/rss`·`/feed`는 SPA HTML 쉘, `/rss.xml`·`/sitemap.xml`은 500, 홈페이지에 RSS link 태그 없음 — 유료 구독 미디어라 공개 피드 미제공.
- Blogspot 미러: 2020-12 중단(안내용 블로그). YouTube(@themiilk, UCQ2QuYUI70ujF0cIXhnk7zA): 2023-04 이후 휴면. `viewsletter.themiilk.com`: 접속 타임아웃.

## 검증

- `npm run ingest:techreviewkr -- 5` → 5건 작성, errors 0, translation ok.
- `npm run build`(tsc) 통과 — MCP 도구 교체 포함.
- 다음 배치 RSS 주기부터 failed 알림 소멸 (가드 24h 후 자동 검증).
