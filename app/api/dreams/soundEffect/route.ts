import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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

async function getAISoundTerm(
  model: {
    generateContent: (
      prompt: string
    ) => Promise<{ response: { text: () => string } }>;
  },
  storyDescription: string = "",
  pageDescription: string = "",
  attempt: number = 1
): Promise<string> {
  const prompts = [
    // First attempt - specific sound
    `Given the following story description: "${storyDescription}" and page description: "${pageDescription}", suggest a specific sound effect that would enhance the atmosphere of this dream. Focus on natural sounds, ambient effects, or relevant environmental audio. Only return the search term, nothing else.`,

    // Second attempt - broader interpretation
    `Based on the scene: Story: "${storyDescription}" Page: "${pageDescription}", suggest an alternative sound effect that captures the mood or environment. Consider broader ambient sounds or atmospheric effects. Only return the search term, nothing else.`,

    // Third attempt - most general
    `For this scene: Story: "${storyDescription}" Page: "${pageDescription}", suggest a basic ambient sound that would work as background audio. Focus on versatile environmental sounds. Only return the search term, nothing else.`,
  ];

  try {
    const result = await Promise.race([
      model.generateContent(prompts[attempt - 1]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), 5000)
      ),
    ]);
    const aiResult = result as { response: { text: () => string } };
    return aiResult.response.text();
  } catch (error) {
    console.warn(`AI suggestion attempt ${attempt} failed:`, error);
    return "ambient background";
  }
}

const FALLBACK_SOUNDS = {
  ambient: "https://freesound.org/data/previews/000/000/001-hq.mp3",
  nature: "https://freesound.org/data/previews/000/000/002-hq.mp3",
  default: "https://freesound.org/data/previews/000/000/003-hq.mp3",
};

export async function POST(req: Request) {
  try {
    const GeminiAPI = process.env.GEMINI_API_KEY;
    const FREESOUND_API_KEY = process.env.FREESOUND_API_KEY;

    if (!GeminiAPI || !FREESOUND_API_KEY) {
      throw new Error("Missing required API keys");
    }

    const genAI = new GoogleGenerativeAI(GeminiAPI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const requestBody = await req.json();
    const pageDescription = requestBody.pageDescription;
    const storyDescription = requestBody.storyDescription;

    console.log("Page description:", pageDescription);
    console.log("Story description:", storyDescription);

    if (!storyDescription?.trim() && !pageDescription?.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Try up to 3 different AI-generated terms
    for (let attempt = 1; attempt <= 3; attempt++) {
      const searchTerm = await getAISoundTerm(
        model,
        storyDescription,
        pageDescription,
        attempt
      );

      console.log(`Attempt ${attempt} search term:`, searchTerm);

      const soundId = await searchFreesound(searchTerm, FREESOUND_API_KEY);

      if (soundId) {
        const soundUrl = await getSoundById(soundId, FREESOUND_API_KEY);

        if (soundUrl) {
          console.log(`Found sound on attempt ${attempt}:`, soundUrl);
          return NextResponse.json({
            success: true,
            searchTerm,
            soundUrl,
            attempt,
          });
        }
      }

      console.log(
        `Attempt ${attempt} failed to find sound, trying next term...`
      );
    }

    // If all attempts fail, use fallback
    console.log("All attempts failed, using fallback sound");
    return NextResponse.json({
      success: true,
      soundUrl: FALLBACK_SOUNDS.default,
      note: "Using fallback sound after all attempts failed",
    });
  } catch (error) {
    console.error("Sound effect API error:", error);
    return NextResponse.json({
      success: true,
      soundUrl: FALLBACK_SOUNDS.default,
      note: "Using fallback sound due to error",
    });
  }
}
