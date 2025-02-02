import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
interface userDetails {
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
    const { followStatus, profileName } = body;

    console.log("Follow status:", followStatus);
    console.log("Profile name:", profileName);
    // Find both users
    const userToFollow = await User.findOne({ profileName });
    const currentUser = await User.findOne({ email: session.user.email });

    if (!userToFollow || !currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDetails = {
      id: userToFollow._id,
      username: userToFollow.name,
    };

    if (followStatus) {
      // Check if already following
      const isAlreadyFollowing = currentUser.Following.some(
        (user: userDetails) =>
          user.id.toString() === userToFollow._id.toString()
      );

      if (!isAlreadyFollowing) {
        // Update following for current user
        currentUser.Following.push(userDetails);

        // Update followers for the user being followed
        userToFollow.Followers.push({
          id: currentUser._id,
          username: currentUser.name,
        });
      }
    } else {
      // Remove from following
      currentUser.Following = currentUser.Following.filter(
        (user: userDetails) =>
          user.id.toString() !== userToFollow._id.toString()
      );

      // Remove from followers
      userToFollow.Followers = userToFollow.Followers.filter(
        (user: userDetails) => user.id.toString() !== currentUser._id.toString()
      );
    }

    // Save both users
    await Promise.all([currentUser.save(), userToFollow.save()]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        error: "Failed to follow user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
