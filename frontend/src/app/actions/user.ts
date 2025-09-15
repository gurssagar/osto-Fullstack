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
  phone?: string
  avatar_url?: string
  timezone?: string
  language?: string
  metadata?: Record<string, any>
}

interface ChangePasswordData {
  current_password: string
  new_password: string
}

interface UpdateOrganizationData {
  name?: string
  slug?: string
  description?: string
  website?: string
  phone?: string
  email?: string
  logo_url?: string
  settings?: Record<string, any>
}

interface OrganizationMemberData {
  user_id: string
  organization_id: string
  role: string
  is_active?: boolean
}

interface InviteMemberData {
  email: string
  role: string
  organization_id: string
}



export async function updateProfileAction(formData: FormData): Promise<ApiResponse> {
  try {
   
    
    const updateData: UpdateProfileData = {
      first_name: formData.get('first_name') as string || undefined,
      last_name: formData.get('last_name') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      avatar_url: formData.get('avatar_url') as string || undefined,
      timezone: formData.get('timezone') as string || undefined,
      language: formData.get('language') as string || undefined,
      metadata: formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : undefined,
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
      slug: formData.get('slug') as string || undefined,
      description: formData.get('description') as string || undefined,
      website: formData.get('website') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      email: formData.get('email') as string || undefined,
      logo_url: formData.get('logo_url') as string || undefined,
      settings: formData.get('settings') ? JSON.parse(formData.get('settings') as string) : undefined,
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

export async function getOrganizationMembersAction(organizationId?: string): Promise<ApiResponse> {
  try {
    const url = organizationId 
      ? `${API_BASE_URL}/api/v1/organizations/${organizationId}/members`
      : `${API_BASE_URL}/api/v1/organizations/current/members`

    const response = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get organization members',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get organization members error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function inviteMemberAction(formData: FormData): Promise<ApiResponse> {
  try {
    const inviteData: InviteMemberData = {
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      organization_id: formData.get('organization_id') as string,
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/organizations/members/invite`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(inviteData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to invite member',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Member invited successfully',
    }
  } catch (error) {
    console.error('Invite member error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function updateMemberRoleAction(memberId: string, formData: FormData): Promise<ApiResponse> {
  try {
    const updateData = {
      role: formData.get('role') as string,
      is_active: formData.get('is_active') === 'true',
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/organizations/members/${memberId}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update member role',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Member role updated successfully',
    }
  } catch (error) {
    console.error('Update member role error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function removeMemberAction(memberId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/organizations/members/${memberId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to remove member',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Member removed successfully',
    }
  } catch (error) {
    console.error('Remove member error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

async function getAuthHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}