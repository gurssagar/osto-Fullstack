'use server'

import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
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

export async function getInvoicesAction(): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices`, {
      method: 'GET',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get invoices',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get invoices error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function getInvoicesByOrganizationAction(organizationId: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices/organization/${organizationId}`, {
      method: 'GET',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get organization invoices',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get organization invoices error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function getInvoiceAction(id: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices/${id}`, {
      method: 'GET',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to get invoice',
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Get invoice error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function downloadInvoiceAction(id: string): Promise<ApiResponse> {
  try {
    
   

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices/${id}/download`, {
      method: 'GET',
      
    })

    if (!response.ok) {
      const result = await response.json()
      return {
        success: false,
        error: result.error || 'Failed to download invoice',
      }
    }

    // Get the blob data
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = `invoice-${id}.pdf`
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }

    return {
      success: true,
      data: {
        url,
        filename,
        blob
      },
      message: 'Invoice downloaded successfully',
    }
  } catch (error) {
    console.error('Download invoice error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function markInvoiceAsPaidAction(id: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices/${id}/mark-paid`, {
      method: 'POST',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to mark invoice as paid',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Invoice marked as paid successfully',
    }
  } catch (error) {
    console.error('Mark invoice as paid error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function sendInvoiceReminderAction(id: string): Promise<ApiResponse> {
  try {
    

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices/${id}/send-reminder`, {
      method: 'POST',
      
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to send invoice reminder',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Invoice reminder sent successfully',
    }
  } catch (error) {
    console.error('Send invoice reminder error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}