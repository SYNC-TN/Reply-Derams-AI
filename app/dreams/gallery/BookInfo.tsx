import React from "react";
import { BookHeart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
interface Stats {
  likes?: number;
  views?: number;
}
interface BookInfoProps {
  title: string;
  subtitle: string;
  url: string;
  cover: string;
  stats: {
    likes?: number;
    views?: number;
  };
}

const BookInfo: React.FC<BookInfoProps> = ({
  title,
  subtitle,
  url,
  stats,
  cover,
}) => {
  return (
    <Link href={url}>
      <div className="group relative h-60 w-48  max-md:w-40 perspective-1000 ">
        <div className="absolute w-full h-full transition-all duration-500 transform-style-preserve-3d group-hover:rotate-y-5 group-hover:translate-x-4 group-hover:translate-y-[-10px] cursor-pointer">
          {/* Book spine effect */}
          <div className="absolute left-0 w-6 h-full bg-slate-700 transform origin-left skew-y-12"></div>
          {/* Book cover */}
          <div className="absolute w-full h-full bg-slate-800 rounded-r-lg shadow-xl">
            {/* Cover image */}
            <div className="w-full h-4/5 overflow-hidden rounded-tr-lg">
              <Image
                src={cover || "/api/placeholder/192/230"}
                alt={title}
                layout="responsive"
                priority
                width={208}
                height={288}
                placeholder="blur"
                className="w-full h-full object-cover"
                blurDataURL={`data:image/svg+xml;base64,...`}
              />
            </div>
            {/* Book info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-slate-900/80">
              <h3 className="text-sm font-semibold text-slate-100 truncate">
                {title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
              {/* Stats */}
              <div className="flex gap-3 mt-2">
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
      </div>
    </Link>
  );
};

export default BookInfo;
