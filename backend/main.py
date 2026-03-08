from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from agent.graph import agent
import os
import uuid
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://agentic-ai-1-sedl.onrender.com", "http://localhost:5173"],
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


GENERATED_DIR = "generated_project"
os.makedirs(GENERATED_DIR, exist_ok=True)

app.mount("/generated_project", StaticFiles(directory=GENERATED_DIR), name="generated")


class PromptRequest(BaseModel):
    user_prompt: str


@app.post("/run-agent")
def run_agent(request: PromptRequest):
    if os.path.exists(GENERATED_DIR):
        shutil.rmtree(GENERATED_DIR)
    os.makedirs(GENERATED_DIR, exist_ok=True)

    result = agent.invoke(
        {"user_prompt": request.user_prompt},
        {"recursion_limit": 100}
    )

    return {
        "preview_url": "https://agentic-ai-backend-i4uy.onrender.com/generated_project/index.html"
        # "preview_url": "http://localhost:8000/generated_project/index.html"
    }