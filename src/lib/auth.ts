import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        await dbConnect();

        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          await UserModel.create({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account?.providerAccountId,
          });
        } else if (!existingUser.googleId && account?.providerAccountId) {
          existingUser.googleId = account.providerAccountId;
          await existingUser.save();
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          await dbConnect();
          const user = await UserModel.findOne({ email: session.user.email });

          if (user) {
            session.user.id = user._id?.toString() || "";
            session.user.role = user.role;
            session.user.tier = user.tier;
          }
        } catch (error) {
          console.error("Error fetching user session data:", error);
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};
