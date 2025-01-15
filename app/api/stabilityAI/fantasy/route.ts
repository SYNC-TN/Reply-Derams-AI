// /app/api/stabilityAI/fantasy/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    console.log("Starting API request processing");

    const requestBody = await req.json();
    const prompt = requestBody?.inputs || "Astronaut riding a horse"; // Default if no input is provided

    const payload = {
      inputs: prompt,
    };

    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!HUGGINGFACE_API_KEY) {
      console.error("Missing HUGGINGFACE_API_KEY");
      return NextResponse.json(
        { error: "HUGGINGFACE_API_KEY is not configured" },
        { status: 500 }
      );
    }

    console.log("Making request to Hugging Face");
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/nerijs/dark-fantasy-illustration-flux",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
        responseType: "arraybuffer",
      }
    );

    if (response.status === 200) {
      const base64Image = Buffer.from(response.data).toString("base64");
      return NextResponse.json({
        image: `data:image/jpeg;base64,${base64Image}`,
      });
    }

    throw new Error(
      `API returned invalid response. Status: ${response.status}`
    );
  } catch (error: any) {
    console.error("Error generating image:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      return NextResponse.json(
        {
          error: "Failed to generate image",
          details:
            typeof responseData === "string"
              ? responseData
              : Buffer.from(responseData).toString() || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate image", details: error.message },
      { status: 500 }
    );
  }
}
