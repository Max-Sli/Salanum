@echo off
echo Starting Solana Messenger Mobile Development...
echo.

echo Installing dependencies...
call npm install

echo.
echo Installing iOS dependencies...
cd ios
call pod install
cd ..

echo.
echo Starting Metro bundler...
echo Android will run on emulator/device
echo iOS will run on simulator/device
echo.

call npm start

pause
