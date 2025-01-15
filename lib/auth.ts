import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { User } from "@/app/models/User";
import connectDB from "./mongodb";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!user) {
            throw new Error("No user found");
          }

          const isValid = await compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Early return if account is null or using credentials
      if (!account || account.provider === "credentials") {
        return true;
      }

      try {
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Update user information if needed
          existingUser.name = user.name;
          existingUser.image = user.image;
          existingUser.provider = account.provider;
          await existingUser.save();

          return true;
        }

        // Create new user if they don't exist
        const newUser = await User.create({
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account.provider,
          // Generate a secure random password for OAuth users
          password: crypto.randomBytes(32).toString("hex"),
        });

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
