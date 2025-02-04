import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { NextRequest } from "next/server";
import { hash, compare } from "bcryptjs";

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
    const oldPassword = body.oldPassword;
    const newPassword = body.newPassword;

    // Validate input
    if (!newPassword || !oldPassword) {
      return NextResponse.json(
        { error: "Old password and new password are required" },
        { status: 400 }
      );
    }

    // Use the user's email from the token
    const userEmail = token.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in token" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify old password
    const isOldPasswordCorrect = await compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hash(newPassword, 12);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    // Return success response
    return NextResponse.json(
      {
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
