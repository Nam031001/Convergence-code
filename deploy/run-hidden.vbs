' launch-kiosk.bat 를 검은 콘솔창 없이 백그라운드로 실행한다.
' Windows 시작프로그램(shell:startup)에 이 파일의 바로가기를 등록해서 사용한다.
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

Set shell = CreateObject("WScript.Shell")
shell.Run """" & scriptDir & "\launch-kiosk.bat""", 0, False
