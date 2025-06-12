import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SignInButton from "../../../components/SignInButton";

export default async function SignIn() {
  const session = await getServerSession();

  if (session) {
    redirect("/auth/success");
  }

  const providers = await getProviders();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-[400px] bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden border border-white/40">
        <div className="p-6 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-4 gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                AskShot
              </h2>
              <p className="text-sm text-gray-500/80">
                Please login to continue
              </p>
            </div>

            <div className="w-full space-y-4">
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
      </div>
    </div>
  );
}
