import React from 'react'
import { X, Download, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog'
interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}
interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  status: 'paid' | 'unpaid' | 'overdue' | 'pending'
  dueDate: Date
  modules: string[]
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
}
interface InvoiceDetailProps {
  invoice: Invoice | null
  onClose: () => void
}
const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose }) => {
  if (!invoice) return null
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="w-full max-w-3xl h-[90vh] sm:h-auto overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">
              Invoice {invoice.invoiceNumber}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(invoice.status)}
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Due {formatDate(invoice.dueDate)}
              </span>
            </div>
          </div>
        </DialogHeader>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Billed To
              </h3>
              <p className="font-medium">ACME Corporation</p>
              <p className="text-sm">123 Business Ave, Suite 100</p>
              <p className="text-sm">San Francisco, CA 94103</p>
              <p className="text-sm">United States</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                From
              </h3>
              <p className="font-medium">Osto Billing Platform</p>
              <p className="text-sm">456 Tech Park, Floor 8</p>
              <p className="text-sm">Austin, TX 78701</p>
              <p className="text-sm">United States</p>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="font-medium mb-3">Invoice Details</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                {/* Desktop table */}
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 hidden sm:table">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Unit Price
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(item.unitPrice, invoice.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(item.amount, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Mobile card view */}
                <div className="sm:hidden space-y-4 px-4">
                  {invoice.items.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-neutral-200 dark:border-neutral-700 pb-4"
                    >
                      <div className="font-medium mb-2">{item.description}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Quantity:
                        </span>
                        <span>{item.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Unit Price:
                        </span>
                        <span>
                          {formatCurrency(item.unitPrice, invoice.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium mt-1">
                        <span>Amount:</span>
                        <span>
                          {formatCurrency(item.amount, invoice.currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Subtotal
                </span>
                <span>
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400">Tax</span>
                <span>{formatCurrency(invoice.tax, invoice.currency)}</span>
              </div>
              <div className="flex justify-between py-2 font-medium">
                <span>Total</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h3 className="font-medium mb-3">Notes</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Payment is due within 14 days of invoice date. Please reference
              invoice number {invoice.invoiceNumber} in your payment.
            </p>
          </div>
        </div>
        <DialogFooter className="border-t border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            className="w-full sm:w-auto"
          >
            Download PDF
          </Button>
          {(invoice.status === 'unpaid' || invoice.status === 'overdue') && (
            <Button
              leftIcon={<CreditCard size={16} />}
              className="w-full sm:w-auto"
            >
              Pay Now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default InvoiceDetail
