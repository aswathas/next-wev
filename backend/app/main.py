from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(
    title="FROMBUDDY API",
    description="AI-powered assistant for Indian government services. NON-GOVERNMENT. GUIDANCE ONLY.",
    version="0.1.0"
)

# Legal Compliance & Security: CORS Restriction
VALID_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=VALID_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class Service(BaseModel):
    id: str
    name: str
    description: str
    version: str

@app.get("/")
async def root():
    return {
        "message": "Welcome to FROMBUDDY API",
        "legal_disclaimer": "This is NOT a government website. We do not collect PII. We do not submit forms.",
        "status": "active"
    }

SERVICES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "services")

@app.get("/api/services", response_model=List[Service])
async def list_services():
    services = []
    if os.path.exists(SERVICES_DIR):
        for filename in os.listdir(SERVICES_DIR):
            if filename.endswith(".json"):
                try:
                    with open(os.path.join(SERVICES_DIR, filename), "r", encoding="utf-8") as f:
                        data = json.load(f)
                        services.append(Service(
                            id=data.get("id", "unknown"),
                            name=data.get("name", "Unknown Service"),
                            description=data.get("description", "No description"),
                            version=data.get("version", "0.0")
                        ))
                except Exception as e:
                    print(f"Error reading {filename}: {e}")
                    continue
    return services

@app.get("/api/services/{service_id}")
async def get_service(service_id: str):
    # Security: validate filename to prevent traversal
    safe_id = os.path.basename(service_id)
    file_path = os.path.join(SERVICES_DIR, f"{safe_id}.json")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Service not found")
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Error reading service data: {str(e)}")

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Data Structures for AI Output ---
class Step(BaseModel):
    step_id: int = Field(description="The step number")
    title: str = Field(description="Short title of the step")
    description: str = Field(description="Detailed description of what to do")
    details: Optional[str] = Field(description="Helpful tip or extra detail")

class GuideData(BaseModel):
    name: str = Field(description="Name of the service or process")
    steps: List[Step] = Field(description="List of steps to complete the process")
    checklist: List[str] = Field(description="List of required documents or prerequisites")
    official_link: str = Field(description="URL to the official government portal if known, else empty")
    explanation: str = Field(description="A conversational summary of the process")

# Initialize Groq Client
llm = ChatGroq(
    temperature=0.1, # Lower temperature for valid JSON
    model_name="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

# Parser
parser = JsonOutputParser(pydantic_object=GuideData)

# System Prompt
SYSTEM_PROMPT = """You are FROMBUDDY, an AI assistant for Indian Government Services.
Your goal is to provide a structured guide for the user's request.

INSTRUCTIONS:
1. Analyze the user's query (e.g., "How to apply for Passport").
2. Create a specific, accurate Step-by-Step guide.
3. Create a Document Checklist.
4. Provide a polite conversational explanation.
5. STRICTLY output valid JSON matching the schema.

SCHEMA:
{format_instructions}

RULES:
- If the query is NOT about a government service/procedure (e.g. "hello"), return empty steps/checklist and just an explanation.
- Do NOT generate fake personal data.
- 'official_link' should be a real URL if you know it (e.g. nsdl.com, uidai.gov.in), otherwise string "#".
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("user", "{query}")
])

chain = prompt | llm | parser

@app.post("/api/explain")
async def explain_query(query: str):
    # 1. Guardrail
    pii_keywords = ["aadhaar number", "pan number", "passport number", "voter id"]
    if any(keyword in query.lower() for keyword in pii_keywords):
        raise HTTPException(
            status_code=400, 
            detail="GUARDRAIL ALERT: Request refused. Please do not share personal identity numbers."
        )
    
    # 2. AI Processing
    try:
        response = await chain.ainvoke({
            "query": query,
            "format_instructions": parser.get_format_instructions()
        })
        return response # Returns dict matching GuideData
    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback
        return {
            "explanation": "I'm having trouble structuring the guide right now. Please try again or check the static services menu.",
            "name": "Error",
            "steps": [],
            "checklist": [],
            "official_link": "#"
        }

@app.get("/legal/disclaimer")
async def get_legal_disclaimer():
    return {
        "text": "FROMBUDDY is a private AI assistant for guidance only. It is not affiliated with the Government of India. No user data is stored. Do not enter PII."
    }
