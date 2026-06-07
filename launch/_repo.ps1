# Shared helpers for Yohan OS launch/*.ps1 (dot-source from launch folder)

function Get-YohanOsRoot {
  if ($env:YOHAN_OS_ROOT -and (Test-Path (Join-Path $env:YOHAN_OS_ROOT "package.json"))) {
    return (Resolve-Path $env:YOHAN_OS_ROOT).Path
  }
  $launchDir = $PSScriptRoot
  if (-not $launchDir) { $launchDir = Split-Path -Parent $MyInvocation.MyCommand.Path }
  return (Resolve-Path (Join-Path $launchDir "..")).Path
}

function Set-YohanOsCwd {
  param([string]$Root = (Get-YohanOsRoot))
  Set-Location -LiteralPath $Root
  return $Root
}

function Invoke-YohanNpm {
  param(
    [Parameter(Mandatory)][string[]]$Args,
    [int]$ExitCode = 0
  )
  $root = Set-YohanOsCwd
  Write-Host "[launch] cwd=$root"
  Write-Host "[launch] npm $($Args -join ' ')"
  & npm @Args
  if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
    Write-Host "[launch] exit=$LASTEXITCODE" -ForegroundColor Red
    if ($ExitCode -ne 0) { exit $LASTEXITCODE }
  }
}

function Clear-TcpPort {
  param([int]$Port)
  $lines = netstat -ano -p tcp 2>$null
  foreach ($line in $lines) {
    if ($line -notmatch ":$Port\s") { continue }
    $cols = ($line -split '\s+') | Where-Object { $_ -ne '' }
    $pid = $cols[-1]
    if ($pid -match '^\d+$') {
      Write-Host "[launch] freeing port $Port PID $pid"
      taskkill /PID $pid /F 2>$null | Out-Null
    }
  }
}
