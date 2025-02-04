// app/api/dreams/[url]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/app/models/User";
interface LikeProps {
  username: string;
  id: string;
}
export async function GET(
  request: Request,
  { params }: { params: { url: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // The URL stored in the database is just the UUID
    const dream = await DreamStory.findOne({ url: params.url });
    const user = await User.findOne({ email: session?.user?.email });
    const userEmail = session?.user?.email;
    console.log("User email:", userEmail);
    console.log("Dream email:", dream?.email);
    const isOwner = userEmail === dream.email;
    const nbLikes = dream.stats.likes.length;
    const isAlreadyLiking = dream.stats.likes.some(
      (like: LikeProps) => like.id.toString() === user._id.toString()
    );
    if (!dream) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }
    const response = {
      dream,
      isOwner,
      nbLikes,
      isAlreadyLiking,
    };

    console.log("Dream data:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dream:", error);
    return NextResponse.json(
      { error: "Failed to fetch dream" },
      { status: 500 }
    );
  }
}
