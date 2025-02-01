import React from "react";
import { Sparkles } from "lucide-react";
import { useBookData } from "./BookData";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
interface PixelData {
  x: number;
  y: number;
  color: string;
  size: number;
  counter: number;
  isReverse: boolean;
  isShimmer: boolean;
  isIdle: boolean;
  sizeStep: number;
  minSize: number;
  maxSize: number;
  counterStep: number;
}

const SoundEffectBtn = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pixelsRef = React.useRef<PixelData[]>([]);
  const animationRef = React.useRef<number | null>(null);
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const { soundEffect, setSoundEffect } = useBookData();

  const colors = ["#e0f2fe", "#7dd3fc", "#0ea5e9"];
  const gap = 4;
  const speed = 0.025;

  const getDistanceToCanvasCenter = (
    x: number,
    y: number,
    width: number,
    height: number
  ): number => {
    const dx = x - width / 2;
    const dy = y - height / 2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const createPixel = (
    x: number,
    y: number,
    color: string,
    delay: number
  ): PixelData => ({
    x,
    y,
    color,
    size: 0,
    counter: 0,
    isReverse: false,
    isShimmer: false,
    isIdle: false,
    sizeStep: Math.random() * 0.4,
    minSize: 0.5,
    maxSize: Math.random() * 1.5 + 0.5,
    counterStep:
      Math.random() * 4 +
      (canvasRef.current
        ? (canvasRef.current.width + canvasRef.current.height) * 0.01
        : 0),
  });

  const drawPixel = React.useCallback(
    (context: CanvasRenderingContext2D, pixel: PixelData) => {
      const centerOffset = 2 * 0.5 - pixel.size * 0.5;
      context.fillStyle = pixel.color;
      context.fillRect(
        pixel.x + centerOffset,
        pixel.y + centerOffset,
        pixel.size,
        pixel.size
      );
    },
    []
  );

  const updatePixel = (
    pixel: PixelData,
    action: "appear" | "disappear"
  ): PixelData => {
    const newPixel = { ...pixel };

    if (action === "appear") {
      if (newPixel.counter <= newPixel.counterStep) {
        newPixel.counter += newPixel.counterStep;
        return newPixel;
      }

      if (newPixel.size >= newPixel.maxSize) {
        newPixel.isShimmer = true;
      }

      if (newPixel.isShimmer) {
        if (newPixel.size >= newPixel.maxSize) {
          newPixel.isReverse = true;
        } else if (newPixel.size <= newPixel.minSize) {
          newPixel.isReverse = false;
        }
        newPixel.size += newPixel.isReverse ? -speed : speed;
      } else {
        newPixel.size += newPixel.sizeStep;
      }
    } else {
      newPixel.isShimmer = false;
      newPixel.counter = 0;

      if (newPixel.size <= 0) {
        newPixel.isIdle = true;
      } else {
        newPixel.size -= 0.1;
      }
    }

    return newPixel;
  };

  const initializePixels = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const pixels: PixelData[] = [];

    for (let x = 0; x < canvas.width; x += gap) {
      for (let y = 0; y < canvas.height; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = getDistanceToCanvasCenter(
          x,
          y,
          canvas.width,
          canvas.height
        );
        pixels.push(createPixel(x, y, color, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap]);

  const animate = React.useCallback(
    (action: "appear" | "disappear") => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const frame = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        let allIdle = true;
        pixelsRef.current = pixelsRef.current.map((pixel) => {
          const updatedPixel = updatePixel(pixel, action);
          if (!updatedPixel.isIdle) allIdle = false;
          drawPixel(context, updatedPixel);
          return updatedPixel;
        });

        if (allIdle && action === "disappear") {
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
        } else {
          animationRef.current = requestAnimationFrame(frame);
        }
      };

      animationRef.current = requestAnimationFrame(frame);
    },
    [drawPixel]
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initializePixels();

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializePixels();
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [initializePixels]);

  React.useEffect(() => {
    if (soundEffect) {
      animate("appear");
    } else {
      animate("disappear");
    }
  }, [soundEffect, animate]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!soundEffect) {
      animate("appear");
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!soundEffect) {
      animate("disappear");
    }
  };

  const handleClick = () => {
    setSoundEffect(!soundEffect);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={`absolute w-[50px] h-[45px] top-9 max-sm:right-4 right-[15%] border overflow-hidden grid place-items-center bg-sky-950 transition-colors duration-300 cursor-pointer rounded-lg
        ${
          soundEffect
            ? "border-[#0ea5e9]"
            : "border-zinc-800 hover:border-[#0ea5e9]"
        }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          role="button"
          aria-label="Toggle sound effects"
          aria-pressed={soundEffect}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <Sparkles
            className={`relative z-10 w-[30%] h-auto transition-all duration-300 
          ${
            soundEffect
              ? "text-[#0ea5e9] scale-110"
              : isHovered
              ? "text-[#0ea5e9] scale-110"
              : "text-zinc-600"
          }`}
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        asChild
        className="bg-gray-700 absolute bottom-0 mb-2 left-1/2 translate-y-11 -translate-x-1/2 w-auto min-w-0 p-0"
        align="center"
      >
        <p className="bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
          Sound Effects {soundEffect ? "On" : "Off"}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SoundEffectBtn;
