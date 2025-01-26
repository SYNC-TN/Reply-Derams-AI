"use client";
import React, { useState } from "react";
import Categorie from "./categorie";
import HeaderBar from "./headerBar";

const AllCategories = () => {
  const [selectedTab, setSelectedTab] = useState("All");

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
  ];

  const categoriesToRender = selectedTab === "All" ? ListTitles : [selectedTab];

  return (
    <div className="flex flex-col space-y-8 w-full">
      <HeaderBar setTab={setSelectedTab} />
      {categoriesToRender.map((title, index) => (
        <div key={index} className="space-y-4 mb-24 pb-24">
          <Categorie BooksTitle={title} Tab={selectedTab} />
        </div>
      ))}
    </div>
  );
};

export default AllCategories;
