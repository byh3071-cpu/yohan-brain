# Run automation:batch once (telegram OCR / ingest pipeline)
. "$PSScriptRoot\_repo.ps1"
Write-Host "=== Yohan OS Automation Batch ===" -ForegroundColor Cyan
Invoke-YohanNpm @("run", "automation:batch")
Write-Host "[launch] done. Press Enter to close."
Read-Host | Out-Null
