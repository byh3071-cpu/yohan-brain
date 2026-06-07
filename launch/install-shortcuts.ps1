# Create Desktop / Workspace shortcuts (.lnk) pointing at launch/*.bat
param(
  [ValidateSet("Desktop", "Workspace", "Both")]
  [string]$Target = "Both"
)

$ErrorActionPreference = "Stop"
. "$PSScriptRoot\_repo.ps1"
$repo = Get-YohanOsRoot
$launch = Join-Path $repo "launch"

$shortcuts = @(
  @{ Name = "Yohan Bot";           Bat = "bot.bat";           Desc = "Telegram bot (npm run bot)" }
  @{ Name = "Yohan Dashboard";     Bat = "dashboard.bat";     Desc = "Dashboard start :4000" }
  @{ Name = "Yohan Dashboard Dev"; Bat = "dashboard-dev.bat"; Desc = "Dashboard dev safe mode" }
  @{ Name = "Yohan Batch";         Bat = "batch-once.bat";    Desc = "automation:batch once" }
  @{ Name = "Yohan RSS Ingest";    Bat = "ingest-rss.bat";    Desc = "ingest:all feeds" }
  @{ Name = "Yohan Health";        Bat = "health-check.bat";  Desc = "telegram health + smoke" }
)

function Get-ShortcutDir {
  param([string]$Kind)
  if ($Kind -eq "Desktop") {
    return [Environment]::GetFolderPath("Desktop")
  }
  $workspace = Split-Path -Parent $repo
  return Join-Path $workspace "Yohan-Launch"
}

function Install-ShortcutsTo {
  param([string]$Dir)
  if ($Dir -ne (Get-ShortcutDir "Desktop")) {
    New-Item -ItemType Directory -Path $Dir -Force | Out-Null
  }
  $shell = New-Object -ComObject WScript.Shell
  foreach ($s in $shortcuts) {
    $batPath = Join-Path $launch $s.Bat
    if (-not (Test-Path $batPath)) { throw "Missing: $batPath" }
    $lnkPath = Join-Path $Dir ($s.Name + ".lnk")
    $sc = $shell.CreateShortcut($lnkPath)
    $sc.TargetPath = $batPath
    $sc.WorkingDirectory = $repo
    $sc.Description = $s.Desc
    $sc.Save()
    Write-Host "  + $lnkPath"
  }
}

Write-Host "=== Install Yohan OS launch shortcuts ===" -ForegroundColor Cyan
Write-Host "Repo: $repo"

if ($Target -eq "Desktop" -or $Target -eq "Both") {
  Write-Host "`nDesktop:"
  Install-ShortcutsTo (Get-ShortcutDir "Desktop")
}

if ($Target -eq "Workspace" -or $Target -eq "Both") {
  Write-Host "`nWorkspace (Yohan-Launch):"
  Install-ShortcutsTo (Get-ShortcutDir "Workspace")
}

Write-Host "`nDone."
