---
id: PAT-006
패턴명: 브라우저 네이티브 스토리지 금지 (샌드박스 한정)
카테고리: browser-api
증상: 빌드 없는 산출물에서 localStorage/sessionStorage 호출이 샌드박스에서 차단·예외로 렌더 실패
원인: 샌드박스(iframe sandbox 등) 환경에 네이티브 스토리지가 막혀 있는데 일반 웹 규약으로 작성
적용조건: ★빌드/샌드박스 단일파일 산출물 한정★ — 자체호스팅 웹앱(Next.js·Vite)은 정상 사용
출처프로젝트: Fable 5 §5 아티팩트 정책 (설계사상)
태그: [artifact, browser-api, storage, sandbox, state]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 (디자인/프론트 렌즈)
---

## 증상
샌드박스 산출물에서 `localStorage.setItem(...)`이 보안 정책에 막혀 throw → 컴포넌트 전체가 죽는다.

## 원인
아티팩트/임베드 샌드박스는 `localStorage`·`sessionStorage`를 차단한다. 영속이 필요하면 **메모리 상태**나 **플랫폼이 제공하는 KV API**를 써야 한다(네이티브 스토리지 ✗, 블레스된 API ✓).

## 해결
- 세션 내 상태: React state / 메모리 변수
- 영속 필요: 플랫폼 제공 storage API(예: `window.storage.get/set`)만, 키는 계층형 `table:id`
- 네이티브 `localStorage`/`sessionStorage`는 **호출 금지**

- ✅ 이렇게: `const [v, setV] = useState(...)` / 플랫폼 KV API
- ❌ 이렇게 말고: `localStorage.setItem("k", v)` (샌드박스 차단)
- 왜: 샌드박스는 네이티브 스토리지 차단, 블레스된 API만 동작.

## 적용조건
- ★샌드박스/단일파일 산출물 한정★.
- **자체호스팅 웹앱**(yohan-studio·shotgrade·notion-uiux는 자체 도메인 임베드)은 localStorage 정상 사용 — 이 PAT 적용 금지.
- PAT-005와 한 쌍(둘 다 "샌드박스 vs 자체호스팅" 경계가 핵심).
