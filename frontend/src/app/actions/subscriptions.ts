'use server'

import { cookies } from 'next/headers'

const API_BASE_URL = process.env.API_BASE_URL || 'https://osto-fullstack.vercel.app/'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface CreateSubscriptionData {
  organization_id: string
  plan_id: string
  payment_method_id?: string
  billing_cycle?: string
  trial_ends_at?: string
  metadata?: Record<string, any>
}

interface UpdateSubscriptionData {
  plan_id?: string
  status?: string
  payment_method_id?: string
  billing_cycle?: string
  trial_ends_at?: string
  metadata?: Record<string, any>
}



export async function getSubscriptionsAction(organizationId?: string): Promise<ApiResponse> {
  try {
    let url = `${API_BASE_URL}/api/v1/subscriptions`;
    
    // If organization ID is provided, use organization-specific endpoint
    if (organizationId) {
      url = `${API_BASE_URL}/api/v1/subscriptions/organization/${organizationId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
    })

    const result = await response.json()
    console.log("test", result)
    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get subscriptions',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get subscriptions error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function getSubscriptionAction(id: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${id}`, {
      method: 'GET',
    
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get subscription',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get subscription error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function createSubscriptionAction(formData: FormData): Promise<ApiResponse> {
  try {
    
    
    const subscriptionData: CreateSubscriptionData = {
      organization_id: formData.get('organization_id') as string,
      plan_id: formData.get('plan_id') as string,
      payment_method_id: formData.get('payment_method_id') as string || undefined,
      billing_cycle: formData.get('billing_cycle') as string || undefined,
      trial_ends_at: formData.get('trial_ends_at') as string || undefined,
      metadata: formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : undefined,
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions`, {
      method: 'POST',
    
      body: JSON.stringify(subscriptionData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create subscription',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Subscription created successfully',
    }
  } catch (error) {
    console.error('Create subscription error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function updateSubscriptionAction(id: string, formData: FormData): Promise<ApiResponse> {
  try {
    
    
    const updateData: UpdateSubscriptionData = {
      plan_id: formData.get('plan_id') as string || undefined,
      status: formData.get('status') as string || undefined,
      payment_method_id: formData.get('payment_method_id') as string || undefined,
      billing_cycle: formData.get('billing_cycle') as string || undefined,
      trial_ends_at: formData.get('trial_ends_at') as string || undefined,
      metadata: formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : undefined,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateSubscriptionData] === undefined) {
        delete updateData[key as keyof UpdateSubscriptionData]
      }
    })

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${id}`, {
      method: 'PUT',
    
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update subscription',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Subscription updated successfully',
    }
  } catch (error) {
    console.error('Update subscription error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function cancelSubscriptionAction(id: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${id}/cancel`, {
      method: 'POST',
    
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to cancel subscription',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Subscription cancelled successfully',
    }
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function getPlansAction(): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/plans`, {
      method: 'GET',
    
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get plans',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get plans error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function getPlanAction(id: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/plans/${id}`, {
      method: 'GET',
    
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get plan',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get plan error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}