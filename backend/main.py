from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Prompt Vault API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY"),
)


class PromptCreate(BaseModel):
    content: str


@app.get("/")
def root():
    return {"status": "ok", "service": "Prompt Vault API"}


@app.get("/prompts")
def get_prompts():
    try:
        response = (
            supabase.table("prompts")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return {"prompts": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/prompts", status_code=201)
def create_prompt(body: PromptCreate):
    if not body.content.strip():
        raise HTTPException(status_code=400, detail="Prompt boş olamaz.")
    try:
        response = (
            supabase.table("prompts")
            .insert({"content": body.content.strip()})
            .execute()
        )
        return {"prompt": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))