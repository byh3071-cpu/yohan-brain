Option Explicit

' Canonical home script — installed to %USERPROFILE%\git-auto-pull.vbs via install-git-auto-pull.ps1
' Placeholder __YOHAN_OS_REPO__ is replaced at install time (PC별 clone 경로).

Dim shell, fso, repoPath, logPath, ts, cmd, exitCode
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

repoPath = "__YOHAN_OS_REPO__"
logPath = shell.ExpandEnvironmentStrings("%USERPROFILE%") & "\git-autopull.log"
ts = Year(Now) & "-" & Right("0" & Month(Now), 2) & "-" & Right("0" & Day(Now), 2) & " " & _
     Right("0" & Hour(Now), 2) & ":" & Right("0" & Minute(Now), 2) & ":" & Right("0" & Second(Now), 2)

If Not fso.FolderExists(repoPath) Then
  Call AppendLog(logPath, "[" & ts & "] SKIP repo missing: " & repoPath)
  WScript.Quit 1
End If

cmd = "cmd /c cd /d """ & repoPath & """ && git pull --rebase origin main"
exitCode = shell.Run(cmd, 0, True)
Call AppendLog(logPath, "[" & ts & "] git pull --rebase exit=" & exitCode & " repo=" & repoPath)

Sub AppendLog(path, line)
  Dim stream
  Set stream = fso.OpenTextFile(path, 8, True, -1)
  stream.WriteLine line
  stream.Close
End Sub
