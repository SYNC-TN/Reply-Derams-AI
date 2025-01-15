// components/Generate.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

interface DreamPage {
  text: string;
  imageUrl: string;
}

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
const MAX_RETRIES = 3;

const Generate = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const LoadDream = localStorage.getItem("Dream")
    ? JSON.parse(localStorage.getItem("Dream") as string)
    : null;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const generatePage = async (
    prompt: string,
    retryCount = 0
  ): Promise<DreamPage> => {
    try {
      // Add delay for rate limiting
      await delay(RATE_LIMIT_DELAY);
      const imageResponse = await fetch("/api/stabilityAI/realistic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (imageResponse.status === 429 && retryCount < MAX_RETRIES) {
        // If rate limited, wait longer and retry
        toast({
          title: "Rate limited",
          description: `Waiting before retry attempt ${
            retryCount + 1
          }/${MAX_RETRIES}...`,
          duration: 10000,
        });
        await delay(RATE_LIMIT_DELAY * (retryCount + 1));
        return generatePage(prompt, retryCount + 1);
      }

      if (!imageResponse.ok) {
        throw new Error(
          `Failed to generate image: ${imageResponse.statusText}`
        );
      }

      const imageData = await imageResponse.json();

      return {
        text: prompt, // Replace with actual text generation
        imageUrl: imageData.image,
      };
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        toast({
          title: "Retrying",
          description: `Error occurred, retrying (${
            retryCount + 1
          }/${MAX_RETRIES})...`,
          duration: 3000,
        });
        await delay(RATE_LIMIT_DELAY * (retryCount + 1));
        return generatePage(prompt, retryCount + 1);
      }
      throw error;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      const dreamId = uuidv4();
      const pages: DreamPage[] = [];

      // Sample prompts - replace with your form data
      const prompts = [
        "A magical forest with glowing butterflies and floating crystals",
        "An ancient castle in the clouds with rainbow bridges",
        "A mystical underwater city with glowing jellyfish",
        "A hidden temple in the jungle with golden statues",
        "A futuristic cityscape with flying cars and neon lights",
      ];

      for (let i = 0; i < prompts.length; i++) {
        try {
          const page = await generatePage(prompts[i]);
          pages.push(page);
          setProgress(((i + 1) / prompts.length) * 100);

          toast({
            title: "Progress",
            description: `Generated page ${i + 1} of ${prompts.length}`,
            duration: 2000,
          });
        } catch (error) {
          console.error(`Error generating page ${i + 1}:`, error);
          toast({
            title: "Error",
            description: `Failed to generate page ${
              i + 1
            }. Continuing with remaining pages...`,
            duration: 3000,
            variant: "destructive",
          });
        }
      }

      if (pages.length === 0) {
        throw new Error("Failed to generate any pages");
      }

      // Save the dream book
      const response = await fetch(
        "http://localhost/php/p2/restapi/api.php/dreams",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: dreamId.toString(),
            title: "Your Fantasy Dream Journey",
            description: "A magical story of your dream",
            artStyle: "fantasy",
            language: "en",
            pages: JSON.stringify(pages),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save dream book");
      }

      toast({
        title: "Success",
        description: "Your dream book has been created!",
        duration: 3000,
      });

      router.push(`/dreams/${dreamId}`);
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate dream");

      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to generate dream",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 relative group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Dream Book ({Math.round(progress)}%)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Generate Dream Book</span>
            </>
          )}
        </span>
      </Button>

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {isGenerating && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Generate;
