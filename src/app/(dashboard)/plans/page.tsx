"use client"

import React from 'react'
import { motion } from 'motion/react'
import { Zap, Crown, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Plan {
  name: string
  price: string
  features: string[]
  current: boolean
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    features: ['10 screenshots/day', '5 AI chats/day', 'Basic support'],
    current: false
  },
  {
    name: 'Pro',
    price: '$9.99',
    features: ['100 screenshots/day', '50 AI chats/day', 'Priority support', 'Advanced AI models'],
    current: true
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    features: ['Unlimited screenshots', 'Unlimited AI chats', '24/7 support', 'Custom integrations'],
    current: false
  }
]

const PlansPage = () => {
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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">Unlock the full potential of AskShot</p>
      </div>

      <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Usage This Month</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Screenshots</span>
              <span className="text-foreground">45/100</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">AI Chats</span>
              <span className="text-foreground">28/50</span>
            </div>
            <Progress value={56} className="h-2" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative bg-background/80 backdrop-blur-sm border-border/50 p-6 transition-all duration-300 ${
              plan.current
                ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20'
                : 'hover:shadow-lg hover:shadow-blue-500/10'
            }`}
          >
            {plan.current && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                Current Plan
              </Badge>
            )}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                {plan.name === 'Free' && <Zap className="w-6 h-6 text-gray-400" />}
                {plan.name === 'Pro' && <Crown className="w-6 h-6 text-purple-400" />}
                {plan.name === 'Enterprise' && <Building2 className="w-6 h-6 text-blue-400" />}
              </div>
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-3xl font-bold text-foreground mt-2">
                {plan.price}
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${
                plan.current
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

export default PlansPage