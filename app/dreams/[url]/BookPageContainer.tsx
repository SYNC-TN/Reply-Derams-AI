import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  StopCircle,
} from "lucide-react";
import BookPage from "./BookPage";
import useSound from "use-sound";
import BookNavigation from "./BookNavigation";

interface DreamBookContainerProps {
  book: { pages: { text: string; image: string }[] };
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function DreamBookContainer({
  book,
  currentPage,
  onPageChange,
}: DreamBookContainerProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isReading, setIsReading] = useState(false);
  const [autoTurnEnabled, setAutoTurnEnabled] = useState(
    localStorage.getItem("isReading") === "true" ? true : false
  );
  const [playFlipSound] = useSound("/page-flip.mp3", { volume: 0.3 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isReadingRef = useRef(false);
  const autoReadingRef = useRef(false);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextPageRef = useRef<number>(currentPage);
  const isFlippingRef = useRef(false);
  const StoreReadingStats = localStorage.setItem(
    "isReading",
    autoTurnEnabled.toString()
  );

  useEffect(() => {
    if (localStorage.getItem("isReading")) {
      console.log("autoRead is set to: ", localStorage.getItem("isReading"));
      setAutoTurnEnabled(
        localStorage.getItem("isReading") === "true" ? true : false
      );
    }
  }, []);
  const pageVariants = {
    enter: (direction: "next" | "prev") => ({
      transform: `perspective(1500px) translateY(${
        direction === "next" ? 180 : -180
      }deg)`,
      opacity: 0,
    }),
    center: {
      transform: "perspective(1500px) translateY(0deg)",
      opacity: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        bounce: 0.2,
      },
    },
    exit: (direction: "next" | "prev") => ({
      transform: `perspective(1500px) translateY(${
        direction === "next" ? -180 : 180
      }deg)`,
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  const stopReading = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
    }
    setIsReading(false);
    console.log("autoTurnEnabled status is set to: ", autoTurnEnabled);
    localStorage.setItem("isReading", autoTurnEnabled.toString());
    isReadingRef.current = false;
    autoReadingRef.current = false;
  };

  const startReading = async (
    autoReading = false,
    pageToRead = currentPage
  ) => {
    try {
      setIsReading(true);
      isReadingRef.current = true;
      autoReadingRef.current = autoReading;

      const response = await fetch("/api/dreams/voiceAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: book.pages[pageToRead].text }),
      });

      if (!response.ok) throw new Error("Failed to get audio");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (!isReadingRef.current) {
        URL.revokeObjectURL(audioUrl);
        return;
      }

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          stopReading();
        });
      }
    } catch (error) {
      console.error("Error getting audio:", error);
      stopReading();
    }
  };

  const flipPage = (newDirection: "next" | "prev") => {
    if (isFlippingRef.current) return;

    const newPage =
      newDirection === "next"
        ? Math.min(currentPage + 1, book.pages.length - 1)
        : Math.max(currentPage - 1, 0);

    if (
      (currentPage === 0 && newDirection === "prev") ||
      (currentPage === book.pages.length - 1 && newDirection === "next")
    ) {
      return;
    }

    isFlippingRef.current = true;
    setIsFlipping(true);
    setDirection(newDirection);
    playFlipSound();
    onPageChange(newPage);

    setTimeout(() => {
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, 800);
  };

  useEffect(() => {
    audioRef.current = new Audio();
    nextPageRef.current = currentPage;

    const handleAudioEnd = async () => {
      if (autoTurnEnabled && nextPageRef.current < book.pages.length - 1) {
        const nextPage = nextPageRef.current + 1;
        const wasAutoReading = autoReadingRef.current;

        // Stop current reading
        stopReading();

        // Clear any existing timeout
        if (flipTimeoutRef.current) {
          clearTimeout(flipTimeoutRef.current);
        }

        // Flip the page first
        flipPage("next");

        // Update nextPageRef after flipping
        nextPageRef.current = nextPage;

        // Start reading the next page after the flip animation
        if (wasAutoReading) {
          setTimeout(() => {
            if (!isReadingRef.current) {
              startReading(true, nextPage);
            }
          }, 800);
        }
      } else {
        stopReading();
      }
    };

    audioRef.current.addEventListener("ended", handleAudioEnd);

    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd);
        stopReading();
      }
    };
  }, [currentPage, autoTurnEnabled]);

  // Update nextPageRef when currentPage changes
  useEffect(() => {
    nextPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && !isFlippingRef.current) flipPage("prev");
      if (e.key === "ArrowRight" && !isFlippingRef.current) flipPage("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  return (
    <div className="relative w-full h-full md:scale-90 max-md:h-[calc(70vh)] z-50 overflow-visible">
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={() => {
            if (isReading) {
              stopReading();
            } else {
              startReading(true, currentPage);
            }
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300
        ${
          isReading
            ? "bg-red-500/20 hover:bg-red-500/30"
            : "bg-white/10 hover:bg-white/20"
        } 
        border border-white/30 shadow-lg`}
        >
          {isReading ? (
            <Pause className="w-6 h-6 text-white " />
          ) : (
            <Play className="w-6 h-6 text-white " />
          )}
        </button>

        <button
          onClick={() => setAutoTurnEnabled(!autoTurnEnabled)}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 
        ${
          autoTurnEnabled
            ? "bg-white/10 hover:bg-white/20"
            : "bg-yellow-500/20 hover:bg-yellow-500/30"
        } 
        border border-white/30 shadow-lg`}
        >
          <StopCircle className="w-6 h-6 text-white" />
        </button>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 "
          style={{
            transformStyle: "preserve-3d",
            transformOrigin:
              direction === "next" ? "left center" : "right center",
          }}
        >
          <BookPage
            text={book.pages[currentPage].text}
            imageUrl={book.pages[currentPage].image}
            pageNumber={currentPage + 1}
            totalPages={book.pages.length}
            isMobile={window.innerWidth < 768}
          />
        </motion.div>
      </AnimatePresence>

      <BookNavigation
        currentPage={currentPage}
        totalPages={book.pages.length}
        onNavigate={flipPage}
        isFlipping={isFlipping}
        isReading={isReading}
      />
    </div>
  );
}
