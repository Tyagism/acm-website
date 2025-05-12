@echo off
echo Starting ACM Website Servers...
echo.

:: Create timestamp for auto-refresh detection
echo %TIME% > server-start-time.txt

:: Check if data directory exists
if not exist "data\" (
    echo Creating data directory...
    mkdir data
)

:: Check if applications.json exists
if not exist "data\applications.json" (
    echo Creating empty applications.json file...
    echo [] > data\applications.json
)

:: Check if messages.json exists
if not exist "data\messages.json" (
    echo Creating empty messages.json file...
    echo [] > data\messages.json
)

echo Data files are ready.
echo.

:: Create build directories if they don't exist
if not exist "build\" mkdir build
if not exist "build\main\" mkdir build\main
if not exist "build\export\" mkdir build\export

:: Clean up any previous server-runner.go file
if exist "server-runner.go" del server-runner.go

:: Build main server
echo Building main server...
cd build\main
go build ..\..\server.go
cd ..\..

:: Build export server as a standalone executable
echo Building export server...
cd build\export
go build ..\..\export-server.go
cd ..\..

echo Build complete!
echo.

:: Start the servers
start "ACM Main Server" /d "build\main" server.exe
start "ACM Export Server" /d "build\export" export-server.exe

echo Servers started successfully!
echo Main server running on http://localhost:8081
echo Export server running on http://localhost:8082
echo.

echo Press any key to shut down the servers...
pause > nul

:: Kill the servers when this window is closed
taskkill /F /FI "WINDOWTITLE eq ACM Main Server*" > nul 2>&1
taskkill /F /FI "WINDOWTITLE eq ACM Export Server*" > nul 2>&1

echo Servers have been shut down.
timeout /t 3 > nul 