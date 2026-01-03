from langchain_core.tools import tool
import subprocess
import httpx


@tool
async def execute_python(code: str) -> str:
    """Execute Python code and return the output."""
    try:
        # Run in subprocess with timeout for safety
        result = subprocess.run(
            ["python", "-c", code],
            capture_output=True,
            text=True,
            timeout=30
        )
        return f"stdout: {result.stdout}\nstderr: {result.stderr}"
    except subprocess.TimeoutExpired:
        return "Error: Code execution timed out (30 seconds limit)"
    except Exception as e:
        return f"Error: {str(e)}"


@tool
async def call_api(url: str, method: str = "GET", body: str = None) -> str:
    """Make an HTTP request to an API endpoint."""
    try:
        async with httpx.AsyncClient() as client:
            if method.upper() == "GET":
                response = await client.get(url)
            else:
                response = await client.post(url, content=body)
            return f"Status: {response.status_code}\nBody: {response.text[:1000]}"
    except Exception as e:
        return f"Error: {str(e)}"


tools = [execute_python, call_api]
