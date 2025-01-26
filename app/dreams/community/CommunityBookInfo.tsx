import React from "react";
import { BookHeart, Eye, Share2, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
interface Stats {
  likes?: number;
  views?: number;
  shares?: number;
}

interface CommunityBookProps {
  title: string;
  subtitle: string;
  url: string;
  cover: string;
  stats: Stats;
  author: {
    name: string;
    avatar?: string;
    username: string;
  };
  createdAt: string;
}

const CommunityBookInfo: React.FC<CommunityBookProps> = ({
  title,
  subtitle,
  url,
  stats,
  cover,
  author,
  createdAt,
}) => {
  return (
    <Link href={url}>
      <div className="group relative h-72 w-52 max-md:w-44 perspective-1000">
        <div className="absolute w-full h-full transition-all duration-500 transform-style-preserve-3d group-hover:rotate-y-5 group-hover:translate-x-4 group-hover:translate-y-[-10px] cursor-pointer">
          {/* Book spine effect */}
          <div className="absolute left-0 w-6 h-full bg-slate-700 transform origin-left skew-y-12"></div>

          {/* Book cover */}
          <div className="absolute w-full h-full bg-slate-800 rounded-r-lg shadow-xl">
            {/* Author info at the top */}
            <div className="absolute top-0 left-0 right-0 p-2 bg-slate-900/90 rounded-tr-lg z-10">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">
                    {author.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    @{author.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Cover image */}
            <div className="w-full h-4/5 overflow-hidden rounded-tr-lg">
              <Image
                src={cover || "/defaultCover.png"}
                alt={title}
                width={208} // Adjust the width as needed
                height={288} // Adjust the height as needed
                className="w-full h-full object-cover"
              />
            </div>

            {/* Book info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-slate-900/80">
              <h3 className="text-sm font-semibold text-slate-100 truncate">
                {title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>

              {/* Stats and date */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-3">
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
                  {stats?.shares !== undefined && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Share2 className="w-3 h-3" />
                      <span className="text-xs">{stats.shares}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityBookInfo;
