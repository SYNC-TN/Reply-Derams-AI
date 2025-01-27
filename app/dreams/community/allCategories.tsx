"use client";
import React, { useState, memo } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const HeaderBar = dynamic(() => import("./headerBar"), {
  loading: () => (
    <div className="w-full h-8 bg-slate-800 animate-pulse rounded-md"></div>
  ),
});

const Categorie = dynamic(() => import("./categorie"), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-72 w-52 rounded-xl" />
        ))}
      </div>
    </div>
  ),
});

const ListTitles = [
  "Adventure",
  "Action",
  "Horror",
  "Mystery",
  "Comedy",
  "Drama",
  "Fantasy",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "History",
  "Biography",
  "Documentary",
  "Crime",
  "Animation",
  "Family",
  "Music",
  "Sport",
  "War",
  "Western",
  "Musical",
  "Supernatural",
] as const;

const AllCategories = memo(() => {
  const [selectedTab, setSelectedTab] = useState<string>("All");

  const categoriesToRender = selectedTab === "All" ? ListTitles : [selectedTab];

  return (
    <div className="flex flex-col space-y-8 w-full">
      <HeaderBar setTab={setSelectedTab} />
      {categoriesToRender.map((title, index) => (
        <div key={`${title}-${index}`} className="space-y-4">
          <Categorie BooksTitle={title} Tab={selectedTab} />
        </div>
      ))}
    </div>
  );
});

AllCategories.displayName = "AllCategories";
export default AllCategories;
