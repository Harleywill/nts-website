"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import NavBlobIndicator from "./NavBlobIndicator";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const [shouldShowBackground, setShouldShowBackground] = useState(false);
  // Calculate selected index based on pathname - use memo to avoid recalculation
  const selectedIndex = useMemo(() => {
    const currentIndex = NAV_LINKS.findIndex((link) => {
      if (link.href === "/") return pathname === "/";
      return pathname.startsWith(link.href);
    });
    return currentIndex >= 0 ? currentIndex : 0;
  }, [pathname]);

  const [hoveredIndex, setHoveredIndex] = useState(selectedIndex);

  // Update hoveredIndex when selectedIndex changes (e.g., when navigating to a new page)
  useEffect(() => {
    setHoveredIndex(selectedIndex);
  }, [selectedIndex]);
  const [itemPositions, setItemPositions] = useState<
    Array<{ left: number; width: number }>
  >([]);
  const [navbarHeight, setNavbarHeight] = useState(80);
  const [buttonPosition, setButtonPosition] = useState<{ left: number; width: number } | null>(null);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate nav item positions and navbar height
  useEffect(() => {
    const calculatePositions = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }

      const positions = navItemsRef.current.map((item) => {
        if (!item) return { left: 0, width: 0 };
        const rect = item.getBoundingClientRect();
        const parentRect =
          item.parentElement?.getBoundingClientRect() || rect;
        return {
          left: rect.left - parentRect.left,
          width: rect.width,
        };
      });
      setItemPositions(positions);
      setIsInitialized(true);
    };

    calculatePositions();
    window.addEventListener("resize", calculatePositions);
    return () => window.removeEventListener("resize", calculatePositions);
  }, []);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar only if near top of page
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Show background when scrolled past hero section (~600px)
      setShouldShowBackground(currentScrollY > 600);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mouse hover near top of screen to reveal navbar & reset blob when leaving navbar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 50) {
        setIsHoveringTop(true);
      } else if (e.clientY > 150) {
        setIsHoveringTop(false);
      }

      // Reset blob to current page when mouse leaves navbar area
      // Only hide navbar if we're already scrolled down (not at top)
      if (e.clientY > navbarHeight) {
        if (lastScrollY >= 100) {
          setIsVisible(false);
        }
        setHoveredIndex(selectedIndex);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [selectedIndex, navbarHeight, lastScrollY]);

  return (
    <motion.nav
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isMobile || shouldShowBackground || isHoveringTop ? "#ffffff" : "#1a1a1a00",
        boxShadow:
          isMobile || shouldShowBackground || isHoveringTop
            ? "0 1px 3px rgba(0, 0, 0, 0.1)"
            : "none",
      }}
      animate={{
        y: isMobile || isVisible || isHoveringTop ? 0 : -80,
      }}
      transition={{
        type: "tween",
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96], // Smooth easeInOutCubic-like curve
      }}
    >
      <div className="mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center h-20 justify-between">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex-shrink-0 h-20 flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/ntsLogo.png"
              alt="NTS Ltd Logo"
              width={280}
              height={140}
              priority
              className="h-14 w-auto"
            />
          </Link>

          {/* Center spacer for desktop nav centering */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            {/* Desktop Navigation - Center */}
            <div
              ref={navContainerRef}
              className="flex items-center justify-center gap-16 relative"
              onMouseLeave={() => setHoveredIndex(selectedIndex)}
            >
            {isInitialized && (
              <NavBlobIndicator
                selectedIndex={hoveredIndex}
                itemPositions={itemPositions}
                buttonPosition={null}
              />
            )}
            {NAV_LINKS.map((link, index) => (
              <div
                key={link.href}
                ref={(el) => {
                  navItemsRef.current[index] = el;
                }}
                className="relative group z-10"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                }}
              >
                <Link
                  href={link.href}
                  className="font-medium text-sm relative z-20"
                  style={{
                    color: (shouldShowBackground || isHoveringTop) ? "#000000" : "#ffffff",
                    transition: "color 0.5s cubic-bezier(0.43, 0.13, 0.23, 0.96)",
                  }}
                >
                  {link.label}
                </Link>
              </div>
            ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
            {isOpen ? (
              <FaTimes
                size={24}
                style={{ color: isMobile || shouldShowBackground ? "#000000" : "#ffffff" }}
              />
            ) : (
              <FaBars
                size={24}
                style={{ color: isMobile || shouldShowBackground ? "#000000" : "#ffffff" }}
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200"
            >
              <div className="px-6 py-6 space-y-4">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
