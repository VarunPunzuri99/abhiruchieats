import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

interface MobileAuthSectionProps {
  onMenuClose: () => void;
}

const MobileAuthSection: React.FC<MobileAuthSectionProps> = ({ onMenuClose }) => {
  const { data: session } = useSession();

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {session?.user ? (
        // Signed In User Section
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center px-4 py-3 bg-green-50 rounded-lg">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-green-600 font-medium">
                  {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                Customer
              </span>
            </div>
          </div>

          {/* My Orders Link */}
          <Link
            href="/orders"
            className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
            onClick={onMenuClose}
          >
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-base">My Orders</span>
          </Link>

          {/* Profile Link */}
          <Link
            href="/profile"
            className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
            onClick={onMenuClose}
          >
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-base">Profile Settings</span>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              onMenuClose();
              signOut({ callbackUrl: '/' });
            }}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
          >
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-base">Sign Out</span>
          </button>
        </div>
      ) : (
        // Not Signed In Section
        <div className="space-y-3">
          {/* Sign In Button */}
          <Link
            href="/auth/signin"
            className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors touch-manipulation"
            onClick={onMenuClose}
          >
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-base font-medium">Sign In with Google</span>
          </Link>

          {/* Benefits */}
          <div className="px-4 py-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Sign in to enjoy:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center">
                <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save your cart across devices
              </li>
              <li className="flex items-center">
                <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Track your order history
              </li>
              <li className="flex items-center">
                <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Faster checkout process
              </li>
              <li className="flex items-center">
                <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Personalized recommendations
              </li>
            </ul>
          </div>

          {/* Guest Shopping Note */}
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              You can also continue shopping as a guest
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAuthSection;
