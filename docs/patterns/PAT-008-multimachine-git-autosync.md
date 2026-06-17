---
id: PAT-008
패턴명: 멀티머신 git 부팅 자동풀 (전체fetch + clean-FF + 자기배포)
카테고리: git
증상: 다른 PC서 push/merge 했는데 이 PC 자동풀이 "작업 사라진 듯" 보이고 로컬 master 가 안 따라온다
원인: 자동풀이 현재 체크아웃 브랜치만 단일 refspec fetch → 타 브랜치 tracking ref stale + 실행 사본이 repo와 분리돼 드리프트 + 머신경로 하드코딩
적용조건: 2대 이상 PC가 같은 GitHub 레포군을 부팅 자동풀로 동기화하는 모든 환경
출처프로젝트: boot-auto-pull-setup (git-auto-pull.ps1 v3, 집컴 실측 검증)
태그: [git, multi-machine, sync, automation, self-update, powershell]
발견일: 2026-06-17
출처DevLog: (2026-06-17) boot-auto-pull v3 — 멀티PC 양방향 동기화 하드닝
---

## 증상
A PC에서 커밋·푸시·머지 후 B PC를 켜면 "작업이 사라진 것처럼" 보인다. 자동풀 로그는 해당 레포를 `UpToDate`로 찍는데, 실제로는 로컬 `master`가 `origin/master`보다 수십 커밋 뒤처져 있고 `git log origin/master`도 옛값이다. 에이전트가 "원격에만 있고 로컬엔 없다 = 다시 구현해야 하나"로 오판한다.

## 원인
세 갈래가 겹친 **설계 한계(버그 아님)**:
1. **단일 브랜치 fetch** — 자동풀이 `+refs/heads/<현재>:refs/remotes/origin/<현재>` 한 refspec만 fetch. feature 브랜치에 체크아웃돼 있으면 `origin/master` tracking ref가 갱신 안 됨 → stale 착시. 체크아웃 안 된 로컬 `master`는 영영 안 당겨짐.
2. **실행 사본 ≠ repo** — 실제 도는 건 `%USERPROFILE%` 사본인데 자동풀은 repo만 갱신. 코드 고쳐 push해도 사본 재배포를 사람이 깜빡하면 구버전이 계속 돈다(드리프트).
3. **머신경로 하드코딩** — WorkspaceRoot 등을 스크립트에 박으면 PC마다 문자열 치환 필요 → plain copy/자기배포가 경로를 깨뜨림.

## 해결 — 3축 + 안전
1. **전체 refspec fetch**: `git fetch --prune origin '+refs/heads/*:refs/remotes/origin/*'` — 매 실행 모든 브랜치 tracking ref 갱신. stale 착시 박멸. (FF/merge 판정은 여전히 현재 브랜치 단일 ref 기준 → "multiple branches" 충돌 없음.)
2. **다중 브랜치 clean-FF**: 체크아웃 안 된 로컬 브랜치를 `git fetch . <src>:<dst>`로 전진. `+` 없으면 비-FF를 **거부**(분기/되감기 위험 0). 현재 브랜치는 머지 로직이 처리하므로 제외.
   ```powershell
   foreach ($lb in (git -C $repo for-each-ref --format='%(refname:short)' refs/heads)) {
     if ($lb -eq $current) { continue }
     git -C $repo show-ref --verify --quiet "refs/remotes/origin/$lb"; if ($LASTEXITCODE -ne 0) { continue }
     git -C $repo fetch . ("refs/remotes/origin/{0}:refs/heads/{0}" -f $lb)   # FF-only, 실패=무시
   }
   ```
3. **자기배포**: 풀로 갱신된 repo 사본을 실행 위치로 자동 복사. **안전장치 필수** — ①채택 전 문법검사(`[Parser]::ParseFile`) 통과분만 ②직전본 `.bak` 백업 ③재-exec 안 함(다음 실행부터 적용). 깨진 push가 양쪽을 brick하는 것 방지.
- **머신값 외부화(자기배포의 전제)**: WorkspaceRoot 등 PC별 값은 스크립트에서 빼서 머신 로컬 config(`machine.config.json`)에. → 양쪽 PC·repo가 byte-동일 → plain copy/자기배포 안전.
- **충돌 정책 = skip 유지**: dirty/diverged 레포는 덮어쓰지 말고 건너뛰고 알림. 작업 유실 0.

- ✅ 이렇게: 전체fetch + 다중 clean-FF + 외부config + 문법게이트 자기배포 + skip
- ❌ 이렇게 말고: 현재 브랜치만 fetch + 경로 하드코딩 + 수동 재배포 의존
- 왜: 실측(boot-auto-pull-setup v3). 어느 브랜치에 있어도 로컬 master 최신 유지 → 다른 PC 가서 즉시 이어서. 고치고 push하면 양쪽 자동 반영(최초 1회 부트스트랩만 수동).

## 적용조건
- 2대+ PC가 GitHub(SSoT)로 같은 레포군을 동기화. 단일 PC엔 과함.
- 자기배포는 **외부 config 분리가 선행**돼야 안전(안 하면 plain copy가 머신값을 깨뜨림).
- 보조 습관 필수: "자리 뜨기 전 push, 앉으면 pull". 자동풀은 pull만 대행 — push는 사람 몫(안 하면 다음 PC가 못 봄).
- auto-push는 넣지 말 것(미완성/실험 커밋까지 새어나감). 풀 자동 + 푸시 수동이 안전한 분담.
