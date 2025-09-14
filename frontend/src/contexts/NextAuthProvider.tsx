'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api-client';

interface NextAuthContextType {
  syncTokens: () => Promise<void>;
}

const NextAuthContext = createContext<NextAuthContextType | undefined>(undefined);

export const useNextAuth = () => {
  const context = useContext(NextAuthContext);
  if (context === undefined) {
    throw new Error('useNextAuth must be used within a NextAuthProvider');
  }
  return context;
};

interface TokenSyncProviderProps {
  children: ReactNode;
}

// Inner component that has access to session
const TokenSyncProvider: React.FC<TokenSyncProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();

  const syncTokens = async () => {
    if (session?.user) {
      const accessToken = (session.user as any).accessToken;
      const refreshToken = (session.user as any).refreshToken;
      
      if (accessToken && refreshToken) {
        apiClient.setTokens(accessToken, refreshToken);
      }
    } else {
      // Clear tokens if no session
      apiClient.clearTokens();
    }
  };

  // Sync tokens whenever session changes
  useEffect(() => {
    if (status !== 'loading') {
      syncTokens();
    }
  }, [session, status]);

  const value: NextAuthContextType = {
    syncTokens,
  };

  return (
    <NextAuthContext.Provider value={value}>
      {children}
    </NextAuthContext.Provider>
  );
};

interface NextAuthProviderProps {
  children: ReactNode;
}

// Main provider that wraps SessionProvider
export const NextAuthProvider: React.FC<NextAuthProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <TokenSyncProvider>
        {children}
      </TokenSyncProvider>
    </SessionProvider>
  );
};

export default NextAuthProvider;