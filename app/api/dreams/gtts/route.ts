import Gtts from "gtts";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body.text;
    const lang = body.lang || "en"; // Convert "us" to "en"
    const speed = body.speed || 1.1; // New speed parameter

    if (!text) {
      return new Response("Text is required", { status: 400 });
    }

    // Create a new GTTS instance
    const gtts = new Gtts(text, lang);

    // Convert GTTS stream to Buffer
    const chunks: Array<Uint8Array> = [];
    const audioData = await new Promise<Buffer>((resolve, reject) => {
      const stream = gtts.stream();
      stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "x-playback-rate": speed.toString(), // Add speed as a header
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error processing text to speech", { status: 500 });
  }
}
