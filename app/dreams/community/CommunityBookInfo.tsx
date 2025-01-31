import React, { useEffect } from "react";
import { BookHeart, Eye, Share2, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import type { CommunityBookProps, Author } from "./types";

const defaultAuthor: Author = {
  name: "Anonymous",
  avatar: "https://i.ibb.co/9TN2nT1/rb-4707.png",
  username: "username",
};

const CommunityBookInfo: React.FC<CommunityBookProps> = ({
  title,
  username,
  profilePic,
  url,
  stats,
  coverData,
  author = defaultAuthor,
  createdAt,
}) => {
  const authorData: Author = {
    ...defaultAuthor,
    ...author,
  };
  const [hover, setHover] = React.useState(false);

  const profileUrl = `/dreams/profile/${(username || "anonymous")
    .toLowerCase()
    .replaceAll(/\s+/g, "-")}`;

  return (
    <div className="group relative h-72 w-52 max-md:w-44 perspective-1000">
      <div className="absolute w-full h-full transition-all duration-500 transform-style-preserve-3d group-hover:rotate-y-5 group-hover:translate-x-4 group-hover:translate-y-[-10px] cursor-pointer">
        {/* Book spine effect */}
        <div className="absolute left-0 w-6 h-full bg-slate-700 transform origin-left skew-y-12"></div>

        {/* Book cover */}
        <div className="absolute w-full h-full bg-slate-800 rounded-r-lg shadow-xl ">
          {/* Author info at the top */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = profileUrl;
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="absolute top-0 left-0 right-0 p-2 bg-slate-900/90 rounded-tr-lg z-10 cursor-pointer  hover:bg-slate-900/70   transition-colors "
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profilePic} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p
                  className={
                    "text-xs font-medium text-slate-200 truncate " +
                    (hover ? "text-sky-600" : "")
                  }
                >
                  {username || "anonymous"}
                </p>
              </div>
            </div>
          </div>

          <Link href={url} className="block w-full h-full">
            {/* Cover image */}
            <div className="w-full h-full overflow-hidden rounded-xl">
              <Image
                src={coverData.coverImageUrl}
                alt={title}
                width={208}
                height={288}
                layout="responsive"
                priority
                className="w-full h-full object-cover"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,...`}
              />
            </div>

            {/* Book info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-slate-900/80">
              <h3 className="text-sm font-semibold text-slate-100 truncate">
                {coverData.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {coverData.subtitle}
              </p>

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
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityBookInfo;
