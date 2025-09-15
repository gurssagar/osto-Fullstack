'use client';

import React, { useState, useEffect } from 'react';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import BillingCalendar from '@/components/dashboard/BillingCalender';
import {
  ShieldCheck,
  Monitor,
  Network,
  ClipboardCheck,
  Bug,
  CheckCircle2,
  XCircle,
  Loader2,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AuthTest from '@/components/AuthTest';
import { getSession } from '@/lib/session';

interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date?: string;
  payment_method_id?: string;
  billing_cycle?: string;
  trial_ends_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: string;
  interval?: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface InvoiceItem {
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate?: number;
  tax_amount?: number;
  metadata?: Record<string, any>;
}

interface Invoice {
  id: string;
  organization_id: string;
  subscription_id?: string;
  payment_method_id?: string;
  invoice_number: string;
  status: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount_amount?: number;
  total: number;
  due_date: string;
  issued_at?: string;
  paid_at?: string;
  notes?: string;
  metadata?: Record<string, any>;
  items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

interface DashboardComponentProps {
  subscriptions: Subscription[];
  plans: Plan[];
  invoices: Invoice[];
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({ 
  subscriptions: initialSubscriptions, 
  plans: initialPlans, 
  invoices: initialInvoices 
}) => {
  const { user, organization } = useAuth();
  
  // Debug session data
  useEffect(() => {
    const logSessionData = async () => {
      try {
        const sessionData = await getSession();
        console.log('=== SESSION DEBUG INFO ===');
        console.log('Session Data:', sessionData);
        console.log('User from Auth Context:', user);
        console.log('Organization from Auth Context:', organization);
        console.log('========================');
      } catch (error) {
        console.error('Error getting session data:', error);
      }
    };
    
    logSessionData();
  }, [user, organization]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    totalSpent: 0,
    upcomingPayments: 0,
    overdueInvoices: 0,
  });

  useEffect(() => {
    // Calculate stats when data changes
    const activeSubscriptions = subscriptions.filter((sub: Subscription) => sub.status === 'active').length;
    const totalSpent = invoices
      .filter((inv: Invoice) => inv.status === 'paid')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const upcomingPayments = subscriptions
      .filter((sub: Subscription) => sub.status === 'active' && sub.end_date)
      .length;
    const overdueInvoices = invoices
      .filter((inv: Invoice) => inv.status === 'overdue')
      .length;
    
    setStats({
      activeSubscriptions,
      totalSpent,
      upcomingPayments,
      overdueInvoices,
    });
  }, [subscriptions, plans, invoices]);

  // Mock data for billing calendar
  const currentDate = new Date();
  const month = currentDate;
  const events = subscriptions
    .filter(sub => sub.end_date)
    .map(sub => ({
      date: new Date(sub.end_date!),
      type: 'due' as const,
      label: `${plans.find(p => p.id === sub.plan_id)?.name || 'Subscription'} Renewal`,
    }));

  const getIconForPlan = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('security') || name.includes('shield')) return <ShieldCheck size={20} />;
    if (name.includes('monitor') || name.includes('endpoint')) return <Monitor size={20} />;
    if (name.includes('network')) return <Network size={20} />;
    if (name.includes('compliance')) return <ClipboardCheck size={20} />;
    if (name.includes('vulnerability')) return <Bug size={20} />;
    return <ShieldCheck size={20} />;
  };

  const getSubscriptionStatus = (subscription: Subscription): 'active' | 'payment-failed' | 'grace-period' | 'expired' => {
    switch (subscription.status) {
      case 'active':
        return 'active';
      case 'cancelled':
      case 'expired':
        return 'expired';
      case 'trialing':
        return 'grace-period';
      default:
        return 'payment-failed';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's an overview of your {organization?.name || 'organization'}'s subscriptions and billing.
          </p>
        </div>
      </div>

      {/* Auth Test Panel */}
      <AuthTest className="mb-6" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {subscriptions.length > stats.activeSubscriptions && 
                `${subscriptions.length - stats.activeSubscriptions} inactive`
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              From {invoices.filter((inv: Invoice) => inv.status === 'paid').length} paid invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Active subscriptions with renewal dates
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overdueInvoices > 0 ? 'Requires attention' : 'All up to date'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.overdueInvoices > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            You have {stats.overdueInvoices} overdue invoice{stats.overdueInvoices > 1 ? 's' : ''}. 
            Please review your billing to avoid service interruption.
          </AlertDescription>
        </Alert>
      )}

      {subscriptions.some((sub: Subscription) => sub.status === 'trialing') && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            You have active trial subscriptions. Don't forget to add a payment method before they expire.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriptions Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Subscriptions
            </h2>
          </div>
          
          {subscriptions.length > 0 ? (
            <div className="grid gap-4">
              {subscriptions.slice(0, 4).map((subscription) => {
                const plan = plans.find(p => p.id === subscription.plan_id);
                return (
                  <SubscriptionCard
                    key={subscription.id}
                    name={plan?.name || 'Unknown Plan'}
                    icon={getIconForPlan(plan?.name || 'Default')}
                    status={getSubscriptionStatus(subscription)}
                    usagePercentage={Math.floor(Math.random() * 100)} // Mock usage data
                    tier={plan?.name || 'Unknown'}
                    billingCycle={plan?.interval === 'monthly' ? 'monthly' : 'yearly'}
                  />
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShieldCheck className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No active subscriptions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Get started by subscribing to one of our plans.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Billing Calendar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Billing Calendar
          </h2>
          <BillingCalendar events={events} month={month} />
          
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <div className="space-y-3">
                  {invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{invoice.invoice_number}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </p>
                        <p className={`text-xs capitalize ${
                          invoice.status === 'paid' ? 'text-green-600' :
                          invoice.status === 'overdue' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {invoice.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                  No invoices yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
