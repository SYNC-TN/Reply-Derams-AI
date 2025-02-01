// app/api/dreams/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
interface Page {
  text: string;
  imageUrl: string;
  soundEffect: string;
}
interface Tag {
  id: number;
  name: string;
  label: string;
  value: string;
}
interface CoverDataProps {
  coverImagePrompt: string;
  coverImageUrl: string;
  dominantColors: string[];
  fontStyle: string;
  mood: string;
  subtitle: string;
  theme: string;
  title: string;
}

interface DreamRequestBody {
  description: string;
  share: boolean;
  tags: Tag[];
  soundEffect: boolean;
  artStyle: string;
  language: string;
  bookTone: string;
  storyLength: string;
  perspective: string;
  genre: string;
  pages: Page[];
  coverData: CoverDataProps;
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
    console.log("Session user:", session.user);
    // Log the raw request body

    const body: DreamRequestBody = await req.json();
    console.log(
      "Raw request body:",
      body.coverData || "No cover data provided"
    );
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

    const tempId = new mongoose.Types.ObjectId();
    const url = uuidv4();
    const truncatedDescription = body.description.slice(0, 30) + "...";

    // Ensure all required fields are present in cover data
    const defaultCoverData = {
      coverImagePrompt: "Default dream cover image",
      coverImageUrl: "",
      dominantColors: ["blue"],
      fontStyle: "default",
      mood: "peaceful",
      subtitle: "A journey through dreams",
      theme: "default",
      title: truncatedDescription,
    };

    // Create cover data with all required fields

    const dreamStoryData = {
      _id: tempId,
      User: user._id,
      username: session.user.name,
      email: session.user.email,
      url: url,
      name: `Dream: ${truncatedDescription}`,
      share: body.share || false,
      soundEffect: body.soundEffect || false,
      Tags: body.tags || [],
      description: body.description,
      title: `Dream: ${truncatedDescription}`,
      stats: {
        likes: 0,
        views: 0,
      },
      options: [
        {
          artStyle: body.artStyle || "realistic",
          language: body.language || "en",
          advancedOption: {
            bookTone: body.bookTone || "neutral",
            storyLength: body.storyLength || "medium",
            perspective: body.perspective || "first-person",
            genre: body.genre || "fantasy",
          },
        },
      ],
      pages: body.pages.map((page, index) => ({
        nb: index + 1,
        text: page.text,
        image: page.imageUrl,
        soundEffect: page.soundEffect,
      })),
      coverData: {
        coverImagePrompt:
          body.coverData.coverImagePrompt || defaultCoverData.coverImagePrompt,
        coverImageUrl:
          body.coverData.coverImageUrl || defaultCoverData.coverImageUrl,
        dominantColors:
          body.coverData.dominantColors || defaultCoverData.dominantColors,
        fontStyle: body.coverData.fontStyle || defaultCoverData.fontStyle,
        mood: body.coverData.mood || defaultCoverData.mood,
        subtitle: body.coverData.subtitle || defaultCoverData.subtitle,
        theme: body.coverData.theme || defaultCoverData.theme,
        title: body.coverData.title || defaultCoverData.title,
      },
    };

    const dreamStory = await DreamStory.create(dreamStoryData);

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
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Validation error :", error.errors);
    }
    return NextResponse.json(
      {
        error: "Failed to create dream",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
