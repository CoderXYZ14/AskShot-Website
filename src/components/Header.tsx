"use client";
import { useState, useEffect } from "react";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { URLS } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  isDark: boolean;
  onThemeChange: (checked: boolean) => void;
}

export default function Header({ isDark, onThemeChange }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".askshot-avatar-dropdown")) setShowDropdown(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  useEffect(() => {
    setShowDropdown(false);
  }, [router]);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/60 border-b border-border/50 shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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

          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/profile"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                Profile
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                Features
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                Pricing
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href={URLS.CALENDLY}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Demo
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="#faq"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                FAQ
              </Link>
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs text-white mb-1">🔥 Trending on</span>
              <Link
                href="https://www.producthunt.com/posts/askshot?utm_source=badge-featured&utm_medium=badge"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=989044&theme=light&t=1751814643084"
                  alt="AskShot - Your browser, now smarter with AI screenshots | Product Hunt"
                  width={110}
                  height={24}
                  className="hover:opacity-90 transition-opacity"
                />
              </Link>
            </motion.div>
            <div className="flex items-center space-x-2 bg-muted/50 rounded-full p-1 backdrop-blur-sm">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={onThemeChange} />
              <Moon className="h-4 w-4" />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {session ? (
                <motion.div
                  key="avatar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="relative"
                >
                  <motion.button
                    className="focus:outline-none"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDropdown((v) => !v)}
                    style={{ borderRadius: "9999px" }}
                  >
                    <Avatar className="w-9 h-9 ring-2 ring-purple-400">
                      <AvatarImage
                        src={session.user?.image || undefined}
                        alt={session.user?.name || "avatar"}
                      />
                      <AvatarFallback>
                        {session.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      className="askshot-avatar-dropdown absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-lg ring-1 ring-black/10 z-50"
                    >
                      <div className="flex flex-col items-stretch py-2">
                        <span className="px-4 py-2 text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </span>
                        <Button
                          variant="ghost"
                          className="justify-start px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg"
                          onClick={async () => {
                            await signOut({ redirect: false });
                            setShowDropdown(false);
                          }}
                        >
                          Logout
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link href="/auth/signin">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/25">
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-b border-border"
        >
          <div className="px-4 py-4 space-y-4">
            {session && (
              <Link href="/profile" className="block text-muted-foreground">
                Profile
              </Link>
            )}
            <Link href="#features" className="block text-muted-foreground">
              Features
            </Link>
            <Link href="#pricing" className="block text-muted-foreground">
              Pricing
            </Link>
            <Link
              href={URLS.CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground"
            >
              Book Demo
            </Link>
            <Link href="#faq" className="block text-muted-foreground">
              FAQ
            </Link>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={onThemeChange} />
              <Moon className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-center py-3 space-y-2">
              <span className="text-xs text-white">🔥 Trending on</span>
              <Link
                href="https://www.producthunt.com/posts/askshot?utm_source=badge-featured&utm_medium=badge"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=989044&theme=light&t=1751814643084"
                  alt="AskShot on Product Hunt"
                  width={130}
                  height={28}
                  className="hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {session ? (
                <motion.div
                  key="mobile-logout"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg"
                    onClick={async () => {
                      await signOut({ redirect: false });
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-signin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/25">
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
