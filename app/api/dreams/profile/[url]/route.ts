// app/api/profile/[url]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { DreamStory } from "@/app/models/DreamStory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
interface userDetails {
  id: string;
  username: string;
}
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
    let isFollowing: boolean = false;
    const user = await User.findOne({ profileName: params.url });
    const currentUser = await User.findOne({ email: token });
    const dreams = await DreamStory.find({
      email: user.email,
      share: true,
    });
    if (!user) {
      console.log("User not found:", params.url);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser.Following.length > 0) {
      isFollowing = currentUser.Following.some(
        (check: userDetails) => check.id.toString() === user._id.toString()
      );
    }
    const count = dreams.length;
    const ModifiedDreams = dreams.map((dream) => {
      return {
        User: dream.User,
        url: dream.url,
        name: dream.name,
        title: dream.title,
        stats: {
          likes: dream.stats.likes.length,
          views: dream.views,
          comments: dream.comments.length,
        },
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
      profileName: user.profileName,
      isFollowing: isFollowing,
      profileBanner: user.banner || null,
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
