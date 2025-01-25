import React from "react";

const GalleryLoadingState = () => {
  return (
    <div className="min-h-screen bg-[#0f1420] flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated gallery frames */}
        <div className="relative w-40 h-40 mx-auto">
          {/* Frame container with hover effect */}
          <div className="relative grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gradient-to-r from-[#1a2030] to-[#252d40] rounded-lg shadow-xl"
                style={{
                  animation: "frameFloat 3s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {/* Frame inner glow */}
                <div className="absolute inset-0 bg-[#a9c5dd] rounded-lg opacity-10 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Moon glow effect */}
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#a9c5dd] rounded-full opacity-20 animate-pulse blur-xl"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <p className="text-[#b4c6db] text-lg font-serif italic">
            Displaying your gallery...
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
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes frameFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px) scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryLoadingState;
