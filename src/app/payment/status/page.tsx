"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function PaymentStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setMessage("Invalid payment reference");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.get(`/api/payment/verify?order_id=${orderId}`);
        
        if (response.data.success) {
          setStatus("success");
          setMessage("Your payment was successful! Your account has been upgraded to Premium.");
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage(`Payment verification failed: ${response.data.status || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("failed");
        setMessage("Failed to verify payment status. Please contact support.");
      }
    };

    verifyPayment();
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg">Verifying payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full inline-flex">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full inline-flex">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Failed</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
