import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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

  // Enhanced page styles with depth effect
  const pageStyles = {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin: "left center",
  };

  // Dynamic shadow based on page position
  const shadowIntensity = Math.abs((pageNumber / totalPages - 0.5) * 2);

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
      style={pageStyles as React.CSSProperties}
    >
      <div className="relative w-full h-full bg-[#f5e6d3] rounded-lg shadow-2xl overflow-hidden">
        {/* Enhanced page texture */}
        <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-15 mix-blend-multiply pointer-events-none" />

        {/* Content grid with perspective */}
        <div
          className={`absolute inset-0 ${
            isMobile ? "flex flex-col" : "grid grid-cols-2"
          } gap-4 md:gap-8 p-4 md:p-12 transform-gpu`}
        >
          {/* Text section with depth */}
          <motion.div
            className="relative flex-1"
            animate={{
              rotateY: hoverState * 2,
              z: hoverState * 10,
            }}
          >
            <div className="prose prose-sm md:prose-lg max-w-none transform-gpu">
              <p
                className="text-[#2a1810] leading-relaxed font-semibold font-mono md:text-base lg:text-3xl max-md:text-base"
                style={{
                  textShadow: `${shadowIntensity * 2}px ${
                    shadowIntensity * 2
                  }px 4px rgba(0,0,0,0.1)`,
                }}
              >
                {text}
              </p>
            </div>
          </motion.div>

          {/* Image section with enhanced depth */}
          <motion.div
            className="relative flex-1 min-h-[200px] md:min-h-0"
            animate={{
              rotateY: -hoverState * 2,
              z: hoverState * 10,
            }}
          >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="relative h-full w-full transform-gpu">
                {/* Display the uploaded image */}
                <Image
                  src={imageUrl}
                  alt={`Page ${pageNumber}`}
                  fill
                  className="object-cover rounded-lg mix-blend-multiply"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Enhanced layering to match the book theme */}
                <div className="absolute inset-0 bg-[url('https://i.imgur.com/0kjMcUe.png')] opacity-20 mix-blend-overlay rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 mix-blend-multiply rounded-lg" />
                <div className="absolute inset-0 bg-[#f5e6d3] opacity-15 mix-blend-color rounded-lg" />

                {/* Simulated shadow to mimic the book's natural folds */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-10"
                  style={{
                    transform: `translateX(${hoverState * 100}%)`,
                    transition: "transform 0.3s ease-out",
                  }}
                />

                {/* Add soft vignette for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/15 rounded-lg" />
              </div>
            </div>
          </motion.div>

          {/* Enhanced binding effect */}
          {!isMobile && (
            <>
              <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 transform-gpu">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[#f5e6d3] mix-blend-overlay opacity-30" />
              </div>
              <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-r from-black/15 via-black/10 to-transparent" />
            </>
          )}
        </div>

        {/* Page numbers with depth */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#2a1810] opacity-50 text-sm md:text-base"
          animate={{
            z: hoverState * 20,
            scale: 1 + hoverState * 0.05,
          }}
        >
          {pageNumber} / {totalPages}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookPage;
