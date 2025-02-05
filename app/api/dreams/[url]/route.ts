import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/app/models/User";

interface LikeProps {
  username: string;
  id: string;
}

// Using Context type from Next.js for route handlers
type Context = {
  params: {
    url: string;
  };
};

export async function GET(
  req: NextRequest,
  context: Context
): Promise<NextResponse> {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const dream = await DreamStory.findOne({ url: context.params.url });

    if (!dream) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    const user = await User.findOne({ email: session?.user?.email });
    const userEmail = session?.user?.email;

    const isOwner = userEmail === dream.email;
    const nbLikes = dream.stats.likes.length;
    const isAlreadyLiking = user
      ? dream.stats.likes.some(
          (like: LikeProps) => like.id.toString() === user._id.toString()
        )
      : false;

    const response = {
      dream,
      isOwner,
      nbLikes,
      isAlreadyLiking,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dream:", error);
    return NextResponse.json(
      { error: "Failed to fetch dream" },
      { status: 500 }
    );
  }
}
