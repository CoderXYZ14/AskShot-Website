import {
  Camera,
  Chrome,
  Cpu,
  Globe,
  MessageSquare,
  Shield,
  Zap,
} from "lucide-react";
import { Feature, Step, Testimonial } from "./types";

export const testimonials: Testimonial[] = [
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

export const features: Feature[] = [
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
      "Your screenshots are processed and stored securely. Complete privacy protection for sensitive content.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Works Everywhere",
    description:
      "Compatible with any webpage, web app, PDF, dashboard, or online document. No restrictions.",
  },
];

export const steps: Step[] = [
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

export const faqs = [
  {
    question: "Is my screenshot data private and secure?",
    answer:
      "Yes, your screenshot data is stored securely. We use cryptographic hashing to anonymize and protect your data, ensuring it cannot be linked back to you. All transmissions are encrypted, and we follow strict security practices to safeguard your privacy.",
  },
  {
    question: "What AI model powers AskShot?",
    answer:
      "AskShot is powered by cutting-edge vision-language models. Free users use Claude 3, while Pro users get access to Claude 3.5 Sonnet — offering enhanced speed, accuracy, and deeper analysis for screenshots of code, content, or designs.",
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
      "No. Both Free and Pro users can capture any part of the webpage visible in the browser window — from below the address bar to the bottom of the page. Developer tools and browser UI are not included.",
  },
];
