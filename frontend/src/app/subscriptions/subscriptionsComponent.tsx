'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Monitor,
  Network,
  ClipboardCheck,
  Bug,
  ChevronUp,
  ChevronDown,
  Pause,
  X,
  Loader2,
  Plus,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Subscription, Plan } from '@/lib/api-client';
import { toast } from 'sonner';

interface SubscriptionComponentsProps {
  subscriptions: Subscription[];
  plans: Plan[];
}

const SubscriptionComponents: React.FC<SubscriptionComponentsProps> = ({ subscriptions, plans }) => {
  const { user, organization } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [localSubscriptions, setLocalSubscriptions] = useState<Subscription[]>(subscriptions);
  const [localPlans, setLocalPlans] = useState<Plan[]>(plans);

  // Update local state when props change
  useEffect(() => {
    setLocalSubscriptions(subscriptions);
    setLocalPlans(plans);
  }, [subscriptions, plans]);

  const fetchSubscriptions = async () => {
    if (!organization) return;
    
    try {
      const data = await apiClient.getSubscriptionsByOrganization(organization.id);
      setLocalSubscriptions(data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      toast.error('Failed to load subscriptions');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    setActionLoading(subscriptionId);
    try {
      await apiClient.cancelSubscription(subscriptionId);
      toast.success('Subscription cancelled successfully');
      await fetchSubscriptions();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenewSubscription = async (subscriptionId: string) => {
    setActionLoading(subscriptionId);
    try {
      await apiClient.renewSubscription(subscriptionId);
      toast.success('Subscription renewed successfully');
      await fetchSubscriptions();
    } catch (error) {
      console.error('Failed to renew subscription:', error);
      toast.error('Failed to renew subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSubscription = async (planId: string) => {
    if (!organization) return;
    
    setActionLoading(planId);
    try {
      await apiClient.createSubscription({
        organization_id: organization.id,
        plan_id: planId,
        auto_renew: true,
      });
      toast.success('Subscription created successfully');
      await fetchSubscriptions();
    } catch (error: any) {
      console.error('Failed to create subscription:', error);
      toast.error(error.message || 'Failed to create subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Trial</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Cancelled</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getIconForPlan = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('security') || name.includes('shield')) return <ShieldCheck size={24} />;
    if (name.includes('monitor') || name.includes('endpoint')) return <Monitor size={24} />;
    if (name.includes('network')) return <Network size={24} />;
    if (name.includes('compliance')) return <ClipboardCheck size={24} />;
    if (name.includes('vulnerability')) return <Bug size={24} />;
    return <ShieldCheck size={24} />;
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading subscriptions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your active subscriptions and billing
          </p>
        </div>
      </div>

      {/* Active Subscriptions */}
      {localSubscriptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Subscriptions
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localSubscriptions.map((subscription) => {
              const plan = localPlans.find(p => p.id === subscription.plan_id);
              return (
                <Card key={subscription.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getIconForPlan(plan?.name || 'Default')}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {plan?.name || 'Unknown Plan'}
                          </h3>
                          {getStatusBadge(subscription.status)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className="font-medium">
                          {plan ? formatPrice(plan.price, plan.currency) : 'N/A'}
                          {plan && `/${plan.interval}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                        <span className="font-medium">
                          {formatDate(subscription.start_date)}
                        </span>
                      </div>
                      
                      {subscription.end_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                          <span className="font-medium">
                            {formatDate(subscription.end_date)}
                          </span>
                        </div>
                      )}
                      
                      {subscription.trial_end_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Trial Ends:</span>
                          <span className="font-medium">
                            {formatDate(subscription.trial_end_date)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Auto Renew:</span>
                        <span className="font-medium">
                          {subscription.auto_renew ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    {plan?.features && plan.features.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                          Features:
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-xs text-gray-500">
                              +{plan.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-3 space-x-2">
                    {subscription.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelSubscription(subscription.id)}
                        disabled={actionLoading === subscription.id}
                        className="flex-1"
                      >
                        {actionLoading === subscription.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Cancel
                      </Button>
                    )}
                    
                    {(subscription.status === 'expired' || subscription.status === 'cancelled') && (
                      <Button
                        size="sm"
                        onClick={() => handleRenewSubscription(subscription.id)}
                        disabled={actionLoading === subscription.id}
                        className="flex-1"
                      >
                        {actionLoading === subscription.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                        Renew
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Available Plans
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {localPlans.map((plan) => {
            const hasActiveSubscription = localSubscriptions.some(
              sub => sub.plan_id === plan.id && sub.status === 'active'
            );
            
            return (
              <Card key={plan.id} className="relative">
                {plan.is_popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    {getIconForPlan(plan.name)}
                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(plan.price, plan.currency)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      per {plan.interval}
                    </div>
                    {plan.trial_days > 0 && (
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {plan.trial_days} days free trial
                      </div>
                    )}
                  </div>
                  
                  {plan.features && plan.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                        Features:
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleCreateSubscription(plan.id)}
                    disabled={hasActiveSubscription || actionLoading === plan.id}
                    variant={hasActiveSubscription ? "outline" : "default"}
                  >
                    {actionLoading === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : hasActiveSubscription ? (
                      'Already Subscribed'
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {localSubscriptions.length === 0 && localPlans.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No subscriptions found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any active subscriptions yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionComponents;
