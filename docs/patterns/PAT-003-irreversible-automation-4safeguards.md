---
id: PAT-003
패턴명: 되돌릴 수 없는 자동화의 4중 안전장치
카테고리: state
증상: 자동 매매·결제·발송·삭제 봇이 폭주해 금전·데이터 손실이 누적된다
원인: 단발 가드(잔고 체크 1개)만 있고, 누적 한도·연속실패 정지·재개 통제·에러 분류가 없다
적용조건: 사람 개입 없이 되돌릴 수 없는 부작용(주문·송금·메일·삭제)을 실행하는 모든 루프
출처프로젝트: yohan-dca-bot(src/risk/lockout.py + tests, 검증된 정본)
태그: [automation, safety, circuit-breaker, capability-gating, finance]
발견일: 2026-06-15
출처DevLog: Fable 5 시스템 프롬프트 다중렌즈 흡수 분석 (capability gating + 수치 하드리밋)
---

## 증상
자동화가 한 번 잘못 돌면 멈추는 사람이 없어 손실이 선형/지수로 누적. 특히 LLM 신호 기반 자동 실행은 환각 1건이 실제 주문/송금으로 직결된다.

## 원인
"실행 직전 조건 1개 체크"는 단발 방어다. ①한도 ②연속실패 ③재개 ④에러종류를 구분하지 않으면, 일시 장애(잔고부족·rate limit)와 진짜 버그가 같은 카운터에 섞여 정지가 안 걸리거나 과도하게 걸린다.

## 해결 — 4중 장치 (전부 코드로)
1. **하드 수치 한도** — 작업당/일일 상한(예: `daily_limit_krw`), 초과시 차단
2. **연속실패 자동정지** — 연속 N회 진짜 에러면 `_pause()`(서킷 브레이커)
3. **재개 = 인간 명시행위 전용** — `resume()`는 사람만. **자동 타이머 재개 금지**
4. **에러 분류** — 회복 가능(잔고부족·sanity)과 진짜 API 에러를 구분, **후자만** 실패 카운터 증가

```python
def record_api_error(self):
    self.consecutive_errors += 1
    if self.consecutive_errors >= self.max_consecutive_errors:
        self._pause()           # ② 자동 정지
def resume(self):               # ③ 사람만 호출 (자동 타이머 ✗)
    self.paused = False; self.consecutive_errors = 0
```

- ✅ 이렇게: 한도+서킷+수동재개+에러분류, 상태 영속화(재시작에도 보존)
- ❌ 이렇게 말고: `if balance > amount: place_order()` (단발 가드뿐, 폭주 무방비)
- 왜: 실측 정본(dca-bot lockout.py). 일시장애를 실패로 안 세야 헛정지 없고, 진짜 에러엔 즉시 멈춘다.

## 적용조건
- 금전·송금·대량 발송·삭제 등 되돌릴 수 없는 작업. 읽기/조회 자동화엔 과함.
- 상태(`paused`·카운터)는 **영속화** — 프로세스 재시작으로 리셋되면 서킷이 무력화.
- LLM이 실행 결정을 내리면 이 장치는 **필수**(LLM은 결정경로에서 빼는 게 더 안전 — PAT는 차선).
