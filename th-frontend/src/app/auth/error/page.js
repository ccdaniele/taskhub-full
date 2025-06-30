'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error) => {
    switch (error) {
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          description: 'The username/email or password you entered is incorrect. Please check your credentials and try again.',
          action: 'Try Again'
        }
      case 'OAuthSignin':
        return {
          title: 'OAuth Sign-in Failed',
          description: 'There was an issue signing in with your OAuth provider. Please try again.',
          action: 'Try Again'
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          description: 'There was an error during the OAuth callback process. Please try signing in again.',
          action: 'Try Again'
        }
      case 'OAuthCreateAccount':
        return {
          title: 'Account Creation Failed',
          description: 'We couldn\'t create your account using OAuth. Please try again or contact support.',
          action: 'Try Again'
        }
      case 'EmailCreateAccount':
        return {
          title: 'Email Account Creation Failed',
          description: 'We couldn\'t create your account. Please check your email address and try again.',
          action: 'Try Again'
        }
      case 'Callback':
        return {
          title: 'Authentication Callback Error',
          description: 'There was an error during the authentication process. Please try again.',
          action: 'Try Again'
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          description: 'This OAuth account is not linked to any existing account. Please sign in with your email and password, or create a new account.',
          action: 'Sign In'
        }
      case 'EmailSignin':
        return {
          title: 'Email Sign-in Failed',
          description: 'We couldn\'t send you a sign-in email. Please check your email address and try again.',
          action: 'Try Again'
        }
      case 'CredentialsSignup':
        return {
          title: 'Account Creation Failed',
          description: 'We couldn\'t create your account. Please check your information and try again.',
          action: 'Try Again'
        }
      case 'SessionRequired':
        return {
          title: 'Session Required',
          description: 'You need to be signed in to access this page. Please sign in and try again.',
          action: 'Sign In'
        }
      default:
        return {
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication. Please try again.',
          action: 'Try Again'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{errorInfo.title}</h1>
            <p className="text-gray-600 mt-2">{errorInfo.description}</p>
          </div>

          {/* Error Details */}
          {error && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Error Code:</span> {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {errorInfo.action}
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help?{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
