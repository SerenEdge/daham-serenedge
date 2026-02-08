"use client";

import { useState, useEffect } from "react";

export default function useScale(targetWidth: number = 1920) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // Calculate scale: if window is smaller than target, scale down. separate logic for mobile if needed
      // preventing scale up beyond 1
      const newScale = Math.min(window.innerWidth / targetWidth, 1);
      setScale(newScale);
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targetWidth]);

  return scale;
}
