"use client";
import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Mousewheel } from "swiper/modules";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import type { CommunityBookProps } from "./types";

const CommunityBookInfo = dynamic(() => import("./CommunityBookInfo"), {
  loading: () => <Skeleton className="h-72 w-52 rounded-xl" />,
});

interface SwiperComponentProps {
  books: CommunityBookProps[];
  isLoading: boolean;
  onReachEnd: () => void;
}

const breakpoints = {
  320: { slidesPerView: 1.2, spaceBetween: 10 },

  640: { slidesPerView: 2.2, spaceBetween: 10 },
  768: { slidesPerView: 2.5, spaceBetween: 10 },
  1024: { slidesPerView: 3.2, spaceBetween: 10 },
  1280: { slidesPerView: 4.2, spaceBetween: 10 },
};

const SwiperComponent = memo(
  ({ books, isLoading, onReachEnd }: SwiperComponentProps) => {
    return (
      <div className="min-h-[300px]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, Mousewheel]}
          spaceBetween={10}
          navigation={true}
          mousewheel={{
            forceToAxis: true,
          }}
          keyboard={true}
          breakpoints={breakpoints}
          onReachEnd={onReachEnd}
          autoplay={{
            delay: 8000,
            disableOnInteraction: true,
          }}
          className="mySwiper h-[300px]"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SwiperSlide
                  key={`skeleton-${i}`}
                  className="flex justify-center items-center h-full"
                >
                  <div className="h-72 w-52">
                    <Skeleton className="h-full w-full rounded-xl" />
                  </div>
                </SwiperSlide>
              ))
            : books.map((book, index) => (
                <SwiperSlide
                  key={`${book.title}-${index}`}
                  className="flex justify-center items-center h-full"
                >
                  <div className="h-72 w-52">
                    <CommunityBookInfo {...book} />
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    );
  }
);

SwiperComponent.displayName = "SwiperComponent";
export default SwiperComponent;
