// app/api/dreams/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

interface Page {
  text: string;
  imageUrl: string;
}

interface DreamRequestBody {
  description: string;
  artStyle: string;
  language: string;
  colorTheme: string;
  imageStyleStrength: string;
  imageResolution: string;
  pages: Page[];
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to create dreams" },
        { status: 401 }
      );
    }

    console.log("Incoming request body:", await req.clone().text());
    const body: DreamRequestBody = await req.json();
    console.log("Parsed body:", body);

    // ... (validation checks remain the same)

    await connectDB();

    const user = await mongoose
      .model("User")
      .findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Create a temporary ID to generate the URL
    const tempId = new mongoose.Types.ObjectId();

    const dreamStory = await DreamStory.create({
      _id: tempId, // Set the ID explicitly
      User: user._id,
      url: `/${tempId}`, // Set the URL using the ID
      name: `Dream: ${body.description.slice(0, 30)}...`,
      description: body.description,
      title: `Dream: ${body.description.slice(0, 30)}...`,
      options: [
        {
          artStyle: body.artStyle || "realistic",
          language: body.language || "en",
          advancedOption: {
            theme: body.colorTheme || "default",
            styleStrength: body.imageStyleStrength || "medium",
            resolution: body.imageResolution || "512x512",
          },
        },
      ],
      pages: body.pages.map((page, index) => ({
        nb: index + 1,
        text: page.text,
        image: page.imageUrl,
      })),
    });

    const populatedDreamStory = await DreamStory.findById(dreamStory._id)
      .populate("User")
      .populate("options.advancedOption");

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: populatedDreamStory,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating dream:", error);
    return NextResponse.json(
      {
        error: "Failed to create dream",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ... (GET endpoint remains the same)
// Add GET endpoint to fetch user's dreams
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to view dreams" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await mongoose
      .model("User")
      .findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Fetch all dreams for the user
    const dreams = await DreamStory.find({ User: user._id })
      .populate("User")
      .populate("options.advancedOption")
      .sort({ createdAt: -1 }); // Sort by newest first

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: dreams,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching dreams:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch dreams",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
