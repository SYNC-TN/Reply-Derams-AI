import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BookNavigationProps {
  currentPage: number;
  totalPages: number;
  onNavigate: (direction: "prev" | "next") => void;
  isFlipping: boolean;
  isReading: boolean;
}

const BookNavigation: React.FC<BookNavigationProps> = ({
  currentPage,
  totalPages,
  onNavigate,
  isFlipping,
  isReading,
}) => {
  const isPrevDisabled = currentPage === 0 || isFlipping || isReading;
  const isNextDisabled =
    currentPage === totalPages - 1 || isFlipping || isReading;

  return (
    <>
      {/* Left Navigation Button */}
      <motion.button
        onClick={() => onNavigate("prev")}
        disabled={isPrevDisabled}
        initial="initial"
        whileHover={!isPrevDisabled ? "hover" : undefined}
        whileTap={!isPrevDisabled ? "tap" : undefined}
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1 },
          tap: { scale: 0.9 },
        }}
        className={`absolute left-[-60px] top-1/2 transform -translate-y-1/2
          max-md:bottom-4 max-md:left-4 max-md:top-auto max-md:translate-y-0
          w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-300
          ${
            isPrevDisabled
              ? "opacity-50 cursor-not-allowed bg-white/5"
              : "bg-white/10 hover:bg-white/20 border border-white/30 shadow-lg"
          }`}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </motion.button>
      {/* Reading indicator */}
      {isReading && (
        <div
          className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 
                      flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full 
                      backdrop-blur-md border border-white/30"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-white">Reading...</span>
        </div>
      )}
      {/* Right Navigation Button */}
      <motion.button
        onClick={() => onNavigate("next")}
        disabled={isNextDisabled}
        initial="initial"
        whileHover={!isNextDisabled ? "hover" : undefined}
        whileTap={!isNextDisabled ? "tap" : undefined}
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1 },
          tap: { scale: 0.9 },
        }}
        className={`absolute right-[-60px] top-1/2 transform -translate-y-1/2
          max-md:bottom-4 max-md:right-4 max-md:top-auto max-md:translate-y-0
          w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-300
          ${
            isNextDisabled
              ? "opacity-50 cursor-not-allowed bg-white/5"
              : "bg-white/10 hover:bg-white/20 border border-white/30 shadow-lg"
          }`}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </motion.button>
    </>
  );
};

export default BookNavigation;
