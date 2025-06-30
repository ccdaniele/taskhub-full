'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/auth/verify_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
        
        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?verified=true')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to verify email')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const resendVerification = async () => {
    try {
      const email = prompt('Please enter your email address:')
      if (!email) return

      const response = await fetch('http://localhost:3000/auth/resend_verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Verification email sent! Please check your inbox.')
      } else {
        alert(data.error || 'Failed to resend verification email')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
            <p className="text-gray-600 mt-2">Verifying your TaskHub account</p>
          </div>

          {/* Status Content */}
          <div className="text-center space-y-4">
            {status === 'verifying' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Verifying your email address...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-600">Email Verified!</h2>
                  <p className="text-gray-600 mt-2">{message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll be redirected to the sign-in page in a few seconds...
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-red-600">Verification Failed</h2>
                  <p className="text-gray-600 mt-2">{message}</p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {status === 'success' && (
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In Now
              </Link>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Resend Verification Email
                </button>
                
                <Link
                  href="/auth/signin"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Having trouble? Contact our{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-500">
                support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
