"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthSuccess() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      window.opener?.postMessage(
        {
          type: "AUTH_SUCCESS",
          session: session,
        },
        "*"
      );

      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-[400px] bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden border border-white/40">
        <div className="p-6 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-4 gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100/80 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                Authentication Successful
              </h2>
              <p className="text-sm text-gray-500/80">
                {session
                  ? "You have successfully signed in. This window will close automatically."
                  : "Finalizing your sign-in..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
