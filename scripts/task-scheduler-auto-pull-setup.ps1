# Registers YohanAutoPull — runs repo auto-pull-hidden.vbs (delegates to %USERPROFILE%\git-auto-pull.vbs).
$ErrorActionPreference = "Stop"

$taskName = "YohanAutoPull"
$repoRoot = Split-Path -Parent $PSScriptRoot
$entryVbs = Join-Path $repoRoot "auto-pull-hidden.vbs"
$wscript = Join-Path $env:WINDIR "System32\wscript.exe"
$homeScript = Join-Path $env:USERPROFILE "git-auto-pull.vbs"

if (-not (Test-Path $entryVbs)) {
  throw "Entry VBS not found: $entryVbs"
}
if (-not (Test-Path $wscript)) {
  throw "wscript.exe not found: $wscript"
}
if (-not (Test-Path $homeScript)) {
  Write-Warning "Missing $homeScript — run scripts\install-git-auto-pull.ps1 first."
}

$arg = "`"$entryVbs`""
$action = New-ScheduledTaskAction -Execute $wscript -Argument $arg

# 30분 간격 반복 (Once + RepetitionInterval)
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddMinutes(1) `
  -RepetitionInterval (New-TimeSpan -Minutes 30) `
  -RepetitionDuration ([TimeSpan]::MaxValue)

$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

try {
  Register-ScheduledTask `
    -TaskName $taskName `
    -User "$env:UserDomain\$env:UserName" `
    -RunLevel Highest `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Yohan OS git pull every 30m via auto-pull-hidden.vbs -> git-auto-pull.vbs" `
    -Force | Out-Null
} catch {
  Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Yohan OS git pull every 30m (user-level)" `
    -Force | Out-Null
  Write-Host "Registered without -RunLevel Highest (non-admin fallback)."
}

Write-Host "Registered task: $taskName"
Write-Host "Entry: $entryVbs"
Write-Host "Run now: Start-ScheduledTask -TaskName `"$taskName`""
Write-Host "Delete : Unregister-ScheduledTask -TaskName `"$taskName`" -Confirm:`$false"
