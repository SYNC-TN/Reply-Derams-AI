// LikeButton.tsx
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useCallback } from "react";

interface LikeButtonProps {
  setLikeStatus: (status: boolean) => void;
  url: string | string[] | undefined;
  nbLikes: number;
  setNbLikes: (nbLikes: number) => void;
  initialLikeStatus: boolean;
}

const LikeButton = ({
  setLikeStatus,
  url,
  nbLikes,
  setNbLikes,
  initialLikeStatus,
}: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const formatter = new Intl.NumberFormat("en", { notation: "compact" });
  useEffect(() => {
    if (initialLikeStatus !== undefined) {
      setLiked(initialLikeStatus);
    }
  }, [initialLikeStatus]);

  const handleClick = useCallback(() => {
    setIsAnimating(true);

    setLiked((prev) => {
      // Update parent state with the new value
      setLikeStatus(!prev);
      return !prev;
    }); // Reset animation state after animation completes

    setTimeout(() => setIsAnimating(false), 300);
  }, [setLikeStatus]);

  const handleLikeClick = async () => {
    if (isUpdatingLike) return;

    try {
      setIsUpdatingLike(true);
      const newLikeStatus = !liked;
      if (liked) {
        setNbLikes(nbLikes - 1);
      } else {
        setNbLikes(nbLikes + 1);
      }
      const response = await fetch("/api/dreams/profile/Like", {
        method: "POST",
        body: JSON.stringify({
          url: url,
          likeStatus: newLikeStatus,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(`Follow failed: ${data.error || "Unknown error"}`);
      }

      // No need to setIsFollowing here since we already did it optimistically
    } catch (error) {
      console.error("Follow operation failed:", error);
    } finally {
      setIsUpdatingLike(false);
    }
  };
  return (
    <>
      <div
        className=" relative
        right-10
         grid grid-flow-col  items-center gap-2
        max-sm:bottom-2
        mb-[20%]
        max-sm:absolute
        
        max-sm:mb-0
        
        z-50
        "
      >
        <button
          onClick={() => {
            handleClick();
            handleLikeClick();
          }}
          disabled={isUpdatingLike}
          className={`
          z-50
          flex
          items-center
          justify-center
          w-12
          h-12
          rounded-full
          transition-colors
          duration-200
        
          ${liked ? "bg-red-50/10" : "hover:bg-gray-100/10"}
        `}
          aria-label={liked ? "Unlike" : "Like"}
        >
          {/* Background burst effect */}
          {isAnimating && (
            <div className="absolute inset-0">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-400/30" />
              <div className="absolute inset-[-8px] animate-scale-burst">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-red-400"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 45}deg) translateY(-20px)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Main heart icon */}
          <div
            className={`
            relative
            transition-transform
            duration-300
            ${isAnimating ? "animate-heart-pop" : ""}
            ${liked ? "scale-110" : "scale-100"}
          `}
          >
            <Heart
              className={`
              w-8
              h-8
              transition-colors
              duration-300
              ${
                liked
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-gray-200 fill-none"
              }
            `}
            />
          </div>
          {/* +1 Animation */}
          {isAnimating && liked && (
            <div className="absolute animate-float-up pointer-events-none select-none">
              <span className="text-red-500 font-medium text-sm">+1</span>
            </div>
          )}
          <style jsx global>{`
            @keyframes heart-pop {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.4);
              }
              100% {
                transform: scale(1.1);
              }
            }
            @keyframes scale-burst {
              0% {
                transform: scale(0) rotate(45deg);
                opacity: 1;
              }
              50% {
                transform: scale(1) rotate(45deg);
                opacity: 0.5;
              }
              100% {
                transform: scale(1.5) rotate(45deg);
                opacity: 0;
              }
            }
            @keyframes float-up {
              0% {
                transform: translateY(0);
                opacity: 1;
              }
              100% {
                transform: translateY(-20px);
                opacity: 0;
              }
            }
            .animate-heart-pop {
              animation: heart-pop 0.3s ease-in-out;
            }
            .animate-scale-burst {
              animation: scale-burst 0.5s ease-out forwards;
            }
            .animate-float-up {
              animation: float-up 0.5s ease-out forwards;
            }
          `}</style>
        </button>
        <span className="text-2xl  text-gray-300">
          {formatter.format(nbLikes)}
        </span>
      </div>
    </>
  );
};

export default LikeButton;
