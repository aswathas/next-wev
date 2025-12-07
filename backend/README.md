# FROMBUDDY Backend API

FastAPI backend for the FROMBUDDY application, providing AI-powered guidance for Indian government services.

## Local Development

### Setup

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and set:
   - `GROQ_API_KEY` - Your Groq API key
   - `ENVIRONMENT=development`
   - `FRONTEND_URL=http://localhost:3000`

4. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   # Or use the startup script:
   # bash start.sh  # Linux/Mac
   # start.bat      # Windows
   ```

The API will be available at `http://localhost:8000`

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ENVIRONMENT` | Environment mode (`development` or `production`) | `development` | No |
| `FRONTEND_URL` | Frontend URL for CORS configuration | `http://localhost:3000` | Yes (production) |
| `ADDITIONAL_ORIGINS` | Comma-separated list of additional allowed origins | - | No |
| `GROQ_API_KEY` | Groq API key for AI features | - | Yes |
| `PORT` | Server port (Render sets this automatically) | `8000` | No |

## Deployment to Render

### Option 1: Using Render Dashboard

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables:**
   - `ENVIRONMENT` = `production`
   - `GROQ_API_KEY` = Your Groq API key
   - `FRONTEND_URL` = Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `ADDITIONAL_ORIGINS` = (Optional) Additional origins

### Option 2: Using render.yaml

The `render.yaml` file is pre-configured. Simply:

1. Push your code to GitHub
2. In Render dashboard, select "Apply render.yaml"
3. Set the required environment variables (`GROQ_API_KEY` and `FRONTEND_URL`)

## API Endpoints

- `GET /` - API information and status
- `GET /api/services` - List all available services
- `GET /api/services/{service_id}` - Get service details
- `POST /api/explain` - AI-powered explanation endpoint
- `GET /legal/disclaimer` - Legal disclaimer

## CORS Configuration

The backend automatically configures CORS based on the environment:

- **Development:** Allows `http://localhost:3000` and `http://127.0.0.1:3000`
- **Production:** Uses the `FRONTEND_URL` environment variable

Additional origins can be specified via the `ADDITIONAL_ORIGINS` environment variable.

