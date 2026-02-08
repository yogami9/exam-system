#!/bin/bash
# Automated Setup Script for Mac/Linux
# This script will install dependencies and initialize the database

echo "========================================"
echo "BIPS Exam System - Automated Setup"
echo "========================================"
echo ""

echo "Step 1/3: Installing Node.js dependencies..."
echo ""
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed"
    echo "Please make sure Node.js is installed"
    exit 1
fi
echo ""
echo "✓ Node.js dependencies installed"
echo ""

echo "Step 2/3: Installing Python dependencies..."
echo ""
pip3 install pymongo python-dotenv
if [ $? -ne 0 ]; then
    echo "ERROR: pip install failed"
    echo "Please make sure Python 3 is installed"
    exit 1
fi
echo ""
echo "✓ Python dependencies installed"
echo ""

echo "Step 3/3: Testing MongoDB connection..."
echo ""
python3 test_connection.py
if [ $? -ne 0 ]; then
    echo ""
    echo "WARNING: MongoDB connection test failed"
    echo "Please check your internet connection and MongoDB Atlas settings"
    echo "You can still continue, but database initialization may fail"
    echo ""
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Initialize database: python3 setup_mongodb_complete.py"
echo "2. Start development server: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
