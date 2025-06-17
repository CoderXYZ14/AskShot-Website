"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RefundTermsPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Refund Terms
        </h1>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Refund Policy
            </h2>
            <p className="mb-4">
              At AskShot, we want you to be completely satisfied with your
              purchase. If you&apos;re not happy with our service for any
              reason, we offer the following refund policy:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>30-Day Money-Back Guarantee:</strong> We offer a 30-day
                money-back guarantee for all subscription plans. If you&apos;re
                not satisfied with our service, you can request a full refund
                within 30 days of your initial purchase.
              </li>
              <li>
                <strong>Pro-rated Refunds:</strong> After the initial 30-day
                period, refunds for unused subscription time may be considered
                on a case-by-case basis and will be pro-rated based on the
                remaining subscription period.
              </li>
              <li>
                <strong>No Refunds for Consumption:</strong> We do not offer
                refunds for consumed services, including but not limited to used
                AI credits, processed screenshots, or other features that have
                been utilized.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              How to Request a Refund
            </h2>
            <p className="mb-4">
              To request a refund, please contact our support team at{" "}
              <a
                href="mailto:shahwaizislam1404@gmail.com"
                className="text-purple-400 hover:text-purple-300"
              >
                shahwaizislam1404@gmail.com
              </a>{" "}
              with the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your registered email address</li>
              <li>Date of purchase</li>
              <li>Subscription plan</li>
              <li>Reason for requesting a refund</li>
            </ul>
            <p className="mt-4">
              We aim to process all refund requests within 5-7 business days.
              Refunds will be issued to the original payment method used for the
              purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Contact Us
            </h2>
            <p>
              If you have any questions about our refund policy, please contact
              us at
              <a
                href="mailto:shahwaizislam1404@gmail.com"
                className="text-purple-400 hover:text-purple-300"
              >
                shahwaizislam1404@gmail.com
              </a>
              .
            </p>
          </section>

          <div className="border-t border-gray-800 pt-8 mt-12">
            <p className="text-sm text-gray-500">Last updated: June 18, 2025</p>
            <div className="flex gap-4 mt-4">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-purple-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="/service"
                className="text-sm text-gray-500 hover:text-purple-400"
              >
                Terms of Service
              </Link>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-purple-400"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundTermsPage;
