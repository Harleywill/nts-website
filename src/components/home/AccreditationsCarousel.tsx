"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface AccreditationsCarouselProps {
  title: string;
  accreditations: Array<{ name: string; path: string }>;
}

export default function AccreditationsCarousel({
  title,
  accreditations,
}: AccreditationsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);

  // Duplicate array enough times for seamless loop
  const repeatedAccreditations = [
    ...accreditations,
    ...accreditations,
    ...accreditations,
    ...accreditations,
    ...accreditations,
  ];

  const logoWidth = 168; // 160px logo + 8px gap
  const singleCycleWidth = accreditations.length * logoWidth;
  const pixelsPerSecond = logoWidth; // Scroll one logo per second

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000; // Convert to seconds
      lastTime = now;

      positionRef.current += deltaTime * pixelsPerSecond;

      // Reset to beginning seamlessly when one full cycle is complete
      if (positionRef.current >= singleCycleWidth) {
        positionRef.current = 0;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(-${positionRef.current}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [singleCycleWidth]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-xl font-semibold text-navy-900">{title}</h3>

      {/* Carousel container with fade gradients */}
      <div className="relative w-full overflow-hidden rounded-lg bg-white">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling logos */}
        <div
          ref={containerRef}
          className="flex gap-2 py-8 px-6"
          style={{ width: "fit-content" }}
        >
          {repeatedAccreditations.map((accred, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ minWidth: "160px", height: "100px" }}
            >
              <Image
                src={accred.path}
                alt={accred.name}
                width={140}
                height={80}
                className="object-contain max-h-full"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
