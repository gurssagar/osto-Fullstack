import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub, 
    Google,
    // Credentials provider removed - using server actions instead
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName ?? ''
        token.role = (user as any).role ?? 'user'
        token.isActive = (user as any).isActive ?? true
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.organization = (user as any).organization
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        (session.user as any).firstName = (token as any).firstName
        (session.user as any).lastName = (token as any).lastName
        (session.user as any).role = (token as any).role
        (session.user as any).isActive = (token as any).isActive
        (session.user as any).accessToken = (token as any).accessToken
        (session.user as any).refreshToken = (token as any).refreshToken
        (session.user as any).organization = (token as any).organization
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
})