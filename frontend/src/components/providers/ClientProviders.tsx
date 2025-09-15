'use client';

import React from 'react';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NextAuthProvider } from '@/contexts/NextAuthProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <NextAuthProvider>
        <AuthProvider>
          <SidebarProvider>
            {children}
            <Toaster position="top-right" richColors />
          </SidebarProvider>
        </AuthProvider>
      </NextAuthProvider>
    </ThemeProvider>
  );
}