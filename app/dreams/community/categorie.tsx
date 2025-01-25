import React, { useEffect, useState } from "react";
import CommunityBookInfo from "./CommunityBookInfo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import "swiper/css/pagination";

interface Stats {
  likes?: number;
  views?: number;
  shares?: number;
}

interface CommunityBookProps {
  title: string;
  subtitle: string;
  url: string;
  coverData: {
    coverImageUrl: string;
  };
  stats: Stats;
  author: {
    name: string;
    avatar?: string;
    username: string;
  };
  createdAt: string;
}

const Categorie = () => {
  const [selectedBooks, setSelectedBooks] = useState<CommunityBookProps[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth > 1024) {
        setSlidesPerView(4);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("/api/dreams/getBooks");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setSelectedBooks(data);
      console.log("Books fetched:", data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto ">
      <h1 className="px-4 mb-4">Romance</h1>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Mousewheel]}
        spaceBetween={24}
        slidesPerView={slidesPerView}
        navigation={true}
        mousewheel={true}
        keyboard={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        className="mySwiper"
      >
        {selectedBooks.length === 0 &&
          Array.from({ length: slidesPerView }).map((_, i) => (
            <SwiperSlide key={i} className="flex justify-center mySwiper">
              <Skeleton className="h-[250px] w-[250px] rounded-xl flex justify-center z-0" />
            </SwiperSlide>
          ))}
        {selectedBooks.map((book, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center"
            virtualIndex={index}
          >
            <div className="flex justify-center">
              <CommunityBookInfo
                title={book.title}
                subtitle={book.subtitle}
                url={book.url}
                author={{
                  name: "John Doe",
                  username: "johndoe",
                }}
                cover={book.coverData.coverImageUrl}
                stats={{
                  likes: 42,
                  views: 156,
                  shares: 23,
                }}
                createdAt={book.createdAt}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Categorie;
