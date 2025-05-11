@echo off
echo Creating desktop shortcut for ACM Website servers...

:: Get the current directory
set "CURRENT_DIR=%~dp0"
set "TARGET_PATH=%CURRENT_DIR%start-servers.bat"
set "SHORTCUT_NAME=Start ACM Website.lnk"
set "DESKTOP_PATH=%USERPROFILE%\Desktop"

:: Create the shortcut using PowerShell
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_PATH%\%SHORTCUT_NAME%'); $Shortcut.TargetPath = '%TARGET_PATH%'; $Shortcut.WorkingDirectory = '%CURRENT_DIR%'; $Shortcut.IconLocation = 'shell32.dll,22'; $Shortcut.Description = 'Start ACM Website servers'; $Shortcut.Save()"

echo.
echo Shortcut created successfully on your desktop!
echo.
echo Press any key to exit...
pause > nul 