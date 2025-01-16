// app/api/dreams/[url]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";

export async function GET(
  request: Request,
  { params }: { params: { url: string } }
) {
  try {
    await connectDB();

    // The URL stored in the database is just the UUID
    const dream = await DreamStory.findOne({ url: params.url });

    if (!dream) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    return NextResponse.json(dream);
  } catch (error) {
    console.error("Error fetching dream:", error);
    return NextResponse.json(
      { error: "Failed to fetch dream" },
      { status: 500 }
    );
  }
}
