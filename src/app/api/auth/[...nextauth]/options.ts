import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Account } from "next-auth";
import { JWT } from "next-auth/jwt";
import { sendWelcomeEmail } from "@/lib/email";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const email = user.email;
          if (!email) return false;

          const existingUser = await UserModel.findOne({ email });

          if (!existingUser) {
            await UserModel.create({
              email,
              name: user.name,
              image: user.image,
              role: "user",
              tier: "free",
              freeTrialsLeft: 5,
              maxCredits: 5,
              googleId: account.providerAccountId,
            });

            try {
              const firstName = user.name
                ? user.name.split(" ")[0]
                : email.split("@")[0];
              await sendWelcomeEmail(firstName, email);
            } catch (emailError) {
              console.error("Failed to send welcome email:", emailError);
            }
          } else if (!existingUser.googleId) {
            existingUser.googleId = account.providerAccountId;
            await existingUser.save();
          }

          return true;
        } catch (error) {
          console.error("NextAuth | signIn error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: Account | null;
      user: User;
    }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }

      if (user?.email) {
        try {
          await dbConnect();
          const dbUser = await UserModel.findOne({ email: user.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.tier = dbUser.tier;
            token.freeTrialsLeft = dbUser.freeTrialsLeft;
            token.userId = String(dbUser._id);
          }
        } catch (error) {
          console.error("NextAuth | jwt user lookup error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.tier = token.tier as string;
        session.user.freeTrialsLeft = token.freeTrialsLeft as number;
        session.user.id = token.userId as string;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
