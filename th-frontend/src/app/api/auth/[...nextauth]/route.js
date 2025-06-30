import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              username: credentials.username,
              email: credentials.username,
              password: credentials.password,
            }),
            headers: { 'Content-Type': 'application/json' }
          })

          const data = await res.json()

          if (res.ok && data.user) {
            return {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              emailVerified: data.user.email_verified,
              public: data.user.public,
              token: data.token
            }
          }
          return null
        } catch (error) {
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.emailVerified = user.emailVerified
        token.public = user.public
        token.apiToken = user.token
      }
      
      // Handle Google OAuth sign-up/sign-in
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our system
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: user.email,
              password: 'oauth_' + user.id // Temporary password for OAuth users
            }),
            headers: { 'Content-Type': 'application/json' }
          })

          if (!res.ok) {
            // User doesn't exist, create account
            const signupRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/signup`, {
              method: 'POST',
              body: JSON.stringify({
                user: {
                  username: user.email.split('@')[0],
                  email: user.email,
                  password: 'oauth_' + user.id,
                  password_confirmation: 'oauth_' + user.id
                }
              }),
              headers: { 'Content-Type': 'application/json' }
            })
            
            const signupData = await signupRes.json()
            if (signupRes.ok) {
              // Auto-verify email for OAuth users
              await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/verify_email`, {
                method: 'POST',
                body: JSON.stringify({
                  token: signupData.user.email_verification_token
                }),
                headers: { 'Content-Type': 'application/json' }
              })
            }
          }
        } catch (error) {
          console.error('OAuth user creation error:', error)
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      session.user.id = token.id
      session.user.username = token.username
      session.user.emailVerified = token.emailVerified
      session.user.public = token.public
      session.apiToken = token.apiToken
      return session
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome'
  }
})

export { handler as GET, handler as POST } 
