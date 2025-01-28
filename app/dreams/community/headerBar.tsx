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
    <div className="relative w-full z-10">
      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={5}
        slidesPerView="auto"
        mousewheel={{
          forceToAxis: true,
        }}
        className="mySwiper"
        keyboard={true}
      >
        {ListeTabs.map((tab, index) => (
          <SwiperSlide key={index} className="!w-auto flex justify-center">
            <Button
              onClick={() => setSelectedTab(tab)}
              className={
                selectedTab === tab
                  ? "bg-sky-600 w-auto h-6 text-white"
                  : "w-auto h-6 bg-gradient-to-r from-slate-900 to-zinc-700 text-white"
              }
            >
              {tab}
            </Button>
          </SwiperSlide>
        ))}
        <SwiperNavButtons />
      </Swiper>
    </div>
  );
};

export default HeaderBar;
