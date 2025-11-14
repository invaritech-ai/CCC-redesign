import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
  children?: ReactNode;
  className?: string;
  direction?: "left" | "right";
  blurIntensity?: number;
}

export function ProgressiveBlur({
  children,
  className,
  direction = "left",
  blurIntensity = 1,
}: ProgressiveBlurProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-background via-background/80 to-transparent",
        direction === "right" &&
          "bg-gradient-to-l from-background via-background/80 to-transparent",
        className
      )}
      style={{
        maskImage: `linear-gradient(to ${
          direction === "left" ? "right" : "left"
        }, transparent, black 20%, black 80%, transparent)`,
        WebkitMaskImage: `linear-gradient(to ${
          direction === "left" ? "right" : "left"
        }, transparent, black 20%, black 80%, transparent)`,
        filter: `blur(${blurIntensity * 4}px)`,
      }}
    >
      {children}
    </div>
  );
}

