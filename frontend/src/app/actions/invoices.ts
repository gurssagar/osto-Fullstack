'use server'

import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://osto-fullstack.vercel.app/'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface InvoiceItemData {
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  tax_rate?: number
  tax_amount?: number
  metadata?: Record<string, any>
}

interface InvoiceData {
  organization_id: string
  subscription_id?: string
  payment_method_id?: string
  invoice_number: string
  status: string
  currency: string
  subtotal: number
  tax_amount: number
  discount_amount?: number
  total: number
  due_date: string
  issued_at?: string
  paid_at?: string
  notes?: string
  metadata?: Record<string, any>
  items?: InvoiceItemData[]
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

export async function createInvoiceAction(formData: FormData): Promise<ApiResponse> {
  try {
    const invoiceData: InvoiceData = {
      organization_id: formData.get('organization_id') as string,
      subscription_id: formData.get('subscription_id') as string || undefined,
      payment_method_id: formData.get('payment_method_id') as string || undefined,
      invoice_number: formData.get('invoice_number') as string,
      status: formData.get('status') as string || 'draft',
      currency: formData.get('currency') as string || 'USD',
      subtotal: parseFloat(formData.get('subtotal') as string),
      tax_amount: parseFloat(formData.get('tax_amount') as string) || 0,
      discount_amount: formData.get('discount_amount') ? parseFloat(formData.get('discount_amount') as string) : undefined,
      total: parseFloat(formData.get('total') as string),
      due_date: formData.get('due_date') as string,
      issued_at: formData.get('issued_at') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      metadata: formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : undefined,
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create invoice',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Invoice created successfully',
    }
  } catch (error) {
    console.error('Create invoice error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function updateInvoiceAction(id: string, formData: FormData): Promise<ApiResponse> {
  try {
    const updateData: Partial<InvoiceData> = {
      status: formData.get('status') as string || undefined,
      due_date: formData.get('due_date') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      metadata: formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : undefined,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof InvoiceData] === undefined) {
        delete updateData[key as keyof InvoiceData]
      }
    })

    const response = await fetch(`${API_BASE_URL}/api/v1/invoices/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update invoice',
      }
    }

    return {
      success: true,
      data: result.data,
      message: 'Invoice updated successfully',
    }
  } catch (error) {
    console.error('Update invoice error:', error)
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
      headers: await getAuthHeaders(),
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