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
  Tab: string | undefined;
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

const Categorie = ({ BooksTitle, Tab }: BooksCategorie) => {
  const [selectedBooks, setSelectedBooks] = useState<CommunityBookProps[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [title, setTitle] = useState(BooksTitle);

  useEffect(() => {
    setSelectedBooks((prevBooks) => {
      return prevBooks.filter((book, index) => {
        return prevBooks.indexOf(book) === index;
      });
    });
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 768) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1280) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Reset state when category changes
    setSelectedBooks([]);
    setIsLoading(true);
    setPage(1);
    setHasMore(true);
  }, [BooksTitle]);

  const fetchBooks = async (currentPage: number) => {
    try {
      setTitle(BooksTitle);
      const response = await fetch(
        `/api/dreams/getBooksByCategorie?page=${currentPage}&limit=${
          Tab === "All" ? 4 : 20
        }&categorie=${Tab === "All" ? title : Tab}`
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
  }, [page, BooksTitle]);

  const loadMoreBooks = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Determine if we should use Swiper or grid based on Tab
  const renderContent = () => {
    if (Tab === "All") {
      return (
        <Swiper
          modules={[Autoplay, Pagination, Navigation, Mousewheel]}
          spaceBetween={10}
          slidesPerView={slidesPerView}
          navigation={true}
          mousewheel={true}
          keyboard={true}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 10 },
            640: { slidesPerView: 2.2, spaceBetween: 10 },
            768: { slidesPerView: 2.5, spaceBetween: 10 },
            1024: { slidesPerView: 3.2, spaceBetween: 10 },
            1280: { slidesPerView: 4.2, spaceBetween: 10 },
          }}
          onReachEnd={() => {
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
            ? Array.from({ length: Math.ceil(slidesPerView) }).map((_, i) => (
                <SwiperSlide
                  key={`skeleton-${i}`}
                  className="flex justify-center"
                >
                  <Skeleton className="h-72 w-52 rounded-xl" />
                </SwiperSlide>
              ))
            : (selectedBooks || []).map((book, index) => (
                <SwiperSlide
                  key={`book-${index}`}
                  className="flex justify-center"
                >
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
                </SwiperSlide>
              ))}
        </Swiper>
      );
    } else {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="flex justify-center">
                  <Skeleton className="h-72 w-52 rounded-xl" />
                </div>
              ))
            : (selectedBooks || []).map((book, index) => (
                <div key={`book-${index}`} className="flex justify-center">
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
              ))}
        </div>
      );
    }
  };

  return (
    <div className={"w-full max-w-6xl mx-auto px-2"}>
      {selectedBooks.length > 0 && <h1 className="px-2 mb-4">{BooksTitle}</h1>}
      {renderContent()}
    </div>
  );
};

export default Categorie;
