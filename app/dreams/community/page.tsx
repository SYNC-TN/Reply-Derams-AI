import React from "react";
import AllCategories from "./allCategories";

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic";

const page = () => {
  return (
    <div className="flex max-w-7xl mx-auto p-10 space-y-8">
      <AllCategories />
    </div>
  );
};

export default page;
