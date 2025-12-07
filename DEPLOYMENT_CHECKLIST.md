# ✅ Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] All local tests passing
- [ ] Clerk account created
- [ ] Groq API key obtained
- [ ] Render account created
- [ ] Vercel account created

## Backend Deployment (Render)

- [ ] Web service created on Render
- [ ] Root directory set to `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variable `ENVIRONMENT=production` set
- [ ] Environment variable `GROQ_API_KEY` set
- [ ] Environment variable `FRONTEND_URL` set (placeholder initially)
- [ ] Backend deployed successfully
- [ ] Backend URL copied: `https://________________.onrender.com`

## Frontend Deployment (Vercel)

- [ ] Clerk application created
- [ ] Clerk API keys copied
- [ ] Project imported to Vercel
- [ ] Root directory set to `frontend`
- [ ] Environment variable `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set
- [ ] Environment variable `CLERK_SECRET_KEY` set
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set to backend URL
- [ ] Clerk URLs configured in Clerk dashboard
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied: `https://________________.vercel.app`

## Post-Deployment Configuration

- [ ] Updated `FRONTEND_URL` in Render to actual Vercel URL
- [ ] Backend redeployed after CORS update
- [ ] Clerk allowed URLs updated with Vercel domain

## Testing

- [ ] Homepage loads correctly
- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Services page loads data from backend
- [ ] AI assistant responds correctly
- [ ] Service detail pages load
- [ ] No CORS errors in browser console
- [ ] No API errors in browser console
- [ ] Authentication persists across page refreshes

## Final Verification

- [ ] All features working in production
- [ ] Both services auto-deploying on git push
- [ ] Environment variables secured (not in code)
- [ ] Documentation updated if needed

---

**Deployment Date**: _______________

**Backend URL**: https://________________.onrender.com

**Frontend URL**: https://________________.vercel.app

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

