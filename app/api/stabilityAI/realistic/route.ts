import { NextResponse } from "next/server";
import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 10;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 5; // Increased from 3 to 5
const SERVICE_UNAVAILABLE_RETRY_DELAY = 5000; // 5 seconds wait for 503 errors

// Queue to track API requests
let requestQueue: { timestamp: number }[] = [];

function canMakeRequest(): boolean {
  const now = Date.now();
  requestQueue = requestQueue.filter(
    (request) => now - request.timestamp < RATE_LIMIT_WINDOW
  );
  return requestQueue.length < MAX_REQUESTS_PER_WINDOW;
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeRequestWithRetry(
  url: string,
  payload: any,
  headers: any,
  retryCount = 0
): Promise<any> {
  try {
    while (!canMakeRequest()) {
      console.log("Rate limit reached, waiting...");
      await wait(RATE_LIMIT_WINDOW / MAX_REQUESTS_PER_WINDOW);
    }

    requestQueue.push({ timestamp: Date.now() });

    const response = await axios.post(url, payload, {
      headers,
      responseType: "arraybuffer",
      timeout: 30000, // 30 second timeout
    });

    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // Handle specific error cases
      if (status === 503) {
        if (retryCount < MAX_RETRIES) {
          console.log(
            `Service unavailable (503), retrying in ${SERVICE_UNAVAILABLE_RETRY_DELAY}ms...`
          );
          await wait(SERVICE_UNAVAILABLE_RETRY_DELAY);
          return makeRequestWithRetry(url, payload, headers, retryCount + 1);
        }
      } else if (status === 429) {
        if (retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          console.log(
            `Rate limited (429), retrying in ${delay}ms (attempt ${
              retryCount + 1
            }/${MAX_RETRIES})`
          );
          await wait(delay);
          return makeRequestWithRetry(url, payload, headers, retryCount + 1);
        }
      }

      // Add more specific error handling
      const errorMessage = error.response?.data
        ? Buffer.from(error.response.data).toString()
        : error.message;

      throw new Error(`API request failed: ${status} - ${errorMessage}`);
    }
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    console.log("Starting storyboard sketch API request processing");

    const requestBody = await req.json();
    const prompt = requestBody?.prompt as string;

    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!HUGGINGFACE_API_KEY) {
      console.error("Missing HUGGINGFACE_API_KEY");
      return NextResponse.json(
        { error: "HUGGINGFACE_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    console.log(
      "Making request to Hugging Face with stable-diffusion-xl-base-1.0",
      prompt
    );

    const response = await makeRequestWithRetry(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      { inputs: prompt },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      }
    );

    if (response.status === 200) {
      const base64Image = Buffer.from(response.data).toString("base64");
      console.log("Image generated successfully");

      return NextResponse.json({
        image: `data:image/jpeg;base64,${base64Image}`,
      });
    }

    throw new Error(
      `API returned unexpected response. Status: ${response.status}`
    );
  } catch (error: any) {
    console.error("Error generating sketch:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status || 500;
      const errorMessage =
        typeof responseData === "string"
          ? responseData
          : responseData
          ? Buffer.from(responseData).toString()
          : error.message;

      return NextResponse.json(
        {
          error: "Failed to generate sketch",
          details: errorMessage,
          retryAfter: error.response?.headers?.["retry-after"],
          status: statusCode,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate sketch",
        details: error.message,
        status: 500,
      },
      { status: 500 }
    );
  }
}
