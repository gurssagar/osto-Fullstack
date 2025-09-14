"use client"
import React from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  CreditCard,
  FileText,
  Clock,
  BarChart,
  Users,
} from 'lucide-react'
const Features: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={24} className="text-[#3b55f0]" />,
      title: 'Secure Subscription Management',
      description:
        'Manage all your subscriptions with enterprise-grade security and compliance standards.',
    },
    {
      icon: <CreditCard size={24} className="text-[#3b55f0]" />,
      title: 'Flexible Billing Options',
      description:
        'Support for multiple payment methods, currencies, and billing cycles to fit your business needs.',
    },
    {
      icon: <FileText size={24} className="text-[#3b55f0]" />,
      title: 'Automated Invoicing',
      description:
        'Generate and send professional invoices automatically with customizable templates.',
    },
    {
      icon: <Clock size={24} className="text-[#3b55f0]" />,
      title: 'Recurring Payments',
      description:
        'Set up and manage recurring payments with customizable billing cycles and payment reminders.',
    },
    {
      icon: <BarChart size={24} className="text-[#3b55f0]" />,
      title: 'Analytics & Reporting',
      description:
        'Gain insights into your subscription metrics with comprehensive analytics and reporting tools.',
    },
    {
      icon: <Users size={24} className="text-[#3b55f0]" />,
      title: 'Team Management',
      description:
        'Invite team members and set custom permissions to collaborate efficiently.',
    },
  ]
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div
          className="text-center mb-12"
          
        >
          <h2 className="text-3xl font-bold mb-4 text-[#1e3a8a] dark:text-white">
            Powerful Features for Your Business
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools you need to manage
            subscriptions and billing efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              
            >
              <div className="mb-4 p-2 bg-accent-blue-light/30 dark:bg-[#1e3073]/30 rounded-lg inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1e3a8a] dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export { Features }
