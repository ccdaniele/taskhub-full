import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please enter your username/email and password')
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              username: credentials.username,
              email: credentials.username,
              password: credentials.password,
            }),
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Authentication failed' }))
            throw new Error(errorData.error || 'Invalid credentials')
          }

          const data = await res.json()

          if (data.user) {
            return {
              id: data.user.id.toString(),
              name: data.user.username,
              email: data.user.email,
              username: data.user.username,
              emailVerified: data.user.email_verified,
              public: data.user.public,
              token: data.token
            }
          }
          
          throw new Error('Invalid credentials')
        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error(error.message || 'Authentication failed')
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.emailVerified = user.emailVerified
        token.public = user.public
        token.apiToken = user.token
      }
      return token
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.emailVerified = token.emailVerified
        session.user.public = token.public
        session.apiToken = token.apiToken
      }
      return session
    },
    
    async signIn({ user }) {
      // Check if email is verified
      if (!user.emailVerified) {
        throw new Error('Please verify your email before signing in.')
      }
      return true
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  debug: process.env.NODE_ENV === 'development',
})

export const GET = handlers.GET
export const POST = handlers.POST 
