@echo off
echo ==========================================
echo  CLEANING NODE ENVIRONMENT SAFELY
echo ==========================================

:: Remove node_modules
if exist node_modules (
  echo Deleting node_modules...
  rmdir /s /q node_modules
)

:: Remove package-lock.json
if exist package-lock.json (
  echo Deleting package-lock.json...
  del /f /q package-lock.json
)

:: Clear npm cache
echo Clearing npm cache...
npm cache clean --force

:: Reinstall dependencies
echo Reinstalling dependencies...
npm install

echo ==========================================
echo  RESET COMPLETE ✅
echo  Now run: npm start
echo ==========================================
pause
