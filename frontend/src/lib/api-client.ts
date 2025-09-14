import { toast } from 'sonner';
import { getSession } from 'next-auth/react';

// Types based on Go backend models
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  interval_count: number;
  trial_days: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  start_date: string;
  end_date?: string;
  trial_end_date?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  plan?: Plan;
  organization?: Organization;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  total: number;
  currency: string;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Request/Response types
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  organization: Organization;
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface CreateSubscriptionRequest {
  organization_id: string;
  plan_id: string;
  auto_renew?: boolean;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  trial_days?: number;
  features: string[];
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

class APIClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
    
    // Load tokens from localStorage if available (fallback)
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  // Sync tokens from NextAuth session
  async syncTokensFromSession(): Promise<void> {
    try {
      const session = await getSession();
      if (session?.user) {
        const accessToken = (session.user as any).accessToken;
        const refreshToken = (session.user as any).refreshToken;
        
        if (accessToken && refreshToken) {
          this.setTokens(accessToken, refreshToken);
        }
      }
    } catch (error) {
      console.error('Failed to sync tokens from session:', error);
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Sync tokens from session if no token is available
    if (!this.accessToken) {
      await this.syncTokensFromSession();
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: APIResponse<T> = await response.json();

      // Handle token refresh if access token expired
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          headers.Authorization = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          return await retryResponse.json();
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token);
    }
    
    return response.data!;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.data) {
      this.setTokens(response.data.access_token, response.data.refresh_token);
    }
    
    return response.data!;
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await this.request<{ access_token: string; refresh_token: string }>(
        '/auth/refresh',
        {
          method: 'POST',
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        }
      );

      if (response.success && response.data) {
        this.setTokens(response.data.access_token, response.data.refresh_token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
    }

    return false;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const response = await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
  }

  // Plan methods
  async getPlans(page = 1, limit = 10): Promise<PaginatedResponse<Plan>> {
    const response = await this.request<Plan[]>(`/plans?page=${page}&limit=${limit}`);
    return response as PaginatedResponse<Plan>;
  }

  async getActivePlans(): Promise<Plan[]> {
    const response = await this.request<Plan[]>('/plans/active');
    return response.data || [];
  }

  async getPopularPlans(): Promise<Plan[]> {
    const response = await this.request<Plan[]>('/plans/popular');
    return response.data || [];
  }

  async getPlan(id: string): Promise<Plan> {
    const response = await this.request<Plan>(`/plans/${id}`);
    return response.data!;
  }

  async getPlanBySlug(slug: string): Promise<Plan> {
    const response = await this.request<Plan>(`/plans/slug/${slug}`);
    return response.data!;
  }

  async createPlan(data: CreatePlanRequest): Promise<Plan> {
    const response = await this.request<Plan>('/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async updatePlan(id: string, data: Partial<CreatePlanRequest>): Promise<Plan> {
    const response = await this.request<Plan>(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async deletePlan(id: string): Promise<void> {
    const response = await this.request(`/plans/${id}`, { method: 'DELETE' });
    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async activatePlan(id: string): Promise<Plan> {
    const response = await this.request<Plan>(`/plans/${id}/activate`, {
      method: 'POST',
    });
    return response.data!;
  }

  async deactivatePlan(id: string): Promise<Plan> {
    const response = await this.request<Plan>(`/plans/${id}/deactivate`, {
      method: 'POST',
    });
    return response.data!;
  }

  // Subscription methods
  async createSubscription(data: CreateSubscriptionRequest): Promise<Subscription> {
    const response = await this.request<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async getSubscriptionsByOrganization(orgId: string): Promise<Subscription[]> {
    const response = await this.request<Subscription[]>(`/subscriptions/organization/${orgId}`);
    return response.data || [];
  }

  async getActiveSubscription(orgId: string): Promise<Subscription | null> {
    try {
      const response = await this.request<Subscription>(`/subscriptions/organization/${orgId}/active`);
      return response.data || null;
    } catch (error) {
      return null;
    }
  }

  async getSubscription(id: string): Promise<Subscription> {
    const response = await this.request<Subscription>(`/subscriptions/${id}`);
    return response.data!;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    const response = await this.request<Subscription>(`/subscriptions/${id}/cancel`, {
      method: 'POST',
    });
    return response.data!;
  }

  async renewSubscription(id: string): Promise<Subscription> {
    const response = await this.request<Subscription>(`/subscriptions/${id}/renew`, {
      method: 'POST',
    });
    return response.data!;
  }

  // Profile methods
  async getProfile(): Promise<User> {
    const response = await this.request<User>('/profile');
    return response.data!;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.request<User>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  // Organization methods
  async getOrganizations(): Promise<Organization[]> {
    const response = await this.request<Organization[]>('/organizations');
    return response.data || [];
  }

  async createOrganization(data: { name: string }): Promise<Organization> {
    const response = await this.request<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async getOrganization(id: string): Promise<Organization> {
    const response = await this.request<Organization>(`/organizations/${id}`);
    return response.data!;
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    const response = await this.request<Organization>(`/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  // Invoice methods
  async getInvoices(page = 1, limit = 10): Promise<PaginatedResponse<Invoice>> {
    const response = await this.request<Invoice[]>(`/invoices?page=${page}&limit=${limit}`);
    return response as PaginatedResponse<Invoice>;
  }

  async getInvoicesByOrganization(orgId: string): Promise<Invoice[]> {
    const response = await this.request<Invoice[]>(`/invoices/organization/${orgId}`);
    return response.data || [];
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await this.request<Invoice>(`/invoices/${id}`);
    return response.data!;
  }

  async downloadInvoice(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/invoices/${id}/download`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return await response.blob();
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    const response = await this.request<User[]>('/admin/users');
    return response.data || [];
  }

  async getAllOrganizations(): Promise<Organization[]> {
    const response = await this.request<Organization[]>('/admin/organizations');
    return response.data || [];
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    const response = await this.request<Subscription[]>('/admin/subscriptions');
    return response.data || [];
  }

  async getAnalytics(): Promise<any> {
    const response = await this.request('/admin/analytics');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; version: string }> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
    return await response.json();
  }

  // Token management
  // Public method to set tokens (for NextAuth integration)
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Public method to clear tokens
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Create and export a singleton instance
export const apiClient = new APIClient();
export default apiClient;