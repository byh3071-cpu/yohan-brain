---
id: PAT-006
패턴명: 샌드박스 스토리지 — localStorage 금지, window.storage 사용
카테고리: browser-api
증상: 빌드 없는 산출물에서 localStorage/sessionStorage 호출이 샌드박스에서 차단·예외로 렌더 실패
원인: 샌드박스(iframe sandbox 등) 환경에 네이티브 스토리지가 막혀 있는데 일반 웹 규약으로 작성
적용조건: ★빌드/샌드박스 단일파일 산출물 한정★ — 자체호스팅 웹앱(Next.js·Vite)은 정상 사용
출처프로젝트: Fable 5 §5 아티팩트 정책 (설계사상)
태그: [artifact, browser-api, storage, sandbox, state, window-storage]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 (디자인/프론트 렌즈)
---

## 증상
샌드박스 산출물에서 `localStorage.setItem(...)`이 보안 정책에 막혀 throw → 컴포넌트 전체가 죽는다.

## 원인
아티팩트/임베드 샌드박스는 `localStorage`·`sessionStorage`를 차단한다. 영속이 필요하면 **메모리 상태**나 **플랫폼이 제공하는 `window.storage` KV API**를 써야 한다(네이티브 스토리지 ✗, 블레스된 API ✓).

## 해결

### 세션 내 상태 (영속 불필요)
React state / 메모리 변수를 사용한다.

### 세션 간 영속 (window.storage)
Fable 5 명시 API. `localStorage`/`sessionStorage` 대신 `window.storage`를 사용한다:

```javascript
// 쓰기
await window.storage.setItem("settings:theme", "dark");

// 읽기
const theme = await window.storage.getItem("settings:theme");

// 삭제
await window.storage.removeItem("settings:theme");
```

- **키 형식:** 계층형 `table:id` (예: `user:prefs`, `canvas:last-state`)
- **비동기:** 모든 메서드가 Promise 반환 → `await` 필수
- **범위:** 해당 아티팩트 세션-영속 (브라우저 재시작 시 유지 여부는 플랫폼 구현에 따름)

### 판단 기준
- ✅ 이렇게: `await window.storage.setItem("k", v)` (세션 영속)
- ✅ 이렇게: `const [v, setV] = useState(...)` (세션 내)
- ❌ 이렇게 말고: `localStorage.setItem("k", v)` (샌드박스 차단)
- ❌ 이렇게 말고: `sessionStorage.setItem("k", v)` (샌드박스 차단)

## 적용조건
- ★샌드박스/단일파일 산출물 한정★.
- **자체호스팅 웹앱**(yohan-studio·shotgrade·notion-uiux는 자체 도메인 임베드)은 localStorage 정상 사용 — 이 PAT 적용 금지.
- PAT-005와 한 쌍(둘 다 "샌드박스 vs 자체호스팅" 경계가 핵심).
