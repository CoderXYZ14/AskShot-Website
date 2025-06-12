import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    role?: string;
    tier?: string;
    freeTrialsLeft?: number;
    id?: string;
  }
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      tier?: string;
      freeTrialsLeft?: number;
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    tier?: string;
    freeTrialsLeft?: number;
    userId?: string;
    provider?: string;
    providerAccountId?: string;
  }
}
