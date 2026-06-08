"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaExclamation, FaInfo } from "react-icons/fa";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeConfig = {
  success: {
    bgColor: "bg-brand-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    icon: FaCheck,
    iconBgColor: "bg-brand-green-100",
  },
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    icon: FaTimes,
    iconBgColor: "bg-red-100",
  },
  warning: {
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
    icon: FaExclamation,
    iconBgColor: "bg-yellow-100",
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    icon: FaInfo,
    iconBgColor: "bg-blue-100",
  },
};

export default function Toast({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  // Auto-close after duration
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 384 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: 384 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg z-50`}
    >
      <motion.div
        className={`flex-shrink-0 p-2 rounded-full ${config.iconBgColor}`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Icon className={`${config.textColor}`} size={18} />
      </motion.div>
      <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
      <motion.button
        onClick={onClose}
        className={`ml-2 flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaTimes size={16} />
      </motion.button>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${config.borderColor}`}
        style={{
          backgroundColor: config.borderColor.replace("border-", "").replace("-200", "-400"),
        }}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}
