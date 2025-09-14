'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSession, deleteSession, SessionData } from '@/lib/session'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  organization_name?: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export async function loginAction(formData: FormData): Promise<ApiResponse> {
  try {
    const loginData: LoginData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Login failed',
      }
    }

    // Set the JWT token in cookies
    const cookieStore = await cookies()
    cookieStore.set('token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Create session with user data
    const sessionData: SessionData = {
      user: {
        id: result.data.user.id,
        email: result.data.user.email,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        role: result.data.user.role,
        is_active: result.data.user.is_active
      },
      organization: result.data.organization ? {
        id: result.data.organization.id,
        name: result.data.organization.name,
        description: result.data.organization.description
      } : undefined,
      accessToken: result.data.token,
      refreshToken: result.data.refresh_token,
      expiresAt: Date.now() + (60 * 60 * 24 * 7 * 1000) // 7 days
    }

    await createSession(sessionData)

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function registerAction(formData: FormData): Promise<ApiResponse> {
  try {
    const registerData: RegisterData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      organization_name: formData.get('organization_name') as string || undefined,
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Registration failed',
      }
    }

    // Set the JWT token in cookies
    const cookieStore = await cookies()
    cookieStore.set('token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Create session with user data
    const sessionData: SessionData = {
      user: {
        id: result.data.user.id,
        email: result.data.user.email,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        role: result.data.user.role,
        is_active: result.data.user.is_active
      },
      organization: result.data.organization ? {
        id: result.data.organization.id,
        name: result.data.organization.name,
        description: result.data.organization.description
      } : undefined,
      accessToken: result.data.token,
      refreshToken: result.data.refresh_token,
      expiresAt: Date.now() + (60 * 60 * 24 * 7 * 1000) // 7 days
    }

    await createSession(sessionData)

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function logoutAction(): Promise<void> {
  await deleteSession()
  redirect('/auth/login')
}

export async function getCurrentUser(): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        error: 'No authentication token found',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get user data',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('token')?.value || null
}