import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {Hero} from '@/components/home/homehero'
import {Features} from '@/components/home/homefeatures'
import {Testimonials} from '@/components/home/testimonials'
import {FAQSection} from '@/components/home/homefaq'
import { Button } from '@/components/ui/button'
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />
      {/* Pricing CTA */}
      <section className="py-16 px-4 bg-[#f0f5ff] dark:bg-[#1e3073]/10">
        <div
          className="max-w-6xl mx-auto text-center"
          
      
        >
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose a plan that works best for your business needs and scale as
            you grow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div
             
            >
              <Link href="/pricing">
                <Button size="lg">View Pricing</Button>
              </Link>
            </div>
            <div
              
            >
              <Link href="/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <Testimonials />
      {/* FAQ Section */}
      <FAQSection />
    </div>
  )
}
export default Home
