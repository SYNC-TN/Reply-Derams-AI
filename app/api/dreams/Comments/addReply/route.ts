import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { User } from "@/app/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to reply" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { content, url, parentCommentId } = body;

    if (!content?.trim() || !url?.trim() || !parentCommentId) {
      return NextResponse.json(
        { error: "Content, URL and parent comment ID are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const story = await DreamStory.findOne({ url });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const parentComment = story.comments.id(parentCommentId);
    if (!parentComment) {
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    const newReply = {
      username: session.user.name,
      id: user._id,
      content: content.trim(),
      image: session.user.image || "",
      profileName: user.profileName,
      createdAt: new Date(),
      parentId: parentCommentId,
      ancestors: [...(parentComment.ancestors || []), parentCommentId],
    };

    const updatedStory = await DreamStory.findOneAndUpdate(
      { url },
      { $push: { comments: newReply } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      reply: updatedStory.comments[updatedStory.comments.length - 1],
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      {
        error: "Failed to add reply",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
