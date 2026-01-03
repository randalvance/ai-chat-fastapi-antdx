from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json

from agent import graph
from models import ChatRequest

app = FastAPI(
    title="AI Chat with LangGraph",
    description="FastAPI backend for AI chat application with AntD frontend",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def stream_agent_events(messages: list):
    """Stream agent events as SSE."""
    inputs = {"messages": [(m.role, m.content) for m in messages]}

    try:
        async for event in graph.astream_events(inputs, version="v2"):
            kind = event["event"]

            if kind == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if content:
                    yield f"data: {json.dumps({'type': 'token', 'content': content})}\n\n"

            elif kind == "on_tool_start":
                yield f"data: {json.dumps({'type': 'tool_start', 'tool': event['name'], 'input': str(event['data'].get('input', {}))})}\n\n"

            elif kind == "on_tool_end":
                output = event["data"].get("output", "")
                yield f"data: {json.dumps({'type': 'tool_end', 'tool': event['name'], 'output': str(output)[:500]})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"


@app.post("/api/chat")
async def chat_stream(request: ChatRequest):
    return StreamingResponse(
        stream_agent_events(request.messages),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "AI Chat with LangGraph Agent"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


def dev():
    """Development server entry point for uv run dev"""
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

