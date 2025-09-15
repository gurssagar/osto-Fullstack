'use client';

import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import NavbarHome from "@/components/homenavbar";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <NavbarHome />
      <div className="fixed inset-y-0 left-0 z-30 lg:relative lg:z-auto">
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}