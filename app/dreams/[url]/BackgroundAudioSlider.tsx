import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
type SliderProps = React.ComponentProps<typeof Slider>;
interface BackgroundAudioSliderProps {
  setValue: (value: number) => void;
}

const BackgroundAudioSlider = ({
  className,
  setValue,
  ...props
}: SliderProps & BackgroundAudioSliderProps) => {
  return (
    <Slider
      defaultValue={[0.5]}
      orientation="vertical"
      max={1.0}
      onValueChange={(value) => setValue(value[0])}
      step={0.1}
      className={cn("w-[40%] cursor-pointer", className)}
      {...props}
    />
  );
};

export default BackgroundAudioSlider;
