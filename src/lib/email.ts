import { Resend } from "resend";
import WelcomeEmail from "@/components/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (name: string, email: string) => {
  try {
    console.log("About to send email");
    await resend.emails.send({
      from: "shahwaizislam1404@gmail.com",
      to: email,
      subject: "Welcome to AskShot! Your account is ready 🎉",
      react: WelcomeEmail({
        username: name || email.split("@")[0],
        userEmail: email,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
};
