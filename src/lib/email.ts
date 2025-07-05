import { Resend } from "resend";
import WelcomeEmail from "@/components/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (name: string, email: string) => {
  try {
    console.log("About to send email", { name, email });
    console.log("API Key exists:", !!process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "AskShot <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to AskShot! Your account is ready 🎉",
      react: WelcomeEmail({
        username: name || email.split("@")[0],
      }),
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
};
