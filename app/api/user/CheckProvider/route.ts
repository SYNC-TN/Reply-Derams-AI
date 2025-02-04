import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/app/models/User";
import { decodeEmail } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    let isCredentialsProvider = false;
    let token = null;

    if (session) {
      token = decodeEmail(session.user.id);
    }

    const user = await User.findOne({ email: token });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.provider.toString() === "credentials") {
      isCredentialsProvider = true;
    }

    return NextResponse.json(
      {
        isCredentialsProvider,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user provider:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to check user provider: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to check user provider" },
      { status: 500 }
    );
  }
}
