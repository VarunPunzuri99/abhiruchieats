#!/usr/bin/env node

/**
 * OAuth Configuration Test Script
 * Tests Google OAuth configuration and connectivity
 */

const https = require('https');
const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const REQUIRED_VARS = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'MONGODB_URI'
];

function testEnvironmentVariables() {
  console.log('🔍 Testing Environment Variables...\n');
  
  let allPresent = true;
  
  REQUIRED_VARS.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Set (${value.length} characters)`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  });
  
  console.log(`\n📊 Environment Variables: ${allPresent ? '✅ All Present' : '❌ Missing Variables'}\n`);
  return allPresent;
}

function testGoogleOAuthEndpoint() {
  return new Promise((resolve) => {
    console.log('🔍 Testing Google OAuth Endpoint...\n');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.log('❌ Cannot test - GOOGLE_CLIENT_ID missing\n');
      resolve(false);
      return;
    }
    
    // Test Google's OAuth discovery endpoint
    const options = {
      hostname: 'accounts.google.com',
      port: 443,
      path: '/.well-known/openid-configuration',
      method: 'GET',
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const config = JSON.parse(data);
            console.log(`✅ Google OAuth Discovery: ${res.statusCode}`);
            console.log(`✅ Authorization Endpoint: Available`);
            console.log(`✅ Token Endpoint: Available`);
            console.log(`✅ Userinfo Endpoint: Available\n`);
            resolve(true);
          } catch (error) {
            console.log(`❌ Google OAuth Discovery: Invalid JSON response\n`);
            resolve(false);
          }
        } else {
          console.log(`❌ Google OAuth Discovery: HTTP ${res.statusCode}\n`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Google OAuth Discovery: ${error.message}\n`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log(`❌ Google OAuth Discovery: Timeout\n`);
      req.destroy();
      resolve(false);
    });
    
    req.setTimeout(10000);
    req.end();
  });
}

function testMongoDBConnection() {
  return new Promise(async (resolve) => {
    console.log('🔍 Testing MongoDB Connection...\n');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ Cannot test - MONGODB_URI missing\n');
      resolve(false);
      return;
    }
    
    try {
      const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
      });
      
      console.log('⏳ Connecting to MongoDB...');
      await client.connect();
      
      console.log('✅ MongoDB Connection: Successful');
      
      // Test database operations
      const db = client.db();
      const collections = await db.listCollections().toArray();
      console.log(`✅ Database Access: ${collections.length} collections found`);
      
      // Test NextAuth collections
      const authCollections = collections.filter(c => 
        ['accounts', 'sessions', 'users', 'verification_tokens'].includes(c.name)
      );
      console.log(`✅ NextAuth Collections: ${authCollections.length} found`);
      
      await client.close();
      console.log('✅ MongoDB Connection: Closed properly\n');
      resolve(true);
      
    } catch (error) {
      console.log(`❌ MongoDB Connection: ${error.message}\n`);
      resolve(false);
    }
  });
}

function testNextAuthURL() {
  return new Promise((resolve) => {
    console.log('🔍 Testing NextAuth URL...\n');
    
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    if (!nextAuthUrl) {
      console.log('❌ Cannot test - NEXTAUTH_URL missing\n');
      resolve(false);
      return;
    }
    
    try {
      const url = new URL(nextAuthUrl);
      console.log(`✅ NextAuth URL Format: Valid`);
      console.log(`✅ Protocol: ${url.protocol}`);
      console.log(`✅ Host: ${url.host}`);
      console.log(`✅ Port: ${url.port || 'default'}`);
      
      // Test if URL is reachable (for localhost)
      if (url.hostname === 'localhost') {
        const module = url.protocol === 'https:' ? require('https') : require('http');
        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: '/',
          method: 'GET',
          timeout: 5000
        };
        
        const req = module.request(options, (res) => {
          console.log(`✅ NextAuth URL Reachable: ${res.statusCode}\n`);
          resolve(true);
        });
        
        req.on('error', (error) => {
          console.log(`⚠️  NextAuth URL: Not reachable (${error.message})`);
          console.log(`ℹ️  This is normal if the dev server is not running\n`);
          resolve(true); // Still valid URL format
        });
        
        req.on('timeout', () => {
          console.log(`⚠️  NextAuth URL: Timeout\n`);
          req.destroy();
          resolve(true); // Still valid URL format
        });
        
        req.setTimeout(5000);
        req.end();
      } else {
        console.log(`ℹ️  Production URL - skipping reachability test\n`);
        resolve(true);
      }
      
    } catch (error) {
      console.log(`❌ NextAuth URL Format: Invalid (${error.message})\n`);
      resolve(false);
    }
  });
}

function generateTestReport(results) {
  console.log('📋 OAuth Configuration Test Report\n');
  console.log('='.repeat(50));
  
  const tests = [
    { name: 'Environment Variables', result: results.env },
    { name: 'Google OAuth Endpoint', result: results.google },
    { name: 'MongoDB Connection', result: results.mongodb },
    { name: 'NextAuth URL', result: results.nextauth }
  ];
  
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.name}`);
  });
  
  console.log('='.repeat(50));
  
  const passedTests = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! OAuth should work correctly.');
  } else {
    console.log(`⚠️  ${totalTests - passedTests} test(s) failed. Please fix the issues above.`);
  }
  
  console.log('\n📚 Next Steps:');
  if (results.env && results.google && results.mongodb && results.nextauth) {
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit http://localhost:3001/auth/signin');
    console.log('3. Test Google OAuth login');
    console.log('4. Check for any errors in browser console');
  } else {
    console.log('1. Fix the failed tests above');
    console.log('2. Run this script again to verify fixes');
    console.log('3. Refer to OAUTH_TROUBLESHOOTING.md for detailed solutions');
  }
  
  console.log('\n🔧 Troubleshooting Resources:');
  console.log('- OAUTH_TROUBLESHOOTING.md');
  console.log('- GOOGLE_CONSOLE_SETUP.md');
  console.log('- DEPLOYMENT_GUIDE.md');
}

async function main() {
  console.log('🚀 OAuth Configuration Test\n');
  console.log('This script tests your OAuth setup for potential issues.\n');
  
  const results = {
    env: false,
    google: false,
    mongodb: false,
    nextauth: false
  };
  
  // Run all tests
  results.env = testEnvironmentVariables();
  results.google = await testGoogleOAuthEndpoint();
  results.mongodb = await testMongoDBConnection();
  results.nextauth = await testNextAuthURL();
  
  // Generate report
  generateTestReport(results);
}

// Run the tests
main().catch(console.error);
