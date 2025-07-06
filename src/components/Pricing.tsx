"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Script from "next/script";
import { URLS } from "@/lib/constants";
import { usePayment } from "./PaymentHandler";

export default function Pricing() {
  const {
    isYearly,
    setIsYearly,
    userTier,
    loading,
    error,
    handleUpgrade,
    pricingPlans,
  } = usePayment();
  return (
    <section id="pricing" className="py-32 relative">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" />

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
            you&apos;re ready.
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
                  Save 15%
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
                    {plan.features.map(
                      (feature: string, featureIndex: number) => (
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
                      )
                    )}
                  </ul>
                </CardContent>

                <div className="p-8 pt-0">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {plan.name === "Enterprise" ? (
                      <Link
                        href={URLS.CALENDLY}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button
                          className={`w-full py-4 text-lg border-purple-500/30 hover:bg-purple-500/10`}
                          variant="outline"
                          size="lg"
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className={`w-full py-4 text-lg ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-xl shadow-purple-500/25"
                            : "border-purple-500/30 hover:bg-purple-500/10"
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={
                          plan.name === "Enterprise"
                            ? undefined
                            : plan.popular && userTier !== "paid"
                            ? () => handleUpgrade()
                            : undefined
                        }
                        disabled={
                          plan.name === "Free" ||
                          (plan.popular && (loading || userTier === "paid"))
                        }
                      >
                        {plan.popular && loading
                          ? "Processing..."
                          : plan.popular && userTier === "paid"
                          ? "Current Plan"
                          : plan.name === "Free"
                          ? "Default Plan"
                          : plan.cta}
                      </Button>
                    )}
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
  );
}
