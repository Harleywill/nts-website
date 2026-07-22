import Image from "next/image";

interface AccreditationsCarouselProps {
  title: string;
  accreditations: Array<{ name: string; path: string }>;
  /** Scroll speed in pixels per second. */
  speed?: number;
  /** Which way the logos travel. */
  direction?: "left" | "right";
  /** Pause the marquee while the pointer is over the card. */
  pauseOnHover?: boolean;
}

// Each slot: 160px logo box + 8px right margin. Keeping this fixed makes the
// doubled track exactly twice one cycle wide, so the -50% CSS loop is seamless.
const SLOT_WIDTH = 168;

export default function AccreditationsCarousel({
  title,
  accreditations,
  speed = 48,
  direction = "left",
  pauseOnHover = true,
}: AccreditationsCarouselProps) {
  // Two copies: the animation slides by -50%, landing on identical pixels.
  const doubled = [...accreditations, ...accreditations];
  const cycleWidth = accreditations.length * SLOT_WIDTH;
  const duration = cycleWidth / speed;

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-xl font-semibold text-navy-900">{title}</h3>

      <div
        className={`relative w-full overflow-hidden rounded-lg bg-white ${
          pauseOnHover ? "accred-pausable" : ""
        }`}
      >
        {/* Edge fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling logos */}
        <div
          className="accred-marquee flex py-8 w-fit"
          style={
            {
              "--marquee-duration": `${duration}s`,
              "--marquee-direction": direction === "right" ? "reverse" : "normal",
            } as React.CSSProperties
          }
        >
          {doubled.map((accred, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center mr-2"
              style={{ width: "160px", height: "100px" }}
            >
              <Image
                src={accred.path}
                alt={accred.name}
                width={140}
                height={80}
                className="object-contain max-h-full transition-transform duration-300 hover:scale-110"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
