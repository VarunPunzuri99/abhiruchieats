import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const errors: { [key: string]: string } = {
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Google sign-in failed. Please try again.',
  OAuthCallback: 'Google authentication timed out or failed. This might be due to network issues or server load.',
  OAuthCallbackError: 'Google authentication timed out or failed. This might be due to network issues or server load.',
  OAuthCreateAccount: 'Failed to create account with Google. Please try again.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Authentication callback failed. Please try again.',
  OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  AccessDenied: 'Access denied. You may have cancelled the authentication or don\'t have permission.',
  Configuration: 'There is a problem with the server configuration. Please contact support.',
  default: 'Unable to sign in.',
};

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessage = error && typeof error === 'string' ? errors[error] : errors.default;

  return (
    <>
      <Head>
        <title>Authentication Error - AbhiruchiEats</title>
        <meta name="description" content="Authentication error occurred" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold text-green-600 mb-2">AbhiruchiEats</h1>
            </Link>
            <div className="mx-auto h-16 w-16 text-red-500 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600">{errorMessage}</p>
          </div>

          {/* Error Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">What can you do?</h3>
              
              <div className="space-y-4">
                <Link
                  href="/auth/signin"
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Try signing in again
                </Link>

                <Link
                  href="/"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Continue as guest
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Need help?</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>If you continue to experience issues, please:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Wait a moment and try signing in again</li>
                  <li>Check your internet connection</li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Try using a different browser or incognito mode</li>
                  <li>Make sure you clicked "Allow" when prompted by Google</li>
                  <li>Check if your email provider is blocking our emails</li>
                  <li>
                    <a href="mailto:support@abhiruchieats.com" className="text-green-600 hover:text-green-700">
                      Contact our support team
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Having trouble? Visit our{' '}
              <Link href="/contact" className="text-green-600 hover:text-green-700">
                help center
              </Link>{' '}
              or{' '}
              <Link href="/contact" className="text-green-600 hover:text-green-700">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
