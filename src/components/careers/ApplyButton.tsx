'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ApplyButtonProps {
  slug: string;
  isOpen: boolean;
  closesDate: string;
}

export function ApplyButton({ slug, isOpen, closesDate }: ApplyButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Link
        href={`/careers/${slug}/apply`}
        className="block w-full px-6 py-3 rounded-lg font-semibold text-center transition-all text-white"
        style={{
          backgroundColor: isOpen ? (isHovered ? '#3d9142' : '#4caf50') : '#d1d5db',
          color: isOpen ? '#ffffff' : '#9ca3af',
          cursor: isOpen ? 'pointer' : 'not-allowed',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isOpen ? "Apply now" : "Applications Closed"}
      </Link>
      {isOpen ? (
        <p className="text-xs text-gray-400 font-mono mt-2">
          Applications close {closesDate}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mt-2">
          This position is no longer accepting applications
        </p>
      )}
    </>
  );
}
