import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SignInClientPage from "./SignInClientPage";

export default async function SignIn({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  const session = await getServerSession();
  const fromExtension = searchParams?.from === "extension";

  if (session) {
    if (fromExtension) {
      redirect("/auth/success");
    } else {
      redirect("/");
    }
  }

  return <SignInClientPage fromExtension={fromExtension} />;
}
