#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "fastapi>=0.115.0",
#     "uvicorn[standard]>=0.30.0",
# ]
# ///
"""
Development server script for AI Chat FastAPI application.
Run with: uv run run_dev.py
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
