// lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export const encodeEmail = (email: string): string => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "30d" });
};

export const decodeEmail = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded.email;
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
};
