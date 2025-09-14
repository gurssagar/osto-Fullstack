'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AuthTestProps {
  className?: string;
}

export const AuthTest: React.FC<AuthTestProps> = ({ className }) => {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runAuthTests = async () => {
    setIsLoading(true);
    const results: any[] = [];

    try {
      // Test 1: Check session data
      results.push({
        test: 'Session Data',
        status: session ? 'PASS' : 'FAIL',
        data: session ? {
          user: session.user?.email,
          accessToken: session.accessToken ? 'Present' : 'Missing',
          refreshToken: session.refreshToken ? 'Present' : 'Missing'
        } : 'No session'
      });

      // Test 2: Check API client token sync
      await apiClient.syncTokensFromSession();
      const hasToken = apiClient.getAccessToken();
      results.push({
        test: 'API Client Token Sync',
        status: hasToken ? 'PASS' : 'FAIL',
        data: hasToken ? 'Token synced successfully' : 'No token found'
      });

      // Test 3: Test protected API call
      try {
        const response = await apiClient.getCurrentUser();
        results.push({
          test: 'Protected API Call',
          status: response ? 'PASS' : 'FAIL',
          data: response || 'No response'
        });
      } catch (error: any) {
        results.push({
          test: 'Protected API Call',
          status: 'FAIL',
          data: error.message || 'Unknown error'
        });
      }

      // Test 4: Test plans endpoint (should work without auth)
      try {
        const plans = await apiClient.getPlans();
        results.push({
          test: 'Public API Call (Plans)',
          status: plans ? 'PASS' : 'FAIL',
          data: plans ? `Found ${plans.length} plans` : 'No plans'
        });
      } catch (error: any) {
        results.push({
          test: 'Public API Call (Plans)',
          status: 'FAIL',
          data: error.message || 'Unknown error'
        });
      }

    } catch (error: any) {
      results.push({
        test: 'General Error',
        status: 'FAIL',
        data: error.message || 'Unknown error'
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Authentication Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={runAuthTests} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Running Tests...' : 'Run Auth Tests'}
          </Button>
          <Badge variant={status === 'authenticated' ? 'default' : 'secondary'}>
            Session: {status}
          </Badge>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{result.test}</span>
                  <Badge 
                    variant={result.status === 'PASS' ? 'default' : 'destructive'}
                  >
                    {result.status}
                  </Badge>
                </div>
                <pre className="text-sm text-muted-foreground bg-muted p-2 rounded overflow-auto">
                  {typeof result.data === 'object' 
                    ? JSON.stringify(result.data, null, 2) 
                    : result.data
                  }
                </pre>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthTest;