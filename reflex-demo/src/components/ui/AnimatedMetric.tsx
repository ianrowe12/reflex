"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedMetricProps {
  value: number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  duration?: number;
  className?: string;
}

export function AnimatedMetric({
  value,
  prefix = "",
  suffix = "",
  precision = 0,
  duration = 800,
  className = "",
}: AnimatedMetricProps) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(null);
  const startRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    startValueRef.current = 0;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplay(startValueRef.current + (value - startValueRef.current) * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  return (
    <span className={`font-mono tabular-nums ${className}`} data-metric>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
