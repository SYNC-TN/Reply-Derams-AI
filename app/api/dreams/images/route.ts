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
    const { image, path, width, height } = body;

    if (!image) {
      return NextResponse.json({ error: "no data provided" }, { status: 400 });
    }

    //télécharger de l'image sur Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: path, // organizer les images dans un dossier
      resource_type: "image",
      transformation: [
        { quality: "auto" },
        { width: width },
        { height: height },
        { fetch_format: "webp" }, //utilizer format webp pour optimize l'image
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
