"use client";

import { motion } from "framer-motion";
import { wordStaggerContainerVariants, wordVariants } from "@/lib/animations";

interface AnimatedHeadingProps {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export default function AnimatedHeading({
  text,
  level = "h2",
  className = "",
  style = {},
  delay = 0,
}: AnimatedHeadingProps) {
  const words = text.split(" ");
  const Component = level;

  return (
    <motion.div
      variants={wordStaggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delayChildren: delay }}
    >
      <Component className={className} style={style}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            style={{ display: "inline-block", marginRight: "0.25em" }}
          >
            {word}
          </motion.span>
        ))}
      </Component>
    </motion.div>
  );
}
