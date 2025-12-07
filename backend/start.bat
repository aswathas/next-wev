@echo off
REM Windows startup script for local development
REM For production on Render, use start.sh

set PORT=8000
if not "%PORT%"=="" set PORT=%PORT%

uvicorn app.main:app --host 0.0.0.0 --port %PORT%

