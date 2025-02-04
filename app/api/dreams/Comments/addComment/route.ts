import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { User } from "@/app/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Get session and connect to DB
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    await connectDB();

    // 2. Parse and validate request body
    const body = await request.json();
    const { content, url } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    if (!url?.trim()) {
      return NextResponse.json(
        { error: "Story URL is required" },
        { status: 400 }
      );
    }

    // 3. Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // 4. Create comment object
    const newComment = {
      username: session.user.name,
      id: user._id,
      content: content.trim(),
      image: session.user.image || "",
      profileName: user.profileName,
      createdAt: new Date(),
      parentId: null,
      ancestors: [],
    };

    // 5. Add comment to story
    const updatedStory = await DreamStory.findOneAndUpdate(
      { url: url },
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      comment: updatedStory.comments[updatedStory.comments.length - 1],
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      {
        error: "Failed to add comment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
