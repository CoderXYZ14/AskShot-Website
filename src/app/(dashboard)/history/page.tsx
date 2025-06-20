"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Grid3X3,
  List,
  MessageSquare,
  Download,
  X,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import Image from "next/image";

interface Screenshot {
  _id: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
}

interface Question {
  _id: string;
  question: string;
  answer?: string;
  screenshotId: string;
  userId: string;
  createdAt: string;
}

interface ScreenshotWithQuestions extends Screenshot {
  questions: Question[];
  questionsCount: number;
}

const HistoryPage = () => {
  const [historyView, setHistoryView] = useState<"grid" | "list">("grid");
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<ScreenshotWithQuestions | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [screenshots, setScreenshots] = useState<ScreenshotWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null
  );
  const [deletingScreenshot, setDeletingScreenshot] = useState(false);

  useEffect(() => {
    fetchScreenshots();
  }, []);

  const fetchScreenshots = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/screenshots");
      const screenshotsData = res.data.screenshots;

      const screenshotsWithQuestions = await Promise.all(
        screenshotsData.map(async (screenshot: Screenshot) => {
          const questionsRes = await axios.get(
            `/api/questions?screenshotId=${screenshot._id}`
          );
          return {
            ...screenshot,
            questions: questionsRes.data.questions || [],
            questionsCount: questionsRes.data.questions?.length || 0,
          };
        })
      );

      setScreenshots(screenshotsWithQuestions);
      setError("");
    } catch (err) {
      console.error("Error fetching screenshots:", err);
      setError("Failed to load screenshots");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedScreenshot || !newQuestion.trim()) return;

    try {
      await axios.post("/api/questions", {
        question: newQuestion,
        screenshotId: selectedScreenshot._id,
      });

      const questionsRes = await axios.get(
        `/api/questions?screenshotId=${selectedScreenshot._id}`
      );
      setSelectedScreenshot({
        ...selectedScreenshot,
        questions: questionsRes.data.questions || [],
        questionsCount: questionsRes.data.questions?.length || 0,
      });

      setScreenshots(
        screenshots.map((s) =>
          s._id === selectedScreenshot._id
            ? {
                ...s,
                questions: questionsRes.data.questions || [],
                questionsCount: questionsRes.data.questions?.length || 0,
              }
            : s
        )
      );

      setNewQuestion("");
    } catch (err) {
      console.error("Error asking question:", err);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!selectedScreenshot) return;

    try {
      setDeletingQuestionId(questionId);
      await axios.delete(`/api/questions/${questionId}`);

      const questionsRes = await axios.get(
        `/api/questions?screenshotId=${selectedScreenshot._id}`
      );
      setSelectedScreenshot({
        ...selectedScreenshot,
        questions: questionsRes.data.questions || [],
        questionsCount: questionsRes.data.questions?.length || 0,
      });

      setScreenshots(
        screenshots.map((s) =>
          s._id === selectedScreenshot._id
            ? {
                ...s,
                questions: questionsRes.data.questions || [],
                questionsCount: questionsRes.data.questions?.length || 0,
              }
            : s
        )
      );
    } catch (err) {
      console.error("Error deleting question:", err);
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const handleDeleteScreenshot = async (screenshotId: string) => {
    try {
      setDeletingScreenshot(true);
      await axios.delete(`/api/screenshots/${screenshotId}`);

      if (selectedScreenshot && selectedScreenshot._id === screenshotId) {
        setSelectedScreenshot(null);
      }

      setScreenshots(screenshots.filter((s) => s._id !== screenshotId));
    } catch (err) {
      console.error("Error deleting screenshot:", err);
    } finally {
      setDeletingScreenshot(false);
    }
  };

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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : screenshots.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No screenshots found. Take a screenshot using the extension.
        </div>
      ) : (
        <div
          className={
            historyView === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {screenshots.map((screenshot) => (
            <motion.div
              key={screenshot._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedScreenshot(screenshot)}
              className="cursor-pointer"
            >
              <Card className="bg-background/80 backdrop-blur-sm border-border/50 overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={screenshot.imageUrl}
                    alt={`Screenshot ${new Date(
                      screenshot.createdAt
                    ).toLocaleDateString()}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white/70 text-xs">
                      {new Date(screenshot.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {screenshot.questionsCount} questions
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

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
                  Screenshot from{" "}
                  {new Date(selectedScreenshot.createdAt).toLocaleDateString()}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                    onClick={() =>
                      handleDeleteScreenshot(selectedScreenshot._id)
                    }
                    disabled={deletingScreenshot}
                  >
                    {deletingScreenshot ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
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
                    src={selectedScreenshot.imageUrl}
                    alt={`Screenshot from ${new Date(
                      selectedScreenshot.createdAt
                    ).toLocaleDateString()}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="border-l border-border p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                      Questions ({selectedScreenshot.questions.length})
                    </h4>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                    {selectedScreenshot.questions.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No questions yet. Ask your first question below.
                      </div>
                    ) : (
                      selectedScreenshot.questions.map((question) => (
                        <div key={question._id} className="group relative">
                          <div className="rounded-lg p-3 bg-muted/50 ml-8">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                  {question.question}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(
                                    question.createdAt
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-400 hover:bg-red-500/10"
                                onClick={() =>
                                  handleDeleteQuestion(question._id)
                                }
                                disabled={deletingQuestionId === question._id}
                              >
                                {deletingQuestionId === question._id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                          {question.answer && (
                            <div className="rounded-lg p-3 bg-blue-500/10 border border-blue-500/20 mr-8 mt-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm text-foreground">
                                    {question.answer}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask a question about this screenshot..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newQuestion.trim()) {
                            handleAskQuestion();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={handleAskQuestion}
                        disabled={!newQuestion.trim()}
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
