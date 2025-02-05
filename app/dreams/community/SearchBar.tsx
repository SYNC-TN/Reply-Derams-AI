"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CommunityBookProps } from "./types";
import SearchResults from "./SearchBook";
interface SearchBarProps {
  books: CommunityBookProps[];
}
const SearchBar = ({ books }: SearchBarProps) => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<CommunityBookProps[]>([]);
  useEffect(() => {
    const uniqueBookIds = new Set();

    const filteredBooks = books
      .filter((book) => {
        const title = book.coverData.title.toLowerCase();
        const searchTerm = search.toLowerCase();
        return title.includes(searchTerm);
      })
      .filter((book) => {
        const bookId = book.url || book.coverData.title;
        if (uniqueBookIds.has(bookId)) {
          return false;
        }
        uniqueBookIds.add(bookId);
        return true;
      });

    setResults(filteredBooks);
  }, [books, search]);
  return (
    <div className="fixed top-4 right-4 md:right-6 lg:right-8 z-50">
      <div
        className={`relative flex items-center transition-all duration-300 ease-in-out ${
          isFocused
            ? "w-[200px] sm:w-[300px] md:w-[400px] max-md:w-[300px] lg:w-[400px]"
            : "w-10 md:w-12 cursor-pointer"
        }`}
      >
        <Search
          size={20}
          className={`absolute left-3 transition-all duration-200 ${
            isFocused
              ? "text-blue-400 z-10"
              : "text-gray-400 hover:text-blue-400 cursor-pointer"
          }`}
          onClick={() => !isFocused && setIsFocused(true)}
        />
        <Input
          type="text"
          placeholder="Search dreams..."
          value={search}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.target.value) {
              setIsFocused(false);
            }
          }}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full transition-all duration-300 ease-in-out
            ${
              isFocused
                ? "opacity-100 pl-10 pr-4"
                : "opacity-0 pl-10 pr-4 cursor-pointer"
            }
            py-2 bg-[#0a1929]/80 border border-blue-900/30
            text-blue-100 placeholder-blue-400/50
            rounded-lg backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
            hover:bg-[#0a1929] hover:border-blue-800/50
            ${isFocused ? "shadow-lg shadow-blue-500/20" : ""}
          `}
        />
        {isFocused && results.length > 0 && search.length > 0 && (
          <SearchResults results={results} />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
