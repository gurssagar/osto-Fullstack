import React from 'react'
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
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
const Subscriptions: React.FC = () => {
  // Sample subscription data with more details
  const subscriptions = [
    {
      id: '1',
      name: 'Cloud Security',
      icon: <ShieldCheck size={24} />,
      status: 'active' as const,
      usagePercentage: 65,
      tier: 'Enterprise',
      billingCycle: 'yearly' as const,
      nextBillingDate: new Date(2023, 9, 15),
      price: 499,
      features: [
        'Cloud Workload Protection',
        'Container Security',
        'Serverless Security',
        'Cloud Security Posture Management',
        'Cloud Infrastructure Entitlement Management',
      ],
      limits: {
        users: '100/100',
        assets: '1,500/2,500',
        scans: 'Unlimited',
      },
    },
    {
      id: '2',
      name: 'Endpoint Protection',
      icon: <Monitor size={24} />,
      status: 'active' as const,
      usagePercentage: 82,
      tier: 'Business',
      billingCycle: 'monthly' as const,
      nextBillingDate: new Date(2023, 4, 25),
      price: 199,
      features: [
        'Antivirus & Anti-malware',
        'Endpoint Detection & Response',
        'Device Control',
        'Application Control',
        'Host-based Firewall',
      ],
      limits: {
        endpoints: '82/100',
        policies: '15/20',
        reports: 'Weekly',
      },
    },
    {
      id: '3',
      name: 'Network Security',
      icon: <Network size={24} />,
      status: 'grace-period' as const,
      usagePercentage: 45,
      tier: 'Professional',
      billingCycle: 'yearly' as const,
      nextBillingDate: new Date(2023, 4, 18),
      price: 349,
      features: [
        'Next-Gen Firewall',
        'Intrusion Prevention System',
        'Web Application Firewall',
        'SSL Inspection',
        'Traffic Analysis',
      ],
      limits: {
        networks: '5/15',
        bandwidth: '450/1,000 Mbps',
        rules: '125/500',
      },
    },
    {
      id: '4',
      name: 'Compliance Manager',
      icon: <ClipboardCheck size={24} />,
      status: 'active' as const,
      usagePercentage: 30,
      tier: 'Enterprise',
      billingCycle: 'monthly' as const,
      nextBillingDate: new Date(2023, 5, 5),
      price: 599,
      features: [
        'Compliance Assessment',
        'Policy Management',
        'Risk Assessment',
        'Audit Management',
        'Compliance Reporting',
      ],
      limits: {
        frameworks: '8/12',
        controls: '300/1,000',
        assessments: '10/50 per month',
      },
    },
    {
      id: '5',
      name: 'VAPT Services',
      icon: <Bug size={24} />,
      status: 'payment-failed' as const,
      usagePercentage: 92,
      tier: 'Professional',
      billingCycle: 'yearly' as const,
      nextBillingDate: new Date(2023, 4, 12),
      price: 299,
      features: [
        'Vulnerability Assessment',
        'Penetration Testing',
        'Web Application Security',
        'Network Security Testing',
        'Mobile Application Security',
      ],
      limits: {
        applications: '9/10',
        scans: '92/100 per month',
        reports: 'Detailed + Executive',
      },
    },
  ]
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'payment-failed':
        return <Badge variant="danger">Payment Failed</Badge>
      case 'grace-period':
        return <Badge variant="warning">Grace Period</Badge>
      case 'expired':
        return <Badge variant="danger">Expired</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Manage Subscriptions</h1>
      {subscriptions.map((subscription) => (
        <Card key={subscription.id} className="mb-6">
          {/* Card Header */}
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 sm:py-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-4">
                {subscription.icon}
              </div>
              <div>
                <h2 className="text-xl font-medium">{subscription.name}</h2>
                <div className="flex items-center mt-1">
                  {getStatusBadge(subscription.status)}
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {subscription.tier} Plan ({subscription.billingCycle})
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<ChevronUp size={14} />}
                className="flex-1 sm:flex-auto"
              >
                Upgrade
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<ChevronDown size={14} />}
                className="flex-1 sm:flex-auto"
              >
                Downgrade
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Pause size={14} />}
                className="flex-1 sm:flex-auto"
              >
                Pause
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<X size={14} />}
                className="flex-1 sm:flex-auto"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          {/* Card Content */}
          <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3">Subscription Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Status
                  </span>
                  <span>{getStatusBadge(subscription.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Price
                  </span>
                  <span>
                    ${subscription.price}/
                    {subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Next Billing
                  </span>
                  <span className="text-right">
                    {formatDate(subscription.nextBillingDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Plan</span>
                  <span>{subscription.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Billing Cycle
                  </span>
                  <span className="capitalize">
                    {subscription.billingCycle}
                  </span>
                </div>
              </div>
            </div>
            {/* Features - Collapsible on mobile */}
            <div className="sm:block">
              <h3 className="font-medium mb-3">Features</h3>
              <ul className="space-y-1">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="line-clamp-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Usage & Limits</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Usage</span>
                    <span>{subscription.usagePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(subscription.usagePercentage)}`}
                      style={{
                        width: `${subscription.usagePercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
                {Object.entries(subscription.limits).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="capitalize">{key}</span>
                      <span>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          {/* Status Messages */}
          {subscription.status === 'payment-failed' && (
            <CardFooter className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 flex flex-col sm:flex-row sm:items-center gap-3">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-800 dark:text-red-200 flex-1">
                Payment failed for this subscription. Please update your payment
                method to avoid service interruption.
              </span>
              <Button size="sm" className="w-full sm:w-auto">
                Update Payment
              </Button>
            </CardFooter>
          )}
          {subscription.status === 'grace-period' && (
            <CardFooter className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 flex flex-col sm:flex-row sm:items-center gap-3">
              <svg
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-yellow-800 dark:text-yellow-200 flex-1">
                This subscription is in grace period and will be suspended in 3
                days. Please update your payment method.
              </span>
              <Button size="sm" className="w-full sm:w-auto">
                Update Payment
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
export default Subscriptions
