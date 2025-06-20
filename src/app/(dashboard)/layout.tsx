"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } bg-background text-foreground`}
    >
      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-80 transition-all duration-300">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-end mb-4">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
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
