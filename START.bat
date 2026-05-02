@echo off
echo.
echo ============================================
echo   Bristi's Birthday Website - Quick Start
echo ============================================
echo.
echo Installing dependencies...
echo.
call npm install
echo.
echo Building project...
echo.
call npm run build
echo.
echo.
echo ============================================
echo   Server is starting...
echo ============================================
echo.
echo Open your browser and go to:
echo   http://localhost:3000
echo.
echo Available pages:
echo   - Main: http://localhost:3000
echo   - Reply: http://localhost:3000/reply.html
echo   - Admin: http://localhost:3000/admin.html
echo.
echo Press Ctrl+C to stop the server.
echo.
echo ============================================
echo.
call npm run server
pause
