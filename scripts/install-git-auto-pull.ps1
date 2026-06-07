# Installs %USERPROFILE%\git-auto-pull.vbs from repo template (PC-specific repo path).
param(
  [string]$RepoRoot = "",
  [switch]$Force
)

$ErrorActionPreference = "Stop"

if (-not $RepoRoot) {
  $RepoRoot = Split-Path -Parent $PSScriptRoot
}

$template = Join-Path $PSScriptRoot "git-auto-pull.template.vbs"
$dest = Join-Path $env:USERPROFILE "git-auto-pull.vbs"

if (-not (Test-Path $template)) {
  throw "Template not found: $template"
}

if ((Test-Path $dest) -and -not $Force) {
  Write-Host "Already exists (use -Force to overwrite): $dest"
  exit 0
}

$raw = Get-Content -Path $template -Raw -Encoding UTF8
$content = $raw -replace '__YOHAN_OS_REPO__', $RepoRoot

Set-Content -Path $dest -Value $content -Encoding UTF8
Write-Host "Installed: $dest"
Write-Host "Repo path: $RepoRoot"
Write-Host "Log: $env:USERPROFILE\git-autopull.log"
Write-Host "Next: powershell -ExecutionPolicy Bypass -File scripts\task-scheduler-auto-pull-setup.ps1"
