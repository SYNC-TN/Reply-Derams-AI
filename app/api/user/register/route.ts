// app/api/user/register/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already registered",
      });
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: username.trim(), // Use username as name
      profileName: username,

      provider: "credentials",
      image: "https://i.ibb.co/9TN2nT1/rb-4707.png",
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profileName: user.profileName,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      success: false,
      message: "Error creating account",
    });
  }
}
