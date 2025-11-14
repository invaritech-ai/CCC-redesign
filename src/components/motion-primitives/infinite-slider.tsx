import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InfiniteSliderProps {
  children: ReactNode[];
  speed?: number;
  speedOnHover?: number;
  gap?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  speed = 40,
  speedOnHover = 20,
  gap = 64,
  className,
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const animationDuration = isHovered ? speedOnHover : speed;

    // Set animation duration - using percentage-based transform for seamless loop
    slider.style.setProperty("--animation-duration", `${animationDuration}s`);
  }, [isHovered, speed, speedOnHover]);

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={sliderRef}
        className="flex animate-infinite-scroll-smooth"
        style={{
          gap: `${gap}px`,
          animationDuration: `var(--animation-duration, ${speed}s)`,
          width: "fit-content",
        }}
      >
        {/* Render children twice for seamless loop - animation moves exactly 50% */}
        {children}
        {children}
      </div>
    </div>
  );
}

