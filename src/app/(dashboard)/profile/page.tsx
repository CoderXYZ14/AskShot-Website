"use client"

import React from 'react'
import { motion } from 'motion/react'
import { User, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ProfilePage = () => {
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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
        <Card className="relative bg-background/80 backdrop-blur-sm border-border/50 p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
              <p className="text-muted-foreground">john.doe@example.com</p>
              <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
                Pro Member
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Extension Version</span>
              <span className="text-foreground font-semibold">v2.1.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-foreground font-semibold">Jan 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan Status</span>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Active</Badge>
            </div>
          </div>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Extension Access</h3>
            <ExternalLink className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Launch the AskShot extension to start capturing and analyzing screenshots.
          </p>
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open AskShot Extension
          </Button>
        </Card>
      </div>
    </motion.div>
  )
}

export default ProfilePage