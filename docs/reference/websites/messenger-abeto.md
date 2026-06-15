---
title: "Messenger (Abeto) — 웹사이트·디자인 레퍼런스"
kind: website-reference
url: https://messenger.abeto.co
collected_at: "2026-06-15"
category: [3D 웹게임, 인터랙티브, WebGL]
tags: [website-reference, design-reference, webgl, threejs, cel-shading, websocket, multiplayer, cozy-game, awwwards, performance]
status: collected
source:
  - https://messenger.abeto.co
  - https://www.awwwards.com/sites/messenger
  - https://gigazine.net/gsc_news/en/20250929-messenger-browser-game/
  - https://aftermath.site/messenger-browser-game-abeto/
---

# Messenger (Abeto) — 웹사이트·디자인 레퍼런스

> 한 줄 요약: **작은 행성 위에서 편지·소포를 배달하는 무료 브라우저 3D 게임.** 설치·광고 없이 PC·모바일 웹에서 바로 실행되며, 5.7MB 초기 로드라는 극단적 최적화 + cel-shading 아트로 Awwwards SOTD를 받은 인터랙티브 웹의 레퍼런스 사례.
>
> ⚠️ 직접 수집 참고: `messenger.abeto.co` 및 일부 기사(aftermath·gigazine)는 봇 차단(HTTP 403)으로 자동 본문 추출 불가. 아래 내용은 Awwwards·검색 결과·2차 기사 기준이며 직접 플레이 시 갱신 권장. (source-to-summary-protocol #3 폴백)

## 1. 개요

- **제품:** Messenger — 브라우저 기반 코지(cozy) 3D 게임 (2025)
- **제작:** Vicente Lucendo · Michael Sungaila / 퍼블리시 **Abeto** (인터랙티브 경험 전문 스튜디오)
- **포지셔닝:** 설치·다운로드·광고 없이 **브라우저에서 바로 실행**되는 무료 멀티플레이 웹게임
- **수상·노출:** Awwwards Site of the Day, GIGAZINE·80.lv·Aftermath·ResetEra 등 다수 소개
- **콘셉트:** 작고 둥근 행성 — 어느 방향으로 걸어도 결국 출발점으로 돌아오는 구(球) 월드에서 주민들의 편지·소포를 배달하는 어린 우체부

## 2. 디자인·UX 특징 (레퍼런스 포인트)

1. **2색 중심 팔레트 + cel-shading** — 컬러풀하지만 절제된 2색 기반, 셀 셰이딩으로 일러스트 같은 3D 룩. ("Colorful / Storytelling / 3D")
2. **UI를 WebGL 안에서 직접 렌더** — DOM/HTML 오버레이가 아니라 **UI 전체를 WebGL로 구현**해 모든 디테일을 제약 없이 애니메이션. 게임 화면과 UI가 한 레이어로 통합된 일관된 모션.
3. **구(球) 월드 = 자연스러운 경계 없는 탐험** — 평면이 아닌 작은 행성이라 "끝"이 없고, 길 잃을 부담 없이 계속 걷게 되는 릴랙싱 루프.
4. **소셜은 가볍게** — 다른 플레이어가 화면에 등장, **이모지(3D 이모지)·이모트**로만 소통. 텍스트 채팅 부담 없는 저마찰 멀티플레이.
5. **캐릭터 커스터마이즈 + 사운드트랙** — 외형 꾸미기와 부드러운 음악으로 "내 캐릭터로 머무는" 코지 경험 강화.
6. **무광고·무가입 즉시 진입** — 랜딩 = 곧 플레이. 마케팅 페이지가 아니라 경험 자체가 첫 화면.

## 3. 기술 스택 (인터랙티브 웹 구현 참고)

| 영역 | 사용 기술 |
|------|----------|
| 렌더링 코어 | **Three.js** (WebGL) |
| 충돌·교차 최적화 | **three-mesh-bvh** |
| 3D 에셋 | 모델링 **Houdini · Blender**, 텍스처 **Substance** |
| 멀티플레이 | **WebSocket** 서버 (Node.js) |
| 텍스트 렌더 | **WebAssembly로 글리프 생성 → GPU 직접 렌더** (UI를 WebGL로 그리기 위함) |
| 셰이딩 | Cel shading |

- **최적화 수치:** 초기 로드 **5.7MB**, 전체 상한 **17.5MB**. 이 완성도의 3D 멀티플레이 게임치고 매우 가벼움 — 압축 텍스처·에셋으로 데스크톱·모바일 양쪽 부드럽게 구동.

## 4. 왜 레퍼런스로 가치 있나 (Yohan 관점)

- **"가벼운데 고급스럽다"의 실증** — 5.7MB로 SOTD급 인터랙티브를 낸 사례. 대시보드·랜딩 등에서 "무겁지 않게 인상 주기"의 벤치마크.
- **UI=WebGL 통합 모션** — HTML UI와 캔버스를 분리하지 않고 한 레이어로 묶었을 때 나오는 일관성. 향후 인터랙티브 산출물(데모·소개 페이지) 설계 시 모션 통일성 레퍼런스.
- **저마찰 소셜 패턴** — 텍스트 대신 이모지/이모트만으로 "함께 있는 느낌". 협업·공유 기능을 가볍게 붙일 때 참고.
- **랜딩 = 경험** — 설명 페이지 없이 첫 화면이 곧 제품. 군더더기 없는 진입 흐름의 본보기.

## 5. 더 볼 것 / 후속

- [ ] 직접 플레이 후 실제 인터랙션·로딩 체감 갱신 (봇 차단으로 자동 캡처 불가)
- [ ] Awwwards 페이지의 기술 스택·크레딧 원문 교차 확인: https://www.awwwards.com/sites/messenger
- [ ] (선택) 인터랙티브 웹/3D 디자인 레퍼런스가 늘면 `memory/wiki/` 또는 knowledge-hub 「인터랙티브 웹 디자인」 주제로 승격 검토

---
출처: [messenger.abeto.co](https://messenger.abeto.co) · [Awwwards](https://www.awwwards.com/sites/messenger) · [GIGAZINE](https://gigazine.net/gsc_news/en/20250929-messenger-browser-game/) · [Aftermath](https://aftermath.site/messenger-browser-game-abeto/)
