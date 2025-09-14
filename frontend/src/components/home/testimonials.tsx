"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '../ui/card'
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Osto Security has transformed how we manage our cybersecurity. The automation and insights have been invaluable.',
      author: 'Sarah Johnson',
      role: 'CEO, TechSolutions Inc.',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      quote:
        'The security management features have saved us countless hours and helped reduce vulnerabilities by 75%.',
      author: 'Michael Chen',
      role: 'CTO, GrowthWave',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      quote:
        "We've been able to scale our business efficiently thanks to Osto's powerful security platform. The reporting is exceptional.",
      author: 'Emma Rodriguez',
      role: 'COO, ScaleUp SaaS',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ]
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div
          className="text-center mb-12"
          
        >
          <h2 className="text-3xl font-bold mb-4 text-[#1e3a8a] dark:text-white">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Trusted by businesses of all sizes to manage their security
            operations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              
            >
              <Card className="p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 inline-block text-yellow-400 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div
                    className="flex items-center"
                    
                  >
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export { Testimonials }
