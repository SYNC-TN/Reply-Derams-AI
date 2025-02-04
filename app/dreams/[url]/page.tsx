//page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BookPageContainer from "./BookPageContainer";
import Image from "next/image";
import LoadingState from "./LoadingState";
import { notFound } from "next/navigation";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
interface DreamPage {
  nb: number;
  text: string;
  image: string;
  soundEffect: string;
}

interface DreamBook {
  name: string;
  description: string;
  options: { artStyle: string; language: string }[];
  pages: DreamPage[];
  comments: {
    username: string;
    text: string;
    image: string;
    profileName: string;
  }[];
  share: boolean;
  coverData?: {
    coverImagePrompt: string;
    coverImageUrl: string;
    dominantColors: string[];
    fontStyle: string;
    mood: string;
    subtitle: string;
    theme: string;
    title: string;
  };
}

export default function DreamBookPage() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<DreamBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [nbLikes, setNbLikes] = useState(0);
  const [isAlreadyLiking, setIsAlreadyLiking] = useState(false);
  useEffect(() => {
    console.log("like status:", isLiked);
  }, [isLiked]);
  useEffect(() => {
    const fetchDream = async () => {
      try {
        if (!params.url) {
          throw new Error("No dream URL provided");
        }

        // Make sure we're using the raw URL parameter
        const response = await fetch(`/api/dreams/${params.url}`);

        if (response.status === 404) {
          notFound();
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const { dream, isOwner, nbLikes, isAlreadyLiking } = data;
        setNbLikes(nbLikes);
        setIsOwner(isOwner);
        setIsAlreadyLiking(isAlreadyLiking);
        console.log("isAlreadyLiking:", isAlreadyLiking);
        console.log("owner:", isOwner);

        setBook(dream);
        console.log("Dream book data:", data);
        setError(null);
      } catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
          notFound();
        }
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [params.url]);

  if (loading) return <LoadingState />;

  if (error || !book || book.pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-red-500">Dream Not Found</h2>
        <p className="text-gray-400">{error || "Dream book not found."}</p>
      </div>
    );
  }

  const coverColors = book.coverData?.dominantColors || [
    "#102233",
    "#24283c",
    "#285299",
  ];

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Title Card */}
      <div
        className="relative w-full aspect-[16/10] md:aspect-[16/10] rounded-lg shadow-2xl mb-4 md:mb-8 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${coverColors[0]}f0, ${coverColors[1]}f0, ${coverColors[2]}80)`,
        }}
      >
        {/* Background Image */}
        {book.coverData?.coverImageUrl && (
          <div className="absolute inset-0 ">
            <Image
              src={book.coverData.coverImageUrl}
              alt="Dream Cover"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="opacity-30"
              style={{
                filter: "brightness(0.7) contrast(1.1)",
              }}
            />
            {/* Gradient Overlay for better text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(45deg, 
                ${coverColors[0]}cc,
                ${coverColors[1]}99),
                linear-gradient(180deg,
                ${coverColors[2]}66,
                transparent)`,
              }}
            />
          </div>
        )}

        {/* Decorative Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(white,_1px,_transparent_1px)] bg-[size:20px_20px] mix-blend-soft-light" />
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center items-center text-center z-10">
          {/* Subtitle */}
          <div className="mb-2 md:mb-4">
            <span className="text-sm md:text-lg text-white/90 uppercase tracking-wider backdrop-blur-[2px]">
              {book.coverData?.subtitle}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg backdrop-blur-[2px]"
            style={{ fontFamily: book.coverData?.fontStyle || "serif" }}
          >
            {book.coverData?.title}
          </h1>

          {/* Theme and Mood */}
          {book.coverData && (
            <div className="flex gap-3 flex-wrap justify-center">
              <span
                className="px-4 py-2 rounded-full text-base backdrop-blur-md"
                style={{
                  backgroundColor: `${coverColors[0]}70`,
                  color: "white",
                  border: `1px solid ${coverColors[1]}60`,
                }}
              >
                {book.coverData.theme}
              </span>
              <span
                className="px-4 py-2 rounded-full text-base backdrop-blur-md"
                style={{
                  backgroundColor: `${coverColors[1]}70`,
                  color: "white",
                  border: `1px solid ${coverColors[2]}60`,
                }}
              >
                {book.coverData.mood}
              </span>
            </div>
          )}
        </div>

        {/* Book Edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 md:w-8"
          style={{
            background: `linear-gradient(to right, ${coverColors[0]}, ${coverColors[1]}40)`,
          }}
        />

        {/* Additional Ambient Lighting Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 mix-blend-overlay" />
      </div>

      {/* Book pages */}
      <div className="relative flex flex-row max-sm:flex-col items-center gap-8">
        <div className="relative aspect-[3/4] md:aspect-[16/10] w-full max-md:pb-20">
          <BookPageContainer
            book={book}
            lang={book.options[0].language.toLocaleLowerCase()}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
        {!isOwner && (
          <>
            <LikeButton
              setLikeStatus={setIsLiked}
              url={params.url}
              nbLikes={nbLikes}
              setNbLikes={setNbLikes}
              initialLikeStatus={isAlreadyLiking}
            />
          </>
        )}
      </div>
      <CommentsSection />
    </div>
  );
}
