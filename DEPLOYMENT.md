# 🚀 Complete Deployment Plan for FROMBUDDY

This guide provides step-by-step instructions to deploy both the frontend (Next.js) and backend (FastAPI) to production.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account (for code repository)
- ✅ Clerk account (for authentication) - [Sign up here](https://clerk.com)
- ✅ Groq API key (for AI features) - [Get it here](https://console.groq.com)
- ✅ Render account (for backend) - [Sign up here](https://render.com)
- ✅ Vercel account (for frontend) - [Sign up here](https://vercel.com)

---

## 🎯 Deployment Overview

1. **Backend (FastAPI)** → Deploy to **Render**
2. **Frontend (Next.js)** → Deploy to **Vercel**
3. **Configure Environment Variables** in both platforms
4. **Update CORS** settings
5. **Test the deployment**

---

## 📦 Part 1: Prepare Your Code

### Step 1.1: Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"
   ```

2. **Create a GitHub repository**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `frombuddy-app`)
   - **Do NOT** initialize with README

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/frombuddy-app.git
   git branch -M main
   git push -u origin main
   ```

---

## 🔧 Part 2: Deploy Backend to Render

### Step 2.1: Create Render Web Service

1. **Log in to Render**: Go to [render.com](https://render.com) and sign in

2. **Create New Web Service**:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account if prompted
   - Select your repository: `frombuddy-app`

3. **Configure the Service**:
   - **Name**: `frombuddy-api` (or your preferred name)
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 2.2: Set Environment Variables in Render

Click **"Environment"** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `ENVIRONMENT` | `production` | Required |
| `GROQ_API_KEY` | `your_groq_api_key` | Get from [Groq Console](https://console.groq.com) |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **Set this AFTER deploying frontend** |
| `ADDITIONAL_ORIGINS` | (leave empty) | Optional: comma-separated origins |

**Important**: 
- Set `FRONTEND_URL` to your Vercel URL **after** deploying the frontend
- For now, you can use a placeholder like `https://placeholder.vercel.app` and update it later

### Step 2.3: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start the server
3. **Wait for deployment** (usually 2-5 minutes)
4. **Copy your backend URL**: It will look like `https://frombuddy-api.onrender.com`

### Step 2.4: Test Backend

Visit your backend URL in browser:
- `https://your-backend-url.onrender.com/` - Should show API welcome message
- `https://your-backend-url.onrender.com/api/services` - Should return services list

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 3.1: Set Up Clerk Authentication

1. **Log in to Clerk**: Go to [clerk.com](https://clerk.com) and sign in

2. **Create Application**:
   - Click **"Create Application"**
   - Choose **"Next.js"** as framework
   - Name: `FROMBUDDY` (or your preferred name)

3. **Get API Keys**:
   - Go to **"API Keys"** section
   - Copy:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
     - `CLERK_SECRET_KEY` (starts with `sk_`)

4. **Configure Allowed URLs**:
   - Go to **"Paths"** section
   - Add your production URL (you'll get this from Vercel)
   - For now, add: `http://localhost:3000` (for local testing)

### Step 3.2: Deploy to Vercel

1. **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and sign in

2. **Import Project**:
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository: `frombuddy-app`

3. **Configure Project**:
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables** (click "Environment Variables"):
   
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` (from Clerk) |
   | `CLERK_SECRET_KEY` | `sk_test_...` (from Clerk) |
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-url.onrender.com` |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
   | `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/` |
   | `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/` |

5. **Deploy**:
   - Click **"Deploy"**
   - Wait for build to complete (usually 2-3 minutes)
   - **Copy your frontend URL**: It will look like `https://frombuddy-app.vercel.app`

### Step 3.3: Update Clerk Allowed URLs

1. Go back to **Clerk Dashboard**
2. Navigate to **"Paths"** or **"Settings"** → **"Paths"**
3. Add your Vercel URL:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/sign-in`
   - `https://your-app.vercel.app/sign-up`

---

## 🔗 Part 4: Connect Frontend and Backend

### Step 4.1: Update Backend CORS (Render)

1. Go back to **Render Dashboard**
2. Navigate to your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL`:
   - Change from placeholder to: `https://your-app.vercel.app`
5. **Redeploy** the service (Render will auto-redeploy when env vars change)

### Step 4.2: Verify Frontend API URL (Vercel)

1. Go to **Vercel Dashboard**
2. Navigate to your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Verify `NEXT_PUBLIC_API_URL` is set to your Render backend URL
5. If changed, **redeploy** (go to "Deployments" → click "..." → "Redeploy")

---

## ✅ Part 5: Testing & Verification

### Step 5.1: Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. **Verify**:
   - ✅ Homepage loads
   - ✅ Header shows "Sign In" / "Sign Up" buttons
   - ✅ Can navigate to `/services`
   - ✅ Can navigate to `/ai/explain`

### Step 5.2: Test Authentication

1. Click **"Sign Up"**
2. Create a test account
3. **Verify**:
   - ✅ Can sign up successfully
   - ✅ Redirected to homepage after sign up
   - ✅ Header shows user profile button
   - ✅ Can sign out

### Step 5.3: Test API Integration

1. **Test Services Page**:
   - Navigate to `/services`
   - ✅ Should load services from backend
   - ✅ No CORS errors in browser console

2. **Test AI Assistant**:
   - Navigate to `/ai/explain`
   - Type: "How to apply for PAN card"
   - ✅ Should get response from backend
   - ✅ Should show wizard component

3. **Test Service Details**:
   - Click on a service from `/services`
   - ✅ Should load service details from backend

### Step 5.4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. **Verify**:
   - ✅ No CORS errors
   - ✅ No API connection errors
   - ✅ No authentication errors

---

## 🔍 Troubleshooting

### Issue: CORS Errors

**Symptoms**: Browser console shows CORS errors

**Solution**:
1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Check for trailing slashes (should be `https://your-app.vercel.app` not `https://your-app.vercel.app/`)
3. Redeploy backend after changing `FRONTEND_URL`

### Issue: API Not Responding

**Symptoms**: Frontend shows "Failed to fetch" or timeout

**Solution**:
1. Check Render dashboard - is backend service running?
2. Test backend URL directly: `https://your-backend.onrender.com/`
3. Verify `NEXT_PUBLIC_API_URL` in Vercel matches backend URL
4. Check Render logs for errors

### Issue: Authentication Not Working

**Symptoms**: Can't sign in/sign up

**Solution**:
1. Verify Clerk API keys in Vercel environment variables
2. Check Clerk dashboard - are allowed URLs configured?
3. Verify Clerk URLs match your Vercel domain
4. Check browser console for Clerk errors

### Issue: Backend Returns 500 Errors

**Symptoms**: API calls return server errors

**Solution**:
1. Check Render logs (click "Logs" tab in Render dashboard)
2. Verify `GROQ_API_KEY` is set correctly
3. Check if Groq API key is valid and has credits

---

## 📝 Quick Reference: Environment Variables

### Render (Backend)
```env
ENVIRONMENT=production
GROQ_API_KEY=your_groq_key
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## 🎉 Success Checklist

- [ ] Backend deployed to Render and accessible
- [ ] Frontend deployed to Vercel and accessible
- [ ] Clerk authentication working (sign up/in/out)
- [ ] Services page loads data from backend
- [ ] AI assistant responds correctly
- [ ] No CORS errors in browser console
- [ ] All environment variables set correctly
- [ ] Both services auto-deploy on git push

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

- **Render**: Auto-deploys on push to `main` branch
- **Vercel**: Auto-deploys on push to `main` branch

To update your app:
1. Make changes locally
2. Commit and push to GitHub
3. Both services will automatically redeploy

---

## 📞 Support

If you encounter issues:
1. Check platform logs (Render/Vercel dashboards)
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure both services are running

---

**🎊 Congratulations! Your FROMBUDDY app is now live!**

