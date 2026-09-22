@echo off
REM ============================================================
REM  GMKtec N100 + LG StanbyMe 2 키오스크 실행 스크립트
REM  - Chrome을 --kiosk(전체화면, 주소창 없음) 모드로 index.html 실행
REM  - Chrome이 죽거나 닫히면 자동으로 다시 실행(워치독 루프)
REM  - Windows 시작프로그램(run-hidden.vbs)에서 이 스크립트를 호출한다
REM ============================================================
setlocal enabledelayedexpansion

REM --- 이 스크립트 상위 폴더(프로젝트 루트)의 절대경로 구하기 ---
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "APP_PATH=%ROOT%\index.html"
set "APP_PATH=%APP_PATH:\=/%"
set "APP_URL=file:///%APP_PATH%"

REM --- Chrome 실행파일 위치 찾기 (설치 방식에 따라 경로가 다름) ---
set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if not defined CHROME (
    echo [오류] Chrome을 찾을 수 없습니다. 먼저 Google Chrome을 설치하세요.
    pause
    exit /b 1
)

REM --- 워치독 루프: Chrome이 종료되면(크래시/오조작) 즉시 재실행 ---
:loop
"%CHROME%" ^
  --kiosk ^
  --app="%APP_URL%" ^
  --incognito ^
  --noerrdialogs ^
  --disable-infobars ^
  --disable-session-crashed-bubble ^
  --disable-translate ^
  --disable-pinch ^
  --overscroll-history-navigation=0 ^
  --no-first-run ^
  --autoplay-policy=no-user-gesture-required

goto loop
