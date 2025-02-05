import React from "react";
import { Star } from "lucide-react";
import "./dreams.css";
import Create from "../../components/create";

export default function Dreams() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-8 ">
      <h1 className="text-2xl font-semibold text-white mb-2">Dreams</h1>
      <p className="text-blue-200 mb-12">
        Create your personalized dream visualization.
      </p>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center bg-blue-900/10 border border-blue-500/20 rounded-lg py-16 px-4">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 star">
          <Star className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Visualize your dreams
        </h2>
        <p className="text-blue-200 text-center max-w-md mb-8">
          Transform your dreams and ideas into stunning visual stories using AI.
        </p>
        <Create />
      </div>
    </div>
  );
}
