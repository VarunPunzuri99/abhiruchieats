## Google OAuth Production Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "Credentials" → "OAuth 2.0 Client IDs"
4. Edit your existing OAuth client
5. Add production URLs:
   - Authorized JavaScript origins: https://abhiruchieats.vercel.app
   - Authorized redirect URIs: https://abhiruchieats.vercel.app/api/auth/callback/google

⚠️ **Important**: Remove localhost URLs from production OAuth client