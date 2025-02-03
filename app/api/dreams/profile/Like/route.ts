import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { User } from "@/app/models/User";
import { DreamStory } from "@/app/models/DreamStory";
import { getServerSession } from "next-auth";

interface UserDetails {
  id: string;
  username: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { likeStatus, url } = body;
    console.log("Like status:", likeStatus);

    // Find both documents
    const storyToLike = await DreamStory.findOne({ url: url });
    const currentUserStory = await User.findOne({
      email: session.user.email,
    });

    if (!storyToLike || !currentUserStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const userDetails: UserDetails = {
      id: currentUserStory._id.toString(), // Convert ObjectId to string
      username: currentUserStory.name,
    };

    if (likeStatus) {
      // Check if already liking
      const isAlreadyLiking = storyToLike.stats.likes.some(
        (like: UserDetails) =>
          like.id.toString() === currentUserStory._id.toString()
      );
      if (isAlreadyLiking) {
        console.log("Already liking");
      }
      if (!isAlreadyLiking) {
        console.log("Adding like");
        // Add the like
        storyToLike.stats.likes.push(userDetails);
      }
    } else {
      // Remove the like
      console.log("Removing like");
      storyToLike.stats.likes = storyToLike.stats.likes.filter(
        (like: UserDetails) =>
          like.id.toString() !== currentUserStory._id.toString()
      );
    }

    // Save only the story that was liked/unliked
    await storyToLike.save();

    return NextResponse.json({
      success: true,
      likesCount: storyToLike.stats.likes.length,
    });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        error: "Failed to like story",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
