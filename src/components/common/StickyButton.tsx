"use client";

import { useState } from "react";
import QuickEnquiryModal from "./QuickEnquiryModal";

export default function StickyButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "56px",
          width: "100%",
          backgroundColor: "#4caf50",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "0 16px",
          border: "none",
          borderTop: "1px solid #ddd",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
          zIndex: 9999,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#45a049";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#4caf50";
        }}
        aria-label="Get Free Quote"
      >
        Get Free Quote
      </button>

      <QuickEnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
