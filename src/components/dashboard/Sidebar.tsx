"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  History,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
  { id: "history", label: "History", icon: History, href: "/history" },
  { id: "plans", label: "Plans", icon: Crown, href: "/plans" },
  // { id: "billing", label: "Billing", icon: CreditCard, href: "/billing" },
];

const Sidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const pathname = usePathname();

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={sidebarCollapsed ? "collapsed" : "expanded"}
      className="fixed left-0 top-0 h-full bg-background/95 backdrop-blur-sm border-r border-border/50 z-40"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          {!sidebarCollapsed && (
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AskShot
              </span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2"
          >
            {sidebarCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === `/${item.id}` || pathname.startsWith(`/${item.id}/`);
            return (
              <Link href={item.href} key={item.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 space-y-3"
          >
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Extension
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10"
              onClick={async () => {
                await signOut({ redirect: true, callbackUrl: "/" });
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
