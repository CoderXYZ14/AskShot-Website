import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SignInClientPage from "./SignInClientPage";

export default async function SignIn() {
  const session = await getServerSession();

  if (session) {
    redirect("/auth/success");
  }

  return <SignInClientPage />;
}
