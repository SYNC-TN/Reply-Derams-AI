// BookPageContainer.tsx
import React, { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookPage from "./BookPage";
import { useEffect } from "react";
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
  const pageFlipSfx = "/page-flip.mp3";
  const [play] = useSound(pageFlipSfx, { volume: 0.1 });
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") flipPage("prev");
      if (e.key === "ArrowRight") flipPage("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, isFlipping]);

  const flipPage = (newDirection: "next" | "prev") => {
    if (isFlipping) return;

    if (
      !(currentPage === 0 && newDirection === "prev") &&
      !(currentPage === book.pages.length - 1 && newDirection === "next")
    ) {
      play();
      setIsFlipping(true);
      setDirection(newDirection);
    }

    const newPage =
      newDirection === "next"
        ? Math.min(currentPage + 1, book.pages.length - 1)
        : Math.max(currentPage - 1, 0);

    onPageChange(newPage);
    setTimeout(() => setIsFlipping(false), 800);
  };

  return (
    <div className="relative w-full h-full  md:scale-90 max-md:h-[calc(70vh)] ">
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

      {/* Navigation buttons */}
      <BookNavigation
        currentPage={currentPage}
        totalPages={book.pages.length}
        onNavigate={flipPage}
        isFlipping={isFlipping}
      />
    </div>
  );
}
