# AI Chat FastAPI AntDX

Full-stack AI chat application with FastAPI backend and React + Vite frontend.

## Project Structure

```
.
├── main.py              # FastAPI backend application
├── pyproject.toml       # Python dependencies (managed by uv)
├── run_dev.py           # Backend dev server script
└── client/              # React + Vite frontend
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## Prerequisites

- Python 3.12+
- Node.js 20.19+ or 22.12+
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer

## Installation

### Backend Setup

Install Python dependencies using `uv`:

```bash
uv sync
```

### Frontend Setup

Install Node.js dependencies:

```bash
cd client
npm install
```

## Running the Application

### Backend (FastAPI)

**Option 1: Using the uv script (recommended)**

```bash
uv run run_dev.py
```

Or make it executable and run directly:

```bash
./run_dev.py
```

**Option 2: Using uvicorn directly**

Run the FastAPI application with auto-reload:

```bash
uv run uvicorn main:app --reload
```

Or using the main.py directly:

```bash
uv run python main.py
```

The backend will be available at:
- **API**: http://localhost:8000
- **Interactive API docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API docs (ReDoc)**: http://localhost:8000/redoc

### Frontend (React + Vite)

In a separate terminal, start the frontend dev server:

```bash
cd client
npm run dev
```

The frontend will be available at: http://localhost:5173

### Production Mode

**Backend:**

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend:**

Build the frontend:

```bash
cd client
npm run build
```

Preview the production build:

```bash
npm run preview
```

## API Endpoints

### Backend

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint

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

### Running Tests

**Backend:**

```bash
uv add --dev pytest pytest-asyncio httpx
uv run pytest
```

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