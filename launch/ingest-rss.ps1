# RSS ingest all feeds (weekly manual)
. "$PSScriptRoot\_repo.ps1"
Write-Host "=== Yohan OS RSS Ingest (all) ===" -ForegroundColor Cyan
Invoke-YohanNpm @("run", "ingest:all")
Write-Host "[launch] done. Press Enter to close."
Read-Host | Out-Null
