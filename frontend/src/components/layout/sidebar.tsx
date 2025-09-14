"use client"
import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '../../lib/utils'
import { useSidebar } from '../../contexts/SidebarContext'
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const [shouldHide, setShouldHide] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pages = ["/", "/signup", "/signin"]
      setShouldHide(pages.includes(window.location.pathname))
    }
  }, [])
  
  if(shouldHide){
    return null
  }
  const { collapsed, toggleSidebar } = useSidebar()
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: <ShieldCheck size={20} />,
      label: 'Subscriptions',
      path: '/subscriptions',
    },
    {
      icon: <CreditCard size={20} />,
      label: 'Billing',
      path: '/billing',
    },
    {
      icon: <FileText size={20} />,
      label: 'Invoices',
      path: '/invoices',
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      path: '/settings',
    },
  ]
  return (
    <aside
      className={cn(
        'bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300 ease-in-out flex flex-col h-full',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-700">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">O</span>
            </div>
            <span className="ml-2 font-semibold text-neutral-900 dark:text-neutral-100">
              Osto Billing
            </span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold">O</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      <nav className="flex-1 pt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className="flex items-center px-3 py-2 rounded-md transition-colors text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <span className="flex items-center justify-center">
                  {item.icon}
                </span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
