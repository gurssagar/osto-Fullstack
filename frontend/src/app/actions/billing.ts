'use server'

import { cookies } from 'next/headers'

const API_BASE_URL = process.env.API_BASE_URL || 'https://osto-fullstack.vercel.app/'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface PaymentMethodData {
  organization_id: string
  type: string
  provider: string
  provider_id?: string
  last4?: string
  brand?: string
  expiry_month?: number
  expiry_year?: number
  holder_name?: string
  is_default?: boolean
  is_active?: boolean
  // Legacy fields for backward compatibility
  card_number?: string
  cvv?: string
  cardholder_name?: string
}

interface BillingAddressData {
  organization_id: string
  company_name?: string
  contact_name: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  tax_id?: string
  is_default?: boolean
  // Legacy field for backward compatibility
  street_address?: string
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
      organization_id: formData.get('organization_id') as string,
      type: formData.get('type') as string,
      provider: formData.get('provider') as string || 'stripe',
      provider_id: formData.get('provider_id') as string || undefined,
      last4: formData.get('last4') as string || undefined,
      brand: formData.get('brand') as string || undefined,
      expiry_month: formData.get('expiry_month') ? parseInt(formData.get('expiry_month') as string) : undefined,
      expiry_year: formData.get('expiry_year') ? parseInt(formData.get('expiry_year') as string) : undefined,
      holder_name: formData.get('holder_name') as string || formData.get('cardholder_name') as string || undefined,
      is_default: formData.get('is_default') === 'true',
      is_active: formData.get('is_active') !== 'false',
      // Legacy fields for backward compatibility
      card_number: formData.get('card_number') as string || undefined,
      cvv: formData.get('cvv') as string || undefined,
      cardholder_name: formData.get('cardholder_name') as string || undefined,
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
      organization_id: formData.get('organization_id') as string,
      company_name: formData.get('company_name') as string || undefined,
      contact_name: formData.get('contact_name') as string,
      address_line1: formData.get('address_line1') as string || formData.get('street_address') as string,
      address_line2: formData.get('address_line2') as string || undefined,
      city: formData.get('city') as string,
      state: formData.get('state') as string || undefined,
      postal_code: formData.get('postal_code') as string,
      country: formData.get('country') as string,
      tax_id: formData.get('tax_id') as string || undefined,
      is_default: formData.get('is_default') === 'true',
      // Legacy field for backward compatibility
      street_address: formData.get('street_address') as string || undefined,
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