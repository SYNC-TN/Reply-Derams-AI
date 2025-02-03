import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
type SliderProps = React.ComponentProps<typeof Slider>;
interface BackgroundAudioSliderProps {
  setValue: (value: number) => void;
  defaultValue: number[];
}

const BackgroundAudioSlider = ({
  className,
  setValue,
  defaultValue,
  ...props
}: SliderProps & BackgroundAudioSliderProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 460);
  }, []);
  return (
    <Slider
      defaultValue={[0.5]}
      orientation={!isMobile ? "vertical" : "horizontal"}
      max={1.0}
      value={defaultValue}
      onValueChange={(value) => setValue(value[0])}
      step={0.1}
      className={cn(
        "w-[40%] cursor-pointer  max-sm:left-8 max-sm:bottom-14 max-sm:translate-y-32 z-50",
        className
      )}
      {...props}
    />
  );
};

export default BackgroundAudioSlider;
