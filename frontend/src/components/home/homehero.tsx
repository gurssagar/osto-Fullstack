"use client"
import React, { Children } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  CreditCard,
  FileText,
  Settings,
  CheckCircle,
} from 'lucide-react'
function Hero(){
  
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  }
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36 flex flex-col md:flex-row items-center">
          <div
            className="md:w-1/2 md:pr-8 mb-12 md:mb-0"
           
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1e3a8a] dark:text-white mb-6"
              variants={itemVariants}
            >
              One-Stop <span className="text-[#3b55f0]">Cyber Security</span>{' '}
              Product
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl"
              variants={itemVariants}
            >
              Built for New-Age Businesses. Streamline your security operations
              with our comprehensive platform.
            </motion.p>
            <div
              className="flex flex-wrap gap-4"
              
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#1e3a8a] hover:bg-[#2d42db]"
                >
                  Secure your Business Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
            <div
              className="mt-8 flex flex-wrap gap-6 text-sm"
             
            >
              <div className="flex items-center">
                <CheckCircle size={16} className="text-success mr-2" />
                <span>Get Live in 9 Mins</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-success mr-2" />
                <span>No Security Team Needed</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-success mr-2" />
                <span>Monthly Subscription</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-success mr-2" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
          <div
            className="md:w-1/2 relative"
            
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-blue-light rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#e0ebff] rounded-full blur-3xl dark:bg-[#1e3073]/30"></div>
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-10"
              
            >
              <div className="p-6 bg-accent-blue-light/30 dark:bg-[#1e3a8a]/30 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-[#1e3a8a] flex items-center justify-center text-white mr-3">
                    <span className="font-bold">O</span>
                  </div>
                  <h3 className="font-semibold text-lg">
                    Osto Security Dashboard
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <ShieldCheck
                        size={18}
                        className="text-[#3b55f0] mr-2"
                      />
                      <h4 className="font-medium">Security</h4>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Enterprise Grade
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CreditCard size={18} className="text-[#3b55f0] mr-2" />
                      <h4 className="font-medium">Billing</h4>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Next payment: Jul 15
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText size={18} className="text-[#3b55f0] mr-2" />
                      <h4 className="font-medium">Reports</h4>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      3 pending alerts
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Settings size={18} className="text-[#3b55f0] mr-2" />
                      <h4 className="font-medium">Settings</h4>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Account preferences
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -z-10 top-1/3 left-0 w-full">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent-blue-light/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
export { Hero }

