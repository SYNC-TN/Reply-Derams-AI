import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    // Get the token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if the user is authenticated
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get the new username from request body
    const body = await request.json();
    const { newUsername } = body;

    if (!newUsername) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Use the user's email from the token instead of ID
    const userEmail = token.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in token" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the username
    user.name = newUsername;
    await user.save();

    return NextResponse.json({
      message: "Username updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error updating username:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to update username: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update username" },
      { status: 500 }
    );
  }
}
