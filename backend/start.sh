#!/bin/bash

# Get port from environment variable (Render provides PORT)
PORT=${PORT:-8000}

# Run the FastAPI application
uvicorn app.main:app --host 0.0.0.0 --port $PORT

