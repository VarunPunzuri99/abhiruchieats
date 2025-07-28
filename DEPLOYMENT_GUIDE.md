# 🚀 Deployment Guide: Local Development & Vercel Production

## 📋 Environment Configuration Overview

### **Local Development** (`.env.local`)
- Used when running `npm run dev`
- Contains development-specific configurations
- Uses `localhost` URLs and test credentials

### **Production Deployment** (Vercel Environment Variables)
- Used when deployed to Vercel
- Contains production-specific configurations
- Uses live domain URLs and production credentials

## 🔧 Required Environment Variables

### **Core Variables (Required for both environments)**

| Variable | Local Value | Production Value | Description |
|----------|-------------|------------------|-------------|
| `MONGODB_URI` | MongoDB Atlas URI | Same MongoDB Atlas URI | Database connection |
| `NEXTAUTH_URL` | `http://localhost:3001` | `https://your-app.vercel.app` | App base URL |
| `NEXTAUTH_SECRET` | Development secret | Strong production secret | NextAuth encryption |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | Same Google OAuth ID | Google login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Same Google OAuth Secret | Google login |
| `ADMIN_JWT_SECRET` | Development JWT secret | Strong production JWT secret | Admin authentication |

### **Email Configuration (Optional but recommended)**

| Variable | Local Value | Production Value | Description |
|----------|-------------|------------------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | `smtp.gmail.com` | Email server |
| `SMTP_PORT` | `587` | `587` | Email port |
| `SMTP_USER` | Your Gmail | Production email | Email sender |
| `SMTP_PASS` | Gmail app password | Production app password | Email authentication |

## 🌐 Google Console Configuration

### **Step 1: Update OAuth Redirect URIs**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add these **Authorized redirect URIs**:

```
# For Local Development
http://localhost:3001/api/auth/callback/google

# For Production (replace with your actual domain)
https://your-app-name.vercel.app/api/auth/callback/google
```

### **Step 2: Update Authorized Origins**

Add these **Authorized JavaScript origins**:

```
# For Local Development
http://localhost:3001

# For Production
https://your-app-name.vercel.app
```

## 🔐 Vercel Environment Variables Setup

### **Step 1: Access Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### **Step 2: Add Required Variables**

Add these environment variables in Vercel:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=yourapp

# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-strong-production-secret-min-32-chars-long

# Google OAuth (Replace with your actual credentials)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Admin Authentication
ADMIN_JWT_SECRET=your-super-strong-admin-jwt-secret-for-production

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Environment
NODE_ENV=production
```

### **Step 3: Generate Strong Secrets**

Use these commands to generate secure secrets:

```bash
# For NEXTAUTH_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For ADMIN_JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📱 Domain Configuration

### **Option 1: Using Vercel Domain**
```
https://your-app-name.vercel.app
```

### **Option 2: Using Custom Domain**
1. Add custom domain in Vercel dashboard
2. Update DNS records
3. Use custom domain in environment variables:
```
NEXTAUTH_URL=https://www.abhiruchieats.com
```

## 🔍 Testing Checklist

### **Local Development Testing**
- [ ] `npm run dev` starts without errors
- [ ] Google OAuth login works
- [ ] Admin login works
- [ ] Database operations work
- [ ] Email sending works (if configured)

### **Production Testing**
- [ ] Vercel deployment succeeds
- [ ] Live URL loads correctly
- [ ] Google OAuth works on live domain
- [ ] Admin panel accessible
- [ ] Database operations work
- [ ] All API endpoints respond correctly

## 🚨 Common Issues & Solutions

### **Issue 1: Google OAuth Error**
```
Error: redirect_uri_mismatch
```
**Solution**: Add your live domain to Google Console redirect URIs

### **Issue 2: NextAuth Error**
```
Error: NEXTAUTH_URL environment variable is not set
```
**Solution**: Ensure `NEXTAUTH_URL` is set in Vercel environment variables

### **Issue 3: Database Connection Error**
```
Error: MongoServerError
```
**Solution**: Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0`)

### **Issue 4: Admin Login Issues**
```
Error: Invalid admin token
```
**Solution**: Ensure `ADMIN_JWT_SECRET` is set and consistent

## 📋 Deployment Steps

### **Step 1: Prepare for Deployment**
```bash
# 1. Ensure all environment variables are ready
# 2. Test locally one final time
npm run dev

# 3. Build and test production build locally
npm run build
npm start
```

### **Step 2: Deploy to Vercel**
```bash
# Option 1: Using Vercel CLI
npm i -g vercel
vercel

# Option 2: Git push (if connected to GitHub)
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### **Step 3: Configure Environment Variables**
1. Go to Vercel dashboard
2. Add all required environment variables
3. Redeploy if necessary

### **Step 4: Update Google Console**
1. Add production domain to OAuth settings
2. Test Google login on live site

## 🔒 Security Best Practices

### **Environment Variables Security**
- ✅ Use strong, unique secrets for production
- ✅ Never commit `.env.local` to git
- ✅ Use different secrets for local vs production
- ✅ Regularly rotate secrets

### **Database Security**
- ✅ Use MongoDB Atlas with proper authentication
- ✅ Configure IP whitelist appropriately
- ✅ Use strong database passwords

### **OAuth Security**
- ✅ Restrict OAuth redirect URIs to your domains only
- ✅ Use HTTPS in production
- ✅ Keep OAuth secrets secure

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test Google Console configuration
4. Check MongoDB Atlas connectivity
5. Review this guide for missed steps

---

**Last Updated**: January 2025
**Status**: ✅ Production Ready

