import React from "react";
import { BookHeart, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dreamTagSuggestions from "../dreamTagSuggestions";
import Select, { MultiValue } from "react-select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useSession } from "next-auth/react";

interface Tag {
  id: number;
  name: string;
  label: string;
  value: string;
}

interface Stats {
  likes?: number;
  views?: number;
  comments?: number;
}

interface BookInfoProps {
  title: string;
  subtitle: string;
  username?: string;
  share: boolean;
  url: string;
  cover: string;
  stats: Stats;
}

const BookInfo: React.FC<BookInfoProps> = ({
  title,
  share,
  subtitle,
  url,
  stats,
  cover,
}) => {
  const [shareStatus, setShareStatus] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [maxTags, setMaxTags] = useState(false);
  const { data: session } = useSession();
  const formatter = new Intl.NumberFormat("en", { notation: "compact" });

  useEffect(() => {
    console.log(tags);
  }, [tags]);

  useEffect(() => {
    if (share) {
      setShareStatus(true);
    } else {
      setShareStatus(false);
    }
    console.log("Share status: ", shareStatus);
  }, [share, shareStatus]);

  const toggleShare = async () => {
    try {
      await fetch(`/api/dreams/updateShare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url, tags: tags }),
      });

      setShareStatus(!shareStatus);
    } catch (error) {
      console.error("Error updating share status:", error);
    }
  };

  const handleTagChange = (newTags: MultiValue<Tag>) => {
    if (newTags.length <= 5) {
      setTags(newTags as Tag[]);
      setMaxTags(false);
    } else {
      setMaxTags(true);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="group relative h-60 w-48  max-md:w-40 perspective-1000 ">
          <div className="absolute w-full h-full transition-all duration-500 transform-style-preserve-3d group-hover:rotate-y-5 group-hover:translate-x-4 group-hover:translate-y-[-10px] cursor-pointer">
            {shareStatus &&
            !window.location.pathname.startsWith("/dreams/profile") ? (
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Button className="absolute mr-1 p-2 right-0 top-14 rounded-full bg-red-500 z-40 hover:bg-red-600 -translate-y-16 transition-all duration-300 shadow-lg">
                    <Share className="w-6 h-6 text-white" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent
                  className="absolute bottom-full mb-2 left-1/2 -translate-y-9 -translate-x-1/2 w-auto min-w-0 p-0"
                  align="center"
                >
                  <div className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                    Shared
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : !shareStatus &&
              !window.location.pathname.startsWith("/dreams/profile") ? (
              <Dialog>
                <HoverCard openDelay={200} closeDelay={100}>
                  <DialogTrigger asChild>
                    <HoverCardTrigger asChild>
                      <Button className="absolute mr-1 p-2 right-0 top-14 rounded-full bg-green-600 z-40 -translate-y-16 transition-all duration-300 shadow-lg hover:bg-green-700">
                        <Share className="w-6 h-6 text-white" />
                      </Button>
                    </HoverCardTrigger>
                  </DialogTrigger>
                  <HoverCardContent
                    className="absolute bottom-full mb-2 left-1/2 -translate-y-9 -translate-x-1/2 w-auto min-w-0 p-0"
                    align="center"
                  >
                    <div className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                      Publish
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <DialogContent className="sm:max-w-[425px] bg-[#0c1b2d]">
                  <DialogHeader>
                    <DialogTitle>Share To Community</DialogTitle>
                    <DialogDescription>
                      Once you share it, you cannot take it back.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Card className="w-full bg-[#0c1b2d] text-white">
                      <CardHeader>
                        <CardTitle>Add Tags to Your Story</CardTitle>
                        {maxTags && (
                          <p className="text-red-500 text-sm">
                            You can only add up to 5 tags to your story
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="bg-[#0c1b2d]">
                        <Select
                          isMulti
                          name="DreamTags"
                          options={dreamTagSuggestions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={handleTagChange}
                          value={tags}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: "transparent",
                              borderColor: "transparent",
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              backgroundColor: "transparent",
                              color: "white",
                            }),
                            input: (provided) => ({
                              ...provided,
                              color: "white",
                            }),
                            option: (provided) => ({
                              ...provided,
                              backgroundColor: "transparent",
                              color: "white",
                              ":hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                              },
                            }),
                            multiValue: (provided) => ({
                              ...provided,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              color: "white",
                            }),
                            multiValueLabel: (provided) => ({
                              ...provided,
                              color: "white",
                            }),
                            menu: (provided) => ({
                              ...provided,
                              backgroundColor: "#0C1B2D",
                            }),
                            multiValueRemove: (provided) => ({
                              ...provided,
                              color: "white",
                              ":hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                color: "white",
                              },
                            }),
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={toggleShare}>
                      Publish
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
            <Link href={"/dreams/" + url}>
              <div className="absolute left-0 w-6 h-full bg-slate-700 transform origin-left skew-y-12"></div>
              <div className="absolute w-full h-full bg-slate-800 rounded-r-lg shadow-xl">
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
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-slate-900/80">
                  <h3 className="text-sm font-semibold text-slate-100 truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {subtitle}
                  </p>
                  <div className="flex gap-3 mt-2">
                    {stats?.likes !== undefined && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <BookHeart className="w-3 h-3" />
                        <span className="text-xs">
                          {formatter.format(stats.likes)}
                        </span>
                      </div>
                    )}
                    {stats?.views !== undefined && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Eye className="w-3 h-3" />
                        <span className="text-xs">
                          {formatter.format(stats.views)}
                        </span>
                      </div>
                    )}
                    {stats?.comments !== undefined && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-xs">
                          {formatter.format(stats.comments)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookInfo;
