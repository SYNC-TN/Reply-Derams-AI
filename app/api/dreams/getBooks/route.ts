import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { authOptions } from "@/lib/auth";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dreams = await DreamStory.find({ User: session.user.id });

    if (!dreams || dreams.length === 0) {
      return NextResponse.json({ error: "No dreams found" }, { status: 404 });
    }

    return NextResponse.json(dreams);
  } catch (error) {
    console.error("Error fetching dreams:", error);
    return NextResponse.json(
      { error: "Failed to fetch dreams" },
      { status: 500 }
    );
  }
}
