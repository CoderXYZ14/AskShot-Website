"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await axios.post("/api/payment/create-order")
      
      if (response.data.paymentLink) {
        window.location.href = response.data.paymentLink
      } else {
        setError("Failed to create payment link")
      }
    } catch (error) {
      console.error("Error creating payment:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Upgrade AskShot</h1>
          <p className="mt-2 text-gray-600">
            Get unlimited access to AI-powered screenshot analysis
          </p>
        </div>

        <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Premium Plan</h2>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900">₹499</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="mt-4 space-y-2 text-left">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Unlimited screenshot analysis
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Advanced AI features
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Priority support
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Upgrade Now"}
        </button>

        <div className="text-center text-sm text-gray-500">
          <Link href="/" className="text-violet-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
