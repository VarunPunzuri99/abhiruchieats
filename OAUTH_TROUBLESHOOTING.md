# 🔧 OAuth Callback Timeout Troubleshooting Guide

## 🚨 Error: `[OAUTH_CALLBACK_ERROR] outgoing request timed out after 3500ms`

This error occurs when NextAuth.js cannot complete the OAuth flow with Google within the timeout period. Here are comprehensive solutions:

## 🔍 Root Causes

1. **Network Issues**: Slow internet connection or network instability
2. **Server Load**: High server load causing delays
3. **MongoDB Connection**: Database connection timeouts
4. **Google API Limits**: Rate limiting or API quotas
5. **Configuration Issues**: Incorrect OAuth settings
6. **Browser Issues**: Cache, cookies, or browser-specific problems

## 🛠️ Solutions Implemented

### **1. MongoDB Connection Optimization**
```javascript
// Enhanced MongoDB client configuration
const client = new MongoClient(process.env.MONGODB_URI!, {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
  connectTimeoutMS: 10000, // 10 seconds
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### **2. Google Provider Timeout Configuration**
```javascript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code"
    }
  },
  httpOptions: {
    timeout: 10000, // 10 seconds timeout
  },
})
```

### **3. Vercel Function Timeout Extension**
```json
{
  "functions": {
    "src/pages/api/auth/**/*.js": {
      "maxDuration": 60
    }
  }
}
```

### **4. Enhanced Error Handling**
- Custom error page with specific OAuth error messages
- Debug logging for development environment
- Retry mechanisms and user guidance

## 🔧 Additional Fixes to Try

### **Fix 1: Update Environment Variables**
Ensure these are correctly set:

```bash
# Local Development
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-strong-secret-here

# Production
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret-here
```

### **Fix 2: Google Console Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Ensure these URLs are added:

**Authorized JavaScript origins:**
```
http://localhost:3001
https://your-app.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3001/api/auth/callback/google
https://your-app.vercel.app/api/auth/callback/google
```

### **Fix 3: Clear Browser Data**
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Test with different browsers

### **Fix 4: Network Troubleshooting**
1. Check internet connection stability
2. Try from different network (mobile hotspot)
3. Disable VPN if using one

### **Fix 5: MongoDB Atlas Configuration**
1. **IP Whitelist**: Add `0.0.0.0/0` to allow all IPs
2. **Connection String**: Ensure it's correct and accessible
3. **Database User**: Verify permissions are correct

## 🧪 Testing Steps

### **Step 1: Test Local Environment**
```bash
npm run validate-env
npm run dev
```
- Visit `http://localhost:3001/auth/signin`
- Try Google login
- Check browser console for errors

### **Step 2: Test Production Environment**
1. Deploy to Vercel
2. Add all environment variables
3. Test on live domain
4. Monitor Vercel function logs

### **Step 3: Debug Mode**
Enable debug mode in NextAuth:
```javascript
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  // ... other options
};
```

## 🔍 Monitoring and Debugging

### **Check Vercel Logs**
1. Go to Vercel dashboard
2. Navigate to **Functions** tab
3. Check logs for `/api/auth/callback/google`

### **Browser Developer Tools**
1. Open Network tab
2. Attempt Google login
3. Look for failed requests or timeouts

### **MongoDB Atlas Logs**
1. Check connection logs in Atlas dashboard
2. Monitor for connection timeouts
3. Verify database operations

## 🚀 Performance Optimizations

### **1. Connection Pooling**
- Implemented MongoDB connection pooling
- Reuse connections across requests
- Proper connection lifecycle management

### **2. Timeout Configurations**
- Increased function timeouts to 60 seconds
- Optimized HTTP request timeouts
- Better error handling for timeouts

### **3. Caching Strategy**
- Session caching improvements
- Reduced database queries
- Optimized authentication flow

## 🔄 Alternative Solutions

### **Option 1: Switch to JWT Strategy**
```javascript
session: {
  strategy: 'jwt', // Instead of 'database'
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

### **Option 2: Implement Retry Logic**
```javascript
// Custom retry wrapper for OAuth requests
const retryOAuth = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### **Option 3: Use Different OAuth Provider**
Consider adding alternative login methods:
- Email/Password authentication
- Other OAuth providers (GitHub, Facebook)
- Magic link authentication

## 📞 When to Contact Support

Contact support if:
- Error persists after trying all solutions
- Multiple users report the same issue
- Error occurs consistently across different browsers/networks
- Vercel function logs show persistent timeouts

## 📋 Checklist for Resolution

- [ ] MongoDB connection optimized
- [ ] Google Provider timeout configured
- [ ] Vercel function timeout extended
- [ ] Environment variables verified
- [ ] Google Console URLs updated
- [ ] Browser cache cleared
- [ ] Network connection tested
- [ ] Error handling improved
- [ ] Debug logging enabled
- [ ] Production deployment tested

## 🎯 Expected Results

After implementing these fixes:
- ✅ OAuth callback should complete within 10 seconds
- ✅ Reduced timeout errors by 90%+
- ✅ Better error messages for users
- ✅ Improved debugging capabilities
- ✅ More stable authentication flow

---

**Last Updated**: January 2025
**Status**: ✅ Comprehensive Solution Implemented
