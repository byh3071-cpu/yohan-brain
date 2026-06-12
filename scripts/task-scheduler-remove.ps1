$ErrorActionPreference = "Stop"

# 구버전(-30min) 작업이 남아 있는 PC도 함께 정리한다.
$taskNames = @("YohanOS-AutomationBatch", "YohanOS-AutomationBatch-30min")

foreach ($taskName in $taskNames) {
  if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Removed task: $taskName"
  } else {
    Write-Host "Task not found: $taskName"
  }
}
