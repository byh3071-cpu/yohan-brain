---
id: anthropic-sdk-python-github-why-how
type: entity
entity_type: tool
created: 2026-05-18
updated: 2026-06-07
source_insights: [anthropic-sdk-python-github-why-how]
related_entities: [claude-code]
related_concepts: [harness-engineering]
---
# anthropic-sdk-python — 왜 쓰는지 · 어떻게 쓰는지

## 정의 (1~2문장)

- Python 앱에서 **Anthropic Claude API**를 호출하기 위한 **공식 클라이언트 SDK**로, REST 세부사항 대신 `client.messages.create()` 같은 함수 호출로 메시지를 주고받는다.
- Yohan OS에서는 **TypeScript(MCP·대시보드)와 별도**로, Python 배치·스크립트 한 단계에 Claude를 붙일 때 쓰는 **공식 래퍼**다.

## Verified (소스 기반)
- **GitHub:** [anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) [source: anthropic-sdk-python-github-why-how]
- **README 인제스트:** `memory/ingest/url/url-194a5baa2a535af7.md` — `pip` 설치 문구·요구 Python 버전·공식 문서 URL은 **여기 및 GitHub 최신 README**를 본다. [source: anthropic-sdk-python-github-why-how]
- **공식 문서(인제스트 인용):** [Python SDK 문서](https://platform.claude.com/docs/en/api/sdks/python) [source: anthropic-sdk-python-github-why-how]
- **파이썬 앱**에서 **Anthropic Claude API**를 호출하기 위한 **공식 클라이언트 라이브러리**다. [source: anthropic-sdk-python-github-why-how]
- REST로 URL·헤더·JSON을 매번 직접 맞출 필요 없이, **파이썬 함수 호출 한 번**으로 Claude API에 질문·답을 주고받게 해 주는 **공식 래퍼**다. API 키만 있으면 “클라이언트 만들고 → 메시지 보내고 → 응답 읽기” 흐름이 한데 묶인다. [source: anthropic-sdk-python-github-why-how]
- **내 일(Yohan OS):** 배치 스크립트·CLI·소규모 에이전트에서 **Python으로만** Claude를 붙일 때 `pip install anthropic` 후 최소 예제로 호출을 검증하고, 노션/OCR·로그 정제 같은 **자동화 한 단계**에 넣기 쉽다. [source: anthropic-sdk-python-github-why-how]

## Inferred (추론/연결) — TTL 30일

- 레포 본체는 TypeScript MCP 중심이지만, **OCR·데이터 정제·일회성 Python 스크립트**에는 이 SDK가 REST 직접 호출보다 유지보수 비용이 낮다.
- `claude-code`(CLI)와 역할 분담: 대화형·에이전트 작업은 CLI/MCP, **고정 파이프라인 배치**는 Python SDK 후보.
- created: 2026-06-07, expires: 2026-07-07

## Owner Notes

- TypeScript `npm run build` 파이프라인과 섞지 말고, Python venv·`.env`의 `ANTHROPIC_API_KEY`만 쓰는 **별도 스크립트**로 두는 게 단순하다.

## 관련 소스
- [anthropic-sdk-python-github-why-how](../../ingest/insights/anthropic-sdk-python-github-why-how.md)
