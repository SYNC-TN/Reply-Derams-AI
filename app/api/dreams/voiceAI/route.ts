import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body.text;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ElevenLabsId as string;

    const client = new ElevenLabsClient({ apiKey: apiKey });

    // Get the audio stream
    const audioStream = await client.textToSpeech.convert(voiceId, {
      output_format: "mp3_44100_128",
      text: text,
      model_id: "eleven_multilingual_v2",
    });

    // Convert the Readable stream to ArrayBuffer
    const chunks: Array<Uint8Array> = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioData = Buffer.concat(chunks);

    // Return the audio data with appropriate headers
    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error processing text to speech", { status: 500 });
  }
}
