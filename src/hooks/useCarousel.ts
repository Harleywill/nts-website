'use client';

import { useState, useEffect, useRef } from 'react';

export function useCarousel(count: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const touchStartX = useRef(0);

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

  const maxIndex = Math.max(0, count - itemsToShow);
  const goToPrevious = () => setCurrentIndex(i => (i === 0 ? maxIndex : i - 1));
  const goToNext = () => setCurrentIndex(i => (i === maxIndex ? 0 : i + 1));
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goToNext(); else if (diff < -50) goToPrevious();
  };
  const translateX = -(currentIndex * (100 / count));

  return { currentIndex, setCurrentIndex, itemsToShow, maxIndex, translateX,
           goToPrevious, goToNext, handleTouchStart, handleTouchEnd };
}
