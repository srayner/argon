"use client";

import React from "react";
import { useToast } from "@/components/ToastContext";
import { BsExclamationCircle } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

const Toast = () => {
  const { toastMessage, isVisible, hideToast } = useToast();

  if (!toastMessage || !isVisible) return null;

  return (
    <div
      className={`fixed top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white py-3 px-6 rounded-lg shadow-xl z-50 flex items-center space-x-3 transition-all duration-300 ease-in-out opacity-100 translate-y-0`}
    >
      <BsExclamationCircle className="text-xl" />
      <span className="text-sm">{toastMessage}</span>
      <button onClick={hideToast} className="ml-2">
        <IoClose className="text-lg hover:text-gray-300 transition" />
      </button>
    </div>
  );
};

export default Toast;
