"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Zap, Crown, Building2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

interface Plan {
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

interface DailyUsageData {
  used: number;
  total: number;
  percentage: number;
}

interface PlansData {
  currentPlan: string;
  usage: {
    screenshots: {
      daily: DailyUsageData;
      total: number;
    };
    aiChats: {
      daily: DailyUsageData;
      total: number;
    };
  };
}

// Define plans statically
const plans: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    features: ["20 screenshots/day", "5 AI chats/day", "Basic support"],
    current: false,
  },
  {
    name: "Pro",
    price: "₹679",
    features: [
      "100 screenshots/day",
      "20 AI chats/day",
      "Priority support",
      "Advanced AI models",
    ],
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited screenshots",
      "Unlimited AI chats",
      "24/7 support",
      "Custom integrations",
    ],
    current: false,
  },
];

const PlansPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plansData, setPlansData] = useState<PlansData | null>(null);
  const [updatedPlans, setUpdatedPlans] = useState(plans);
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    const fetchPlansData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/plans");
        setPlansData(response.data);

        // Update plans to mark current plan
        const currentPlan = response.data.currentPlan;
        setUpdatedPlans(
          plans.map((plan) => ({
            ...plan,
            current: plan.name.toLowerCase() === currentPlan,
          }))
        );

        setError("");
      } catch (err) {
        console.error("Error fetching plans data:", err);
        setError("Failed to load plans data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlansData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 sm:space-y-8 px-1 sm:px-0"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Choose Your Plan
        </h2>
        <p className="text-muted-foreground">
          Unlock the full potential of AskShot
        </p>
      </div>

      <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Usage Statistics
          </h3>
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-3 py-1 text-sm ${
                activeTab === "daily"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab("total")}
              className={`px-3 py-1 text-sm ${
                activeTab === "total"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground"
              }`}
            >
              Total
            </button>
          </div>
        </div>

        {activeTab === "daily" ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Screenshots</span>
                <span className="text-foreground">
                  {plansData?.usage.screenshots.daily.used}/
                  {plansData?.usage.screenshots.daily.total}
                </span>
              </div>
              <Progress
                value={plansData?.usage.screenshots.daily.percentage || 0}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">AI Chats</span>
                <span className="text-foreground">
                  {plansData?.usage.aiChats.daily.used}/
                  {plansData?.usage.aiChats.daily.total}
                </span>
              </div>
              <Progress
                value={plansData?.usage.aiChats.daily.percentage || 0}
                className="h-2"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Total Screenshots</span>
                <span className="text-foreground">
                  {plansData?.usage.screenshots.total}
                </span>
              </div>
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Total AI Chats</span>
                <span className="text-foreground">
                  {plansData?.usage.aiChats.total}
                </span>
              </div>
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {updatedPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative bg-background/80 backdrop-blur-sm border-border/50 p-6 transition-all duration-300 ${
              plan.current
                ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20"
                : "hover:shadow-lg hover:shadow-blue-500/10"
            }`}
          >
            {plan.current && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                Current Plan
              </Badge>
            )}
            <div className="text-center mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 mb-2">
                {plan.name === "Free" && (
                  <Zap className="w-6 h-6 text-gray-400" />
                )}
                {plan.name === "Pro" && (
                  <Crown className="w-6 h-6 text-purple-400" />
                )}
                {plan.name === "Enterprise" && (
                  <Building2 className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-3xl font-bold text-foreground mt-2">
                {plan.price}
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.current && (
              <Button
                className={`w-full ${
                  plan.current
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                }`}
                disabled={plan.current}
              >
                Current Plan
              </Button>
            )}
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default PlansPage;
