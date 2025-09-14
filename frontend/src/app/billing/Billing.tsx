"use client"

import React, { useState, useEffect } from 'react'
import { CreditCard, Mail, MapPin, DollarSign, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSession, SessionData } from '@/lib/session'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

const BillingTabs: React.FC = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState('email')

  useEffect(() => {
    const loadSession = async () => {
      const session = await getSession()
      setSessionData(session)
      console.log(session, "session data")
    }
    loadSession()
  }, [])
  return (
     <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Billing Administration</h1>
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex overflow-x-auto scrollbar-hide">
            <TabsList className="bg-transparent p-0 h-auto w-full justify-start">
              <TabsTrigger
                value="email"
                className={`flex items-center px-3 sm:px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
              >
                <Mail size={16} className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Email Management</span>
                <span className="xs:hidden">Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className={`flex items-center px-3 sm:px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === 'payment' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
              >
                <CreditCard size={16} className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Payment Methods</span>
                <span className="xs:hidden">Payment Methods</span>
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className={`flex items-center px-3 sm:px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === 'address' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
              >
                <MapPin size={16} className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Billing Address</span>
                <span className="xs:hidden">Billing Address</span>
              </TabsTrigger>
              <TabsTrigger
                value="backup"
                className={`flex items-center px-3 sm:px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === 'backup' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
              >
                <DollarSign size={16} className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Backup Payment</span>
                <span className="xs:hidden">Backup Payment</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className={`flex items-center px-3 sm:px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
              >
                <Bell size={16} className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Notifications</span>
                <span className="xs:hidden">Notifications</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="email">
            <div>
              <h3 className="text-lg font-medium mb-4">Email Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Billing Email
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="email"
                      defaultValue="finance@acmecorp.com"
                      className="flex-1"
                    />
                    <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-2 rounded-md text-sm flex items-center justify-center">
                      Verified
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Additional Recipients
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        type="email"
                        defaultValue="accounts@acmecorp.com"
                        className="flex-1"
                      />
                      <button className="text-red-500 hover:text-red-700 sm:ml-2">
                        Remove
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        type="email"
                        placeholder="Add another email..."
                        className="flex-1"
                      />
                      <Button className="sm:ml-2">Add</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button>Save Changes</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="payment">
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle p-4 sm:p-0">
                  <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Expiry
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <CreditCard className="mr-2" size={16} />
                            <span>Visa</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          •••• •••• •••• 4242
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">09/2024</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="success">Default</Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button className="text-red-500 hover:text-red-700 mr-3">
                            Remove
                          </button>
                          <button className="text-neutral-500 hover:text-neutral-700">
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <CreditCard className="mr-2" size={16} />
                            <span>Mastercard</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          •••• •••• •••• 5555
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">11/2023</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="warning">Expiring soon</Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button className="text-red-500 hover:text-red-700 mr-3">
                            Remove
                          </button>
                          <button className="text-neutral-500 hover:text-neutral-700">
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6">
                <Button>Add Payment Method</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="address">
            <div>
              <h3 className="text-lg font-medium mb-4">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <Input type="text" defaultValue="ACME Corporation" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tax ID / VAT Number
                  </label>
                  <Input type="text" defaultValue="US123456789" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address Line 1
                  </label>
                  <Input type="text" defaultValue="123 Business Ave" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address Line 2
                  </label>
                  <Input type="text" defaultValue="Suite 100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input type="text" defaultValue="San Francisco" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State / Province
                  </label>
                  <Input type="text" defaultValue="CA" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ZIP / Postal Code
                  </label>
                  <Input type="text" defaultValue="94103" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <Select defaultValue="US">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <Button>Save Address</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="backup">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Backup Payment Hierarchy
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Drag and drop payment methods to set the order in which they'll
                be used if your primary method fails.
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-md border border-neutral-200 dark:border-neutral-600 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 text-neutral-400">1</div>
                    <CreditCard className="mr-2" size={16} />
                    <span className="text-sm sm:text-base">
                      Visa ending in 4242
                    </span>
                  </div>
                  <div className="cursor-move">⋮⋮</div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-md border border-neutral-200 dark:border-neutral-600 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 text-neutral-400">2</div>
                    <CreditCard className="mr-2" size={16} />
                    <span className="text-sm sm:text-base">
                      Mastercard ending in 5555
                    </span>
                  </div>
                  <div className="cursor-move">⋮⋮</div>
                </div>
              </div>
              <div className="mt-6">
                <Button>Save Order</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Notification Settings
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="font-medium">Payment Reminders</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Get notified before payments are due
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="font-medium">Payment Failures</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Get notified when a payment fails
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Notification Frequency</h4>
                  <Select defaultValue="immediately">
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <Button>Save Preferences</Button>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
    </div>
  )
}
export default BillingTabs
