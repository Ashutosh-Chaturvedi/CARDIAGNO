@echo off
echo ============================================
echo   CardiagnoAI - Ollama Setup Script
echo ============================================
echo.
echo This script will help you set up Ollama for CardiagnoAI
echo.
echo Step 1: Download Ollama
echo ----------------------------------------
echo Opening Ollama download page...
start https://ollama.com/download
echo.
echo Please:
echo 1. Download Ollama for Windows
echo 2. Install it
echo 3. Come back here and press any key to continue
echo.
pause
echo.
echo Step 2: Install AI Models
echo ----------------------------------------
echo Installing chat model (llama3.2)...
ollama pull llama3.2
echo.
echo Installing vision model (llava)...
ollama pull llava
echo.
echo Step 3: Verify Installation
echo ----------------------------------------
echo Checking installed models...
ollama list
echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Your CardiagnoAI is now configured to use:
echo - Chat Model: llama3.2
echo - Vision Model: llava
echo - Server: http://localhost:11434
echo.
echo Next steps:
echo 1. Start CardiagnoAI: npm start
echo 2. Scan a medical report
echo 3. Chat with AI assistant
echo.
echo ============================================
pause
