"use client";

import React from "react";
import { useToast } from "@/components/ToastContext";
import { BsExclamationCircle } from "react-icons/bs";

const Toast = () => {
  const { toastMessage, isVisible } = useToast();

  if (!toastMessage || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white py-3 px-6 rounded-lg shadow-xl z-50 flex items-center space-x-3 opacity-90 transition-opacity duration-300 ease-in-out">
      <BsExclamationCircle />
      <span className="text-sm">{toastMessage}</span>
    </div>
  );
};

export default Toast;
