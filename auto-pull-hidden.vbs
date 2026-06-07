Option Explicit

' Legacy entrypoint — delegates to canonical home boot script.
Dim shell
Set shell = CreateObject("WScript.Shell")
shell.Run "wscript.exe """ & shell.ExpandEnvironmentStrings("%USERPROFILE%") & "\git-auto-pull.vbs""", 0, False
