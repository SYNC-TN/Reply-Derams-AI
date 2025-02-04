import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { Types } from "mongoose";

interface Comment {
  username: string;
  id: Types.ObjectId;
  content: string;
  image: string;
  profileName: string;
  createdAt: Date;
  parentId: Types.ObjectId | null;
  ancestors: Types.ObjectId[];
  replies?: Comment[];
  toObject(): Comment;
}

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
    const flattenedComments = story.comments.map((comment: Comment) => ({
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
