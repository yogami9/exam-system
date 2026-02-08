@echo off
REM Automated Setup Script for Windows
REM This script will install dependencies and initialize the database

echo ========================================
echo BIPS Exam System - Automated Setup
echo ========================================
echo.

echo Step 1/3: Installing Node.js dependencies...
echo.
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    echo Please make sure Node.js is installed
    pause
    exit /b 1
)
echo.
echo ✓ Node.js dependencies installed
echo.

echo Step 2/3: Installing Python dependencies...
echo.
pip install pymongo python-dotenv
if %errorlevel% neq 0 (
    echo ERROR: pip install failed
    echo Please make sure Python is installed
    pause
    exit /b 1
)
echo.
echo ✓ Python dependencies installed
echo.

echo Step 3/3: Testing MongoDB connection...
echo.
python test_connection.py
if %errorlevel% neq 0 (
    echo.
    echo WARNING: MongoDB connection test failed
    echo Please check your internet connection and MongoDB Atlas settings
    echo You can still continue, but database initialization may fail
    echo.
    pause
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Initialize database: python setup_mongodb_complete.py
echo 2. Start development server: npm run dev
echo 3. Visit: http://localhost:3000
echo.
pause
