import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user identifiers
    const oauthId = session.user.id;
    const userEmail = session.user.email;

    // Log for debugging
    console.log("Attempting to fetch dreams for:", {
      oauthId,
      userEmail,
    });

    // Find dreams without type conversion
    let dreams = await DreamStory.find({
      email: userEmail, // Just use the OAuth ID directly
    });

    console.log("Dreams found:", dreams);
    // Return empty array if no dreams found
    if (!dreams || dreams.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(dreams);
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dreams",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
