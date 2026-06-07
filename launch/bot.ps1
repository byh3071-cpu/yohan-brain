# Telegram bot — keep this window open while polling
. "$PSScriptRoot\_repo.ps1"
Write-Host "=== Yohan OS Telegram Bot ===" -ForegroundColor Cyan
Write-Host "Stop: Ctrl+C | Health: launch\health-check.ps1"
Invoke-YohanNpm @("run", "bot")
