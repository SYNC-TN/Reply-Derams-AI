"use client";
import React, { useState } from "react";
import { Moon, Sparkles, BookOpen, Camera, Share, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import GenreShowcase from "./GenreShowcase";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SessionProvider, useSession } from "next-auth/react";
import AuthDialog from "../AuthPage/AuthDialog";

const StarField = () => {
  const stars = Array.from({ length: 50 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((style, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={style}
        />
      ))}
    </div>
  );
};

// Separate component for authenticated content in nav
const AuthenticatedContent = ({
  onStartCreating,
}: {
  onStartCreating: () => void;
}) => {
  const { data: session } = useSession();

  if (session?.user?.id) {
    return (
      <Link href="/dreams">
        <Button className="bg-blue-500 hover:bg-blue-600">
          Start Creating
        </Button>
      </Link>
    );
  }

  return (
    <Button className="bg-blue-500 hover:bg-blue-600" onClick={onStartCreating}>
      Start Creating
    </Button>
  );
};

// Separate component for authenticated content in hero section
const HeroAuthContent = ({
  onStartCreating,
}: {
  onStartCreating: () => void;
}) => {
  const { data: session } = useSession();

  if (session?.user?.id) {
    return (
      <Link href="/dreams">
        <Button className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-6">
          <Sparkles className="w-5 h-5 mr-2" />
          Create Your Dream Story
        </Button>
      </Link>
    );
  }

  return (
    <Button
      className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-6"
      onClick={onStartCreating}
    >
      <Sparkles className="w-5 h-5 mr-2" />
      Create Your Dream Story
    </Button>
  );
};

// Main HomePage component
const HomePage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleStartCreating = () => {
    setIsAuthOpen(true);
  };

  return (
    <SessionProvider>
      <div className="relative">
        <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-[#162a4a] to-[#0a192f] text-white">
          <StarField />

          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/80 backdrop-blur-sm px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3 logo w-auto h-12">
                <img
                  src="/logo.png"
                  className="h-12 w-12 transition-transform transform scale-150 mt-2"
                  alt="ReplayDreams Logo"
                />
                <span className="text-3xl font-extrabold tracking-tight max-md:text-xl">
                  Replay<span className="text-sky-400">Dreams</span> AI
                </span>
              </div>
              <div className="space-x-6 hidden md:flex">
                <Button
                  variant="ghost"
                  className="text-blue-200 hover:text-white hover:bg-slate-400"
                >
                  Gallery
                </Button>
                <Button
                  variant="ghost"
                  className="text-blue-200 hover:text-white hover:bg-slate-400"
                >
                  How It Works
                </Button>
                <Button
                  variant="ghost"
                  className="text-blue-200 hover:text-white hover:bg-slate-400"
                >
                  Pricing
                </Button>
                <AuthenticatedContent onStartCreating={handleStartCreating} />
              </div>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger>
                    <Menu className="w-6 h-6 text-blue-200 hover:text-white transition-colors" />
                  </SheetTrigger>
                  <SheetContent className="bg-gradient-to-b from-[#0a192f] to-[#162a4a] border-l border-blue-500/20">
                    <SheetHeader className="mb-8">
                      <SheetTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                        ReplayDreams AI
                      </SheetTitle>
                      <SheetDescription className="text-blue-200">
                        Transform your dreams into visual stories
                      </SheetDescription>
                    </SheetHeader>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="space-y-6">
                        <Link href="/gallery" className="block">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-lg font-medium text-blue-200 hover:text-white hover:bg-blue-900/40"
                          >
                            <Camera className="w-5 h-5 mr-3" />
                            Gallery
                          </Button>
                        </Link>

                        <Link href="/how-it-works" className="block">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-lg font-medium text-blue-200 hover:text-white hover:bg-blue-900/40"
                          >
                            <BookOpen className="w-5 h-5 mr-3" />
                            How It Works
                          </Button>
                        </Link>

                        <Link href="/pricing" className="block">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-lg font-medium text-blue-200 hover:text-white hover:bg-blue-900/40"
                          >
                            <Moon className="w-5 h-5 mr-3" />
                            Pricing
                          </Button>
                        </Link>
                      </div>

                      <div className="pt-6 mt-6 border-t border-blue-500/20">
                        <AuthenticatedContent
                          onStartCreating={handleStartCreating}
                        />
                      </div>
                    </motion.div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-4 left-4 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl"></div>
                    <div className="absolute top-4 right-4 w-24 h-24 bg-purple-500/10 rounded-full filter blur-2xl"></div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <main className="relative pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  Transform Your Dreams Into Art
                </h1>
                <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
                  Watch your dreams, memories, and stories come to life through
                  AI-generated visual narratives. Turn your imagination into
                  stunning artwork.
                </p>

                <div className="flex justify-center space-x-6 mb-20 max-md:flex-col max-md:space-x-0 max-md:space-y-4">
                  <HeroAuthContent onStartCreating={handleStartCreating} />
                  <Button
                    variant="outline"
                    className="text-lg px-8 py-6 border-blue-300 text-blue-300 hover:bg-blue-900/30 bg-gray-900/95"
                  >
                    Explore Gallery
                  </Button>
                </div>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                <div className="bg-blue-900/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30">
                  <BookOpen className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Visual Stories</h3>
                  <p className="text-blue-200">
                    Transform your dreams into stunning visual narratives with
                    AI-powered art generation
                  </p>
                </div>
                <div className="bg-blue-900/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30">
                  <Camera className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Memory Fusion</h3>
                  <p className="text-blue-200">
                    Blend your photos with AI-generated elements to create
                    magical scenes
                  </p>
                </div>
                <div className="bg-blue-900/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30">
                  <Share className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Share & Connect
                  </h3>
                  <p className="text-blue-200">
                    Join our community of dreamers and share your visual stories
                    with the world
                  </p>
                </div>
              </motion.div>
            </div>
          </main>
        </div>

        <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <GenreShowcase />

        {/* Floating Elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>
    </SessionProvider>
  );
};

export default HomePage;
