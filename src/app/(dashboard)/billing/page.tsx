"use client"

import React from 'react'
import { motion } from 'motion/react'
import { CreditCard, Crown, Calendar, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import axios from 'axios'

interface Invoice {
  id: string
  date: Date
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  downloadUrl: string
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    date: new Date('2024-01-01'),
    amount: 9.99,
    status: 'paid',
    downloadUrl: '#'
  },
  {
    id: 'INV-2023-012',
    date: new Date('2023-12-01'),
    amount: 9.99,
    status: 'paid',
    downloadUrl: '#'
  },
  {
    id: 'INV-2023-011',
    date: new Date('2023-11-01'),
    amount: 9.99,
    status: 'paid',
    downloadUrl: '#'
  }
]

const BillingPage = () => {
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Billing & Invoices</h2>
        <p className="text-muted-foreground">Manage your billing information and download past invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-400" />
            Payment Method
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </div>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-purple-400" />
            Current Subscription
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="text-foreground font-semibold">Pro</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing Cycle</span>
              <span className="text-foreground font-semibold">Monthly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Payment</span>
              <span className="text-foreground font-semibold">Feb 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground font-semibold">$9.99</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
          Invoice History
        </h3>
        <div className="space-y-3">
          {mockInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.date.toLocaleDateString()} • ${invoice.amount}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`${
                  invoice.status === 'paid' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : invoice.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {invoice.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

export default BillingPage