// api/dreams/soundEffect/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Types for better error handling
interface FreesoundResult {
  id: string;
  name: string;
  description: string;
  duration: number;
}

interface FreesoundResponse {
  results: FreesoundResult[];
}

interface FreesoundSoundDetails {
  previews: {
    "preview-hq-mp3": string;
  };
}

// Utility function to handle Freesound API calls with retries
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "User-Agent": "YourApp/1.0",
        },
      });

      if (response.ok) return response;

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        await new Promise((resolve) =>
          setTimeout(resolve, parseInt(retryAfter || "5") * 1000)
        );
        continue;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  throw lastError || new Error("Failed after max retries");
}

async function searchFreesound(
  query: string,
  apiKey: string
): Promise<string | null> {
  try {
    const searchUrl = new URL("https://freesound.org/apiv2/search/text/");
    searchUrl.searchParams.append("query", query);
    searchUrl.searchParams.append("fields", "id,name,description,duration");
    searchUrl.searchParams.append("token", apiKey);

    const response = await fetchWithRetry(searchUrl.toString());
    const data = (await response.json()) as FreesoundResponse;

    return data.results[0]?.id || null;
  } catch (error) {
    console.error("Freesound search error:", error);
    return null;
  }
}

async function getSoundById(
  id: string,
  apiKey: string
): Promise<string | null> {
  try {
    const soundUrl = `https://freesound.org/apiv2/sounds/${id}/?token=${apiKey}`;
    const response = await fetchWithRetry(soundUrl);
    const data = (await response.json()) as FreesoundSoundDetails;

    return data.previews["preview-hq-mp3"] || null;
  } catch (error) {
    console.error("Freesound get sound error:", error);
    return null;
  }
}

// Cached fallback sounds for different categories
const FALLBACK_SOUNDS = {
  ambient: "https://freesound.org/data/previews/000/000/001-hq.mp3",
  nature: "https://freesound.org/data/previews/000/000/002-hq.mp3",
  default: "https://freesound.org/data/previews/000/000/003-hq.mp3",
};

export async function POST(req: Request) {
  try {
    const GeminiAPI = process.env.GEMINI_API_KEY;
    const FREESOUND_API_KEY = process.env.FREESOUND_API_KEY;
    console.log("API Keys:", {
      gemini: !!process.env.GEMINI_API_KEY,
      freesound: !!process.env.FREESOUND_API_KEY,
    });
    if (!GeminiAPI || !FREESOUND_API_KEY) {
      throw new Error("Missing required API keys");
    }

    const genAI = new GoogleGenerativeAI(GeminiAPI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const requestBody = await req.json();

    if (!requestBody.description?.trim()) {
      return NextResponse.json(
        { error: "Page description is required" },
        { status: 400 }
      );
    }

    // Try to get AI-generated sound suggestion with timeout
    const searchTermPromise = Promise.race([
      model.generateContent(
        `Based on this story page description, suggest a specific sound effect that would enhance the atmosphere. Focus on natural sounds, ambient effects, or relevant environmental audio. Only return the search term, nothing else. Description: ${requestBody.description}`
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), 5000)
      ),
    ]);

    let searchTerm;
    try {
      const result = await searchTermPromise;
      searchTerm = (result as any).response.text();
    } catch (error) {
      console.warn("Failed to get AI suggestion, using fallback:", error);
      searchTerm = "ambient background";
    }

    // Search Freesound with the term
    const soundId = await searchFreesound(searchTerm, FREESOUND_API_KEY);

    if (!soundId) {
      return NextResponse.json({
        success: true,
        soundUrl: FALLBACK_SOUNDS.default,
        note: "Using fallback sound",
      });
    }

    // Get sound URL
    const soundUrl = await getSoundById(soundId, FREESOUND_API_KEY);

    if (!soundUrl) {
      return NextResponse.json({
        success: true,
        soundUrl: FALLBACK_SOUNDS.default,
        note: "Using fallback sound",
      });
    }
    console.log("suggesting sound effect:", searchTerm);
    console.log("Sound effect:", soundUrl);
    return NextResponse.json({
      success: true,
      searchTerm,
      soundUrl,
    });
  } catch (error) {
    console.error("Sound effect API error:", error);

    // Always return a valid response with a fallback sound
    return NextResponse.json({
      success: true,
      soundUrl: FALLBACK_SOUNDS.default,
      note: "Using fallback sound due to error",
    });
  }
}
