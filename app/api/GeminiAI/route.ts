// app/api/GeminiAI/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const GeminiAPI = process.env.GEMINI_API_KEY;

    if (!GeminiAPI) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(GeminiAPI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const requestBody = await req.json();
    const language = requestBody?.language || "EN";
    const description = requestBody?.description;
    const bookTone = requestBody?.bookTone || "mysterious";
    const genre = requestBody?.genre || "fantasy";
    const storyLength = requestBody?.storyLength || "medium";
    const perspective = requestBody?.perspective || "first-person";
    const prompt = `I have a dream story that I want you to organize into a JSON format. Each JSON object should represent a single page of the story. The structure should include:

    pageNumber: The number of the page.
    imagePrompt: A short text that describes what the image for this page should depict.
    text: The story text for this page.

    Please follow these specific requirements:
    - Use ${language} language for the text field only, while keeping imagePrompt in English
    - Narrate from ${perspective} perspective point of view
    - Set the tone as ${bookTone}
    - Follow the ${genre} dream theme
    - 
    - Create a ${storyLength} story length
    - Maintain a consistent ${bookTone} atmosphere throughout the story
    - Ensure the imagery and descriptions match the ${genre} theme
    
    Respond ONLY with the JSON array, no additional text or markdown formatting.
    
    Dream Description: ${description}`;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!language) {
      return NextResponse.json(
        { error: "Language parameter is required" },
        { status: 400 }
      );
    }

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Clean up the response to ensure valid JSON
    const cleanedResponse = response
      .replace(/```json\s*/g, "")
      .replace(/```\s*$/g, "")
      .trim();

    // Validate JSON before sending
    try {
      JSON.parse(cleanedResponse);
      return NextResponse.json({ response: cleanedResponse });
    } catch (jsonError) {
      console.error("Invalid JSON received from Gemini:", cleanedResponse);
      console.error("Error:", jsonError);

      return NextResponse.json(
        { error: "Invalid JSON response from AI" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Error generating content" },
      { status: 500 }
    );
  }
}
