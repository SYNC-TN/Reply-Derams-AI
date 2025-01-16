import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BookNavigationProps {
  currentPage: number;
  totalPages: number;
  onNavigate: (direction: "prev" | "next") => void;
  isFlipping: boolean;
}

const BookNavigation: React.FC<BookNavigationProps> = ({
  currentPage,
  totalPages,
  onNavigate,
  isFlipping,
}) => {
  const buttonStyles = {
    base: "pointer-events-auto p-4 rounded-full backdrop-blur-md transition-all duration-300",
    enabled: "bg-white/10 hover:bg-white/20 border border-white/30 shadow-lg",
    disabled: "opacity-50 cursor-not-allowed",
  };

  const iconStyles = "w-6 h-6 text-white";

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-between">
      {/* Left Navigation Button */}
      <motion.button
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        onClick={() => onNavigate("prev")}
        disabled={currentPage === 0 || isFlipping}
        className={`absolute left-[-60px] top-1/2 transform -translate-y-1/2 
              max-md:bottom-4 max-md:left-4 max-md:top-auto max-md:translate-y-0 
              w-[48px] h-[48px] rounded-full flex items-center justify-center 
              bg-white/10 hover:bg-white/20 border border-white/30 shadow-lg 
              backdrop-blur-md transition-all duration-300 
              ${
                currentPage === 0 || isFlipping
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </motion.button>

      <motion.button
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        onClick={() => onNavigate("next")}
        disabled={currentPage === totalPages - 1 || isFlipping}
        className={`absolute right-[-60px] top-1/2 transform -translate-y-1/2 
              max-md:bottom-4 max-md:right-4 max-md:top-auto max-md:translate-y-0 
              w-[48px] h-[48px] rounded-full flex items-center justify-center 
              bg-white/10 hover:bg-white/20 border border-white/30 shadow-lg 
              backdrop-blur-md transition-all duration-300 
              ${
                currentPage === totalPages - 1 || isFlipping
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default BookNavigation;
