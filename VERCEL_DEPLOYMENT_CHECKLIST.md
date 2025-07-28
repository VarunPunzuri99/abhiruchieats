# ✅ Vercel Deployment Checklist

## 🎯 Quick Setup Summary

### **Environment Variables for Vercel Dashboard**

Copy these exact values to your Vercel project's environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=yourapp

# NextAuth (Update NEXTAUTH_URL with your actual Vercel domain)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=f1c0e51017f21427a4510c9c44733bcb93ce307efb30fd122fa089d1e662f451

# Google OAuth (Replace with your actual credentials)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Admin Authentication
ADMIN_JWT_SECRET=1d341672c490d62ea67381cf67b958e8d7914e766e463e2d1e1fc998a3000ee0

# Email (Optional - update with your production email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Environment
NODE_ENV=production
```

## 📋 Step-by-Step Deployment

### **Step 1: Prepare Local Environment** ✅
- [x] Local environment variables are set correctly
- [x] Application runs without errors locally
- [x] All features tested and working

### **Step 2: Deploy to Vercel**
1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Choose "Next.js" framework

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Wait for initial deployment
   - Note your Vercel domain (e.g., `https://abhiruchieats.vercel.app`)

### **Step 3: Add Environment Variables**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all variables from the list above
4. **Important**: Update `NEXTAUTH_URL` with your actual Vercel domain
5. Click "Save"

### **Step 4: Update Google Console** 🔐
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add your Vercel domain to **Authorized JavaScript origins**:
   ```
   https://your-actual-vercel-domain.vercel.app
   ```
5. Add your callback URL to **Authorized redirect URIs**:
   ```
   https://your-actual-vercel-domain.vercel.app/api/auth/callback/google
   ```
6. Click "Save"

### **Step 5: Redeploy with Environment Variables**
1. Go back to Vercel dashboard
2. Go to **Deployments** tab
3. Click "Redeploy" on the latest deployment
4. Wait for deployment to complete

### **Step 6: Test Production Deployment**
Test these features on your live domain:

- [ ] **Homepage loads correctly**
- [ ] **Google OAuth login works**
- [ ] **Customer registration/login**
- [ ] **Product browsing and cart functionality**
- [ ] **Admin login** (admin@abhiruchieats.com / admin123)
- [ ] **Admin panel access**
- [ ] **Order placement and management**
- [ ] **Database operations work**

## 🚨 Troubleshooting Common Issues

### **Issue 1: Environment Variables Not Working**
**Symptoms**: App works locally but fails on Vercel
**Solution**: 
1. Check all environment variables are added to Vercel
2. Ensure no typos in variable names
3. Redeploy after adding variables

### **Issue 2: Google OAuth Fails**
**Symptoms**: "redirect_uri_mismatch" error
**Solution**:
1. Verify Google Console has correct Vercel domain
2. Check redirect URI format exactly matches
3. Ensure HTTPS is used (not HTTP)

### **Issue 3: Database Connection Fails**
**Symptoms**: MongoDB connection errors
**Solution**:
1. Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
2. Verify MONGODB_URI is correct in Vercel
3. Test connection string locally first

### **Issue 4: Admin Login Issues**
**Symptoms**: Admin authentication fails
**Solution**:
1. Verify ADMIN_JWT_SECRET is set in Vercel
2. Check admin exists in database
3. Test admin login locally first

## 🔄 Environment Variable Management

### **Local Development (.env.local)**
```bash
NEXTAUTH_URL=http://localhost:3001
# ... other local-specific values
```

### **Production (Vercel Dashboard)**
```bash
NEXTAUTH_URL=https://your-app.vercel.app
# ... other production-specific values
```

### **Key Differences**
| Variable | Local | Production |
|----------|-------|------------|
| `NEXTAUTH_URL` | `http://localhost:3001` | `https://your-app.vercel.app` |
| `NODE_ENV` | `development` | `production` |
| Secrets | Development values | Strong production values |

## 📱 Custom Domain Setup (Optional)

If you want to use a custom domain:

1. **Add Domain in Vercel**
   - Go to project settings
   - Add custom domain
   - Configure DNS records

2. **Update Environment Variables**
   ```bash
   NEXTAUTH_URL=https://www.abhiruchieats.com
   ```

3. **Update Google Console**
   - Add custom domain to authorized origins
   - Add custom domain callback URL

## 🔐 Security Checklist

- [ ] Strong secrets generated and used
- [ ] Google OAuth configured correctly
- [ ] MongoDB Atlas secured
- [ ] HTTPS enforced in production
- [ ] Environment variables not exposed in client
- [ ] Admin credentials changed from defaults

## 📞 Support Commands

```bash
# Validate environment setup
npm run validate-env

# Test build locally
npm run build && npm start

# Check deployment readiness
npm run deploy-check
```

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Live URL loads without errors
- ✅ Google login works on production
- ✅ Admin panel accessible
- ✅ All CRUD operations work
- ✅ Database operations successful
- ✅ No console errors in browser

---

**Next Steps After Successful Deployment:**
1. Test all functionality thoroughly
2. Set up monitoring and analytics
3. Configure email notifications
4. Plan for scaling and optimization

**Last Updated**: January 2025
**Status**: ✅ Ready for Production Deployment

