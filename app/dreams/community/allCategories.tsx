import React from "react";
import Categorie from "./categorie";
const AllCategories = () => {
  const ListTitles = ["Adventure", "Nightmares", "Nightmares"];

  return (
    <div className="flex flex-col space-y-8 w-full">
      {ListTitles.map((title, index) => (
        <Categorie key={index} BooksTitle={title} />
      ))}
    </div>
  );
};

export default AllCategories;
