Option Explicit

' 배치 VBS와 달리 True(대기) + 종료 코드 전파 —
' Task Scheduler 재시작 정책이 봇 프로세스 수명을 추적해야 하므로.
Dim fso, shell, scriptDir, ps1Path, cmd, exitCode
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
ps1Path = scriptDir & "\run-telegram-bot.ps1"

cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & ps1Path & """"

' 0 = hidden window, True = wait for exit
exitCode = shell.Run(cmd, 0, True)
WScript.Quit exitCode
