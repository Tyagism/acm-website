@echo off
echo Starting ACM Website Servers...
echo.

:: Start the main server in a separate window
start "ACM Main Server" cmd /k acm-combined.exe -server=main

:: Start the export server in a separate window
start "ACM Export Server" cmd /k acm-combined.exe -server=export

echo.
echo Servers started:
echo Main server running on http://localhost:8081
echo Export server running on http://localhost:8082
echo.
echo Each server is running in its own window. Close those windows to stop the servers.
echo. 