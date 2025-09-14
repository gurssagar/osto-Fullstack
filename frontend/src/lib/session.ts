'use server'

import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key'
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionData {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    role?: string
    is_active?: boolean
  }
  organization?: {
    id: string
    name: string
    description?: string
  }
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

export async function createSession(data: SessionData): Promise<void> {
  const session = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (!sessionCookie) {
      return null
    }

    const { payload } = await jwtVerify(sessionCookie, encodedKey)
    return payload as SessionData
  } catch (error) {
    console.error('Session verification failed:', error)
    return null
  }
}

export async function updateSession(data: Partial<SessionData>): Promise<void> {
  const currentSession = await getSession()
  if (!currentSession) {
    throw new Error('No active session found')
  }

  const updatedSession = { ...currentSession, ...data }
  await createSession(updatedSession)
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  cookieStore.delete('token') // Also delete the token cookie
}

export async function isSessionValid(): Promise<boolean> {
  const session = await getSession()
  if (!session) {
    return false
  }

  return session.expiresAt > Date.now()
}