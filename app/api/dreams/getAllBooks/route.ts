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

    const session = await getServerSession(authOptions);
    await connectDB();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Find paginated dreams
    let dreams = await DreamStory.find({
      email: userEmail,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by most recent first

    const dreamModified = dreams.map((dream) => {
      return {
        User: dream.User,
        url: dream.url,
        name: dream.name,
        title: dream.title,
        stats: dream.stats,
        coverData: dream.coverData,
        createdAt: dream.createdAt,
        updatedAt: dream.updatedAt,
        __v: dream.__v,
      };
    });
    return NextResponse.json(dreamModified);
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
