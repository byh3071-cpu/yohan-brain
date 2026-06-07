# Dashboard stable mode — port cleanup, build if needed, start:4000, open browser
. "$PSScriptRoot\_repo.ps1"

$port = if ($env:DASHBOARD_PORT) { $env:DASHBOARD_PORT } else { "4000" }
$root = Set-YohanOsCwd

Write-Host "=== Yohan OS Dashboard (port $port) ===" -ForegroundColor Cyan
Clear-TcpPort -Port ([int]$port)

$buildId = Join-Path $root "dashboard\.next\BUILD_ID"
if (-not (Test-Path $buildId)) {
  Write-Host "[launch] .next missing — running dashboard:build ..."
  Invoke-YohanNpm @("run", "dashboard:build")
}

$url = "http://localhost:$port"
Write-Host "[launch] starting dashboard at $url"
Start-Process $url

Invoke-YohanNpm @("run", "dashboard:start:$port")
