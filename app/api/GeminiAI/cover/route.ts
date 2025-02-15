import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Constants for retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Type definitions for better type safety
interface RequestBody {
  language?: string;
  description?: string;
  bookTone?: string;
  genre?: string;
  storyLength?: string;
  perspective?: string;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to normalize language codes
const normalizeLanguage = (code: string): string => {
  const languageMap: Record<string, string> = {
    AR: "Arabic",
    ES: "Spanish",
    FR: "French",
    DE: "German",
    EN: "English",
  };
  return languageMap[code] || code;
};

export async function POST(req: Request) {
  try {
    const GeminiAPI = process.env.GEMINI_API_KEY;

    if (!GeminiAPI) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const requestBody: RequestBody = await req.json();

    // Input validation
    if (!requestBody.description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const {
      language = "EN",
      description,
      bookTone = "mysterious",
      genre = "fantasy",
      storyLength = "medium",
      perspective = "first-person",
    } = requestBody;

    const normalizedLanguage = normalizeLanguage(language);

    const genAI = new GoogleGenerativeAI(GeminiAPI);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `Create a book cover description in JSON format for this dream, following these strict language rules:
    - For title, subtitle, theme, and mood: Use ${normalizedLanguage} ONLY
    - For all other fields: Use English ONLY
    
    Required JSON structure:
    {
      "title": "${normalizedLanguage} title ",
      "subtitle": "${normalizedLanguage} subtitle ",
      "theme": "${normalizedLanguage} main theme",
      "mood": "${normalizedLanguage} emotional tone",
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

    // Implement retry logic with exponential backoff
    let lastError: any;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            topP: 0.8,
          },
        });

        const response = await result.response.text();
        const cleanedResponse = response
          .replace(/```json\s*/g, "")
          .replace(/```\s*$/g, "")
          .trim();

        // Validate JSON
        const parsedJson = JSON.parse(cleanedResponse);
        return NextResponse.json({ response: cleanedResponse });
      } catch (error: any) {
        lastError = error;

        // Check if it's a 503 error or other retryable error
        if (error?.status === 503 || error?.message?.includes("overloaded")) {
          const waitTime = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
          console.log(
            `Attempt ${attempt + 1} failed, retrying in ${waitTime}ms`
          );
          await delay(waitTime);
          continue;
        }

        // If it's not a retryable error, throw immediately
        throw error;
      }
    }

    // If we've exhausted all retries
    console.error("Max retries reached:", lastError);
    return NextResponse.json(
      {
        error: "Service temporarily unavailable after multiple retries",
        details: lastError?.message,
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Error in API:", error);

    // Return appropriate status codes based on error type
    const status = error?.status || 500;
    const message = error?.message || "Error generating content";

    return NextResponse.json({ error: message }, { status });
  }
}
