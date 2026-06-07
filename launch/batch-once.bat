@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0batch-once.ps1" %*
