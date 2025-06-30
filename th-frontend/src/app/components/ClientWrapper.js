'use client'

import { SessionProvider } from 'next-auth/react'
import Navigation from './Navigation'

export default function ClientWrapper({ children }) {
  return (
    <SessionProvider>
      <Navigation />
      <div className="min-h-screen">
        {children}
      </div>
    </SessionProvider>
  )
} 
