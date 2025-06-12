import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SignInButton from "../../../components/SignInButton";

export default async function SignIn() {
  const session = await getServerSession();
  
  // If the user is already signed in, redirect to a success page
  // that will communicate with the extension
  if (session) {
    redirect("/auth/success");
  }

  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign in to AskShot</h1>
        <div className="space-y-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} className="flex justify-center">
                <SignInButton 
                  providerId={provider.id}
                  providerName={provider.name}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
