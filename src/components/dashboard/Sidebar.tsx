"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import { URLS } from "@/lib/constants";

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
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
        setIsOpen(false);
      } else {
        setSidebarCollapsed(false);
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const mobileSidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  return (
    <>
      {/* Mobile Menu Toggle Button - Fixed at the top */}
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-md"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            variants={isMobile ? mobileSidebarVariants : sidebarVariants}
            initial={isMobile ? "closed" : "expanded"}
            animate={
              isMobile ? "open" : sidebarCollapsed ? "collapsed" : "expanded"
            }
            exit={isMobile ? "closed" : undefined}
            transition={{ duration: 0.3 }}
            className={`fixed left-0 top-0 h-full bg-background/95 backdrop-blur-sm border-r border-border/50 z-40 ${
              isMobile ? "w-[280px]" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                {(!sidebarCollapsed || isMobile) && (
                  <Link href="/" onClick={closeSidebarOnMobile}>
                    <motion.div
                      className="flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        AskShot
                      </span>
                    </motion.div>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="p-2"
                >
                  {isMobile ? (
                    <X className="w-4 h-4" />
                  ) : sidebarCollapsed ? (
                    <Menu className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive =
                    pathname === `/${item.id}` ||
                    pathname.startsWith(`/${item.id}/`);
                  return (
                    <Link
                      href={item.href}
                      key={item.id}
                      onClick={closeSidebarOnMobile}
                    >
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
                        {(!sidebarCollapsed || isMobile) && (
                          <>
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
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

              {(!sidebarCollapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-6 left-6 right-6 space-y-3"
                >
                  <Link
                    href={URLS.CHROME_EXTENSION}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Extension
                    </Button>
                  </Link>
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
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
