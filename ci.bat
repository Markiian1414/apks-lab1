@echo off
setlocal

if exist package-lock.json (
  call npm ci
) else if exist npm-shrinkwrap.json (
  call npm ci
) else (
  call npm install
)
if errorlevel 1 exit /b %errorlevel%

call npm run build
if errorlevel 1 exit /b %errorlevel%

call npm test
if errorlevel 1 exit /b %errorlevel%

if not exist dist\hello exit /b 1
exit /b 0
