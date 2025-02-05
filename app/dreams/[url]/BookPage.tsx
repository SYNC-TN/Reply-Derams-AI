import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import "./BookPage.css";
import { ArrowUpDown, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
interface BookPageProps {
  text: string;
  imageUrl: string;
  pageNumber: number;
  totalPages: number;
  isMobile: boolean;
}

const BookPage: React.FC<BookPageProps> = ({
  text,
  imageUrl,
  pageNumber,
  totalPages,
  isMobile,
}) => {
  const [hoverState, setHoverState] = useState(0);
  const [flipState, setFlipState] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("flipState") === "true"
  );

  // Enhanced page styles with depth effect

  // Dynamic shadow based on page position

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("flipState", flipState.toString());
    }
  }, [flipState]);

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ rotateY: 0, z: 0 }}
      animate={{
        rotateY: hoverState * 5,
        z: hoverState * 20,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      }}
      onHoverStart={() => setHoverState(1)}
      onHoverEnd={() => setHoverState(0)}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "left center",
      }}
    >
      {/* Main container */}
      <div className="relative w-full h-full bg-[#f5e6d3] rounded-lg shadow-2xl overflow-hidden page">
        <Button
          className="absolute top-0 right-2 z-50 w-9 h-9 "
          onClick={() => setFlipState(!flipState)}
        >
          {flipState ? <ArrowUpDown size={24} /> : <ArrowLeftRight size={24} />}
        </Button>
        {/* Page texture */}
        <div className="absolute inset-0 page opacity-15 mix-blend-multiply pointer-events-none" />

        {/* Content container */}
        <div
          className={
            flipState === false
              ? "absolute inset-0 flex flex-row w-full h-full p-4 md:p-8"
              : "absolute inset-0 flex flex-col w-full h-full p-4 md:p-8"
          }
        >
          {/* Text section */}
          <div className="relative flex-1 h-full flex items-center ">
            <motion.div
              className="w-full"
              animate={{
                rotateY: hoverState * 2,
                z: hoverState * 10,
              }}
            >
              <p
                className="text-[#2a1810] leading-relaxed font-semibold font-mono 
                     text-sm md:text-base lg:text-xl xl:text-3xl max-md:text-base
                     max-h-[70vh] overflow-y-auto xl:px-2 md:px-4"
                style={{
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                  hyphens: "auto",
                }}
              >
                {text}
              </p>
            </motion.div>
          </div>

          {/* Center divider */}
          <div className="w-px md:w-1 bg-black/10 self-stretch mx-4" />

          {/* Image section */}
          <div className="relative flex-1 h-full">
            <motion.div
              className="w-full h-full relative rounded-lg overflow-hidden"
              animate={{
                rotateY: -hoverState * 2,
                z: hoverState * 10,
              }}
            >
              {/* Image container */}
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={`Page ${pageNumber}`}
                  fill
                  className="object-fill rounded-lg"
                  priority
                  sizes="(max-width: 768px) 50vw, 50vw"
                />

                {/* Image overlays */}
                <div className="absolute inset-0 bg-[url('https://i.imgur.com/0kjMcUe.png')] opacity-20 mix-blend-overlay rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 mix-blend-multiply rounded-lg" />
                <div className="absolute inset-0 bg-[#f5e6d3] opacity-15 mix-blend-color rounded-lg" />

                {/* Dynamic shadow */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-10 transition-transform duration-300"
                  style={{
                    transform: `translateX(${hoverState * 100}%)`,
                  }}
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/15 rounded-lg" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Center binding effect - only on desktop */}
        {!isMobile && (
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="absolute inset-0 w-12 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            <div className="absolute inset-0 w-12 bg-[#f5e6d3] mix-blend-overlay opacity-30" />
          </div>
        )}

        {/* Page numbers */}
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#2a1810] opacity-50 
                   text-xs md:text-sm lg:text-base "
          animate={{
            z: hoverState * 20,
            scale: 1 + hoverState * 0.5,
          }}
        >
          {pageNumber} / {totalPages}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookPage;
