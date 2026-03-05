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
    allow_origins=["https://agentic-ai-1-sedl.onrender.com", "https://agentic-ai-backend-i4uy.onrender.com"],
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

    # Assume your agent writes files inside project_path
    # You must modify your agent to write there

    return {
        "preview_url": "https://agentic-ai-backend-i4uy.onrender.com/generated_project/index.html"
    }






#  import argparse
# import sys
# import traceback

# from agent.graph import agent


# def main():
#     parser = argparse.ArgumentParser(description="Run engineering project planner")
#     parser.add_argument("--recursion-limit", "-r", type=int, default=100,
#                         help="Recursion limit for processing (default: 100)")

#     args = parser.parse_args()

#     try:
#         user_prompt = input("Enter your project prompt: ")
#         result = agent.invoke(
#             {"user_prompt": user_prompt},
#             {"recursion_limit": args.recursion_limit}
#         )
#         print("Final State:", result)
#     except KeyboardInterrupt:
#         print("\nOperation cancelled by user.")
#         sys.exit(0)
#     except Exception as e:
#         traceback.print_exc()
#         print(f"Error: {e}", file=sys.stderr)
#         sys.exit(1)


# if __name__ == "__main__":
#     main()