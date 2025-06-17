"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PrivacyPolicyPage = () => {
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
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Introduction
            </h2>
            <p className="mb-4">
              At AskShot, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, and protect your personal
              information when you use our Chrome extension and website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Information We Collect
            </h2>
            <p className="mb-4">
              We keep data collection to an absolute minimum:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Email Address Only:</strong> When you create an account,
                we only collect your email address through Google
                authentication.
              </li>
              <li>
                <strong>Encrypted Screenshots:</strong> Any screenshots you
                capture are stored in encrypted format and are not used for any
                purpose other than providing the service to you.
              </li>
            </ul>
            <p className="mt-4">
              We do not collect or store any additional personal information,
              device information, or browsing history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              How We Use Your Information
            </h2>
            <p className="mb-4">We use your information solely for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account identification and authentication</li>
              <li>Providing the core screenshot and AI analysis service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">
                  Do you store my screenshots?
                </h3>
                <p>
                  Yes, but they are stored in encrypted format and are only used
                  to provide the service to you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">
                  Do you track my browsing history?
                </h3>
                <p>No, we do not track or store your browsing history.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">
                  Do you sell my data to third parties?
                </h3>
                <p>
                  No, we do not sell or share your data with any third parties.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">
                  Can I delete my data?
                </h3>
                <p>
                  Yes, you can request deletion of your account and all
                  associated data by contacting us at
                  shahwaizislam1404@gmail.com. We&apos;re also planning to add a
                  self-service data deletion feature in the future.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Data Storage and Security
            </h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your
              personal information. Your data is stored securely and we use
              industry-standard encryption to protect sensitive information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Data Sharing
            </h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your
              information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who help us deliver our services</li>
              <li>AI processing partners to fulfill your queries</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Your Rights
            </h2>
            <p className="mb-4">
              Depending on your location, you may have rights regarding your
              personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to delete your information</li>
              <li>The right to restrict or object to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Contact Information
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
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
                href="/service"
                className="text-sm text-gray-500 hover:text-purple-400"
              >
                Terms of Service
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

export default PrivacyPolicyPage;
