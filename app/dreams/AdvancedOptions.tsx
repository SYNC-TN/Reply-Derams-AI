import React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { useBookData } from "./BookData";

const AdvancedOptions = () => {
  const {
    bookTone,
    setBookTone,
    storyLength,
    setStoryLength,
    perspective,
    setPerspective,
    genre,
    setGenre,
  } = useBookData();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Card className="bg-[#0c1b2d] border-blue-500/20 p-6 space-y-6 my-5">
      <motion.h2 className="text-lg font-semibold text-white" {...fadeIn}>
        Advanced Story Options
      </motion.h2>
      <div className="space-y-4">
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <label className="text-sm text-blue-200 mb-2 block">
            Tone & Mood
          </label>
          <Select value={bookTone} onValueChange={setBookTone}>
            <SelectTrigger className="bg-[#0a1525] border-blue-500/20 text-blue-100 hover:bg-[#111e2f] transition-colors">
              <SelectValue placeholder="Select story tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inspirational">Inspirational</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="whimsical">Whimsical</SelectItem>
              <SelectItem value="suspenseful">Suspenseful</SelectItem>
              <SelectItem value="romantic">Romantic</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <label className="text-sm text-blue-200 mb-2 block">
            Story Length
          </label>
          <Select value={storyLength} onValueChange={setStoryLength}>
            <SelectTrigger className="bg-[#0a1525] border-blue-500/20 text-blue-100 hover:bg-[#111e2f] transition-colors">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (1-2 pages)</SelectItem>
              <SelectItem value="medium">Medium (5-7 pages)</SelectItem>
              <SelectItem value="long">Long (10+ pages)</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <label className="text-sm text-blue-200 mb-2 block">
            Narrative Perspective
          </label>
          <Select value={perspective} onValueChange={setPerspective}>
            <SelectTrigger className="bg-[#0a1525] border-blue-500/20 text-blue-100 hover:bg-[#111e2f] transition-colors">
              <SelectValue placeholder="Select perspective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">First Person</SelectItem>
              <SelectItem value="third">Third Person</SelectItem>
              <SelectItem value="omniscient">Omniscient</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
          <label className="text-sm text-blue-200 mb-2 block">Genre</label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger className="bg-[#0a1525] border-blue-500/20 text-blue-100 hover:bg-[#111e2f] transition-colors">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="scifi">Science Fiction</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="historical">Historical Fiction</SelectItem>
              <SelectItem value="literary">Literary Fiction</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    </Card>
  );
};

export default AdvancedOptions;
