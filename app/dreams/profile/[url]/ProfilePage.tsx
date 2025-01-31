// ProfilePage.tsx
import React from "react";
import {
  MoreHorizontal,
  Mail,
  Link as LinkIcon,
  Edit,
  Share2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import BookShelf from "../../gallery/BookShelf";
import BookShelfContainer from "../../gallery/BookShelfContainer";

interface ProfilePageProps {
  name?: string;
  userData?: {
    profilePic?: string;
    DreamsCount?: number;
  };
  collection?: any[];
  isLoading?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  name = "",
  userData,
  collection = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1929] text-blue-100">
        <div className="h-48 w-full bg-gradient-to-r from-blue-900 to-purple-900" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative -mt-24">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-8 w-48 mt-4" />
          </div>
          <div className="relative mt-4 border-t border-blue-900/30 pt-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-[75%]" />
            <Skeleton className="h-8 w-[50%]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1929] text-blue-100">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Info Section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative -mt-24 sm:flex sm:items-end sm:space-x-5 pb-4">
            <div className="relative">
              <Avatar className="w-32 h-32 rounded-full ring-4 ring-[#0a1929]">
                <AvatarImage src={userData?.profilePic} />
                <AvatarFallback className="bg-blue-800">
                  {name ? name.slice(0, 2).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-6 sm:mt-16 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:min-w-0 flex-1">
                <h1 className="text-2xl font-bold truncate">{name}</h1>
                <p className="text-blue-400 mt-1">Dream Creator</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:mt-0 sm:space-x-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit size={16} />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="mt-2 sm:mt-0 flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-6 mt-4 border-t border-blue-900/30 pt-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xl">
                {userData?.DreamsCount}
              </span>
              <span className="text-blue-400 text-sm">Dreams</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xl">1.2k</span>
              <span className="text-blue-400 text-sm">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xl">450</span>
              <span className="text-blue-400 text-sm">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="bg-blue-900/20">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="collections">
            <div className="text-center py-12 text-blue-400">
              {collection.length === 0 || !collection ? (
                <span> No collections created yet </span>
              ) : (
                <BookShelf
                  title={`${name}'s Collections`}
                  books={collection.map((dream) => ({
                    title: dream.coverData.title,
                    url: dream.url,
                    username: dream.username,
                    share: dream.share,

                    cover: dream.coverData?.coverImageUrl || "coverDefault.png",
                    subtitle: dream.coverData.subtitle,
                    stats: {
                      views: dream.stats?.likes || 0,
                      likes: dream.stats?.views || 0,
                    },
                  }))}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="bg-blue-900/20 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">About Me</h3>
              <p className="text-blue-300">
                Dream creator passionate about storytelling and visual arts.
                Joined Replay Dreams to share my imagination with the world.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Mail size={16} />
                  <span>{name}@example.com</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <LinkIcon size={16} />
                  <a href="#" className="hover:text-blue-300">
                    portfolio.example.com
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
