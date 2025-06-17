"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "motion/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Chrome,
  Zap,
  Shield,
  Globe,
  Camera,
  MessageSquare,
  ArrowRight,
  Check,
  Star,
  Menu,
  X,
  Sun,
  Moon,
  Play,
  Download,
  Users,
  Sparkles,
  Eye,
  Lock,
  Cpu,
  FileText,
  BarChart3,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Script from "next/script";
import axios from "axios";
import { signOut } from "next-auth/react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

declare global {
  interface Window {
    Cashfree: any;
  }
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Floating particles component
const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Animated background grid
const AnimatedGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
};

const AskShotLanding: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

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

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  // Add this interface
  interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    cta: string;
  }

  // Add this pricing plans configuration
  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out AskShot",
      features: [
        "3 screenshots per day",
        "Basic AI analysis",
        "Chrome extension access",
        "Community support",
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: isYearly ? "$50" : "$5",
      period: isYearly ? "year" : "month",
      description: "For power users and professionals",
      features: [
        "100 screenshots per day",
        "Priority AI processing",
        "Advanced analysis features",
        "Email support",
        "Export capabilities",
        "Custom shortcuts",
      ],
      popular: true,
      cta: "Start Pro Trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations",
      features: [
        "Unlimited screenshots",
        "Team management",
        "Analytics dashboard",
        "API access",
        "Priority support",
        "Custom integrations",
        "SSO support",
      ],
      cta: "Contact Sales",
    },
  ];

  // Add this useEffect for Cashfree initialization
  useEffect(() => {
    if (typeof window !== "undefined" && window.Cashfree) {
      setCashfreeLoaded(true);
    }
  }, []);

  // Add this payment handler function
  const handleUpgrade = async () => {
    if (status !== "authenticated") {
      router.push("/auth/signin");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("/api/payment/create-order");
      console.log("Payment API response:", response.data);

      if (response.data.sessionId) {
        const cashfree = window.Cashfree({
          mode: "sandbox",
        });

        cashfree.checkout({
          paymentSessionId: response.data.sessionId,
          redirectTarget: "_self",
          components: [
            "order-details",
            "card",
            "upi",
            "netbanking",
            "app",
            "paylater",
          ],
          theme: {
            primaryColor: "#6366F1",
            secondaryColor: "#C4B5FD",
          },
        });
      } else {
        setError("Failed to create payment session");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      company: "TechCorp",
      content:
        "AskShot has revolutionized how I debug visual issues. I can instantly ask AI about any UI element and get detailed explanations.",
      avatar: "/api/placeholder/40/40",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "UX Researcher",
      company: "DesignLab",
      content:
        "Perfect for analyzing user interfaces and getting quick insights. The AI understands design patterns better than I expected.",
      avatar: "/api/placeholder/40/40",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      company: "MIT",
      content:
        "I use AskShot for my computer science courses. It helps me understand complex diagrams and code snippets instantly.",
      avatar: "/api/placeholder/40/40",
      rating: 5,
    },
  ];

  const features: Feature[] = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast Capture",
      description:
        "Canvas-based screenshot technology that captures any region in milliseconds with pixel-perfect accuracy.",
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Advanced AI Analysis",
      description:
        "Powered by state-of-the-art vision models that understand code, designs, charts, and complex visual content.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description:
        "Your screenshots are processed securely and never stored. Complete privacy protection for sensitive content.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Works Everywhere",
      description:
        "Compatible with any webpage, web app, PDF, dashboard, or online document. No restrictions.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Click Extension",
      description:
        "Activate AskShot from your Chrome toolbar with a single click",
      icon: <Chrome className="h-8 w-8" />,
    },
    {
      number: "02",
      title: "Draw & Capture",
      description: "Draw a rectangle around any area you want to analyze",
      icon: <Camera className="h-8 w-8" />,
    },
    {
      number: "03",
      title: "Ask AI Anything",
      description: "Type your question and get instant AI-powered insights",
      icon: <MessageSquare className="h-8 w-8" />,
    },
  ];

  const faqs = [
    {
      question: "Is my screenshot data private and secure?",
      answer:
        "Absolutely. Your screenshots are processed in real-time and never stored on our servers. We use end-to-end encryption and follow strict privacy protocols to ensure your sensitive information remains protected.",
    },
    {
      question: "What AI model powers AskShot?",
      answer:
        "AskShot uses advanced vision-language models optimized for understanding web content, code, designs, and documents. Our AI is specifically trained to analyze screenshots and provide accurate, contextual responses.",
    },
    {
      question: "Can I use AskShot on PDFs and dashboards?",
      answer:
        "Yes! AskShot works on any content displayed in your Chrome browser, including PDFs, analytics dashboards, web applications, documentation sites, and more.",
    },
    {
      question: "How accurate is the AI analysis?",
      answer:
        "Our AI achieves high accuracy rates for common use cases like code analysis, UI debugging, and content summarization. The accuracy depends on image quality and question complexity.",
    },
    {
      question: "Is there a limit to screenshot size?",
      answer:
        "Free users can capture regions up to 1920x1080 pixels. Pro users have no size restrictions and can capture full-page screenshots with enhanced processing.",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "dark bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
      }`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AnimatedGrid />
        <FloatingParticles />

        {/* Floating gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 10,
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-3xl"
        />
      </div>
      {/* Navigation */}
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
              <motion.a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                whileHover={{ y: -2 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                whileHover={{ y: -2 }}
              >
                Pricing
              </motion.a>
              <motion.a
                href="#demo"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                whileHover={{ y: -2 }}
              >
                Book Demo
              </motion.a>
              <motion.a
                href="#faq"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                whileHover={{ y: -2 }}
              >
                FAQ
              </motion.a>
              <div className="flex items-center space-x-2 bg-muted/50 rounded-full p-1 backdrop-blur-sm">
                <Sun className="h-4 w-4" />
                <Switch checked={isDark} onCheckedChange={setIsDark} />
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
              <a href="#features" className="block text-muted-foreground">
                Features
              </a>
              <a href="#pricing" className="block text-muted-foreground">
                Pricing
              </a>
              <a href="#faq" className="block text-muted-foreground">
                FAQ
              </a>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch checked={isDark} onCheckedChange={setIsDark} />
                <Moon className="h-4 w-4" />
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge
                variant="secondary"
                className="mb-8 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                AI-Powered Screenshot Analysis
              </Badge>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Ask Anything. Visually.
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Draw on any webpage. Capture a region. Ask AI anything about it.
              Perfect for developers, researchers, students, and designers.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-2xl shadow-purple-500/25 px-8 py-4 text-lg"
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Try the Extension
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/10 px-8 py-4 text-lg backdrop-blur-sm"
                >
                  <Play className="h-5 w-5 mr-2" />
                  View Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Demo Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-3xl p-10 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 1.2 + index * 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        y: -10,
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      className="text-center group"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Three simple steps to unlock AI-powered visual analysis on any
              webpage
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                <Card className="relative h-full bg-gradient-to-br from-background/80 to-muted/30 border-border/30 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group">
                  <CardHeader className="text-center pb-6">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
                      {step.icon}
                    </div>
                    <div className="text-sm font-mono text-purple-400 mb-3 font-semibold">
                      {step.number}
                    </div>
                    <CardTitle className="text-2xl group-hover:text-purple-400 transition-colors">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden md:block absolute -right-5 top-1/2 transform -translate-y-1/2 z-10"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Powerful Features
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Built for professionals who need fast, accurate visual analysis
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <Card className="h-full bg-gradient-to-br from-background/80 to-muted/20 border-border/30 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-xl group">
                  <CardHeader>
                    <div className="w-14 h-14 mb-6 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Demo Section */}
      <section id="demo" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Book a Demo Call
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              See how AskShot can transform your workflow with a personalized
              demo
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-3xl p-8 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">
                  Schedule Your Free Demo
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Personalized walkthrough of features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Custom solutions for your use case</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Q&A with our product specialists</span>
                  </li>
                </ul>
              </div>
              <div className="flex-shrink-0">
                <motion.a
                  href="https://calendly.com/askshot/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-xl font-medium shadow-lg shadow-purple-500/25 text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Your Demo
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              See It In Action
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Watch how AskShot transforms the way you interact with visual
              content
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-3xl p-12 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-border/50 group hover:border-purple-500/30 transition-all duration-500">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Play className="h-20 w-20 mx-auto mb-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </motion.div>
                  <p className="text-xl text-muted-foreground mb-6">
                    Interactive Demo Coming Soon
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-xl shadow-purple-500/25"
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Extension
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          onLoad={() => setCashfreeLoaded(true)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Simple Pricing
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Choose the plan that fits your needs. Start free, upgrade when
              you're ready.
            </motion.p>

            <motion.div
              className="flex items-center justify-center space-x-6 bg-muted/30 rounded-full p-2 backdrop-blur-sm border border-border/50 w-fit mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <span
                className={`text-sm px-4 py-2 rounded-full transition-all ${
                  !isYearly
                    ? "text-foreground bg-background shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span
                className={`text-sm px-4 py-2 rounded-full transition-all ${
                  isYearly
                    ? "text-foreground bg-background shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Yearly
              </span>
              {isYearly && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                    Save 20%
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: plan.popular ? -5 : -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                <Card
                  className={`relative h-full ${
                    plan.popular
                      ? "border-purple-500/50 shadow-2xl shadow-purple-500/25 scale-105"
                      : "border-border/30"
                  } bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-xl group`}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white px-4 py-2 shadow-lg">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </motion.div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-4 group-hover:text-purple-400 transition-colors">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-lg">
                        /{plan.period}
                      </span>
                    </div>
                    <CardDescription className="mt-4 text-base leading-relaxed">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 px-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  <div className="p-8 pt-0">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className={`w-full py-4 text-lg ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-xl shadow-purple-500/25"
                            : "border-purple-500/30 hover:bg-purple-500/10"
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={plan.popular ? handleUpgrade : undefined}
                        disabled={plan.popular && loading}
                      >
                        {plan.popular && loading ? "Processing..." : plan.cta}
                      </Button>
                    </motion.div>
                    {plan.popular && error && (
                      <div className="mt-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              What Users Say
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of professionals who use AskShot daily
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                <Card className="h-full bg-gradient-to-br from-background/80 to-muted/20 border-border/30 hover:border-purple-500/30 transition-all duration-500 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4 ring-2 ring-purple-500/20">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-lg group-hover:text-purple-400 transition-colors">
                          {testimonial.name}
                        </div>
                        <div className="text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Everything you need to know about AskShot
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-background/80 to-muted/20 rounded-3xl p-8 backdrop-blur-xl border border-border/30 shadow-2xl"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-border/30"
                  >
                    <AccordionTrigger className="text-left text-lg hover:text-purple-400 transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10" />
        <motion.div
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 0.8, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Workflow?
            </motion.h2>
            <motion.p
              className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of professionals using AskShot to unlock visual
              intelligence
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-2xl shadow-purple-500/25 px-10 py-6 text-xl"
                >
                  <Chrome className="h-6 w-6 mr-3" />
                  Install Extension
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/10 backdrop-blur-sm px-10 py-6 text-xl"
                >
                  View on Chrome Store
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-background to-muted/30 border-t border-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <motion.div
                className="flex items-center space-x-2 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AskShot
                </span>
              </motion.div>
              <p className="text-muted-foreground mb-6 max-w-md text-lg leading-relaxed">
                AI-powered screenshot analysis for the modern web. Ask anything
                about any visual content.
              </p>
              <div className="flex space-x-2">
                {[Twitter, Github, Linkedin].map((Icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-purple-500/10 hover:text-purple-400"
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-muted-foreground">
                {["Features", "Pricing", "Chrome Store", "Changelog"].map(
                  (item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {item}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                {["About", "Blog", "Privacy", "Terms", "Contact"].map(
                  (item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {item}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </div>
          </div>

          <Separator className="my-12 bg-border/50" />

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © 2025 AskShot. All rights reserved.
            </motion.p>
            <motion.div
              className="flex items-center space-x-4 mt-4 sm:mt-0"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="outline"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <Chrome className="h-4 w-4 text-purple-400" />
                <span className="text-sm">Available on Chrome Web Store</span>
              </Badge>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AskShotLanding;
