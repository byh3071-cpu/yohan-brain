$ErrorActionPreference = "Stop"

# 레포 루트 기준으로 실행 (Task Scheduler에서 cwd 유실 방지)
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

# 로그 디렉터리 — telegram-bot.log는 .gitignore (메시지 단위 churn + 프라이버시)
$logDir = Join-Path $repoRoot "memory\logs"
if (-not (Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir | Out-Null
}

$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logFile = Join-Path $logDir "telegram-bot.log"
"[$now] START telegram bot" | Out-File -FilePath $logFile -Append -Encoding utf8

try {
  npm run bot 2>&1 | Out-File -FilePath $logFile -Append -Encoding utf8
  $code = $LASTEXITCODE
  $done = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "[$done] EXIT telegram bot (code=$code)" | Out-File -FilePath $logFile -Append -Encoding utf8
  exit $code
} catch {
  $fail = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "[$fail] FAIL telegram bot :: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append -Encoding utf8
  exit 1
}
