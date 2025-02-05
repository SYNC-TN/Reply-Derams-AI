"use client";
import React, { useState, useCallback, useEffect } from "react";
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
import ShareBook from "./share";
import DreamTags from "./Tags";
import SoundEffectBtn from "./SoundEffectBtn";

interface CreateDreamFormProps {
  onClose: () => void;
}

interface Page {
  pageNumber: number;
  imagePrompt: string;
  soundEffect: string;
  text: string;
}

interface GeneratedPage {
  text: string;
  imageUrl: string;
  soundEffect: string;
}

interface CoverData {
  coverImagePrompt: string;
  coverImageUrl: string;
  dominantColors: string[];
  fontStyle: string;
  mood: string;
  subtitle: string;
  theme: string;
  title: string;
}

interface DreamFormData {
  description: string;
  artStyle: string;
  share: boolean;
  soundEffect: boolean;
  tags: Tag[];
  language: string;
  bookTone: string;
  storyLength: string;
  perspective: string;
  genre: string;
  pages: GeneratedPage[];
  coverData: CoverData;
}
interface Tag {
  id: number;
  name: string;
  label: string;
  value: string;
}
const RATE_LIMIT_DELAY = 1000;
const MAX_RETRIES = 3;
function DreamFormContent({ onClose }: CreateDreamFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storyPages, setStoryPages] = useState<Page[]>([]);
  const [coverData, setCoverData] = useState<CoverData | null>(null);
  const {
    description,
    artStyle,
    language,
    share,
    soundEffect,
    tags,
    bookTone,
    storyLength,
    perspective,
    genre,
  } = useBookData() || {
    description: "",
    artStyle: "",
    language: "",
    share: false,
    soundEffect: false,
    tags: [],
    bookTone: "",
    storyLength: "",
    perspective: "",
    genre: "",
  };

  useEffect(() => {
    if (isGenerating) {
      console.log("Toast :Your Story still generating!");
      toast({
        title: "Your Story still generating!",
      });
    }
    if (progress === 100) {
      toast({
        title: "Your Story has been created!",
      });
    }
  }, [isGenerating]);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const resizeImage = async (url: string, width: number, height: number) => {
    const img = new Image();
    img.src = url;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg");
  };
  const generateSoundEffect = async (
    description: String,
    story: any,
    retryCount = 0
  ) => {
    if (!soundEffect) return ""; // Return empty string when sound effects are disabled

    try {
      const response = await fetch("/api/dreams/soundEffect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageDescription: description,
          storyDescription: story,
        }),
      });

      if (!response.ok) {
        if (retryCount < MAX_RETRIES) {
          await delay(RATE_LIMIT_DELAY * (retryCount + 1));
          return generateSoundEffect(description, story, retryCount + 1);
        }
        return "https://freesound.org/data/previews/000/000/001-hq.mp3";
      }

      const data = await response.json();
      if (!data.soundUrl) {
        return "https://freesound.org/data/previews/000/000/001-hq.mp3";
      }

      return data.soundUrl;
    } catch (error) {
      console.error("Sound effect generation error:", error);
      if (retryCount < MAX_RETRIES) {
        await delay(RATE_LIMIT_DELAY * (retryCount + 1));
        return generateSoundEffect(description, story, retryCount + 1);
      }
      return "https://freesound.org/data/previews/000/000/001-hq.mp3";
    }
  };

  const generateImage = async (prompt: string, retryCount = 0) => {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }

    try {
      // First, generate the image using Stability AI
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
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          const retryAfter = errorData?.retryAfter || 60;
          await delay(retryAfter * 1000);
          return generateImage(prompt, retryCount + 1);
        }
        throw new Error(
          `Failed to generate image: ${errorData?.error || response.statusText}`
        );
      }

      const data = await response.json();

      // Then, upload the generated image to Cloudinary
      const cloudinaryResponse = await fetch("/api/dreams/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: data.image,
          path: "ReplayDreamsImages",
          width: 1024,
          height: 1024,
        }),
      });

      if (!cloudinaryResponse.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const cloudinaryData = await cloudinaryResponse.json();
      return cloudinaryData.url;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await delay(RATE_LIMIT_DELAY * (retryCount + 1));
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
    if (share && tags.length === 0) {
      toast({
        title: "Error",
        description: "Please provide at least one tag for your dream",
        variant: "destructive",
      });
      return;
    }

    const toastId = toast({
      title: "Processing",
      description: "Your book still generating...",
      duration: Infinity,
    });

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
      // Generate story and cover
      const [storyResponse, coverResponse] = await Promise.all([
        fetch("/api/GeminiAI", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            language,
            storyLength,
            genre,
            perspective,
            bookTone,
          }),
        }),
        fetch("/api/GeminiAI/cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            language,
            storyLength,
            genre,
            perspective,
            bookTone,
          }),
        }),
      ]);

      if (!coverResponse.ok || !storyResponse.ok) {
        throw new Error("Failed to generate story or cover");
      }

      // Process cover data
      const coverResult = await coverResponse.json();
      const parsedCoverData: CoverData = JSON.parse(coverResult.response);
      const coverImageUrl = await generateImage(
        parsedCoverData.coverImagePrompt
      );

      const finalCoverData: CoverData = {
        ...parsedCoverData,
        coverImageUrl,
        dominantColors: parsedCoverData.dominantColors || ["default"],
        fontStyle: parsedCoverData.fontStyle || "default",
        mood: parsedCoverData.mood || "neutral",
        subtitle: parsedCoverData.subtitle || "",
        theme: parsedCoverData.theme || "default",
        title: parsedCoverData.title || description.slice(0, 30),
      };

      setCoverData(finalCoverData);

      // Process story data
      const storyResult = await storyResponse.json();
      const parsedPages: Page[] = JSON.parse(storyResult.response);

      if (!Array.isArray(parsedPages) || parsedPages.length === 0) {
        throw new Error("Invalid story structure generated");
      }

      setStoryPages(parsedPages);
      const storyString: any = parsedPages.map((page) => page.text).join(" ");

      // Generate page content sequentially with proper progress tracking
      const generatedPages: GeneratedPage[] = [];
      const totalSteps = parsedPages.length;

      for (let i = 0; i < parsedPages.length; i++) {
        // Generate image and sound effect concurrently for each page
        const [imageUrl, pageSoundEffect] = await Promise.all([
          generateImage(parsedPages[i].imagePrompt),
          generateSoundEffect(parsedPages[i].text, storyString),
        ]);

        generatedPages.push({
          text: parsedPages[i].text,
          imageUrl,
          soundEffect: pageSoundEffect, // This will be either a URL or empty string
        });

        updateProgress(i + 1, totalSteps);
      }

      // Prepare final form data
      const formData: DreamFormData = {
        description,
        artStyle: artStyle || "realistic",
        language: language || "en",
        share: share || false,
        soundEffect: soundEffect || false,
        tags: tags || [],
        pages: generatedPages,
        coverData: finalCoverData,
        bookTone: bookTone || "neutral",
        storyLength: storyLength || "medium",
        perspective: perspective || "first-person",
        genre: genre || "fantasy",
      };

      // Save dream
      const saveResponse = await fetch("/api/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save dream book");
      }

      const result = await saveResponse.json();

      if (saveResponse.ok) {
        toastId.dismiss();
        toast({
          title: "Success",
          description: "Your book is ready to read",
          duration: 2000,
        });
      }

      if (!result.data?.url) {
        throw new Error("Invalid response from server");
      }

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
      <div className="m-auto  w-full max-w-3xl space-y-4">
        <SoundEffectBtn />
        <DescriptionDream />
        <LanguageSelect />
        <ArtStyle />
        <AdvancedOptions />
        {share && <DreamTags />}

        <div className="space-y-4 mt-5 w-full max-w-3xl">
          <div className="flex justify-end space-x-4">
            <ShareBook />
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
                  <span>Creating Dream Bok ({progress}%)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Generate</span>
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
