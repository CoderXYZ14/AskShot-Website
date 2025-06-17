"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ServiceTermsPage = () => {
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
          Terms of Service
        </h1>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using AskShot, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              2. Description of Service
            </h2>
            <p className="mb-4">
              AskShot provides a Chrome extension that allows users to capture
              screenshots of web pages and interact with AI to analyze and
              provide information about the captured content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              3. User Accounts
            </h2>
            <p className="mb-4">
              To use certain features of AskShot, you may be required to create
              an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              4. Subscription and Payments
            </h2>
            <p className="mb-4">
              AskShot offers both free and paid subscription plans. By
              subscribing to a paid plan, you agree to pay the fees associated
              with your selected plan. We reserve the right to change our
              pricing at any time, with notice provided to active subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              5. User Content
            </h2>
            <p className="mb-4">
              You retain all rights to the content you submit through AskShot.
              By using our service, you grant us a license to use, store, and
              process your content solely for the purpose of providing and
              improving our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              6. Prohibited Uses
            </h2>
            <p className="mb-4">
              You agree not to use AskShot for any unlawful purpose or in any
              way that could damage, disable, or impair our service. Prohibited
              activities include but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violating any applicable laws or regulations</li>
              <li>Infringing on the intellectual property rights of others</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Using our service to distribute malware or harmful code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              7. Termination
            </h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate your access to
              AskShot at our discretion, particularly if we believe you have
              violated these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              8. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at{" "}
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
                href="/refund-terms"
                className="text-sm text-gray-500 hover:text-purple-400"
              >
                Refund Terms
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

export default ServiceTermsPage;
