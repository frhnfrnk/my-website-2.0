/**
 * NextAuth Type Extensions
 */

import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      email: string;
      role?: string;
      name?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
