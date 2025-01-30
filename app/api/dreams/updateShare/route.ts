import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const url = body.url;
    const tags = body.tags;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const userEmail = session.user.email;

    const result = await DreamStory.findOneAndUpdate(
      { email: userEmail, url: url },
      { $set: { share: true }, Tags: tags },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Dream story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, share: result.share });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        error: "Failed to update share status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
