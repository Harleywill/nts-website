'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const SLIDE_MS = 400;
const EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

/**
 * Shared carousel state with seamless wrap-around.
 *
 * Looping works by cloning the first `itemsToShow` slides onto the end of the
 * track (via `extendSlides`). Advancing past the last real slide animates onto
 * the clones, then snaps back (transition disabled) to the identical-looking
 * real position. Going back from the first slide does the reverse: an
 * invisible snap onto the clone block, then an animated step back.
 */
export function useCarousel(count: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const touchStartX = useRef(0);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    return () => {
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, []);

  const looping = count > itemsToShow;
  const cloneCount = looping ? itemsToShow : 0;
  const totalSlots = count + cloneCount;
  // Kept for any legacy callers; with looping every item can be leftmost.
  const maxIndex = Math.max(0, count - itemsToShow);

  const extendSlides = useCallback(
    <T,>(slides: T[]): T[] =>
      cloneCount > 0 ? [...slides, ...slides.slice(0, cloneCount)] : slides,
    [cloneCount]
  );

  // Re-enable the transition one frame after an instant reposition, so the
  // snap itself never animates.
  const snapTo = (index: number) => {
    setTransitionEnabled(false);
    setCurrentIndex(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
  };

  const goToNext = () => {
    if (!looping) return;
    if (currentIndex >= count) return; // snap back still pending
    const next = currentIndex + 1;
    setCurrentIndex(next);
    if (next === count) {
      // We've animated onto the clone block; snap to the real start after.
      snapTimer.current = setTimeout(() => snapTo(0), SLIDE_MS + 50);
    }
  };

  // Direct jump (dot navigation): cancel any pending wrap snap so it can't
  // override the user's chosen position a moment later.
  const jumpTo = (index: number) => {
    if (snapTimer.current) {
      clearTimeout(snapTimer.current);
      snapTimer.current = null;
    }
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (!looping) return;
    if (currentIndex >= count) return;
    if (currentIndex === 0) {
      // Invisible jump onto the clone block (identical pixels), then animate.
      setTransitionEnabled(false);
      setCurrentIndex(count);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
          setCurrentIndex(count - 1);
        });
      });
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goToNext();
    else if (diff < -50) goToPrevious();
  };

  const translateX = totalSlots > 0 ? -(currentIndex * (100 / totalSlots)) : 0;
  const transition = transitionEnabled ? `transform ${SLIDE_MS}ms ${EASING}` : 'none';

  const dotCount = looping ? count : 1;
  const activeDot = count > 0 ? currentIndex % count : 0;

  // 1-based visible range for "x–y of n" captions; wraps past the end.
  const rangeStart = count > 0 ? (currentIndex % count) + 1 : 0;
  const rangeEnd = looping
    ? (((currentIndex % count) + itemsToShow - 1) % count) + 1
    : Math.min(itemsToShow, count);

  return { currentIndex, setCurrentIndex: jumpTo, itemsToShow, maxIndex, translateX,
           transition, totalSlots, extendSlides, dotCount, activeDot,
           rangeStart, rangeEnd,
           goToPrevious, goToNext, handleTouchStart, handleTouchEnd };
}
