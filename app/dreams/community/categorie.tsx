"use client";

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
interface BooksCategorie {
  BooksTitle: string;
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

const Categorie = ({ BooksTitle }: BooksCategorie) => {
  const [selectedBooks, setSelectedBooks] = useState<CommunityBookProps[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [title, setTitle] = useState(BooksTitle);

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

  const fetchBooks = async (currentPage: number) => {
    try {
      // Modify your API endpoint to support pagination
      setTitle(BooksTitle);
      const response = await fetch(
        `/api/dreams/getBooksByCategorie?page=${currentPage}&limit=4&categorie=${title}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();

      // Ensure data is an array and check if there are more books
      const booksArray = Array.isArray(data)
        ? data
        : data.books
        ? data.books
        : data.data
        ? data.data
        : [];

      // Append new books to existing books
      setSelectedBooks((prevBooks) => [...prevBooks, ...booksArray]);

      // Check if we've reached the end of books
      setHasMore(booksArray.length > 0);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchBooks(page);
  }, [page]);

  const loadMoreBooks = () => {
    // Increment page to trigger more book loading
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto  ">
      <h1 className="px-4 mb-6">{BooksTitle}</h1>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Mousewheel]}
        spaceBetween={24}
        slidesPerView={slidesPerView}
        navigation={true}
        mousewheel={true}
        keyboard={true}
        onReachEnd={() => {
          // When user reaches the end of current slides, load more
          if (hasMore) {
            loadMoreBooks();
          }
        }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: true,
        }}
        className="mySwiper"
      >
        {isLoading
          ? // Skeleton loading state
            Array.from({ length: slidesPerView }).map((_, i) => (
              <SwiperSlide
                key={`skeleton-${i}`}
                className="flex justify-center"
              >
                <Skeleton className="h-72 w-52 rounded-xl flex justify-center z-0" />
              </SwiperSlide>
            ))
          : // Actual book content
            (selectedBooks || []).map((book, index) => (
              <SwiperSlide
                key={`book-${index}`}
                className="flex justify-center "
                virtualIndex={index}
              >
                <div className="flex justify-center">
                  <CommunityBookInfo
                    title={book.title}
                    subtitle={book.subtitle}
                    url={book.url}
                    author={{
                      name: book.author?.name || "John Doe",
                      username: book.author?.username || "johndoe",
                    }}
                    cover={book.coverData.coverImageUrl}
                    stats={{
                      likes: book.stats?.likes || 0,
                      views: book.stats?.views || 0,
                      shares: book.stats?.shares || 0,
                    }}
                    createdAt={book.createdAt}
                  />
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
      {/* !isLoading && !hasMore && (
        <div className="w-10 h-10 border-2  border-t-transparent animate-spin rounded-full "></div>
      )*/}
    </div>
  );
};
export default Categorie;
