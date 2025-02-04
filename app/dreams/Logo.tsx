"use client";
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface LogoProps {
  test: string;
}

const Logo = ({ test }: LogoProps) => {
  const { state } = useSidebar();
  const isTestTrue = test === "true";

  return (
    <div
      className={`logo transition-all duration-500 ${
        isTestTrue && state === "expanded" ? "hidden opacity-0" : "opacity-100"
      }`}
    >
      {/* Default (Desktop) Logo */}
      <div className="hidden md:flex items-center space-x-1">
        <span className="text-xl font-bold text-white">Replay</span>
        <span className="text-sky-400">Dreams</span>
      </div>

      {/* Mobile Logo */}
      <div className="md:hidden flex items-center space-x-1">
        {state === "expanded" ? (
          // Expanded state - show full logo if needed
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-white">Replay</span>
            <span className="text-sky-400">Dreams</span>
          </div>
        ) : (
          // Collapsed state - show abbreviated logo
          <div className="flex items-center">
            <span className="text-lg font-bold text-white">Replay</span>
            <span className="text-sky-400">Dreams</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
