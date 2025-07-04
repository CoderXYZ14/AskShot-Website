"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TermsOfServicePage = () => {
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
              Introduction
            </h2>
            <p className="mb-4">
              Welcome to AskShot. By using our Chrome extension and website, you
              agree to these Terms of Service. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using AskShot, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any of these terms, you are prohibited from
              using or accessing this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Use of Service
            </h2>
            <p className="mb-4">AskShot provides the following services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Screenshot capture and analysis</li>
              <li>AI-powered insights and answers</li>
              <li>Secure storage of your screenshots</li>
            </ul>
            <p className="mt-4">
              You agree to use these services only for lawful purposes and in
              accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              User Accounts
            </h2>
            <p className="mb-4">
              To use certain features of AskShot, you may need to create an
              account. You are responsible for maintaining the confidentiality
              of your account information and for all activities that occur
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Subscription and Payments
            </h2>
            <p className="mb-4">
              AskShot offers both free and premium subscription plans. By
              subscribing to a premium plan, you agree to pay the applicable
              fees. We reserve the right to change our pricing at any time, with
              notice to our users.
            </p>
            <p className="mb-4">
              For information about refunds, please refer to our{" "}
              <Link
                href="/refund-terms"
                className="text-purple-400 hover:text-purple-300"
              >
                Refund Terms
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Intellectual Property
            </h2>
            <p className="mb-4">
              AskShot and its original content, features, and functionality are
              owned by AskShot and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property
              laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              User Content
            </h2>
            <p className="mb-4">
              When you capture screenshots using AskShot, you retain ownership
              of your content. However, you grant us a license to use, store,
              and process this content for the purpose of providing our services
              to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Limitation of Liability
            </h2>
            <p className="mb-4">
              AskShot shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Changes to Terms
            </h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. We will
              notify users of any significant changes. Your continued use of
              AskShot after such modifications constitutes your acceptance of
              the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Termination
            </h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to AskShot
              immediately, without prior notice, for conduct that we believe
              violates these Terms or is harmful to other users, us, or third
              parties, or for any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <Link
                href="mailto:shahwaizislam1404@gmail.com"
                className="text-purple-400 hover:text-purple-300"
              >
                shahwaizislam1404@gmail.com
              </Link>
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

export default TermsOfServicePage;
