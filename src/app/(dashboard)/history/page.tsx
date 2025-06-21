"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { jsPDF } from "jspdf";

interface Screenshot {
  _id: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
}

interface Question {
  _id: string;
  question: string;
  answer?: string | null;
  screenshotId: string;
  userId: string;
  createdAt: string;
  isLoading?: boolean;
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchScreenshots();
  }, []);

  useEffect(() => {
    if (questionsContainerRef.current && selectedScreenshot?.questions.length) {
      questionsContainerRef.current.scrollTop =
        questionsContainerRef.current.scrollHeight;
    }
  }, [selectedScreenshot?.questions]);

  const fetchScreenshots = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("/api/screenshots");
      const screenshotsData = res.data.screenshots || [];

      const screenshotsWithQuestions = await Promise.all(
        screenshotsData.map(async (screenshot: Screenshot) => {
          const questionsRes = await axios.get(
            `/api/questions?screenshotId=${screenshot._id}`
          );
          const sortedQuestions = (questionsRes.data.questions || []).sort(
            (a: Question, b: Question) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          return {
            ...screenshot,
            questions: sortedQuestions,
            questionsCount: sortedQuestions.length || 0,
          };
        })
      );

      setScreenshots(screenshotsWithQuestions);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching screenshots:", err);
      setError("Failed to load screenshots. Please try again.");
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedScreenshot || !newQuestion.trim()) return;

    const questionText = newQuestion.trim();
    setNewQuestion("");
    setIsAnalyzing(true);

    // Create temporary question object
    const tempQuestion: Question = {
      _id: `temp-${Date.now()}`,
      question: questionText,
      answer: null,
      screenshotId: selectedScreenshot._id,
      userId: "",
      createdAt: new Date().toISOString(),
      isLoading: true,
    };

    // Add question to UI immediately
    const updatedQuestions = [...selectedScreenshot.questions, tempQuestion];
    const updatedScreenshot = {
      ...selectedScreenshot,
      questions: updatedQuestions,
      questionsCount: updatedQuestions.length,
    };

    setSelectedScreenshot(updatedScreenshot);

    // Update screenshots array
    setScreenshots((prev) =>
      prev.map((s) =>
        s._id === selectedScreenshot._id ? updatedScreenshot : s
      )
    );

    try {
      // Call analyze API
      const analyzeRes = await axios.post("/api/analyze", {
        question: questionText,
        screenshot: selectedScreenshot.imageUrl,
        screenshotId: selectedScreenshot._id,
      });

      const aiAnswer = analyzeRes.data.answer || "No answer available";

      // Update the temporary question with the answer
      const finalQuestions = updatedQuestions.map((q) =>
        q._id === tempQuestion._id
          ? { ...q, answer: aiAnswer, isLoading: false }
          : q
      );

      const finalScreenshot = {
        ...selectedScreenshot,
        questions: finalQuestions,
        questionsCount: finalQuestions.length,
      };

      setSelectedScreenshot(finalScreenshot);

      // Update screenshots array
      setScreenshots((prev) =>
        prev.map((s) =>
          s._id === selectedScreenshot._id ? finalScreenshot : s
        )
      );
    } catch (err) {
      console.error("Error asking question:", err);

      // Remove the temporary question on error
      const questionsWithoutTemp = updatedQuestions.filter(
        (q) => q._id !== tempQuestion._id
      );
      const errorScreenshot = {
        ...selectedScreenshot,
        questions: questionsWithoutTemp,
        questionsCount: questionsWithoutTemp.length,
      };

      setSelectedScreenshot(errorScreenshot);
      setScreenshots((prev) =>
        prev.map((s) =>
          s._id === selectedScreenshot._id ? errorScreenshot : s
        )
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!selectedScreenshot) return;

    try {
      setDeletingQuestionId(questionId);
      await axios.delete(`/api/questions/${questionId}`);

      // Remove question from local state
      const updatedQuestions = selectedScreenshot.questions.filter(
        (q) => q._id !== questionId
      );
      const updatedScreenshot = {
        ...selectedScreenshot,
        questions: updatedQuestions,
        questionsCount: updatedQuestions.length,
      };

      setSelectedScreenshot(updatedScreenshot);
      setScreenshots((prev) =>
        prev.map((s) =>
          s._id === selectedScreenshot._id ? updatedScreenshot : s
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

      setScreenshots((prev) => prev.filter((s) => s._id !== screenshotId));
    } catch (err) {
      console.error("Error deleting screenshot:", err);
    } finally {
      setDeletingScreenshot(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedScreenshot) return;

    try {
      setIsAnalyzing(true);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;

      // Title and metadata
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Screenshot Analysis Report", pageWidth / 2, 20, {
        align: "center",
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 35);
      pdf.text(
        `Original: ${new Date(selectedScreenshot.createdAt).toLocaleString()}`,
        margin,
        45
      );

      // Image section - SAFE APPROACH without Image()
      let yPos = 55;
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = imgWidth * 0.5625; // 16:9 aspect ratio (good default)

      try {
        // Directly add base64 image with fixed aspect ratio
        pdf.addImage({
          imageData: selectedScreenshot.imageUrl,
          x: margin,
          y: yPos,
          width: imgWidth,
          height: imgHeight,
          format: "JPEG",
        });
        yPos += imgHeight + 15;
      } catch (e) {
        console.error("Image embedding failed:", e);
        pdf.text("[Screenshot not available]", margin, yPos);
        yPos += 20;
      }

      // Questions section
      pdf.setFontSize(16);
      pdf.text("Questions & Answers", margin, yPos);
      yPos += 10;

      pdf.setFontSize(12);
      selectedScreenshot.questions.forEach((q, i) => {
        // Page management
        if (yPos > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage();
          yPos = 20;
        }

        // Question
        pdf.setFont("helvetica", "bold");
        const questionText = `Q${i + 1}: ${q.question}`;
        const questionLines = pdf.splitTextToSize(
          questionText,
          pageWidth - 2 * margin
        );
        pdf.text(questionLines, margin, yPos);
        yPos += questionLines.length * 6 + 2;

        // Answer
        pdf.setFont("helvetica", "normal");
        const answerText = q.answer || "No answer provided";
        const answerLines = pdf.splitTextToSize(
          answerText,
          pageWidth - 2 * margin - 5
        );

        if (
          yPos + answerLines.length * 6 >
          pdf.internal.pageSize.getHeight() - 20
        ) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.text(answerLines, margin + 5, yPos);
        yPos += answerLines.length * 6 + 10;

        // Separator
        if (i < selectedScreenshot.questions.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 5;
        }
      });

      pdf.save(`screenshot-analysis-${selectedScreenshot._id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsAnalyzing(false);
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
      {/* Header */}
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

      {/* Content */}
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
              : "space-y-3"
          }
        >
          {screenshots.map((screenshot) => (
            <motion.div
              key={screenshot._id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedScreenshot(screenshot)}
              className="cursor-pointer"
            >
              <Card
                className={`bg-background/80 backdrop-blur-sm border-border/50 overflow-hidden hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 ${
                  historyView === "list" ? "flex" : ""
                }`}
              >
                <div
                  className={`${
                    historyView === "list" ? "w-48 h-32" : "aspect-video"
                  } relative overflow-hidden`}
                >
                  <Image
                    src={screenshot.imageUrl}
                    alt={`Screenshot ${new Date(
                      screenshot.createdAt
                    ).toLocaleDateString()}`}
                    width={historyView === "list" ? 200 : 400}
                    height={historyView === "list" ? 150 : 300}
                    className="w-full h-full object-cover"
                  />
                  {historyView === "grid" && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white/70 text-xs">
                          {new Date(screenshot.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {screenshot.questionsCount} questions
                      </Badge>
                    </>
                  )}
                </div>
                {historyView === "list" && (
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(screenshot.createdAt).toLocaleDateString()},{" "}
                        {new Date(screenshot.createdAt).toLocaleTimeString()}
                      </p>
                      {screenshot.questionsCount > 0 && (
                        <p className="text-xs text-blue-500 mt-1">
                          {screenshot.questionsCount} question
                          {screenshot.questionsCount !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-xs">
                        View details
                      </Badge>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
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
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  Screenshot from{" "}
                  {new Date(selectedScreenshot.createdAt).toLocaleDateString()}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    )}
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
              <div
                ref={pdfRef}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "794px", // A4 width in pixels (210mm)
                  padding: "20px",
                  backgroundColor: "white",
                }}
              >
                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Screenshot Analysis Report
                  </h1>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Generated on {new Date().toLocaleDateString()} at{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "20px",
                    }}
                  >
                    Original screenshot taken on{" "}
                    {new Date(
                      selectedScreenshot.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div
                  style={{
                    marginBottom: "30px",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={selectedScreenshot.imageUrl}
                    alt="Screenshot"
                    style={{ width: "100%", display: "block" }}
                  />
                </div>

                <div style={{ marginTop: "30px" }}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "15px",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "5px",
                    }}
                  >
                    Questions & Answers ({selectedScreenshot.questions.length})
                  </h2>

                  {selectedScreenshot.questions.map((question, index) => (
                    <div
                      key={question._id}
                      style={{
                        marginBottom: "20px",
                        paddingBottom: "20px",
                        borderBottom:
                          index < selectedScreenshot.questions.length - 1
                            ? "1px solid #f0f0f0"
                            : "none",
                      }}
                    >
                      <div style={{ marginBottom: "10px" }}>
                        <p
                          style={{
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "5px",
                          }}
                        >
                          Q{index + 1}: {question.question}
                        </p>
                        <p style={{ fontSize: "12px", color: "#999" }}>
                          Asked at{" "}
                          {new Date(question.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      {question.answer ? (
                        <div
                          style={{
                            backgroundColor: "#f8fafc",
                            padding: "10px 15px",
                            borderRadius: "6px",
                            borderLeft: "3px solid #3b82f6",
                          }}
                        >
                          <p style={{ color: "#333" }}>{question.answer}</p>
                        </div>
                      ) : (
                        <p style={{ color: "#999", fontStyle: "italic" }}>
                          No answer provided
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 h-[70vh]">
                {/* Image Section */}
                <div className="p-6">
                  <Image
                    src={selectedScreenshot.imageUrl}
                    alt={`Screenshot from ${new Date(
                      selectedScreenshot.createdAt
                    ).toLocaleDateString()}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                {/* Chat Section */}
                <div className="border-l border-border p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                      Questions ({selectedScreenshot.questions.length})
                    </h4>
                  </div>

                  {/* Questions Container */}
                  <div
                    ref={questionsContainerRef}
                    className="flex-1 space-y-3 overflow-y-auto mb-4 max-h-[50vh] pr-2"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {selectedScreenshot.questions.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No questions yet. Ask your first question below.
                      </div>
                    ) : (
                      selectedScreenshot.questions.map((question) => (
                        <div key={question._id} className="space-y-2">
                          {/* Question */}
                          <div className="group relative">
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
                          </div>

                          {/* Answer */}
                          {question.isLoading ? (
                            <div className="rounded-lg p-3 bg-blue-500/10 border border-blue-500/20 mr-8 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              <span className="text-sm text-muted-foreground">
                                Analyzing...
                              </span>
                            </div>
                          ) : question.answer ? (
                            <div className="rounded-lg p-3 bg-blue-500/10 border border-blue-500/20 mr-8">
                              <p className="text-sm text-foreground">
                                {question.answer}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input Section */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask a question about this screenshot..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isAnalyzing}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          newQuestion.trim() &&
                          !isAnalyzing
                        ) {
                          handleAskQuestion();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      onClick={handleAskQuestion}
                      disabled={!newQuestion.trim() || isAnalyzing}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
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
