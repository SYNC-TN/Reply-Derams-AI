// BookShelfContainer component
"use client";
import { useEffect, useState } from "react";
import BookShelf from "./BookShelf";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoadingState from "../[url]/LoadingState";
import Link from "next/link";
// Types
interface Stats {
  likes?: number;
  views?: number;
}
interface Dream {
  User: string;
  url: string;
  name: string;
  description: string;
  title: string;
  options: any[];
  pages: any[];
  coverData: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface BookData {
  title: string;
  subtitle: string;
  stats: Stats;
}
interface BookCollection {
  featured: BookData[];
  recent: BookData[];
}

const BookShelfContainer: React.FC = () => {
  const [books, setBooks] = useState<Dream[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const grabData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dreams/getBooks");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
        console.log("Books fetched:", data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch books");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    if (books) {
      console.log("books state", books);
    }
    // Only fetch if we have a session and this is the initial load
    const shouldFetch = session && !books;
    if (shouldFetch) {
      grabData();
    }
  }, [session, searchParams]); // Add searchParams to dependencies

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!books) {
    return <div>No books found</div>;
  }

  const sampleBooks: BookCollection = {
    featured: [
      {
        title: "Dream Walker's Guide",
        subtitle: "a journey through the subconscious",
        stats: { likes: 40, views: 65 },
      },
      {
        title: "Lucid Chronicles",
        subtitle: "mastering dream control",
        stats: { likes: 5, views: 24 },
      },
      {
        title: "Astral Passages",
        subtitle: "exploring dream dimensions",
        stats: { likes: 3, views: 19 },
      },
    ],
    recent: [
      {
        title: "Dream Interpreter",
        subtitle: "understanding dream symbols",
        stats: { likes: 5, views: 23 },
      },
      {
        title: "Nighttime Narratives",
        subtitle: "collecting dream stories",
        stats: { likes: 2, views: 18 },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dream Library
          </h1>
          <p className="text-slate-400 mt-2">
            Explore dream stories and experiences
          </p>
        </div>
        <Link href="/dreams">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105 hover:shadow-lg shadow-blue-500/25">
            Create Story
          </button>
        </Link>
      </div>

      <BookShelf
        title="Your Dreams"
        books={books.map((dream) => ({
          title: dream.coverData.title,
          url: dream.url,
          cover: dream.coverData?.coverImageUrl || "/api/placeholder/192/230",
          subtitle: dream.coverData.subtitle,
          stats: { views: 0, likes: 0 },
        }))}
      />
    </div>
  );
};

export default BookShelfContainer;
