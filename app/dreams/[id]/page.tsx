// app/dreams/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BookPageContainer from "./BookPageContainer";
import { LoadingState } from "./LoadingState";

interface DreamPage {
  nb: number;
  text: string;
  image: string;
}

interface DreamBook {
  name: string;
  description: string;
  options: [{ artStyle: string; language: string }];
  pages: DreamPage[];
}

export default function DreamBookPage() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<DreamBook | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDream = async () => {
      try {
        const response = await fetch(`/api/dreams/${params.id}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBook(data);
        setError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDream();
  }, [params.id]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentPage((prev) =>
          Math.min(prev + 1, book?.pages.length - 1 ?? prev)
        );
      } else if (e.key === "ArrowLeft") {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [book?.pages.length]);

  if (loading) return <LoadingState />;
  if (error || !book || book.pages.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Dream Not Found</h2>
          <p className="text-gray-400">{error || "Dream book not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full">
        {/* Title Card */}
        <div className="relative w-full aspect-[16/10] md:aspect-[16/10] bg-gradient-to-r from-[#102233] to-[#24283c] rounded-lg shadow-2xl mb-4 md:mb-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(white,_1px,_transparent_1px)] bg-[size:20px_20px]" />
          </div>
          <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-center items-center text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-[#d1e2ff] mb-2 md:mb-4 font-serif drop-shadow-lg">
              {book.name}
            </h1>
            <p className="text-sm md:text-lg text-[#a4c3e3] max-w-2xl drop-shadow-md">
              {book.description}
            </p>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-2 md:w-8 bg-gradient-to-r from-[#0a1825] to-[#102233] shadow-inner"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#285299] to-transparent opacity-10"></div>
        </div>

        {/* Book pages */}
        <div className="relative aspect-[3/4] md:aspect-[16/10] w-full">
          <BookPageContainer
            book={book}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
