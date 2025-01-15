// BookPageContainer.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookPage from "./BookPage";

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

  const flipPage = (newDirection: "next" | "prev") => {
    if (isFlipping) return;

    setIsFlipping(true);
    setDirection(newDirection);

    const newPage =
      newDirection === "next"
        ? Math.min(currentPage + 1, book.pages.length - 1)
        : Math.max(currentPage - 1, 0);

    onPageChange(newPage);
    setTimeout(() => setIsFlipping(false), 800);
  };

  return (
    <div className="relative w-full h-full md:scale-90">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
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
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => flipPage("prev")}
          disabled={currentPage === 0 || isFlipping}
          className="pointer-events-auto transform -translate-x-4 p-4 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all disabled:opacity-0"
        >
          <ChevronLeft className="w-8 h-8" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => flipPage("next")}
          disabled={currentPage === book.pages.length - 1 || isFlipping}
          className="pointer-events-auto transform translate-x-4 p-4 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all disabled:opacity-0"
        >
          <ChevronRight className="w-8 h-8" />
        </motion.button>
      </div>
    </div>
  );
}
