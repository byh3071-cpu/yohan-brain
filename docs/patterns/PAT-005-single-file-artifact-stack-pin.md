---
id: PAT-005
패턴명: 단일파일 산출물 스택 핀 + 버전별 함정 사전
카테고리: build
증상: 빌드 없는 단일파일 산출물(Claude 아티팩트·canvas·codepen류)이 임의 의존성·임의 Tailwind 값으로 렌더 실패
원인: 빌드 파이프라인이 있는 프로젝트 규약을 빌드 없는 샌드박스에 그대로 적용
적용조건: ★빌드/번들러 없는 단일파일 산출물 한정★ — 자체호스팅 Next.js/Vite 프로젝트엔 적용 금지
출처프로젝트: Fable 5 §5 아티팩트 정책 (설계사상 차용, 일부 버전 함정은 적용 전 실동작 확인 필요)
태그: [artifact, frontend, stack-pin, build, sandbox]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 (디자인/프론트 렌즈)
---

## 증상
빌드 없는 단일파일 산출물에서 Tailwind 임의값(`w-[37px]`)·미허용 라이브러리·존재하지 않는 API를 쓰면 조용히 깨진다(컴파일러·번들러가 없어 검증이 안 됨).

## 원인
일반 프로젝트는 PostCSS·번들러가 임의값을 컴파일하고 의존성을 설치한다. **단일파일 산출물은 그 인프라가 없다** — CDN/런타임이 지원하는 것만 동작.

## 해결 — 핀 + 함정 사전
- **Tailwind**: 코어 유틸리티만(컴파일러 없음 → 임의값 `[...]` 금지)
- **import 화이트리스트**: react, lucide-react, recharts, d3, three, shadcn/ui 등 산출물 런타임이 미리 번들한 것만
- **HTML**: 단일파일 + 의존성은 cdnjs only
- **export**: default export 금지(named만), required prop 없는 컴포넌트
- **버전별 함정**(⚠️ 적용 전 실동작 확인): 예—three r128에서는 OrbitControls·CapsuleGeometry 미제공이라는 보고가 있으나 **유출본 진술 기반, 실제 버전 동작 확인 후 핀에 확정**

- ✅ 이렇게: `className="w-9 gap-2"` (코어 유틸), import는 화이트리스트만
- ❌ 이렇게 말고: `className="w-[37px]"`, `import x from 'random-npm-pkg'`
- 왜: 빌드 인프라가 없으니 런타임 지원 범위 = 사용 가능 범위.

## 적용조건
- ★샌드박스 한정★: Claude 아티팩트·canvas·codepen 등 **빌드 없는 단일파일**.
- 자체호스팅 웹앱(yohan-studio·shotgrade·notion-uiux 등 Next.js/Vite)은 번들러가 있으므로 **이 제약 적용 금지**(오적용이 가장 흔한 함정).
- 버전 함정 항목은 유출 진술이면 "실동작 확인 후 확정" 단서를 단다(미검증 사실화 금지).
