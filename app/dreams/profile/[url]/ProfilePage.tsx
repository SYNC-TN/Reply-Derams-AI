import React, { useEffect } from "react";
import {
  MoreHorizontal,
  Mail,
  Link as LinkIcon,
  Edit,
  Book,
  BookCheck,
  Share2,
  BookOpen,
  Image,
  Camera,
  Cross,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUp } from "lucide-react";
import BookShelf from "../../gallery/BookShelf";

interface ProfilePageProps {
  name?: string;
  userData?: {
    profilePic?: string;
    profileBanner?: string;
    isFollowing?: boolean;
    profileName?: string;
    DreamsCount?: number;
    FollowersCount?: number;
    FollowingCount?: number;
    isOwner?: boolean;
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
  const formatter = new Intl.NumberFormat("en", { notation: "compact" });
  const [isImageHovered, setIsImageHovered] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRefBanner = React.useRef<HTMLInputElement>(null);
  const [profilePicLoading, setProfilePicLoading] = React.useState(false);
  const [isFollowing, setIsFollowing] = React.useState(
    userData?.isFollowing || false
  );

  const [isUpdatingFollow, setIsUpdatingFollow] = React.useState(false);
  useEffect(() => {
    if (userData?.isFollowing !== undefined) {
      setIsFollowing(userData.isFollowing);
      console.log("isFollowing", userData.isFollowing);
    }
  }, [userData?.isFollowing]);
  useEffect(() => {
    setIsFollowing(userData?.isFollowing || false);
  }, [userData?.isFollowing]);
  const handleFollowClick = async () => {
    if (isUpdatingFollow) return;

    try {
      setIsUpdatingFollow(true);
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus); // Optimistic update

      const response = await fetch("/api/dreams/profile/follow", {
        method: "POST",
        body: JSON.stringify({
          profileName: userData?.profileName,
          followStatus: newFollowStatus,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(`Follow failed: ${data.error || "Unknown error"}`);
      }

      // No need to setIsFollowing here since we already did it optimistically
    } catch (error) {
      console.error("Follow operation failed:", error);
      setIsFollowing(!isFollowing); // Revert on error
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1929] text-blue-100">
        <div className="h-48 w-full bg-gradient-to-r from-blue-900 to-purple-900" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative -mt-24">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-8 w-48 mt-4" />
          </div>
          <div className="relative mt-4 border-t border-blue-900/30 pt-4 space-y-4 ">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-[75%]" />
            <Skeleton className="h-8 w-[50%]" />
          </div>
        </div>
      </div>
    );
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const triggerFileInputBanner = () => {
    if (fileInputRefBanner.current) {
      fileInputRefBanner.current.click();
    }
  };

  const UpdateProfile = async (
    image: any,
    path: string,
    width: number,
    height: number
  ) => {
    try {
      setProfilePicLoading(true);
      console.log("Starting Cloudinary upload...");
      const cloudinaryResponse = await fetch("/api/dreams/images", {
        method: "POST",
        body: JSON.stringify({
          image: image,
          path: path,
          width: width,
          height: height,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        console.error("Cloudinary upload failed:", errorData);
        throw new Error(
          `Cloudinary upload failed: ${errorData.error || "Unknown error"}`
        );
      }

      const cloudinaryData = await cloudinaryResponse.json();
      console.log("Cloudinary upload successful:", cloudinaryData);

      const profileResponse = await fetch("/api/dreams/profile/updatePFP", {
        method: "POST",
        body: JSON.stringify({ url: cloudinaryData.url, path: path }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        console.error("Profile update failed:", profileData);
        throw new Error(
          `Profile update failed: ${profileData.error || "Unknown error"}`
        );
      }

      console.log("Profile update successful:", profileData);
      setImage(cloudinaryData.url);

      window.location.reload();
    } catch (error) {
      console.error("Detailed error:", error);
      throw error;
    } finally {
      setProfilePicLoading(false);
    }
  };
  const LoadingProfilePic = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin border-1 w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1929] text-blue-100">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-blue-900 to-purple-900">
          {userData?.isOwner && (
            <div
              className={`absolute w-10 h-10 cursor-pointer transition-opacity duration-200 top-5 right-4  z-50
                    `}
              onClick={userData?.isOwner ? triggerFileInputBanner : undefined}
            >
              <Camera className="w-full h-full text-white opacity-70 hover:opacity-100" />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRefBanner}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              console.log("File selected:", file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  UpdateProfile(reader.result, "BannerImages", 970, 250);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <img
            src={
              userData?.profileBanner ||
              "https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg"
            }
            className="object-cover w-full h-full"
          />
        </div>

        {/* Profile Info Section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative -mt-24 sm:flex sm:items-end sm:space-x-5 pb-4">
            <div
              className="relative group"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  console.log("File selected:", file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      UpdateProfile(reader.result, "ProfileImages", 320, 320);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              <Avatar
                className="w-32 h-32 rounded-full ring-4 ring-[#0a1929] relative"
                onClick={userData?.isOwner ? triggerFileInput : undefined}
              >
                {userData?.isOwner && (
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 
                      cursor-pointer transition-opacity duration-200 
                      ${isImageHovered ? "opacity-100" : ""}`}
                  >
                    <ImageUp className="w-[30%] h-[30%] text-white" />
                  </div>
                )}
                {profilePicLoading ? <LoadingProfilePic /> : null}

                <AvatarImage src={userData?.profilePic || image || undefined} />

                <AvatarFallback className="bg-blue-800">
                  {name ? name.slice(0, 2).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Rest of the component remains the same */}
            <div className="mt-6 sm:mt-16 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:min-w-0 flex-1">
                <h1 className="text-2xl font-bold truncate">{name}</h1>
                <p className="text-blue-400 mt-1">Dream Creator</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:mt-0 sm:space-x-3">
                {userData?.isOwner ? (
                  <Link href={`/dreams/settings`}>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 
                              bg-gradient-to-r from-blue-700 to-blue-800 
                              text-white 
                              hover:from-blue-800 hover:to-blue-900 
                              transition-all duration-300 
                              border-transparent 
                              shadow-md 
                              hover:shadow-lg 
                              focus:ring-2 
                              focus:ring-blue-500 
                              focus:ring-opacity-50"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </Button>
                  </Link>
                ) : null}
                {!userData?.isOwner ? (
                  <Button
                    variant="outline"
                    onClick={handleFollowClick}
                    disabled={isUpdatingFollow}
                    className="flex items-center gap-2 
                      bg-gradient-to-r from-blue-700 to-blue-800 
                      text-white 
                      hover:from-blue-800 hover:to-blue-900 
                      transition-all duration-300 
                      border-transparent 
                      shadow-md 
                      hover:shadow-lg 
                      focus:ring-2 
                      focus:ring-blue-500 
                      focus:ring-opacity-50"
                  >
                    {isFollowing ? <BookCheck size={16} /> : <Book size={16} />}
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                ) : null}
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
              <span className="font-semibold text-xl">
                {formatter.format(userData?.FollowersCount as number)}
              </span>
              <span className="text-blue-400 text-sm">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xl">
                {formatter.format(userData?.FollowingCount as number)}
              </span>
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
              {userData?.isOwner ? (
                <Link href="/dreams/">
                  <Button
                    className="absolute right-16 max-sm:-translate-y-24 max-sm:right-4 bg-blue-900/50 hover:bg-blue-900/80 cursor-pointer z-50"
                    variant="ghost"
                  >
                    <Cross />
                  </Button>
                </Link>
              ) : null}
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
                      likes: dream.stats?.likes || 0,
                      views: dream.stats?.views || 0,
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
              <div className="mt-6 space-y-3"></div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
