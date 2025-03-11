"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ToastContextType {
  toastMessage: string | null;
  isVisible: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsVisible(true);

    // Hide the toast after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
      setToastMessage(null);
    }, 4000);
  };

  const hideToast = () => {
    setIsVisible(false);
    setToastMessage(null);
  };

  return (
    <ToastContext.Provider
      value={{ toastMessage, isVisible, showToast, hideToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
