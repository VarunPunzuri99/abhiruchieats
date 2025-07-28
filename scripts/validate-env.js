#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates that all required environment variables are set correctly
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_VARS = {
  // Core application
  MONGODB_URI: {
    required: true,
    description: 'MongoDB connection string',
    example: 'mongodb+srv://user:pass@cluster.mongodb.net/db'
  },
  NEXTAUTH_URL: {
    required: true,
    description: 'Base URL of the application',
    example: 'http://localhost:3001 (local) or https://app.vercel.app (production)'
  },
  NEXTAUTH_SECRET: {
    required: true,
    description: 'NextAuth encryption secret',
    example: 'A random 32+ character string'
  },
  
  // OAuth
  GOOGLE_CLIENT_ID: {
    required: true,
    description: 'Google OAuth Client ID',
    example: 'xxx.apps.googleusercontent.com'
  },
  GOOGLE_CLIENT_SECRET: {
    required: true,
    description: 'Google OAuth Client Secret',
    example: 'GOCSPX-xxx'
  },
  
  // Admin
  ADMIN_JWT_SECRET: {
    required: true,
    description: 'JWT secret for admin authentication',
    example: 'A random 32+ character string'
  },
  
  // Email (optional)
  SMTP_HOST: {
    required: false,
    description: 'SMTP server host',
    example: 'smtp.gmail.com'
  },
  SMTP_PORT: {
    required: false,
    description: 'SMTP server port',
    example: '587'
  },
  SMTP_USER: {
    required: false,
    description: 'SMTP username/email',
    example: 'your-email@gmail.com'
  },
  SMTP_PASS: {
    required: false,
    description: 'SMTP password/app password',
    example: 'your-app-password'
  }
};

function loadEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function validateEnvironment(env, envName) {
  console.log(`\n🔍 Validating ${envName} Environment Variables\n`);
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Check required variables
  Object.entries(REQUIRED_VARS).forEach(([key, config]) => {
    const value = env[key];
    
    if (config.required) {
      if (!value) {
        console.log(`❌ MISSING: ${key}`);
        console.log(`   Description: ${config.description}`);
        console.log(`   Example: ${config.example}\n`);
        hasErrors = true;
      } else if (value.includes('your-') || value.includes('change-this') || value.includes('xxx')) {
        console.log(`⚠️  PLACEHOLDER: ${key}`);
        console.log(`   Current: ${value}`);
        console.log(`   Description: ${config.description}\n`);
        hasWarnings = true;
      } else {
        console.log(`✅ ${key}: Set correctly`);
      }
    } else {
      if (!value) {
        console.log(`ℹ️  OPTIONAL: ${key} (not set)`);
        console.log(`   Description: ${config.description}\n`);
      } else {
        console.log(`✅ ${key}: Set correctly`);
      }
    }
  });
  
  // Environment-specific validations
  if (envName === 'Local Development') {
    if (env.NEXTAUTH_URL && !env.NEXTAUTH_URL.includes('localhost')) {
      console.log(`⚠️  WARNING: NEXTAUTH_URL should use localhost for local development`);
      console.log(`   Current: ${env.NEXTAUTH_URL}`);
      console.log(`   Expected: http://localhost:3001\n`);
      hasWarnings = true;
    }
  }
  
  if (envName === 'Production') {
    if (env.NEXTAUTH_URL && env.NEXTAUTH_URL.includes('localhost')) {
      console.log(`❌ ERROR: NEXTAUTH_URL should not use localhost in production`);
      console.log(`   Current: ${env.NEXTAUTH_URL}`);
      console.log(`   Expected: https://your-app.vercel.app\n`);
      hasErrors = true;
    }
    
    if (env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length < 32) {
      console.log(`⚠️  WARNING: NEXTAUTH_SECRET should be at least 32 characters for production`);
      console.log(`   Current length: ${env.NEXTAUTH_SECRET.length}\n`);
      hasWarnings = true;
    }
  }
  
  // Summary
  console.log(`\n📊 ${envName} Validation Summary:`);
  if (hasErrors) {
    console.log(`❌ Has critical errors that must be fixed`);
  } else if (hasWarnings) {
    console.log(`⚠️  Has warnings that should be addressed`);
  } else {
    console.log(`✅ All validations passed!`);
  }
  
  return { hasErrors, hasWarnings };
}

function generateSecrets() {
  console.log(`\n🔐 Generate Strong Secrets:\n`);
  
  const crypto = require('crypto');
  
  console.log(`NEXTAUTH_SECRET=${crypto.randomBytes(32).toString('hex')}`);
  console.log(`ADMIN_JWT_SECRET=${crypto.randomBytes(32).toString('hex')}`);
  console.log(`\nCopy these to your environment variables!\n`);
}

function main() {
  console.log(`🚀 AbhiruchiEats Environment Validation\n`);
  console.log(`This script validates your environment configuration for both local and production environments.\n`);
  
  // Check local environment
  const localEnv = loadEnvFile('.env.local');
  if (localEnv) {
    const localResult = validateEnvironment(localEnv, 'Local Development');
  } else {
    console.log(`⚠️  .env.local file not found`);
  }
  
  // Check production environment
  const prodEnv = loadEnvFile('.env.production');
  if (prodEnv) {
    const prodResult = validateEnvironment(prodEnv, 'Production');
  } else {
    console.log(`ℹ️  .env.production file not found (this is normal - use Vercel dashboard for production vars)`);
  }
  
  // Generate secrets
  generateSecrets();
  
  // Instructions
  console.log(`📋 Next Steps:\n`);
  console.log(`1. Fix any ❌ errors shown above`);
  console.log(`2. Address ⚠️  warnings for better security`);
  console.log(`3. For production deployment:`);
  console.log(`   - Add environment variables to Vercel dashboard`);
  console.log(`   - Update Google Console with production domain`);
  console.log(`   - Test deployment thoroughly\n`);
  
  console.log(`📚 For detailed instructions, see DEPLOYMENT_GUIDE.md\n`);
}

// Run the validation
main();
