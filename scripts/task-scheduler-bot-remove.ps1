$ErrorActionPreference = "Stop"

$taskName = "YohanOS-TelegramBot"

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
  # 태스크가 실행 중이면 먼저 중지 (봇 프로세스는 npm 트리 — 별도 종료 필요할 수 있음)
  Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
  Write-Host "Removed task: $taskName"
} else {
  Write-Host "Task not found: $taskName"
}
