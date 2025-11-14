import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  duration?: number; // Animation duration in milliseconds
  startValue?: number; // Starting value (default: 0)
}

export const useCountUp = (
  targetValue: number,
  options: UseCountUpOptions = {}
) => {
  const { duration = 2000, startValue = 0 } = options;
  const [count, setCount] = useState(startValue);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            observer.disconnect(); // Disconnect once triggered
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const start = startValue;
    const end = targetValue;
    const difference = end - start;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + difference * easeOut);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end exactly at target value
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, targetValue, duration, startValue]);

  return { count, ref: elementRef };
};

