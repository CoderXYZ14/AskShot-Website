"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Sidebar from "@/components/dashboard/Sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  // Sync local state with theme system
  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  // Update theme when switch changes
  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? "dark" : "light");
  };

  // Apply theme changes to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 md:ml-80 transition-all duration-300">
          <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-end mb-4">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleThemeChange}
                  />
                  <Moon className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
