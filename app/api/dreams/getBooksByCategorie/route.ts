import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { DreamStory } from "@/app/models/DreamStory";
import { User } from "@/app/models/User";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categorie = searchParams.get("categorie");

    const session = await getServerSession(authOptions);
    await connectDB();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skip = (page - 1) * limit;

    const dreamResults = await DreamStory.aggregate([
      {
        $match: {
          share: true,
          $or: [
            { "Tags.name": categorie },
            { "Tags.value": categorie },
            { "Tags.label": categorie },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "stats.likes": { $ifNull: [{ $size: "$stats.likes" }, 0] },
          "stats.views": "$stats.views",
        },
      },
      {
        $project: {
          User: 1,
          profilePic: "$userDetails.image",
          username: "$userDetails.name",
          url: 1,
          name: 1,
          title: 1,
          stats: 1,
          coverData: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ]);

    return NextResponse.json(dreamResults);
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dreams",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
