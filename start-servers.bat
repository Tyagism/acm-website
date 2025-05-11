@echo off
echo Starting ACM Website Servers...
echo.

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

:: Create a new window for the main server
start "ACM Main Server" cmd /c "go run server.go && pause"

:: Wait for a moment to ensure first server starts properly
timeout /t 2 /nobreak > nul

:: Create a new window for the export server
start "ACM Export Server" cmd /c "go run export-server.go && pause"

echo.
echo Servers started successfully!
echo Main server is running on port 8081
echo Export server is running on port 8082
echo.
echo You can access the website at: http://localhost:8081
echo.
echo Press any key to shut down both servers...
pause > nul

:: Kill both servers when this window is closed
taskkill /F /FI "WINDOWTITLE eq ACM Main Server*" > nul 2>&1
taskkill /F /FI "WINDOWTITLE eq ACM Export Server*" > nul 2>&1

echo Servers have been shut down.
timeout /t 3 > nul 