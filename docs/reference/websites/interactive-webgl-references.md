---
title: "인터랙티브 WebGL·3D 웹 레퍼런스 모음 (Messenger 계열)"
kind: website-reference
collected_at: "2026-06-15"
seed: https://messenger.abeto.co
category: [인터랙티브 웹, WebGL, 3D, 코지]
tags: [website-reference, design-reference, webgl, threejs, interactive, awwwards, cozy, portfolio, studio]
status: collected
related:
  - docs/reference/websites/messenger-abeto.md
source:
  - https://www.awwwards.com/websites/three-js/
  - https://bruno-simon.com/
  - https://lusion.co/
  - https://thatgamecompany.com/sky/
---

# 인터랙티브 WebGL·3D 웹 레퍼런스 모음

> **씨앗:** `messenger.abeto.co` (→ `messenger-abeto.md`). 그와 **결이 비슷하거나 더 강한** 인터랙티브 웹 사례를 리서치로 모은 큐레이션.
> **공통 DNA:** ① 브라우저 네이티브(설치·플러그인 없음) ② WebGL/Three.js 기반 3D ③ 경량·고성능 최적화 ④ "설명"보다 "경험"이 첫 화면 ⑤ 어워드(Awwwards/FWA/Webby) 검증.
>
> ⚠️ 일부 항목은 봇 차단으로 사이트 본문 직접 추출이 안 돼 어워드·기사·검색 기반으로 정리. 직접 방문 시 갱신 권장. (source-to-summary-protocol #3 폴백)

---

## A. 직접 유사 — 게임형·경량 인터랙티브 (가장 가까움)

### 1. Bruno Simon — Portfolio
- **URL:** https://bruno-simon.com
- **무엇:** 작은 **자동차를 운전**해 3D 월드를 돌며 프로젝트를 탐험하는 포트폴리오. Micro Machines에서 영감.
- **왜 유사:** Messenger처럼 "사이트=놀이". 게임 메커닉으로 콘텐츠를 탐험시키고, **<2MB**급 극단 경량(GLTF + draco + gzip)으로 어워드를 받음. 경량+놀이 조합의 원조격.
- **기술:** Three.js + **Cannon.js**(물리, primitive로 단순화), 커스텀 셰이더 머티리얼. Awwwards Site of the Month·FWA.
- **참고점:** "가볍게 만들면서 인상 주기"의 교과서. Messenger의 5.7MB와 같은 결.

### 2. Lusion — Studio & "My Little Storybook"
- **URL:** https://lusion.co (자체 프로젝트 *My Little Storybook*, *Oryzo AI* 포함)
- **무엇:** 멀티 어워드 인터랙티브 스튜디오. *My Little Storybook* = 강을 건너는 새 가족의 **인터랙티브 그림책**(WebGL + 수제 3D + 일러스트 애니).
- **왜 유사:** Messenger의 코지·스토리텔링 톤과 직결. 일러스트 감성을 3D 웹으로 옮기는 방식이 cel-shading 룩과 통함.
- **기술:** 자체 JS 프레임워크 **Hydra**(WebGL). Cannes Lions·D&AD·Webby·Awwwards·FWA. Coca-Cola·Porsche·Google 작업.
- **참고점:** "일러스트 감성 + 3D 인터랙션" 디렉션의 최상위 벤치마크.

### 3. Active Theory
- **URL:** https://activetheory.net
- **무엇:** WebGL·실시간 3D 몰입 경험 전문 스튜디오 (Webby "Crafted with Code" 등).
- **왜 유사:** 브라우저에서 고퀄 실시간 그래픽을 뽑는 기술·연출 레퍼런스. 대형 캠페인급 인터랙티브의 상한선.
- **참고점:** 연출·트랜지션·로딩 경험의 디테일 참고. *(직접 작업 목록은 방문해 갱신 필요 — secondhand)*

---

## B. 발굴 소스 — 갤러리·컬렉션 (지속 공급)

### 4. Awwwards — Three.js / WebGL 컬렉션
- **URL:** https://www.awwwards.com/websites/three-js/ · 컬렉션 https://www.awwwards.com/awwwards/collections/three-js/
- **무엇:** Messenger(SOTD)가 등재된 그 갤러리. 인터랙티브 3D 신작이 계속 올라오는 1차 소스.
- **참고점:** 레퍼런스가 떨어지면 여기부터. FWA(thefwa.com), CSS Nectar, Codrops(tympanus.net/codrops)도 같은 역할.

### 5. 개별 포트폴리오 사례 (Awwwards/forum 발굴)
- **Jordan Breton — 떠 있는 섬:** 잔디·폭포·불·바람·나비가 렌더된 섬을 고정 카메라 포인트로 탐험.
- **Aimee's Papercraft World:** React Three Fiber + Blender + Krita. 2D 일러스트를 3D 지오메트리에 입힌 "노트 종이" 감성 — Messenger의 평면 일러스트×3D 결과 유사.
- **Leeroy — ATMOS:** Three.js + Blender + GSAP + 가상 스크롤. 항공산업 사실을 인터랙티브 스토리로.
- **Robin Mastromarino:** GSAP displacement 슬라이더 등 깔끔한 WebGL 모션 포트폴리오.
- **참고점:** R3F(React Three Fiber) 스택과 스크롤 드리븐 연출의 실전 예시들.

---

## C. 개념·영감 — 코지/무언(無言) 멀티플레이 정신 (웹 전용 아님)

### 6. Sky: Children of the Light (thatgamecompany)
- **URL:** https://thatgamecompany.com/sky/  *(브라우저 게임 아님 — 모바일/PC/콘솔)*
- **무엇:** Journey 제작사의 **무언 소셜 멀티플레이** — 말 없이 감정·제스처로 낯선 이와 유대.
- **왜 참고:** Messenger의 "**이모지/이모트만으로 소통하는 저마찰 소셜**"의 사상적 원형. 코지 멀티플레이 UX 설계 참고.
- **주의:** 기술 스택은 웹이 아니므로 **UX·감성 레퍼런스로만** 사용.

---

## D. Yohan 관점 — 무엇을 가져올까

- **경량 우선(A·1·2):** "5.7MB Messenger / <2MB Bruno Simon" = 가벼움이 곧 고급. 대시보드·소개 페이지 인터랙션을 무겁지 않게 설계하는 기준선.
- **일러스트×3D 디렉션(2·5):** cel-shading·종이 질감 등 "그림 같은 3D"가 코지 톤의 핵심. 비주얼 방향 잡을 때 우선 참고.
- **저마찰 소셜(6):** 텍스트 대신 이모트/제스처. 협업·공유 기능을 가볍게 붙이는 패턴.
- **발굴 루틴(B):** 레퍼런스 고갈 시 Awwwards Three.js → FWA → Codrops 순으로 순회.

## E. 후속 / 검증 TODO
- [ ] A·B 각 사이트 **직접 방문**해 인터랙션·로딩 체감 1줄씩 갱신 (현재 일부 secondhand)
- [ ] Active Theory 실제 대표작 목록 확인 후 보강
- [ ] 인터랙티브 웹 레퍼런스가 8건+로 늘면 knowledge-hub 「인터랙티브 웹 디자인」 주제 문서로 승격 검토 (현재는 collected 단계)

---
출처: [Awwwards Three.js](https://www.awwwards.com/websites/three-js/) · [Bruno Simon](https://bruno-simon.com/) · [Lusion](https://lusion.co/) · [Lusion 케이스(Codrops)](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/) · [Active Theory(Webby)](https://www.webbyawards.com/crafted-with-code/active-theory/) · [Sky — thatgamecompany](https://thatgamecompany.com/sky/)
