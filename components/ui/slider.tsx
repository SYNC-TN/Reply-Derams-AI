import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as styles from "./slider.module.css";
import { cn } from "../../lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none items-center cursor-pointer group",
      styles.default["SliderRoot"],
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        "bg-white/10",
        styles.default["SliderTrack"]
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full",
          "bg-gradient-to-r from-blue-400/80 to-purple-400/80",
          styles.default["SliderRange"]
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full",
        "bg-gradient-to-b from-white to-blue-100",
        "shadow-[0_0_10px_rgba(255,255,255,0.5)]",
        "border border-white/20",
        "transition-transform duration-200",
        "hover:scale-110",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
        "group-hover:shadow-[0_0_15px_rgba(255,255,255,0.7)]",
        "disabled:pointer-events-none disabled:opacity-50",
        styles.default["SliderThumb"]
      )}
    />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
