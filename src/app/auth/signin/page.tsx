import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SignInClientPage from "./SignInClientPage";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | undefined }>;
}) {
  const session = await getServerSession();
  const params = await searchParams;
  const fromExtension = params?.from === "extension";

  if (session) {
    if (fromExtension) {
      redirect("/auth/success");
    } else {
      redirect("/profile");
    }
  }

  return <SignInClientPage fromExtension={fromExtension} />;
}
