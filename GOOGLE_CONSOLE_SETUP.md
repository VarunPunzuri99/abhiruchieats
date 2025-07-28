# 🔐 Google Console Setup Guide

## 📋 Overview
This guide walks you through setting up Google OAuth for both local development and production deployment on Vercel.

## 🚀 Step-by-Step Setup

### **Step 1: Access Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your existing project or create a new one

### **Step 2: Enable Google+ API**
1. Navigate to **APIs & Services** → **Library**
2. Search for "Google+ API" 
3. Click **Enable** (if not already enabled)

### **Step 3: Configure OAuth Consent Screen**
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:

```
App name: AbhiruchiEats
User support email: your-email@gmail.com
Developer contact information: your-email@gmail.com
```

4. Add **Scopes** (click "Add or Remove Scopes"):
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

5. Add **Test users** (for development):
   - Add your email and any other test emails

### **Step 4: Create OAuth 2.0 Credentials**
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set **Name**: `AbhiruchiEats Web Client`

### **Step 5: Configure Authorized Origins**
Add these **Authorized JavaScript origins**:

```
# Local Development
http://localhost:3001

# Production (replace with your actual domain)
https://your-app-name.vercel.app
```

### **Step 6: Configure Redirect URIs**
Add these **Authorized redirect URIs**:

```
# Local Development
http://localhost:3001/api/auth/callback/google

# Production (replace with your actual domain)  
https://your-app-name.vercel.app/api/auth/callback/google
```

### **Step 7: Save and Copy Credentials**
1. Click **Save**
2. Copy the **Client ID** and **Client Secret**
3. Add them to your environment variables

## 🔧 Environment Variables Setup

### **Local Development (.env.local)**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

### **Production (Vercel Dashboard)**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the same variables:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

## 🌐 Domain-Specific Configuration

### **When You Get Your Vercel Domain**
1. Deploy your app to Vercel first
2. Note your Vercel domain (e.g., `https://abhiruchieats.vercel.app`)
3. Go back to Google Console
4. Update the **Authorized Origins** and **Redirect URIs** with your actual domain

### **If Using Custom Domain**
1. Set up custom domain in Vercel
2. Update Google Console with custom domain:
```
https://www.abhiruchieats.com
https://www.abhiruchieats.com/api/auth/callback/google
```

## ✅ Testing Checklist

### **Local Testing**
- [ ] Google login works on `http://localhost:3001`
- [ ] User can sign in and sign out
- [ ] User profile information is retrieved correctly
- [ ] No console errors during OAuth flow

### **Production Testing**
- [ ] Google login works on live domain
- [ ] OAuth redirect works correctly
- [ ] User sessions persist properly
- [ ] No CORS or redirect errors

## 🚨 Common Issues & Solutions

### **Issue 1: redirect_uri_mismatch**
```
Error: redirect_uri_mismatch
```
**Solution**: 
- Check that your redirect URI in Google Console exactly matches your domain
- Ensure you've added both local and production URLs
- Verify there are no trailing slashes or typos

### **Issue 2: origin_mismatch**
```
Error: origin_mismatch
```
**Solution**:
- Add your domain to Authorized JavaScript origins
- Make sure the protocol (http/https) matches exactly

### **Issue 3: access_denied**
```
Error: access_denied
```
**Solution**:
- Check OAuth consent screen configuration
- Ensure your email is added as a test user
- Verify required scopes are added

### **Issue 4: invalid_client**
```
Error: invalid_client
```
**Solution**:
- Verify Client ID and Client Secret are correct
- Check environment variables are properly set
- Ensure credentials haven't expired

## 🔄 When to Update Google Console

### **Always Update When:**
- Changing domains (local to production)
- Adding custom domains
- Switching between development and production
- Moving to a new hosting provider

### **Example Update Scenarios:**

**Scenario 1: First Deployment to Vercel**
```
Before: http://localhost:3001
After: Add https://your-app.vercel.app
```

**Scenario 2: Adding Custom Domain**
```
Before: https://your-app.vercel.app  
After: Add https://www.abhiruchieats.com
```

## 📱 Mobile App Considerations (Future)
If you plan to add mobile apps later:
1. Create separate OAuth clients for iOS/Android
2. Configure different redirect schemes
3. Update consent screen for mobile usage

## 🔐 Security Best Practices

### **OAuth Security**
- ✅ Only add necessary redirect URIs
- ✅ Use HTTPS in production
- ✅ Regularly review authorized domains
- ✅ Monitor OAuth usage in Google Console

### **Credential Management**
- ✅ Keep Client Secret secure
- ✅ Don't commit credentials to git
- ✅ Use environment variables
- ✅ Rotate credentials periodically

## 📞 Support Resources

### **Google Documentation**
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/sign-in/web)

### **NextAuth Documentation**
- [Google Provider](https://next-auth.js.org/providers/google)
- [Configuration](https://next-auth.js.org/configuration/options)

### **Troubleshooting**
1. Check Google Console error logs
2. Verify environment variables
3. Test with different browsers
4. Clear browser cache and cookies
5. Check network requests in browser dev tools

---

**Last Updated**: January 2025
**Status**: ✅ Production Ready
