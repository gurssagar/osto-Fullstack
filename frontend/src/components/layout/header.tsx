"use client"
import React, { useState, useEffect } from 'react'
import { Search, Bell, ChevronDown, Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {ModeToggle} from "@/components/theme-toggle"
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/contexts/SidebarContext'
import { getSession, SessionData } from '@/lib/session'
import { logoutAction } from '@/app/actions/auth'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
const Header: React.FC = () => {
  const [shouldHide, setShouldHide] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { collapsed, toggleSidebar, setOpen } = useSidebar()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pages = ["/", "/signup", "/signin"]
      setShouldHide(pages.includes(window.location.pathname))
    }
  }, [])

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const session = await getSession()
        setSessionData(session)
      } catch (error) {
        console.error('Error loading session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSessionData()
  }, [])

  const handleSignOut = async () => {
    try {
      await logoutAction()
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error signing out')
    }
  }

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getUserDisplayName = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'User'
    return `${firstName || ''} ${lastName || ''}`.trim()
  }
  
  if (shouldHide) {
    return null
  }
  return (
    <header className="h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="lg:hidden"
        >
          <Menu size={20} />
        </Button>
        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex"
        >
          <Menu size={20} />
        </Button>
      </div>
      {/* Search button for mobile */}
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
          <Search size={20} />
        </Button>
      </div>
      {/* Desktop search */}
      <div className="hidden lg:block flex-1 max-w-md mx-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search invoices, subscriptions..."
            className="w-full pl-10"
          />
        </div>
      </div>
      {/* Mobile search sheet */}
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="p-4 pt-12">
          <SheetHeader className="mb-4">
            <SheetTitle>Search</SheetTitle>
            <SheetClose className="absolute right-4 top-4">
              <X size={20} />
            </SheetClose>
          </SheetHeader>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search invoices, subscriptions..."
              className="w-full pl-10"
              autoFocus
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <ModeToggle/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge
                variant="destructive"
                className="absolute top-0 right-0 h-2 w-2 p-0"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <p className="text-sm font-medium">
                  Payment method expiring soon
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Your card ending in 4242 will expire in 7 days.
                </p>
              </div>
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <p className="text-sm font-medium">New invoice available</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Invoice #INV-2023-001 has been generated.
                </p>
              </div>
            </div>
            <div className="p-2 text-center">
              <Button variant="link" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <div className="h-8 w-8 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center text-sm font-medium">
                {isLoading ? '...' : getUserInitials(sessionData?.user?.first_name, sessionData?.user?.last_name)}
              </div>
              <span className="hidden md:block">
                {isLoading ? 'Loading...' : getUserDisplayName(sessionData?.user?.first_name, sessionData?.user?.last_name)}
              </span>
              <ChevronDown size={16} className="hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-sm text-muted-foreground border-b">
              {sessionData?.user?.email || 'No email'}
            </div>
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
export default Header
