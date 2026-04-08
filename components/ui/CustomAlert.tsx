"use client";

import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type AlertType = "success" | "error";

interface CustomAlertProps {
  isOpen: boolean;
  type: AlertType;
  message: string;
  onClose: () => void;
  autoCloseMs?: number;
}

export default function CustomAlert({
  isOpen,
  type,
  message,
  onClose,
  autoCloseMs = 4500,
}: CustomAlertProps) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-120 max-w-md w-[calc(100%-3rem)]">
      <div
        className={`rounded-2xl border shadow-2xl backdrop-blur-md px-4 py-3 flex items-start gap-3 ${
          isSuccess
            ? "bg-blue-600/15 border-blue-500/40 text-blue-100"
            : "bg-red-600/15 border-red-500/40 text-red-100"
        }`}
        role="alert"
        aria-live="polite"
      >
        <div className="pt-0.5">
          {isSuccess ? (
            <CheckCircle2 size={18} className="text-blue-300" />
          ) : (
            <AlertTriangle size={18} className="text-red-300" />
          )}
        </div>
        <p className="text-sm font-medium leading-relaxed flex-1">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-300 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
