import React from 'react'
import { ChevronUp, ChevronDown, Pause, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
type SubscriptionStatus =
  | 'active'
  | 'payment-failed'
  | 'grace-period'
  | 'expired'
interface SubscriptionCardProps {
  name: string
  icon: React.ReactNode
  status: SubscriptionStatus
  usagePercentage: number
  tier: string
  billingCycle: 'monthly' | 'yearly'
}
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  name,
  icon,
  status,
  usagePercentage,
  tier,
  billingCycle,
}) => {
  const getStatusBadge = (status: SubscriptionStatus) => {
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
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-3">
              {icon}
            </div>
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              <div className="mt-1">{getStatusBadge(status)}</div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Usage</span>
            <span>{usagePercentage}%</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getUsageColor(usagePercentage)}`}
              style={{
                width: `${usagePercentage}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="mb-5 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-neutral-500 dark:text-neutral-400">
              Current Plan
            </span>
            <span className="font-medium">{tier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">
              Billing Cycle
            </span>
            <span className="font-medium capitalize">{billingCycle}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<ChevronUp size={14} />}
          >
            Upgrade
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<ChevronDown size={14} />}
          >
            Downgrade
          </Button>
          <Button size="sm" variant="outline" leftIcon={<Pause size={14} />}>
            Pause
          </Button>
          <Button size="sm" variant="outline" leftIcon={<X size={14} />}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default SubscriptionCard
