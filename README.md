# AI Chat with LangGraph Agent

ChatGPT-like chat interface using @ant-design/x with a FastAPI backend powered by LangGraph for AI agent functionality with tool invocation and real-time streaming.

## Features

- **LangGraph Agent**: AI agent with tool invocation capabilities
- **Real-time Streaming**: SSE-based streaming for token-by-token responses
- **Tool Execution**: Python code execution and API calling tools
- **Modern UI**: Chat interface built with @ant-design/x components
- **Type-safe**: Full TypeScript support on frontend

## Project Structure

```
.
├── main.py              # FastAPI backend with SSE streaming
├── agent.py             # LangGraph agent definition
├── tools.py             # Tool definitions (Python exec, API calls)
├── config.py            # Settings configuration
├── models.py            # Pydantic models
├── pyproject.toml       # Python dependencies (managed by uv)
└── client/              # React + Vite frontend
    ├── src/
    │   ├── components/  # Chat component
    │   ├── hooks/       # useChat hook
    │   ├── services/    # SSE streaming service
    │   ├── types/       # TypeScript types
    │   └── config/      # API configuration
    ├── package.json
    └── vite.config.ts
```

## Prerequisites

- Python 3.12+
- Node.js 20.19+ or 22.12+
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer
- OpenAI API key

## Installation

### Backend Setup

1. Install Python dependencies using `uv`:

```bash
uv sync
```

2. Configure your OpenAI API key in `.env`:

```bash
# Edit .env file
OPENAI_API_KEY=your_api_key_here
```

### Frontend Setup

Install Node.js dependencies:

```bash
cd client
npm install
```

## Running the Application

### Backend (FastAPI)

Start the backend server (runs on port 8000):

```bash
uv run dev
```

### Frontend (React + Vite)

In a separate terminal, start the frontend dev server (runs on port 5173):

```bash
cd client
npm run dev
```

The application will be available at: http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Type a message in the chat input
3. Try these example prompts:
   - "What is 2 + 2?"
   - "Execute this Python code: print('Hello, World!')"
   - "Call this API: https://api.github.com/users/github"
   - "Calculate the factorial of 5 using Python"

The AI agent will:
- Understand your request
- Decide if tools are needed
- Execute Python code or call APIs when appropriate
- Stream responses in real-time with inline tool status

## API Endpoints

### Backend

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint
- `POST /api/chat` - Chat endpoint with SSE streaming

## Tools

The agent has access to two tools:

1. **execute_python**: Execute Python code and return output
   - Safe execution with 30-second timeout
   - Returns stdout and stderr

2. **call_api**: Make HTTP requests to API endpoints
   - Supports GET and POST methods
   - Returns status code and response body (truncated to 1000 chars)

## Architecture

### Backend Flow

```
Client Request → FastAPI → LangGraph Agent
                              ↓
                    LangChain ChatOpenAI
                              ↓
                    Tool Invocation (if needed)
                              ↓
                    SSE Streaming Response
```

### Frontend Flow

```
User Input → useChat Hook → streamChat Service
                              ↓
                    SSE Event Stream
                              ↓
                    State Updates → UI Render
```

## SSE Event Types

The backend streams these event types:

- `token`: Text token from LLM response
- `tool_start`: Tool execution started
- `tool_end`: Tool execution completed
- `done`: Stream completed successfully
- `error`: Error occurred

## Development

### Adding Python Dependencies

Add new backend dependencies using `uv`:

```bash
uv add <package-name>
```

### Adding Node.js Dependencies

Add new frontend dependencies:

```bash
cd client
npm install <package-name>
```

### Adding New Tools

1. Define tool in `tools.py`:

```python
from langchain_core.tools import tool

@tool
async def your_tool(param: str) -> str:
    """Your tool description."""
    # Implementation
    return result
```

2. Add to tools list:

```python
tools = [execute_python, call_api, your_tool]
```

### Environment Variables

**Backend (.env):**
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `OPENAI_MODEL` - Model name (default: gpt-4o-mini)

**Frontend (client/.env):**
- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)

## Production Deployment

### Backend

```bash
# Install dependencies
uv sync --no-dev

# Run with production server
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

```bash
cd client
npm run build
# Serve dist/ folder with your preferred static server
```

## Troubleshooting

### Backend Issues

**"OPENAI_API_KEY not found"**
- Ensure `.env` file exists with valid API key
- Check `.env` is in the project root directory

**Dependencies not installing**
- Update uv: `pip install --upgrade uv`
- Clear cache: `uv cache clean`

### Frontend Issues

**TypeScript errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Restart TypeScript server in VS Code

**CORS errors**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `client/.env`

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

**Frontend:**

```bash
cd client
npm run test
```

## Tech Stack

### Backend
- **FastAPI** 0.128.0 - Modern Python web framework
- **Uvicorn** 0.40.0 - ASGI server
- **Pydantic** - Data validation

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server  
- **TypeScript** 5.9.3 - Type-safe JavaScript
- **ESLint** - Code linting

## License

MIT