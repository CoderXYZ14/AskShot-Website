"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PricingPlan } from "@/utils/types";

// Add the global interface for Cashfree
declare global {
  interface Window {
    Cashfree: (config: { mode: string }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget: string;
        components: string[];
        theme?: {
          primaryColor: string;
          secondaryColor: string;
        };
      }) => void;
    };
  }
}

interface PaymentHandlerProps {
  children: React.ReactNode;
}

export function usePayment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userTier, setUserTier] = useState<"free" | "paid">("free");
  const [isYearly, setIsYearly] = useState(false);

  // Check user subscription status
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if user has a paid subscription
      if (session.user.tier === "paid") {
        setUserTier("paid");
      }
    }
  }, [session, status]);

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out AskShot",
      features: [
        "5 AI chats per day",
        "20 screenshots per day",
        "Basic AI analysis",
        "Chrome extension access",
        "Community support",
        "SSO support",
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: isYearly ? "₹6899" : "₹679",
      period: isYearly ? "year" : "month",
      description: "For power users and professionals",
      features: [
        "20 AI chats per day",
        "Unlimited screenshots per day",
        "Priority AI processing",
        "Advanced analysis features",
        "Email support",
        "SSO support",
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
        "Everything in Pro plan",
        "Customizable AI chats per day",
        "Unlimited screenshots per day",
        "Team management",
        "Priority support",
        "SSO support",
      ],
      cta: "Contact Sales",
    },
  ];

  // Payment handler function
  const handleUpgrade = async () => {
    const planType = "Pro";
    if (status !== "authenticated") {
      router.push("/auth/signin");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Pass the selected pricing based on yearly or monthly plan
      const amount = isYearly ? 6899 : 679;
      const period = isYearly ? "yearly" : "monthly";

      const response = await axios.post("/api/payment/create-order", {
        planType,
        amount,
        period,
      });

      if (response.data.sessionId) {
        const cashfree = window.Cashfree({
          mode: "production",
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

      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);

        // Handle the case where user already has premium subscription
        if (
          error.response.data?.error ===
          "You already have a premium subscription"
        ) {
          setUserTier("paid");
          setError("You already have an active premium subscription.");
        } else {
          setError(
            error.response.data?.error ||
              "Something went wrong. Please try again."
          );
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    userTier,
    isYearly,
    setIsYearly,
    pricingPlans,
    handleUpgrade,
  };
}

export default function PaymentHandler({ children }: PaymentHandlerProps) {
  return <>{children}</>;
}
