// /app/dreams/community/SwiperHeader.tsx
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamically import Swiper components
const SwiperComponent = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  { ssr: false }
);

const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false }
);

interface SwiperHeaderProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const ListeTabs = [
  "All",
  "Adventure",
  "Action",
  "Horror",
  "Mystery",
  "Comedy",
  "Drama",
  "Fantasy",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "History",
  "Biography",
  "Documentary",
  "Crime",
  "Animation",
  "Family",
  "Music",
  "Sport",
  "War",
  "Western",
  "Musical",
  "Supernatural",
];

export default function SwiperHeader({
  selectedTab,
  setSelectedTab,
}: SwiperHeaderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-12 animate-pulse bg-slate-800 rounded-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative w-full z-10 px-4 md:px-6">
      <SwiperComponent
        modules={[]}
        spaceBetween={8}
        slidesPerView="auto"
        className="mySwiper py-2"
        speed={600}
      >
        <div className="flex items-center space-x-2">
          {ListeTabs.map((tab, index) => (
            <SwiperSlide
              key={index}
              className="!w-auto flex justify-center first:ml-0 last:mr-4"
            >
              <Button
                onClick={() => setSelectedTab(tab)}
                className={`
                  relative px-4 py-1.5 h-8 text-sm font-medium tracking-wide
                  transition-all duration-300 ease-out
                  hover:scale-105 active:scale-95
                  ${
                    selectedTab === tab
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-500"
                      : "bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 hover:from-slate-700 hover:to-slate-600"
                  }
                `}
              >
                {tab}
              </Button>
            </SwiperSlide>
          ))}
        </div>
      </SwiperComponent>
    </div>
  );
}
