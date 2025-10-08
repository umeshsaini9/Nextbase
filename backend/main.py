from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uuid
import json
import asyncio
from typing import Dict, List, Optional
from datetime import datetime, timedelta

app = FastAPI()

# Store active WebSocket connections and peer data
active_connections: Dict[str, WebSocket] = {}
peer_data: Dict[str, Dict] = {}
message_queue: Dict[str, List[Dict]] = {}  # Queue for messages when peer is offline

# Configure CORS for both HTTP and WebSocket connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Custom middleware to handle CORS for WebSocket connections
@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    # Set CORS headers for all responses
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.get("/api/ping")
def ping():
    return {"message": "pong"}
