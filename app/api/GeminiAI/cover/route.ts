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
    let language = requestBody?.language || "EN";
    if (language === "AR") {
      language = "Arabic";
    } else if (language === "ES") {
      language = "Spanish";
    } else if (language === "FR") {
      language = "French";
    } else if (language === "DE") {
      language = "German";
    } else if (language === "EN") {
      language = "English";
    }
    const description = requestBody?.description;
    const bookTone = requestBody?.bookTone || "mysterious";
    const genre = requestBody?.genre || "fantasy";
    const storyLength = requestBody?.storyLength || "medium";
    const perspective = requestBody?.perspective || "first-person";
    const prompt = `Create a book cover description in JSON format for this dream, following these strict language rules:
    - For title, subtitle, theme, and mood: Use ${language} ONLY
    - For all other fields: Use English ONLY
    
    Required JSON structure:
    {
      "title": "${language} title ",
      "subtitle": "${language} subtitle ",
      "theme": "${language} main theme",
      "mood": "${language} emotional tone",
      "coverImagePrompt": "Concise English prompt with:
        - ${bookTone} atmosphere
        - ${genre} elements
        - ${perspective} viewpoint
        - ${storyLength} format
        - Dreamlike qualities",
      "dominantColors": ["2-3 colors matching mood"],
      "fontStyle": "Font recommendation"
    }
    
    Style requirements:
    - ${bookTone} tone throughout
    - ${genre} dream theme
    - ${storyLength} appropriate
    - Surreal, dreamlike quality
    
    Dream Description: ${description}
    
    Respond with ONLY the JSON object. NO additional text.`;
    console.log("Language : ", language);
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
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topP: 0.8,
      },
    });
    const response = await result.response.text();

    // Clean up the response to ensure valid JSON
    const cleanedResponse = response
      .replace(/```json\s*/g, "") // Remove ```json
      .replace(/```\s*$/g, "") // Remove closing ```
      .trim(); // Remove any extra whitespace

    // Validate JSON before sending
    try {
      JSON.parse(cleanedResponse);
      return NextResponse.json({ response: cleanedResponse });
    } catch (jsonError) {
      console.error("Invalid JSON received from Gemini:", cleanedResponse);
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
