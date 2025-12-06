# FROMBUDDY: AI-Powered Government Services Assistant

**FROMBUDDY** is a Next-Gen AI Assistant designed to guide Indian citizens through complex government procedures (PAN, Aadhaar, Voter ID) with a focus on **Privacy, Simplicity, and User Experience**.

---

## 🏗️ Architecture & How It Works

This project works on a **Client-Server** model:
- **Frontend (Next.js)** handles the beautiful UI and user interaction.
- **Backend (FastAPI)** powers the intelligence using Large Language Models (LLMs).

### 1. The Brain: Backend (`/backend`)
Built with **FastAPI** and **LangChain**, interfaced with **Groq (Llama 3.3)**.

*   **`app/main.py`**: The heart of the backend.
    *   **Dynamic Service Loading**: Automatically scans `data/services/*.json` to serve static guides (like PAN Card) dynamically.
    *   **AI Engine (`/api/explain`)**:
        *   Uses `JsonOutputParser` from LangChain to force the LLM to output structured JSON data (Steps, Checklists) instead of just text.
        *   **Guardrails**: Automatically blocks requests containing PII (keywords like "Aadhaar Number", etc.) to ensure privacy.
    *   **Data Models (Pydantic)**: Defines strict schemas (`GuideData`, `Step`) to ensure the AI always returns data the Frontend can render.

*   **`data/services/`**: Contains "Golden Source" structured JSON files for verified services.
    *   Example: `pan-card.json` contains the manually verified steps for PAN application, used as a fallback or direct guide.

### 2. The Face: Frontend (`/frontend`)
Built with **Next.js 14+ (App Router)** focusing on "Glassmorphism" design.

*   **`app/page.tsx` (Home)**:
    *   Features a **Hero Search** component (`HeroSearch.tsx`) that acts as a "Client Component island" in a Server Component, allowing fast, interactive searching.
    *   Directs users to the AI Chat or Static Libraries.

*   **`app/ai/explain/page.tsx` (The Chat Bot)**:
    *   **Generative UI**: This is the core innovation. It doesn't just show text.
    *   It parses the JSON response from the Backend.
    *   If the AI suggests a procedure, it **Injects the `ServiceWizard` component** directly into the chat stream.
    *   Includes a **Typewriter Effect** for a natural, premium feel.

*   **`app/components/ServiceWizard.tsx`**:
    *   A reusable "State Machine" component.
    *   Manages the user's progress through a service (Step 1 -> Step 2).
    *   Handles the interactive **Document Checklist** (checking off items).

*   **`app/globals.css`**:
    *   Contains the "Premium" design tokens: Glassmorphism backdrops, Gradient Text, and smooth Animations.

---

## 🚀 Key Features Implemented

1.  **Generative AI Wizards**: Ask "How to apply for Passport", and the system generates a step-by-step interactive wizard guide on the fly.
2.  **Privacy-First Guardrails**: The system proactively refuses to process PII (Personal Identifiable Information).
3.  **Hybrid Data Approach**: 
    *   Uses **Static JSON** for common, verified services (High Reliability).
    *   Uses **LLM AI** for infinite long-tail queries (High Flexibility).
4.  **Zero-Retention**: No databases. The application is completely stateless.

---

## 🛠️ Setup & Running

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Groq API Key

### 1. Start the Backend
```bash
cd backend
# Create virtual env
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_key_here > .env

# Run Server
uvicorn app.main:app --reload
```
*Backend runs on: `http://localhost:8000`*

### 2. Start the Frontend
```bash
cd frontend
# Install dependencies
npm install

# Run Dev Server
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 📂 File Directory

```
frombuddy/
├── backend/
│   ├── app/main.py            # API Routes & AI Chain Logic
│   ├── data/services/         # Static Service JSONs
│   ├── requirements.txt       # Python Dependencies
│   └── .env                   # API Keys (GitIgnored)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Landing Page
│   │   ├── layout.tsx         # Global Font & Banner
│   │   ├── ai/explain/        # Chat Bot Page
│   │   ├── services/          # Static Service Listings
│   │   └── components/        # Reusable UI (Wizard, Search)
│   ├── public/                # Images & Assets
│   └── package.json           # JS Dependencies
└── README.md                  # This file
```

---

## ⚠️ Important Legal Note
**This is a Proof-of-Concept Project.**
*   It is **NOT** affiliated with the Government of India.
*   It does **NOT** submit forms significantly.
*   It is for **Educational and Guidance purposes only**.
