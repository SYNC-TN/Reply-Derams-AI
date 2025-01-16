import React from "react";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-[#0f1420] flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated book */}
        <div className="relative w-32 h-40 mx-auto perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2030] to-[#252d40] rounded-lg shadow-xl animate-pulse">
            {/* Moon glow effect */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#a9c5dd] rounded-full opacity-20 animate-pulse blur-xl"></div>
          </div>
          {/* Animated page turn effect */}
          <div
            className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#252d40] to-[#1a2030] rounded-r-lg origin-left"
            style={{
              animation: "pageTurn 3s ease-in-out infinite",
              transformStyle: "preserve-3d",
            }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <p className="text-[#b4c6db] text-lg font-serif italic">
            Opening your dream book...
          </p>
          {/* Animated dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#4a88c7] animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pageTurn {
          0%,
          100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-180deg);
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
