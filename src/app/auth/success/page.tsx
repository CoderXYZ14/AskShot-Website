"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthSuccess() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Send the session data to the extension
      // The extension will be listening for this message
      window.opener?.postMessage(
        {
          type: "AUTH_SUCCESS",
          session: session
        },
        "*"
      );
      
      // Close the window after sending the message
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
        <p className="text-gray-600">
          {session ? "You have successfully signed in. This window will close automatically." : "Finalizing your sign-in..."}
        </p>
      </div>
    </div>
  );
}
