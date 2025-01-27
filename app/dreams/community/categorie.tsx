// categorie.tsx
"use client";
import React, { useEffect, useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import type { BooksCategorie, CommunityBookProps } from "./types";

const CommunityBookInfo = dynamic(() => import("./CommunityBookInfo"), {
  loading: () => <Skeleton className="h-72 w-52 rounded-xl" />,
});

const SwiperComponent = dynamic(() => import("./SwiperComponent"), {
  ssr: false,
});

const Categorie = memo(({ BooksTitle, Tab }: BooksCategorie) => {
  const [selectedBooks, setSelectedBooks] = useState<CommunityBookProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const fetchBooks = useCallback(
    async (currentPage: number) => {
      try {
        const response = await fetch(
          `/api/dreams/getBooksByCategorie?page=${currentPage}&limit=${
            Tab === "All" ? 4 : 20
          }&categorie=${Tab === "All" ? BooksTitle : Tab}`,
          {
            next: { revalidate: 3600 },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        const booksArray = Array.isArray(data)
          ? data
          : data.books
          ? data.books
          : data.data
          ? data.data
          : [];

        /* setSelectedBooks((prev) => [...prev, ...booksArray]);*/
        setSelectedBooks((prevBooks) => {
          const uniqueBooks = [...prevBooks];

          booksArray.forEach((newBook: CommunityBookProps) => {
            // Check if book already exists based on some unique identifier
            const existingBookIndex = uniqueBooks.findIndex(
              (book) => book.url === newBook.url // Using URL as unique identifier
            );

            if (existingBookIndex === -1) {
              // Book doesn't exist, add it
              uniqueBooks.push(newBook);
            } else {
              // Book exists, update it with new data
              uniqueBooks[existingBookIndex] = newBook;
            }
          });

          return uniqueBooks;
        });
        setHasMore(booksArray.length > 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      }
    },
    [BooksTitle, Tab]
  );

  useEffect(() => {
    setSelectedBooks([]);
    setIsLoading(true);
    setPage(1);
    setHasMore(true);
  }, [BooksTitle, Tab]);

  useEffect(() => {
    if (inView) {
      fetchBooks(page);
    }
  }, [inView, page, fetchBooks]);

  const loadMoreBooks = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  const renderContent = () => {
    if (Tab === "All") {
      return (
        <SwiperComponent
          books={selectedBooks}
          isLoading={isLoading}
          onReachEnd={loadMoreBooks}
        />
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="flex justify-center">
                <Skeleton className="h-72 w-52 rounded-xl" />
              </div>
            ))
          : selectedBooks.map((book, index) => (
              <div
                key={`${book.title}-${index}`}
                className="flex justify-center"
              >
                <CommunityBookInfo {...book} />
              </div>
            ))}
      </div>
    );
  };

  return (
    <div ref={ref} className="w-full max-w-6xl mx-auto px-2">
      {selectedBooks.length > 0 && (
        <h1 className="px-2 mb-4 text-xl font-semibold">{BooksTitle}</h1>
      )}
      {renderContent()}
    </div>
  );
});

Categorie.displayName = "Categorie";
export default Categorie;
