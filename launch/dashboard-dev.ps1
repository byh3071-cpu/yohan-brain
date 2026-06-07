# Dashboard dev safe mode (UI work) — wraps npm run dashboard:dev:safe
. "$PSScriptRoot\_repo.ps1"
Write-Host "=== Yohan OS Dashboard DEV (safe) ===" -ForegroundColor Yellow
Invoke-YohanNpm @("run", "dashboard:dev:safe")
