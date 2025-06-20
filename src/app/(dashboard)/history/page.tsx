"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Grid3X3,
  List,
  MessageSquare,
  Download,
  X,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Screenshot {
  id: string;
  url: string;
  timestamp: Date;
  chatCount: number;
  title: string;
  chats: ChatMessage[];
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const mockScreenshots: Screenshot[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    timestamp: new Date("2024-01-15T10:30:00"),
    chatCount: 3,
    title: "Dashboard Analytics",
    chats: [
      {
        id: "1",
        type: "user",
        content: "What does this chart show?",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
      {
        id: "2",
        type: "ai",
        content:
          "This chart displays user engagement metrics over time, showing a steady increase in active users with a notable spike in the last quarter.",
        timestamp: new Date("2024-01-15T10:30:30"),
      },
      {
        id: "3",
        type: "user",
        content: "What caused the spike?",
        timestamp: new Date("2024-01-15T10:31:00"),
      },
      {
        id: "4",
        type: "ai",
        content:
          "The spike appears to correlate with a product launch or marketing campaign, as indicated by the sharp upward trend in the data.",
        timestamp: new Date("2024-01-15T10:31:30"),
      },
    ],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    timestamp: new Date("2024-01-14T15:45:00"),
    chatCount: 1,
    title: "Chart Analysis",
    chats: [
      {
        id: "1",
        type: "user",
        content: "Analyze this financial chart",
        timestamp: new Date("2024-01-14T15:45:00"),
      },
      {
        id: "2",
        type: "ai",
        content:
          "This appears to be a revenue growth chart showing consistent quarterly growth with some seasonal variations.",
        timestamp: new Date("2024-01-14T15:45:30"),
      },
    ],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop",
    timestamp: new Date("2024-01-13T09:15:00"),
    chatCount: 5,
    title: "UI Components",
    chats: [
      {
        id: "1",
        type: "user",
        content: "What UI patterns do you see here?",
        timestamp: new Date("2024-01-13T09:15:00"),
      },
      {
        id: "2",
        type: "ai",
        content:
          "I can see several modern UI patterns including card layouts, clean typography, and a well-structured navigation system.",
        timestamp: new Date("2024-01-13T09:15:30"),
      },
      {
        id: "3",
        type: "user",
        content: "How can I improve the design?",
        timestamp: new Date("2024-01-13T09:16:00"),
      },
      {
        id: "4",
        type: "ai",
        content:
          "Consider adding more whitespace, using a consistent color scheme, and ensuring proper visual hierarchy with typography.",
        timestamp: new Date("2024-01-13T09:16:30"),
      },
    ],
  },
];

const HistoryPage = () => {
  const [historyView, setHistoryView] = useState<"grid" | "list">("grid");
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<Screenshot | null>(null);
  const [newQuestion, setNewQuestion] = useState<string>("");

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Screenshot History
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={historyView === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setHistoryView("grid")}
            className="p-2"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={historyView === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setHistoryView("list")}
            className="p-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={
          historyView === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {mockScreenshots.map((screenshot) => (
          <motion.div
            key={screenshot.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedScreenshot(screenshot)}
            className="cursor-pointer"
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border/50 overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={screenshot.url}
                  alt={screenshot.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-semibold text-sm">
                    {screenshot.title}
                  </h3>
                  <p className="text-white/70 text-xs">
                    {screenshot.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <Badge className="absolute top-3 right-3 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  {screenshot.chatCount} chats
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedScreenshot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedScreenshot.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedScreenshot(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 h-[70vh]">
                <div className="p-6">
                  <Image
                    src={selectedScreenshot.url}
                    alt={selectedScreenshot.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="border-l border-border p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                      AI Chat Thread ({selectedScreenshot.chats.length}{" "}
                      messages)
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                      onClick={() => {
                        setSelectedScreenshot(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Session
                    </Button>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                    {selectedScreenshot.chats.map((chat) => (
                      <div key={chat.id} className="group relative">
                        <div
                          className={`rounded-lg p-3 ${
                            chat.type === "user"
                              ? "bg-muted/50 ml-8"
                              : "bg-blue-500/10 border border-blue-500/20 mr-8"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                {chat.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {chat.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-400 hover:bg-red-500/10"
                              onClick={() => {
                                console.log("Delete chat:", chat.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask a follow-up question..."
                        value={newQuestion}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewQuestion(e.target.value)
                        }
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={() => {
                          if (newQuestion.trim()) {
                            setNewQuestion("");
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HistoryPage;
