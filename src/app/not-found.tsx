"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useTheme } from "next-themes";

import { Footer, Header } from "@/components";
import { AnimatedGrid, FloatingParticles } from "@/components/design";

export default function NotFound() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  // Initialize and sync theme
  useEffect(() => {
    const isDarkMode =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [theme]);

  // Update theme when switch changes
  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden transition-all duration-500 ${
        isDark
          ? "dark bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
      }`}
    >
      <FloatingParticles />
      <AnimatedGrid />

      <Header isDark={isDark} onThemeChange={handleThemeChange} />

      <main className="flex-1 flex items-center justify-center">
        <div className="relative z-10 px-4 text-center max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute -top-[140px] -left-[140px] w-[280px] h-[280px] bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-cyan-500/30 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -bottom-[140px] -right-[140px] w-[280px] h-[280px] bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-7xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500"
            >
              404
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold mb-3 text-gray-900 dark:text-white"
            >
              Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 mb-8 text-sm max-w-xs mx-auto"
            >
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                asChild
                className="px-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25 rounded-full"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
