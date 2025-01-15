"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import ArtStyle from "./ArtStyle";
import AdvancedOptions from "./AdvancedOptions";
import LanguageSelect from "./LanguageSelect";
import DescriptionDream from "./DescriptionDream";
import { BookDataProvider, useBookData } from "./BookData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import "./CreateForm.css";

interface CreateDreamFormProps {
  onClose: () => void;
}

interface Page {
  pageNumber: number;
  imagePrompt: string;
  text: string;
}

interface GeneratedPage {
  text: string;
  imageUrl: string;
}

const RATE_LIMIT_DELAY = 1000;
const MAX_RETRIES = 3;

function DreamFormContent({ onClose }: CreateDreamFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storyPages, setStoryPages] = useState<Page[]>([]);

  const {
    description,
    artStyle,
    language,
    colorTheme,
    imageStyleStrength,
    imageResolution,
  } = useBookData() || {
    description: "",
    artStyle: "",
    language: "",
    colorTheme: "",
    imageStyleStrength: "",
    imageResolution: "",
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const generateImage = async (prompt: string, retryCount = 0) => {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }

    try {
      const response = await fetch("/api/stabilityAI/" + artStyle, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        // If rate limited, wait and retry
        if (response.status === 429) {
          const retryAfter = errorData?.retryAfter || 60; // Default to 60 seconds if no retry-after header
          if (retryCount < MAX_RETRIES) {
            console.log(
              `Rate limited, retrying in ${retryAfter}s (attempt ${
                retryCount + 1
              }/${MAX_RETRIES})`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, retryAfter * 1000)
            );
            return generateImage(prompt, retryCount + 1);
          }
        }

        throw new Error(
          `Failed to generate image: ${errorData?.error || response.statusText}`
        );
      }

      const data = await response.json();
      return data.image;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying image generation (attempt ${retryCount + 1})`);
        await new Promise((resolve) =>
          setTimeout(resolve, RATE_LIMIT_DELAY * (retryCount + 1))
        );
        return generateImage(prompt, retryCount + 1);
      }
      throw error;
    }
  };

  const updateProgress = useCallback((current: number, total: number) => {
    const percentage = (current / total) * 100;
    setProgress(Math.min(Math.round(percentage), 100));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description for your dream",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // First, generate the story structure
      console.log("Sending language:", language);
      console.log("Request body:", JSON.stringify({ description, language }));
      const storyResponse = await fetch("/api/GeminiAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, language }),
      });

      if (!storyResponse.ok) {
        throw new Error(
          `Failed to generate story: ${storyResponse.statusText}`
        );
      }

      const storyData = await storyResponse.json();
      const parsedPages: Page[] = JSON.parse(storyData.response);
      console.log("Parsed pages:", parsedPages);

      if (!Array.isArray(parsedPages) || parsedPages.length === 0) {
        throw new Error("Invalid story structure generated");
      }

      setStoryPages(parsedPages);

      // Generate images for each page
      const generatedPages: GeneratedPage[] = [];

      for (let i = 0; i < parsedPages.length; i++) {
        try {
          updateProgress(i, parsedPages.length);
          const imageUrl = await generateImage(parsedPages[i].imagePrompt);
          generatedPages.push({
            text: parsedPages[i].text,
            imageUrl,
          });
        } catch (error) {
          console.error(`Failed to generate image for page ${i + 1}:`, error);
          throw new Error(
            `Failed to generate image for page ${i + 1}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      // Prepare and submit the final form data
      const formData = {
        description,
        artStyle: artStyle || "realistic",
        language: language || "en",
        colorTheme: colorTheme || "default",
        imageStyleStrength: imageStyleStrength || "medium",
        imageResolution: imageResolution || "512x512",
        pages: generatedPages,
      };

      const saveResponse = await fetch("/api/dreams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(formData),
      });

      const result = await saveResponse.json();

      if (!saveResponse.ok || !result.data?.url) {
        throw new Error(result.error || "Failed to save dream book");
      }

      toast({
        title: "Success",
        description: "Your dream book has been created!",
        duration: 3000,
      });

      await router.push(`/dreams/${result.data.url}`);
      onClose();
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to generate dream",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 createForm">
      <div className="m-auto">
        <DescriptionDream />
        <LanguageSelect />
        <ArtStyle />
        <AdvancedOptions />

        <div className="space-y-4">
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              className="border-blue-500/20 text-blue-100 hover:bg-blue-900/40"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isGenerating || !description.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Creating Dream Book ({progress}%)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Generate Dream Book</span>
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export function CreateDreamForm(props: CreateDreamFormProps) {
  return (
    <BookDataProvider>
      <DreamFormContent {...props} />
    </BookDataProvider>
  );
}

export default CreateDreamForm;
