import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, StopCircle } from "lucide-react";
import BookPage from "./BookPage";
import useSound from "use-sound";
import BookNavigation from "./BookNavigation";
import BackgroundAudioSlider from "./BackgroundAudioSlider";
import { useCallback } from "react";
interface DreamBookContainerProps {
  book: {
    pages: { text: string; image: string; soundEffect: string }[];
    share: boolean;
  };
  lang: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function DreamBookContainer({
  book,
  lang,
  currentPage,
  onPageChange,
}: DreamBookContainerProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isReading, setIsReading] = useState(false);
  const [autoTurnEnabled, setAutoTurnEnabled] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("isReading") === "true"
  );
  const [playFlipSound] = useSound("/page-flip.mp3", { volume: 0.3 });
  const [language, setLanguage] = useState("en");
  const [audioSliderValue, setAudioSliderValue] = useState(0.5);
  const [audioNarratorValue, setAudioNarratorValue] = useState(0.5);
  const [defaultAudioValue, setDefaultAudioValue] = useState(audioSliderValue);
  const [defaultAudioNarratorValue, setDefaultAudioNarratorValue] =
    useState(audioNarratorValue);
  const [audioNarratorSwitch, setAudioNarratorSwitch] = useState(false);
  const [audioEffectSwitch, setAudioEffectSwitch] = useState(false);

  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isReadingRef = useRef(false);
  const autoReadingRef = useRef(false);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextPageRef = useRef<number>(currentPage);
  const isFlippingRef = useRef(false);
  useEffect(() => {
    console.log("audio value", audioSliderValue);
  }, [audioSliderValue]);
  useEffect(() => {
    backgroundAudioRef.current = new Audio();
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
    };
  }, [lang]);
  useEffect(() => {
    if (backgroundAudioRef.current && audioRef.current) {
      backgroundAudioRef.current.volume = audioSliderValue;
      audioRef.current.volume = audioNarratorValue;
    }
  }, [audioSliderValue, audioNarratorValue]);

  const playBackgroundSound = useCallback(
    async (soundUrl: string) => {
      try {
        if (!backgroundAudioRef.current) return;

        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
        backgroundAudioRef.current.src = soundUrl;
        backgroundAudioRef.current.volume = audioSliderValue;
        backgroundAudioRef.current.loop = true;

        await backgroundAudioRef.current.play();
      } catch (error) {
        console.error("Error playing background sound:", error);
      }
    },
    [audioSliderValue]
  );
  useEffect(() => {
    if (lang) {
      setLanguage(lang);
    }
    if (typeof window !== "undefined" && localStorage.getItem("isReading")) {
      setAutoTurnEnabled(localStorage.getItem("isReading") === "true");
    }
  }, [lang]);

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

  const stopReading = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }

    setIsReading(false);
    if (typeof window !== "undefined" && localStorage) {
      localStorage.setItem("isReading", autoTurnEnabled.toString());
    }
    isReadingRef.current = false;
    autoReadingRef.current = false;
  }, [autoTurnEnabled]);

  const startReading = useCallback(
    async (autoReading = false, pageToRead = currentPage, speed = 1.1) => {
      try {
        setIsReading(true);
        isReadingRef.current = true;
        autoReadingRef.current = autoReading;

        const soundEffect = book.pages[pageToRead].soundEffect;
        if (soundEffect) {
          await playBackgroundSound(soundEffect);
        }

        const response = await fetch("/api/dreams/gtts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: book.pages[pageToRead].text,
            lang: language,
            speed,
          }),
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
          audioRef.current.volume = audioNarratorValue;
          audioRef.current.playbackRate = speed;
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Error getting audio:", error);
        stopReading();
      }
    },
    [
      book.pages,
      currentPage,
      language,
      audioNarratorValue,
      playBackgroundSound,
      stopReading,
    ]
  );

  const flipPage = useCallback(
    (newDirection: "next" | "prev") => {
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
    },
    [currentPage, book.pages.length, onPageChange, playFlipSound]
  );

  useEffect(() => {
    audioRef.current = new Audio();
    nextPageRef.current = currentPage;

    const handleAudioEnd = async () => {
      if (autoTurnEnabled && nextPageRef.current < book.pages.length - 1) {
        const nextPage = nextPageRef.current + 1;
        const wasAutoReading = autoReadingRef.current;

        stopReading();

        const timeoutId = flipTimeoutRef.current;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        flipPage("next");
        nextPageRef.current = nextPage;

        if (wasAutoReading) {
          const newTimeoutId = setTimeout(() => {
            if (!isReadingRef.current) {
              startReading(true, nextPage);
            }
          }, 800);
          flipTimeoutRef.current = newTimeoutId;
        }
      } else {
        stopReading();
      }
    };

    audioRef.current.addEventListener("ended", handleAudioEnd);

    return () => {
      const currentTimeout = flipTimeoutRef.current;
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd);
        stopReading();
      }
    };
  }, [
    currentPage,
    autoTurnEnabled,
    book.pages.length,
    flipPage,
    startReading,
    stopReading,
  ]);

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
  }, [flipPage]);
  const switchNarrator = useCallback(() => {
    setDefaultAudioNarratorValue(audioNarratorValue);
    setAudioNarratorSwitch((prev) => !prev);
    setAudioNarratorValue((prev) =>
      prev === 0 ? defaultAudioNarratorValue : 0
    );
  }, [audioNarratorValue, defaultAudioNarratorValue]);
  const switchEffect = useCallback(() => {
    setDefaultAudioValue(audioSliderValue);
    setAudioEffectSwitch((prev) => !prev);
    setAudioSliderValue((prev) => (prev === 0 ? defaultAudioValue : 0));
  }, [audioSliderValue, defaultAudioValue]);
  const HeadphonesSVG = () => {
    return (
      <button onClick={() => switchNarrator()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-6 h-6 ml-4  max-sm:translate-y-14  max-sm:ml-0"
        >
          {/* Headphone main part */}
          <path
            fill={!audioNarratorSwitch ? "#16ADE1" : `#ffffff`}
            d="M219.4,208.9c0,5-2,9.6-5.3,12.9c-3.3,3.3-7.9,5.3-12.9,5.3h-22.8c0.5,42.4,35.1,76.7,77.6,76.7    s77.1-34.2,77.6-76.7h-22.8c-10.1,0-18.2-8.2-18.2-18.2c0-5,2-9.6,5.3-12.9c3.3-3.3,7.9-5.3,12.9-5.3h22.8v-36.5h-22.8    c-10.1,0-18.2-8.2-18.2-18.2c0-5,2-9.6,5.3-12.9c3.3-3.3,7.9-5.3,12.9-5.3h22.8c-0.2-21.1-8.9-40.1-22.7-54    c-14-14-33.5-22.7-54.9-22.7c-42.6,0-77.1,34.2-77.6,76.7h22.8c10.1,0,18.2,8.2,18.2,18.2c0,5-2,9.6-5.3,12.9    c-3.3,3.3-7.9,5.3-12.9,5.3h-22.8v36.5h22.8C211.2,190.6,219.4,198.8,219.4,208.9z"
          />
          {/* Right inner circle */}
          <path
            fill="#1B3954"
            d="M354.7,197.7c-2.8,0-5,2.2-5,5s2.2,5,5,5c19.4,0,35.3-15.8,35.3-35.3s-15.8-35.3-35.3-35.3c-2.8,0-5,2.2-5,5    s2.2,5,5,5c13.9,0,25.3,11.3,25.3,25.3S368.7,197.7,354.7,197.7z"
          />
          {/* Left inner circle */}
          <path
            fill="#1B3954"
            d="M157.3,207.7c2.8,0,5-2.2,5-5s-2.2-5-5-5c-13.9,0-25.3-11.3-25.3-25.3s11.3-25.3,25.3-25.3c2.8,0,5-2.2,5-5    s-2.2-5-5-5c-19.4,0-35.3,15.8-35.3,35.3S137.8,207.7,157.3,207.7z"
          />
          {/* Right outer circle */}
          <path
            fill="#1B3954"
            d="M410.5,120c-2.8,0-5,2.2-5,5s2.2,5,5,5c23.4,0,42.4,19,42.4,42.4s-19,42.4-42.4,42.4c-2.8,0-5,2.2-5,5    s2.2,5,5,5c28.9,0,52.4-23.5,52.4-52.4S439.4,120,410.5,120z"
          />
          {/* Left outer circle */}
          <path
            fill="#1B3954"
            d="M106.5,219.8c0-2.8-2.2-5-5-5c-23.4,0-42.4-19-42.4-42.4s19-42.4,42.4-42.4c2.8,0,5-2.2,5-5s-2.2-5-5-5    c-28.9,0-52.4,23.5-52.4,52.4s23.5,52.4,52.4,52.4C104.3,224.8,106.5,222.5,106.5,219.8z"
          />
          {/* Bottom part and stand */}
          <path
            fill="#1B3954"
            d="M336.9,308c-21.7,21.4-50.4,33.2-80.9,33.2s-59.2-11.8-80.9-33.2c-17.6-17.4-28.9-39.4-32.7-63.7l-38,6    c5.1,32.4,20.2,61.8,43.7,85.1c23.9,23.7,54.3,38.5,87.1,42.9v53.6c-26,5-48.8,19.2-64.7,39.1h64.7h41.7h64.7    c-15.9-19.9-38.7-34.1-64.7-39.1v-53.6c32.8-4.4,63.2-19.3,87.1-42.9c23.5-23.2,38.6-52.7,43.7-85.1l-38-6    C365.8,268.5,354.5,290.6,336.9,308z"
          />
        </svg>
      </button>
    );
  };

  const BarChartSVG = () => {
    return (
      <button onClick={() => switchEffect()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-6 h-6 max-sm:translate-y-12 ml-4 max-sm:ml-0"
        >
          {/* First Column (Dark) */}
          <g>
            <rect fill="#1B3954" x="41" y="388" width="87.8" height="32.7" />
            <rect fill="#1B3954" x="41" y="328.7" width="87.8" height="32.7" />
            <rect fill="#1B3954" x="41" y="269.3" width="87.8" height="32.7" />
            <rect fill="#1B3954" x="41" y="210" width="87.8" height="32.7" />
          </g>
          {/* Second Column (Light) */}
          <g>
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : "#ffffff"}
              x="155.1"
              y="388"
              width="87.8"
              height="32.7"
            />
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="155.1"
              y="328.7"
              width="87.8"
              height="32.7"
            />
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="155.1"
              y="269.3"
              width="87.8"
              height="32.7"
            />
          </g>
          {/* Third Column (Dark) */}
          <g>
            <rect fill="#1B3954" x="269.2" y="388" width="87.8" height="32.7" />
            <rect
              fill="#1B3954"
              x="269.2"
              y="328.7"
              width="87.8"
              height="32.7"
            />
            <rect
              fill="#1B3954"
              x="269.2"
              y="269.3"
              width="87.8"
              height="32.7"
            />
            <rect fill="#1B3954" x="269.2" y="210" width="87.8" height="32.7" />
          </g>
          {/* Fourth Column (Light) */}
          <g>
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="383.2"
              y="388"
              width="87.8"
              height="32.7"
            />
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="383.2"
              y="328.7"
              width="87.8"
              height="32.7"
            />
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="383.2"
              y="269.3"
              width="87.8"
              height="32.7"
            />
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="383.2"
              y="210"
              width="87.8"
              height="32.7"
            />
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="383.2"
              y="150.7"
              width="87.8"
              height="32.7"
            />
            <rect
              fill={!audioEffectSwitch ? "#16ADE1" : `#ffffff`}
              x="383.2"
              y="91.3"
              width="87.8"
              height="32.7"
            />
          </g>
        </svg>
      </button>
    );
  };
  return (
    <div className="relative w-full h-full md:scale-90 max-md:h-[calc(80vh)] z-40 overflow-visible">
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
        <div className="absolute left-[102%] bottom-0 max-sm:bottom-0 z-40 max-sm:left-0">
          <BackgroundAudioSlider
            setValue={setAudioNarratorValue}
            className="w-28"
            defaultValue={[audioNarratorValue]}
          />
          <HeadphonesSVG />
        </div>
        <div className="absolute left-[106%] bottom-0 max-sm:bottom-0 max-sm:translate-y-9 z-40 max-sm:left-0 ">
          <BackgroundAudioSlider
            className="w-28 z-40  "
            defaultValue={[audioSliderValue]}
            setValue={setAudioSliderValue}
          />
          <BarChartSVG />
        </div>
      </div>
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 flex gap-4 max-sm:top-0">
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
