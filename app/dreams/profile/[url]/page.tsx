// ProfileContainer.tsx
"use client";
import React from "react";
import ProfilePage from "./ProfilePage";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface UserData {
  name: string;
  profilePic: string;
  isFollowing: boolean;
  profileBanner: string;
  profileName: string;
  FollowersCount: number;
  FollowingCount: number;
  isOwner: boolean;
  collection: any[];
  DreamsCount: number;
}

const ProfileContainer = () => {
  const { data: session } = useSession();
  const params = useParams<{ url: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log("data session is", session);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!params?.url) {
          throw new Error("No profile URL provided");
        }

        const response = await fetch(`/api/dreams/profile/${params.url}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched user data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.url) {
      fetchUserData();
    }
  }, [params?.url]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1929] text-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-blue-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProfilePage
      name={userData?.name}
      userData={{
        profilePic: userData?.profilePic,
        profileBanner: userData?.profileBanner,
        DreamsCount: userData?.DreamsCount,
        isFollowing: userData?.isFollowing,
        profileName: userData?.profileName,
        FollowersCount: userData?.FollowersCount,
        FollowingCount: userData?.FollowingCount,
        isOwner: userData?.isOwner,
      }}
      isLoading={isLoading}
      collection={userData?.collection}
    />
  );
};

export default ProfileContainer;
