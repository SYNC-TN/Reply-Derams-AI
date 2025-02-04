import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { User } from "@/app/models/User";
import connectDB from "./mongodb";
import crypto from "crypto";
import { encodeEmail, decodeEmail } from "./jwt";

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
            id: encodeEmail(user.email), // Encode email as JWT
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
            profile(profile) {
              return {
                id: encodeEmail(profile.email), // Encode email as JWT
                email: profile.email,
                name: profile.name,
                image: profile.picture,
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider === "credentials") {
        return true;
      }

      try {
        await connectDB();
        const email = decodeEmail(user.id as string);

        if (!email) {
          throw new Error("Invalid token");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return true;
        }

        await User.create({
          email,
          name: user.name,
          profileName: user.name,
          image: user.image,
          provider: account.provider,
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
        token.id = user.id; // Already encoded as JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;

        // Fetch user data using decoded email
        try {
          await connectDB();
          const email = decodeEmail(token.id as string);
          if (!email) {
            throw new Error("Invalid token");
          }

          const dbUser = await User.findOne({ email });
          if (dbUser) {
            session.user.name = dbUser.name;
            session.user.image = dbUser.image;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
