// app/api/dreams/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const dream = await DreamStory.findById(params.id);

    if (!dream) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    return NextResponse.json(dream);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dream" },
      { status: 500 }
    );
  }
}
