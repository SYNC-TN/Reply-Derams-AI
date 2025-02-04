import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url).searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { error: "Story URL is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch the story with all comments, sorted and populated
    const story = await DreamStory.findOne({ url }).populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "replies",
        options: { sort: { createdAt: 1 } },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Flatten comments to include top-level comments and their replies
    const flattenedComments = story.comments.map((comment: any) => ({
      ...comment.toObject(),
      replies: comment.replies || [],
    }));

    return NextResponse.json({
      comments: flattenedComments,
      total: flattenedComments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch comments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
