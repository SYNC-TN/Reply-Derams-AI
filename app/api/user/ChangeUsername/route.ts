import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";

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
    const newProfileName = newUsername.toLowerCase().replaceAll(/\s+/g, "-");

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
    user.profileName = newProfileName;
    await user.save();

    // Create updated token data
    const updatedToken = {
      ...token,
      name: newUsername,
      profileName: newProfileName,
    };

    // Encode the new token
    const newToken = await encode({
      token: updatedToken,
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Create the response
    const response = NextResponse.json({
      message: "Username updated successfully",
      user: {
        id: user._id,
        name: user.name,
        profileName: user.profileName,
        email: user.email,
        image: user.image,
      },
    });

    // Set the new token in cookies
    response.cookies.set({
      name: "next-auth.session-token",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
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
