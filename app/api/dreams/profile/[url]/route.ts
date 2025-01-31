// app/api/profile/[url]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { DreamStory } from "@/app/models/DreamStory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { decodeEmail } from "@/lib/jwt";
// Removed unnecessary import
export async function GET(
  request: Request,
  { params }: { params: { url: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    let token = null;
    if (session?.user?.id) {
      token = session.user.email;
    } else {
      console.log("User ID is undefined");
    }

    const user = await User.findOne({ profileName: params.url });
    const dreams = await DreamStory.find({
      email: token,
      share: true,
    });
    if (!user) {
      console.log("User not found:", params.url);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const count = dreams.length;
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
      DreamsCount: count,
      FollowersCount: user.Followers.length,
      FollowingCount: user.Following.length,
      profilePic: user.image || null,
      collection: ModifiedDreams,
      isOwner: user.email === session?.user.email,
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
