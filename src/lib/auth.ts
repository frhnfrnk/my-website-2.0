/**
 * NextAuth Configuration & Admin Authorization Helper
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectDB } from "./db";
import { User } from "./models";

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        // Find user in database
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Check if user is authenticated admin
 * Use this in API route handlers to protect admin-only endpoints
 */
export async function isAdmin(_request?: Request): Promise<boolean> {
  try {
    // Import getServerSession dynamically to avoid circular dependency
    const { getServerSession } = await import("next-auth");

    // Get session from NextAuth using cookies
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has admin role
    return session?.user?.role === "admin";
  } catch (error) {
    console.error("isAdmin check error:", error);
    return false;
  }
}

/**
 * Get auth session from request
 * More robust version that uses NextAuth session
 */
export async function getSession(_request?: Request) {
  try {
    // Import getServerSession dynamically to avoid circular dependency
    const { getServerSession } = await import("next-auth");

    // Get session from NextAuth using cookies
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("getSession error:", error);
    return null;
  }
}

/**
 * Unauthorized response helper
 */
export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
