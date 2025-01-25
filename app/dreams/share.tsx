import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBookData } from "./BookData";
import { Share } from "lucide-react";

const ShareBook = () => {
  const { share, setShare } = useBookData();

  useEffect(() => {
    console.log(share);
  });

  return (
    <Button
      onClick={() => setShare(!share)}
      type="button"
      className={`
        relative
        flex
        items-center
        justify-center
        gap-2
        bg-gradient-to-r
        from-blue-900
        to-blue-800
        hover:from-blue-800
        hover:to-blue-700
        border
        border-blue-700/50
        hover:border-blue-600/50
        shadow-lg
        transition-all
        duration-300
        transform
        hover:scale-105
        active:scale-95
        ${
          share
            ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950"
            : ""
        }
        max-sm:w-12
        max-sm:h-10
        max-sm:p-2
        rounded-lg
        group
      `}
    >
      <Share
        className={`
          w-5 
          h-5 
          transition-transform 
          duration-300 
          ${share ? "rotate-12 scale-110" : ""} 
          group-hover:rotate-6
        `}
      />
      <span
        className={`
        max-sm:hidden
        transition-opacity
        duration-300
        ${share ? "opacity-100" : "opacity-80"}
      `}
      >
        {share ? "Shared" : "Share"}
      </span>

      {/* Animation overlay */}
      <div
        className={`
        absolute
        inset-0
        bg-blue-400/20
        rounded-lg
        transition-opacity
        duration-300
        ${share ? "opacity-100" : "opacity-0"}
      `}
      />
    </Button>
  );
};

export default ShareBook;
