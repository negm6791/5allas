@echo off
title Launching 5allas...
echo Starting your creative to-do list...
cd /d "%~dp0"

echo Cleaning up old processes...
:: Kill any existing node processes to prevent port conflicts (Double-click safety)
taskkill /F /IM node.exe /T > nul 2>&1

echo Starting development server...
:: running npm run dev will now auto-open the browser thanks to vite.config.ts
npm run dev

pause
