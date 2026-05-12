"use client";

import { useState } from "react";
import Link from "next/link";
import QuickEnquiryModal from "./QuickEnquiryModal";

export default function StickyButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Sticky Button - Mobile & Tablet only */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-0 left-0 right-0 md:hidden h-14 w-full px-4 bg-[#4caf50] text-white font-bold text-base hover:bg-green-600 transition-colors z-40 pb-2 pt-3"
        aria-label="Get Free Quote"
      >
        Get Free Quote
      </button>

      {/* Modal Form */}
      <QuickEnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Padding adjustment for sticky button */}
      <div className="h-14 md:hidden" />
    </>
  );
}
