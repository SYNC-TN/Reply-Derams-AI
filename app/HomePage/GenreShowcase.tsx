import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BookOpen,
  Wand2,
  Rocket,
  Heart,
  Skull,
  Share,
  Search,
} from "lucide-react";

const GenreShowcase = () => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const sectionRef = useRef(null);
  // Modified useInView configuration to be more precise
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2, // Requires 20% of the element to be visible
    margin: "0px", // Remove the negative margin
  });

  const genres = [
    {
      name: "Mystical Dreams",
      icon: <Wand2 className="w-8 h-8" />,
      description:
        "Transform your enchanted dreams into magical visual stories",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      name: "Future Visions",
      icon: <Rocket className="w-8 h-8" />,
      description: "Turn your futuristic dreams into stunning sci-fi visuals",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      name: "Love & Memory",
      icon: <Heart className="w-8 h-8" />,
      description: "Capture your most cherished romantic dreams and memories",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Dark Dreams",
      icon: <Skull className="w-8 h-8" />,
      description: "Visualize your mysterious and haunting dream experiences",
      gradient: "from-slate-800 to-slate-900",
    },
    {
      name: "Dream Mystery",
      icon: <Search className="w-8 h-8" />,
      description: "Explore and decode your most enigmatic dreams",
      gradient: "from-amber-500 to-red-500",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#0a192f] to-[#162a4a] py-24 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="opacity-0" // Add initial opacity-0 class
        >
          <h2 className="text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Your Dreams, Any Style
          </h2>
          <p className="text-xl text-blue-200 text-center mb-16 max-w-3xl mx-auto">
            From mystical journeys to future visions, our AI transforms your
            dreams into breathtaking visual stories. Your subconscious, brought
            to life!
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 opacity-0" // Add initial opacity-0 class
        >
          {genres.map((genre) => (
            <motion.div
              key={genre.name}
              variants={item}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredGenre(genre.name)}
              onMouseLeave={() => setHoveredGenre(null)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`h-72 rounded-xl p-6 bg-gradient-to-b ${genre.gradient} bg-opacity-20 backdrop-blur-sm
              border border-white/10 hover:border-white/20`}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <motion.div
                    animate={
                      hoveredGenre === genre.name
                        ? { y: -8, scale: 1.1 }
                        : { y: 0, scale: 1 }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    {genre.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-center text-white">
                    {genre.name}
                  </h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredGenre === genre.name ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-center text-sm text-blue-100"
                  >
                    {genre.description}
                  </motion.p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredGenre === genre.name ? 0.3 : 0 }}
                className={`absolute inset-0 -z-10 rounded-xl
              bg-gradient-to-b ${genre.gradient} blur-xl`}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 opacity-0" // Add initial opacity-0 class
        >
          {[
            {
              title: "Dream to Story",
              icon: <BookOpen className="w-10 h-10 text-blue-300" />,
              description:
                "Transform your dreams into stunning visual narratives with our AI-powered dream interpretation",
              bgColor: "bg-blue-500/20",
            },
            {
              title: "Limitless Dreams",
              icon: <Wand2 className="w-10 h-10 text-purple-300" />,
              description:
                "Every dream is unique - our AI adapts to capture your personal dream experience perfectly",
              bgColor: "bg-purple-500/20",
            },
            {
              title: "Share Dreams",
              icon: <Share className="w-10 h-10 text-cyan-300" />,
              description:
                "Connect with fellow dreamers and share your visualized dream stories with the world",
              bgColor: "bg-cyan-500/20",
            },
          ].map((feature) => (
            <div key={feature.title} className="text-center group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-20 h-20 mx-auto mb-6 rounded-full ${feature.bgColor} 
                flex items-center justify-center `}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-blue-200">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GenreShowcase;
