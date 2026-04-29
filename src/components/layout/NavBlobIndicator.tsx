"use client";

import { motion } from "framer-motion";
import React from "react";

interface NavBlobIndicatorProps {
  selectedIndex: number;
  itemPositions: Array<{ left: number; width: number }>;
  buttonPosition?: { left: number; width: number } | null;
}

export default function NavBlobIndicator({
  selectedIndex,
  itemPositions,
  buttonPosition,
}: NavBlobIndicatorProps) {
  // Use button position if hovering button, otherwise use selected nav item
  const animateTarget = buttonPosition || itemPositions[selectedIndex];
  const isHoveringButton = !!buttonPosition;

  if (!animateTarget) return null;

  // Calculate distance traveled for dynamic duration
  const baseSpeed = 300; // pixels per second for consistent motion
  const distance = Math.abs(animateTarget.left - (itemPositions[selectedIndex]?.left || 0));
  // Faster animation for button hover, normal speed for nav items
  const duration = isHoveringButton ? 0.3 : Math.max(distance / baseSpeed, 0.3);

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 pointer-events-none rounded-full"
      initial={{
        left: animateTarget.left - 8,
        width: isHoveringButton ? Math.max(animateTarget.width - 30, 0) : animateTarget.width + 16,
        opacity: isHoveringButton ? 1 : 0.9,
      }}
      animate={{
        left: animateTarget.left - 8,
        width: isHoveringButton ? Math.max(animateTarget.width - 30, 0) : animateTarget.width + 16,
        opacity: isHoveringButton ? 1 : 0.9,
      }}
      transition={{
        type: "tween",
        duration: duration,
        ease: [0.01, 0, 0.99, 1],
      }}
      style={{
        zIndex: -10,
        height: 40,
        backgroundColor: "#4caf50",
      }}
    />
  );
}
