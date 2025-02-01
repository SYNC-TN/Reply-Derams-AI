"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SwiperNavButtons from "./swiperNavButtons";

interface HeaderBarProps {
  setTab: (tab: string) => void;
}

const HeaderBar = ({ setTab }: HeaderBarProps) => {
  const [selectedTab, setSelectedTab] = useState("All");
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

  useEffect(() => {
    setTab(selectedTab);
  }, [selectedTab, setTab]);

  return (
    <div className="relative w-full z-10 px-4 md:px-6">
      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={8}
        slidesPerView="auto"
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1.5,
        }}
        className="mySwiper py-2"
        keyboard={{ enabled: true }}
        speed={600}
        resistance={true}
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
        <SwiperNavButtons />
      </Swiper>
    </div>
  );
};

export default HeaderBar;
