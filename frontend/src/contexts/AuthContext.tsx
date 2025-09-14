'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { loginAction, registerAction, logoutAction, getCurrentUser } from '@/app/actions/auth';
import { getUserProfileAction, getOrganizationAction, changePasswordAction } from '@/app/actions/user';
import { getSession, SessionData } from '@/lib/session';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

interface Organization {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    organization_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // First try to get session data
      const sessionData = await getSession();
      if (sessionData && sessionData.user) {
        setUser(sessionData.user);
        setOrganization(sessionData.organization || null);
      } else {
        // Fallback to API call if no session
        const userResult = await getCurrentUser();
        
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          
          // Get user's organization
          const orgResult = await getOrganizationAction();
          if (orgResult.success && orgResult.data) {
            setOrganization(orgResult.data);
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Clear any invalid state
      setUser(null);
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      const result = await loginAction(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      // Get session data after successful login
      const sessionData = await getSession();
      if (sessionData && sessionData.user) {
        setUser(sessionData.user);
        setOrganization(sessionData.organization || null);
      } else {
        // Fallback to API call if no session
        const userResult = await getCurrentUser();
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          
          // Get user's organization
          const orgResult = await getOrganizationAction();
          if (orgResult.success && orgResult.data) {
            setOrganization(orgResult.data);
          }
        }
      }
      
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    organization_name?: string;
  }) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      if (data.organization_name) {
        formData.append('organization_name', data.organization_name);
      }
      
      const result = await registerAction(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      // Get user profile after successful registration
      const userResult = await getCurrentUser();
      if (userResult.success && userResult.data) {
        setUser(userResult.data);
        
        // Get user's organization
        const orgResult = await getOrganizationAction();
        if (orgResult.success && orgResult.data) {
          setOrganization(orgResult.data);
        }
      }
      
      toast.success('Registration successful! Welcome to OstoBilling!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setOrganization(null);
      toast.success('Logged out successfully');
      // logoutAction already handles redirect to login
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const formData = new FormData();
      formData.append('current_password', currentPassword);
      formData.append('new_password', newPassword);
      
      const result = await changePasswordAction(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to change password');
      }
      
      toast.success('Password changed successfully');
    } catch (error: any) {
      console.error('Change password failed:', error);
      toast.error(error.message || 'Failed to change password');
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userResult = await getCurrentUser();
      
      if (userResult.success && userResult.data) {
        setUser(userResult.data);
        
        const orgResult = await getOrganizationAction();
        if (orgResult.success && orgResult.data) {
          setOrganization(orgResult.data);
        }
      } else {
        // User is no longer authenticated
        setUser(null);
        setOrganization(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      setOrganization(null);
    }
  };

  const value: AuthContextType = {
    user,
    organization,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    changePassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;