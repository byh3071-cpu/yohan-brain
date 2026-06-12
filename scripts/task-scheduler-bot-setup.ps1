$ErrorActionPreference = "Stop"

# 텔레그램 봇 상시 등록 — **봇 전용 노트북 1대에서만 실행할 것** (multi-pc-sync.md 참고).
# PC 간 중복 기동 시 텔레그램 polling 409 충돌. 같은 PC 중복은 PID 락이 막는다.
$taskName = "YohanOS-TelegramBot"

$runner = Join-Path $PSScriptRoot "run-telegram-bot.ps1"
$runnerVbs = Join-Path $PSScriptRoot "run-telegram-bot-hidden.vbs"
$wscript = Join-Path $env:WINDIR "System32\wscript.exe"

if (-not (Test-Path $runner)) {
  throw "Runner script not found: $runner"
}
if (-not (Test-Path $runnerVbs)) {
  throw "Hidden VBS runner not found: $runnerVbs"
}
if (-not (Test-Path $wscript)) {
  throw "wscript.exe not found: $wscript"
}

$arg = "`"$runnerVbs`""
$action = New-ScheduledTaskAction -Execute $wscript -Argument $arg

# 로그온 시 자동 기동. 비정상 종료(exit code != 0) 시 5분 간격 3회 재시작.
$trigger = New-ScheduledTaskTrigger -AtLogOn -User "$env:UserDomain\$env:UserName"

$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -MultipleInstances IgnoreNew `
  -RestartCount 3 `
  -RestartInterval (New-TimeSpan -Minutes 5) `
  -ExecutionTimeLimit ([TimeSpan]::Zero)

# 관리자 권한이면 Highest로, 일반 권한이면 현재 사용자 컨텍스트로 fallback
try {
  Register-ScheduledTask `
    -TaskName $taskName `
    -User "$env:UserDomain\$env:UserName" `
    -RunLevel Highest `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Yohan OS telegram bot always-on at logon (hidden vbs, restart x3)" `
    -Force | Out-Null
} catch {
  Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Yohan OS telegram bot always-on at logon (user-level, hidden vbs, restart x3)" `
    -Force | Out-Null
  Write-Host "Registered without -RunLevel Highest (non-admin fallback)."
}

Write-Host "Registered task: $taskName"
Write-Host "Run now: Start-ScheduledTask -TaskName `"$taskName`""
Write-Host "Verify : npm run telegram:health -- --require-lock"
Write-Host "Delete : powershell -ExecutionPolicy Bypass -File scripts\task-scheduler-bot-remove.ps1"
