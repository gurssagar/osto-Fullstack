'use server'

import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface PaymentMethodData {
  type: string
  card_number?: string
  expiry_month?: number
  expiry_year?: number
  cvv?: string
  cardholder_name?: string
  is_default?: boolean
}

interface BillingAddressData {
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
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

// Payment Methods
export async function getPaymentMethodsAction(): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/payment-methods`, {
      method: 'GET',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get payment methods',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get payment methods error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function addPaymentMethodAction(formData: FormData): Promise<ApiResponse> {
  try {
    
    
    const paymentMethodData: PaymentMethodData = {
      type: formData.get('type') as string,
      card_number: formData.get('card_number') as string || undefined,
      expiry_month: formData.get('expiry_month') ? parseInt(formData.get('expiry_month') as string) : undefined,
      expiry_year: formData.get('expiry_year') ? parseInt(formData.get('expiry_year') as string) : undefined,
      cvv: formData.get('cvv') as string || undefined,
      cardholder_name: formData.get('cardholder_name') as string || undefined,
      is_default: formData.get('is_default') === 'true',
    }

    // Remove undefined values
    Object.keys(paymentMethodData).forEach(key => {
      if (paymentMethodData[key as keyof PaymentMethodData] === undefined) {
        delete paymentMethodData[key as keyof PaymentMethodData]
      }
    })

    const response = await fetch(`${API_BASE_URL}/api/v1/payment-methods`, {
      method: 'POST',
      
      body: JSON.stringify(paymentMethodData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to add payment method',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Payment method added successfully',
    }
  } catch (error) {
    console.error('Add payment method error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function updatePaymentMethodAction(id: string, formData: FormData): Promise<ApiResponse> {
  try {
    
    
    const updateData: Partial<PaymentMethodData> = {
      cardholder_name: formData.get('cardholder_name') as string || undefined,
      is_default: formData.get('is_default') === 'true',
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof PaymentMethodData] === undefined) {
        delete updateData[key as keyof PaymentMethodData]
      }
    })

    const response = await fetch(`${API_BASE_URL}/api/v1/payment-methods/${id}`, {
      method: 'PUT',
      
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update payment method',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Payment method updated successfully',
    }
  } catch (error) {
    console.error('Update payment method error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function deletePaymentMethodAction(id: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/payment-methods/${id}`, {
      method: 'DELETE',
      
    })

    if (!response.ok) {
      const result = await response.json()
      return {
        success: false,
        error: result.error || 'Failed to delete payment method',
      }
    }

    return {
      success: true,
      message: 'Payment method deleted successfully',
    }
  } catch (error) {
    console.error('Delete payment method error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

// Billing Address
export async function getBillingAddressAction(): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/billing-address`, {
      method: 'GET',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get billing address',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get billing address error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function updateBillingAddressAction(formData: FormData): Promise<ApiResponse> {
  try {
    
    
    const addressData: BillingAddressData = {
      street_address: formData.get('street_address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postal_code: formData.get('postal_code') as string,
      country: formData.get('country') as string,
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/billing-address`, {
      method: 'PUT',
      
      body: JSON.stringify(addressData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update billing address',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Billing address updated successfully',
    }
  } catch (error) {
    console.error('Update billing address error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

// Billing History
export async function getBillingHistoryAction(): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/billing/history`, {
      method: 'GET',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get billing history',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get billing history error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}