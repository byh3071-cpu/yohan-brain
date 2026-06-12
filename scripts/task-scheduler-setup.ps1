$ErrorActionPreference = "Stop"

$taskName = "YohanOS-AutomationBatch"
$legacyTaskName = "YohanOS-AutomationBatch-30min"

# 구버전(30분 주기) 작업이 남아 있으면 이중 실행을 막기 위해 먼저 제거
if (Get-ScheduledTask -TaskName $legacyTaskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $legacyTaskName -Confirm:$false
  Write-Host "Removed legacy task: $legacyTaskName"
}
$runner = Join-Path $PSScriptRoot "run-automation-batch.ps1"
$runnerVbs = Join-Path $PSScriptRoot "run-automation-batch-hidden.vbs"
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

# 하루 2회(09:00, 21:00)만 실행 — 루틴 텔레그램 알림도 하루 최대 2회가 된다.
# (검토·실패 알림은 배치 실행 시점에 즉시 발송되는 기존 동작 유지)
$arg = "`"$runnerVbs`""
$action = New-ScheduledTaskAction -Execute $wscript -Argument $arg

$triggers = @(
  (New-ScheduledTaskTrigger -Daily -At (Get-Date -Hour 9 -Minute 0 -Second 0)),
  (New-ScheduledTaskTrigger -Daily -At (Get-Date -Hour 21 -Minute 0 -Second 0))
)

$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 25)

# 관리자 권한이면 Highest로, 일반 권한이면 현재 사용자 컨텍스트로 fallback
try {
  Register-ScheduledTask `
    -TaskName $taskName `
    -User "$env:UserDomain\$env:UserName" `
    -RunLevel Highest `
    -Action $action `
    -Trigger $triggers `
    -Settings $settings `
    -Description "Yohan OS automation batch twice daily 09:00/21:00 (hidden vbs)" `
    -Force | Out-Null
} catch {
  Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $triggers `
    -Settings $settings `
    -Description "Yohan OS automation batch twice daily 09:00/21:00 (user-level, hidden vbs)" `
    -Force | Out-Null
  Write-Host "Registered without -RunLevel Highest (non-admin fallback)."
}

Write-Host "Registered task: $taskName"
Write-Host "Run now: Start-ScheduledTask -TaskName `"$taskName`""
Write-Host "Delete : Unregister-ScheduledTask -TaskName `"$taskName`" -Confirm:`$false"
