//getBooksByCategorie.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categorie = searchParams.get("categorie");

    const session = await getServerSession(authOptions);
    await connectDB();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skip = (page - 1) * limit;

    let dreams = await DreamStory.find({
      share: true,
      /* $or: [
        { "Tags.name": categorie },
        { "Tags.value": categorie },
        { "Tags.label": categorie },
      ],*/
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by most recent first

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
