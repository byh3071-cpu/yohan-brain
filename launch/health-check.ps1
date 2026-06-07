param(
  [switch]$RequireLock
)

. "$PSScriptRoot\_repo.ps1"

Write-Host "=== Yohan OS Health Check ===" -ForegroundColor Cyan
Set-YohanOsCwd | Out-Null

if ($RequireLock) {
  npm run telegram:health -- --require-lock
} else {
  npm run telegram:health
}

Write-Host ""
node scripts/smoke-get-context.mjs

Write-Host "[launch] done. Press Enter to close."
Read-Host | Out-Null
