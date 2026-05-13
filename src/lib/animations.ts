/**
 * Reusable Framer Motion animation variants
 * Consistent patterns across the NTS website
 */

// ============ ENTRANCE ANIMATIONS ============

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

export const slideRightVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export const zoomInVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

// ============ STAGGER CONTAINERS & ITEMS ============

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const staggerContainerFastVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerItemFastVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// ============ WORD-BY-WORD STAGGER (for headings) ============

export const wordStaggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// ============ HOVER ANIMATIONS (BOLD & MODERN INTENSITY) ============

export const hoverScaleLarge = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
};

export const hoverScaleMedium = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

export const hoverLiftVariants = {
  whileHover: { scale: 1.05, y: -8 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

export const hoverLiftSmall = {
  whileHover: { scale: 1.03, y: -4 },
  transition: { duration: 0.2 },
};

export const hoverRotateVariants = {
  whileHover: { rotate: 5, scale: 1.05 },
  transition: { duration: 0.3 },
};

// ============ BUTTON ANIMATIONS ============

export const buttonHoverVariants = {
  hidden: { opacity: 1 },
  hover: { scale: 1.08 },
  tap: { scale: 0.92 },
};

export const primaryButtonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
  tap: { scale: 0.95 },
};

// ============ CAROUSEL / SLIDESHOW ANIMATIONS ============

export const carouselItemVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export const fadeCarouselVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// ============ MODAL ANIMATIONS ============

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalContentVariants = {
  hidden: { opacity: 0, y: "100%", scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    y: "100%",
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// ============ FORM ANIMATIONS ============

export const formShakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

export const inputFocusVariants = {
  focus: { scale: 1.02 },
};

export const successCheckmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
};

// ============ LOADING ANIMATIONS ============

export const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

export const spinnerVariants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ============ IMAGE ANIMATIONS ============

export const imageHoverZoomVariants = {
  initial: { scale: 1 },
  whileHover: { scale: 1.1 },
  transition: { duration: 0.3 },
};

export const imageRevealVariants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8 },
  },
};

// ============ SCROLL-TRIGGERED ANIMATIONS (whileInView) ============

export const scrollAnimationConfig = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
};

// ============ TRANSITIONS ============

export const standardTransition = { duration: 0.6 };
export const fastTransition = { duration: 0.3 };
export const slowTransition = { duration: 0.8 };

export const springTransition = {
  type: "spring" as const,
  damping: 20,
  stiffness: 100,
};

// ============ ACCESSIBILITY: REDUCED MOTION ============

export const useReducedMotionVariants = (prefersReduced: boolean) => {
  if (prefersReduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0 } },
      whileHover: { scale: 1 },
      whileTap: { scale: 1 },
    };
  }
  return null;
};
