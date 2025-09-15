'use server'

import { cookies } from 'next/headers'

const API_BASE_URL = process.env.API_BASE_URL || 'https://osto-fullstack.vercel.app/'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface UpdateProfileData {
  first_name?: string
  last_name?: string
  email?: string
}

interface ChangePasswordData {
  current_password: string
  new_password: string
}

interface UpdateOrganizationData {
  name?: string
  description?: string
}



export async function updateProfileAction(formData: FormData): Promise<ApiResponse> {
  try {
   
    
    const updateData: UpdateProfileData = {
      first_name: formData.get('first_name') as string || undefined,
      last_name: formData.get('last_name') as string || undefined,
      email: formData.get('email') as string || undefined,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateProfileData] === undefined) {
        delete updateData[key as keyof UpdateProfileData]
      }
    })

    const response = await fetch(`${API_BASE_URL}/api/v1/users/profile`, {
      method: 'PUT',
    
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update profile',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Profile updated successfully',
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function changePasswordAction(formData: FormData): Promise<ApiResponse> {
  try {
   
    
    const passwordData: ChangePasswordData = {
      current_password: formData.get('current_password') as string,
      new_password: formData.get('new_password') as string,
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/users/change-password`, {
      method: 'PUT',
    
      body: JSON.stringify(passwordData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to change password',
      }
    }

    return {
      success: true,
      message: 'Password changed successfully',
    }
  } catch (error) {
    console.error('Change password error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function getUserProfileAction(): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/users/profile`, {
      method: 'GET',
    
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get user profile',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get user profile error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function getOrganizationAction(): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/organizations/current`, {
      method: 'GET',
    
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get organization',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get organization error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function updateOrganizationAction(formData: FormData): Promise<ApiResponse> {
  try {
    
    
    const updateData: UpdateOrganizationData = {
      name: formData.get('name') as string || undefined,
      description: formData.get('description') as string || undefined,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateOrganizationData] === undefined) {
        delete updateData[key as keyof UpdateOrganizationData]
      }
    })

    const response = await fetch(`${API_BASE_URL}/api/v1/organizations/current`, {
      method: 'PUT',
    
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update organization',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Organization updated successfully',
    }
  } catch (error) {
    console.error('Update organization error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}