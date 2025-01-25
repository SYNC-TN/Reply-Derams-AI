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
    const prompt = `I want you to create a book cover description in JSON format based on a dream description.

The JSON structure should include:
  title: A captivating title for the dream story (20 characters max).
  subtitle: A brief subtitle that adds context (30 characters max).
  coverImagePrompt: A detailed prompt to generate the cover image that incorporates:
    - The ${bookTone} tone and atmosphere
    - The ${genre} dream theme
    - Dreamlike and surreal imagery fitting the selected mood
    - Visual elements that reflect the story's emotional journey
    - A style that matches the ${storyLength} format
    - the story perspective is ${perspective}
  mood: The emotional tone should reflect the selected ${bookTone} atmosphere
  theme: The main theme should align with the chosen ${genre} category
  dominantColors: An array of 2-3 colors that:
    - Match the ${bookTone} mood
    - Complement the ${genre} theme
    - Create a dreamlike atmosphere
  fontStyle: Suggested font style that:
    - Matches the ${bookTone} tone
    - Complements the ${genre} theme
    - Maintains readability and impact

Use ${language} for the title, subtitle, theme, and mood fields only. All other fields should be in English.
ALSO :DONT MAKE THE PROMPT TOO LONG . 

Additional style guidance:
- Maintain the ${bookTone} atmosphere throughout the design
- Ensure the imagery reflects the ${genre} dream theme
- Consider the ${storyLength} format for composition
- Create a cohesive visual narrative

Respond ONLY with the JSON object, no additional text or markdown formatting.

Dream Description: ${description}`;
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
