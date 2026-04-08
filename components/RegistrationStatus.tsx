"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { STATUS_MESSAGES } from "@/lib/constants";

type Status = "SUBMITTED" | "UNDER_REVIEW" | "SELECTED" | "REJECTED" | "PAID";

interface StatusConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  title: string;
  description: string;
}

const statusConfigs: Record<Status, StatusConfig> = {
  SUBMITTED: {
    icon: <Clock className="w-5 h-5" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    title: "Application Submitted",
    description: STATUS_MESSAGES.SUBMITTED,
  },
  UNDER_REVIEW: {
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    title: "Under Review",
    description: STATUS_MESSAGES.UNDER_REVIEW,
  },
  SELECTED: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    title: "Selected for Next Round",
    description: STATUS_MESSAGES.SELECTED,
  },
  REJECTED: {
    icon: <XCircle className="w-5 h-5" />,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    title: "Not Selected",
    description: STATUS_MESSAGES.REJECTED,
  },
  PAID: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    title: "Payment Confirmed",
    description: STATUS_MESSAGES.PAID,
  },
};

interface RegistrationStatusProps {
  status: Status;
  className?: string;
}

export default function RegistrationStatus({ status, className = "" }: RegistrationStatusProps) {
  const config = statusConfigs[status];

  if (!config) {
    return null;
  }

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-sm ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex items-center gap-3">
        <div className={config.color}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{config.title}</h3>
          <p className="text-sm text-gray-300">{config.description}</p>
        </div>
      </div>
    </div>
  );
}
