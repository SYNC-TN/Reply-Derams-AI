import React from "react";
import { BookHeart, Eye, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import type { CommunityBookProps } from "./types";

const SearchResultCard: React.FC<CommunityBookProps> = ({
  username,
  url,
  stats,
  profilePic,
  coverData,
  createdAt,
}) => {
  return (
    <Link href={url}>
      <div className="group w-full bg-[#0a1929]/80 hover:bg-[#0a1929] border border-blue-900/20 hover:border-blue-800/50 rounded-lg p-3 transition-all duration-200 backdrop-blur-sm">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="relative w-16 h-20 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md" />
            <Image
              src={coverData.coverImageUrl}
              alt={coverData.title}
              width={64}
              height={80}
              className="rounded-md object-cover w-full h-full"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,...`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profilePic} />
                <AvatarFallback>
                  <User className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-blue-400">@{username}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
              {coverData.title}
            </h3>
            <p className="text-xs text-slate-400 truncate mt-1">
              {coverData.subtitle}
            </p>

            {/* Stats */}
            <div className="flex gap-4 mt-2">
              {stats?.likes !== undefined && (
                <div className="flex items-center gap-1 text-slate-400">
                  <BookHeart className="w-3 h-3" />
                  <span className="text-xs">{stats.likes}</span>
                </div>
              )}
              {stats?.views !== undefined && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs">{stats.views}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Search Results Container
const SearchResults: React.FC<{ results: CommunityBookProps[] }> = ({
  results,
}) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-blue-900/30 bg-[#0a1929]/95 backdrop-blur-md shadow-xl">
      <div className="p-2 space-y-2">
        {results.map((result, index) => (
          <SearchResultCard key={index} {...result} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
