"use client"
import React from 'react'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'How does the security system work?',
      answer:
        'Our security system automates the entire cybersecurity lifecycle. It monitors threats, detects vulnerabilities, generates alerts, and provides comprehensive reporting on your security posture.',
    },
    {
      question: 'What deployment options do you support?',
      answer:
        'We support cloud-based deployment, on-premises installation, and hybrid setups based on your requirements and compliance needs.',
    },
    {
      question: 'Can I customize my security policies?',
      answer:
        'Yes, you can create and customize security policies with different compliance frameworks, threat detection rules, and response protocols to match your business requirements.',
    },
    {
      question: 'How do you handle security incidents?',
      answer:
        'We have automated incident response that detects threats, alerts your team, and provides guided remediation steps with customizable response workflows.',
    },
    {
      question: 'Is there a free trial available?',
      answer:
        'Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial.',
    },
    {
      question: 'How secure is your platform?',
      answer:
        'We implement bank-level security with encryption, secure data storage, regular security audits, and compliance with PCI DSS, GDPR, and other relevant standards.',
    },
  ]
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <div
          className="text-center mb-12"
          
        >
          <h2 className="text-3xl font-bold mb-4 text-[#1e3a8a] dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Have questions? We've got answers to help you get started.
          </p>
        </div>
        <div
          
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <div
                key={index}
               
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-[#1e3a8a] dark:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
export { FAQSection }
