// app/api/profile/[url]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { DreamStory } from "@/app/models/DreamStory";
export async function GET(
  request: Request,
  { params }: { params: { url: string } }
) {
  try {
    await connectDB();

    const user = await User.findOne({ profileName: params.url });
    const dreams = await DreamStory.find({
      username: user.name,
    });
    if (!user) {
      console.log("User not found:", params.url);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const ModifiedDreams = dreams.map((dream) => {
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

    const userData = {
      name: user.name,
      profilePic: user.image || null,
      collection: ModifiedDreams,
    };

    console.log("Found user data:", userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
