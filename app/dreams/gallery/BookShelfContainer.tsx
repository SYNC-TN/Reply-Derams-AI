"use client";
import { useEffect, useState } from "react";
import BookShelf from "./BookShelf";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, CalendarPlus } from "lucide-react";
import GalleryLoadingState from "./GalleryLoadingState";

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
  stats: Stats;
  options: any[];
  pages: any[];
  coverData: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FilterState {
  hasLikes: boolean;
  hasViews: boolean;
}

const BookShelfContainer: React.FC = () => {
  const [books, setBooks] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // New states for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    hasLikes: true,
    hasViews: true,
  });
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const fetchBooks = async (currentPage: number) => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/dreams/getAllBooks?page=${currentPage}&limit=5`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Append new books to existing books
      setBooks((prevBooks) => [...prevBooks, ...data]);

      // Check if we've reached the end of books
      setHasMore(data.length > 0); //if data.length > 0 return true else return false
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch books");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [session, page]);

  const loadMoreBooks = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filterAndSortBooks = (books: Dream[]) => {
    if (!books) return [];

    // First apply search filter
    let filteredBooks = books.filter((book) => {
      const matchesSearch =
        book.coverData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.coverData.subtitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Then apply date sorting
    return filteredBooks.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  if (loading && books.length === 0) {
    return <GalleryLoadingState />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredAndSortedBooks = filterAndSortBooks(books);

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

      {/* Search and Filter Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search dreams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-100 bg-slate-800/50"
            >
              Filters <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700">
            <DropdownMenuCheckboxItem
              checked={filters.hasLikes}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, hasLikes: checked }))
              }
              className="text-slate-100"
            >
              Show Liked Dreams
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.hasViews}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, hasViews: checked }))
              }
              className="text-slate-100"
            >
              Show Viewed Dreams
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className={`
            ${
              sortOrder === "newest"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-slate-800/50"
            } text-slate-100 rounded-lg transition-all hover:scale-105 hover:shadow-lg shadow-blue-500/25
          `}
        >
          <CalendarPlus className="mr-2" />
          {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </Button>
      </div>
      <BookShelf
        title="Your Dreams"
        books={filteredAndSortedBooks.map((dream) => ({
          title: dream.coverData.title,
          url: dream.url,
          cover: dream.coverData?.coverImageUrl || "coverDefault.png",
          subtitle: dream.coverData.subtitle,
          stats: {
            views: dream.stats?.likes || 0,
            likes: dream.stats?.views || 0,
          },
        }))}
      />

      {/* Load More Button */}
      {hasMore && books.length >= 5 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMoreBooks}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? "Loading..." : "Load More Dreams"}
          </Button>
        </div>
      )}

      {!hasMore && books.length > 0 && (
        <div className="text-center text-slate-400 mt-6">
          No more dreams to load
        </div>
      )}
      {books.length === 0 && (
        <div className="max-w-7xl mx-auto p-6 text-center text-slate-400">
          No dreams found
        </div>
      )}
    </div>
  );
};

export default BookShelfContainer;
