"use client"

import React, { useState } from 'react'
import { Download, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  status: 'paid' | 'unpaid' | 'overdue' | 'pending'
  dueDate: Date
  modules: string[]
}
interface InvoiceTableProps {
  invoices: Invoice[]
  onViewInvoice: (invoice: Invoice) => void
}
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onViewInvoice,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const itemsPerPage = 10
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      filter === '' ||
      invoice.invoiceNumber.toLowerCase().includes(filter.toLowerCase()) ||
      invoice.modules.some((module) =>
        module.toLowerCase().includes(filter.toLowerCase()),
      )
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    // Simple date filter implementation
    let matchesDate = true
    if (dateFilter === 'current-month') {
      const now = new Date()
      matchesDate =
        invoice.dueDate.getMonth() === now.getMonth() &&
        invoice.dueDate.getFullYear() === now.getFullYear()
    } else if (dateFilter === 'last-month') {
      const now = new Date()
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
      const lastMonthYear =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
      matchesDate =
        invoice.dueDate.getMonth() === lastMonth &&
        invoice.dueDate.getFullYear() === lastMonthYear
    }
    return matchesSearch && matchesStatus && matchesDate
  })
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>
      case 'unpaid':
        return <Badge variant="warning">Unpaid</Badge>
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>
      case 'pending':
        return <Badge variant="info">Pending</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }
  return (
    <Card>
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search invoices..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        {/* Mobile filter toggle */}
        <div className="flex md:hidden">
          <Button
            onClick={() => setFiltersOpen(!filtersOpen)}
            variant="outline"
            className="w-full"
          >
            <Filter size={16} className="mr-2" />
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        {/* Filters - responsive */}
        <div
          className={`flex flex-col md:flex-row gap-2 ${filtersOpen ? 'flex' : 'hidden md:flex'}`}
        >
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Responsive table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            {/* Desktop view */}
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 hidden md:table">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Invoice #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Modules
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {paginatedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {invoice.modules.map((module, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Eye size={14} />}
                        className="mr-2"
                        onClick={() => onViewInvoice(invoice)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Download size={14} />}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile view - card style */}
            <div className="md:hidden divide-y divide-neutral-200 dark:divide-neutral-700">
              {paginatedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Due {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                    <div>{getStatusBadge(invoice.status)}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm font-medium">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {invoice.modules.map((module, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Eye size={14} />}
                      onClick={() => onViewInvoice(invoice)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Download size={14} />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredInvoices.length,
                  )}
                </span>{' '}
                of{' '}
                <span className="font-medium">{filteredInvoices.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md"
                >
                  <ChevronLeft size={16} />
                </Button>
                {/* Simplified pagination for small screens */}
                <div className="hidden sm:flex">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(i + 1)}
                      className="relative inline-flex items-center rounded-none"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                {/* Current page indicator for very small screens */}
                <span className="relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm font-medium sm:hidden">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md"
                >
                  <ChevronRight size={16} />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
export default InvoiceTable
