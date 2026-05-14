"use client";

import Image from "next/image";

interface AccreditationsCarouselProps {
  title: string;
  accreditations: Array<{ name: string; path: string }>;
}

export default function AccreditationsCarousel({
  title,
  accreditations,
}: AccreditationsCarouselProps) {
  // Duplicate array multiple times for seamless looping
  const repeatedAccreditations = [
    ...accreditations,
    ...accreditations,
    ...accreditations,
  ];

  const animationDuration = accreditations.length * 4; // 4 seconds per logo

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
          className="flex gap-8 py-8 px-6"
          style={{
            animation: `scroll ${animationDuration}s linear infinite`,
            width: "fit-content",
          }}
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

      {/* CSS animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-${accreditations.length} * 160px));
          }
        }
      `}</style>
    </div>
  );
}
