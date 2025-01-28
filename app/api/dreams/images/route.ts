// app/api/dreams/images/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;
    console.log("claudinary request");
    if (!image) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "ReplayDreamsImages", // Organize images in a folder
      resource_type: "image",
      transformation: [
        { quality: "auto" }, // Automatic quality optimization
        { width: 1024 },
        { height: 1024 },
        { fetch_format: "webp" }, // Automatic format optimization
      ],
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
