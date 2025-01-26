import React, { useEffect } from "react";
import { useSwiper } from "swiper/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
const SwiperNavButtons = () => {
  const swiper = useSwiper();
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setIsStart] = useState(true);
  useEffect(() => {
    const updateNavigation = () => {
      setIsEnd(swiper.isEnd);
      setIsStart(swiper.isBeginning);
    };
    swiper.on("slideChange", updateNavigation);
    return () => {
      swiper.off("slideChange", updateNavigation);
    };
  }, [swiper]);
  return (
    <>
      <div className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2">
        <button
          onClick={() => swiper.slidePrev()}
          className={
            isStart
              ? "  opacity-30"
              : "" +
                "bg-gray-800/50 hover:bg-gray-800/70 text-white p-2 rounded-full cursor-pointer z-50"
          }
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2">
        <button
          onClick={() => swiper.slideNext()}
          className={
            isEnd
              ? "  opacity-30"
              : "" +
                "bg-gray-800/50 hover:bg-gray-800/70 text-white p-2 rounded-full cursor-pointer "
          }
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
};

export default SwiperNavButtons;
