"use client";
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useBookData } from "./BookData";

const DescriptionDream: React.FC = () => {
  const { description, setDescription } = useBookData();
  useEffect(() => {
    console.log(description);
  });
  return (
    <div className="space-y-4 m">
      <h2 className="text-lg font-semibold text-white ">Describe your dream</h2>
      <Textarea
        placeholder="Describe your dream in detail..."
        className="min-h-[200px] bg-[#0c1b2d] border-blue-500/20 text-blue-100 placeholder:text-blue-300/50 "
        id="prompt"
        onChange={(e) => setDescription(e.target.value)}
        required
      />
    </div>
  );
};

export default DescriptionDream;
