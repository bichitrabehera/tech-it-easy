"use client";
import React, { useEffect, useState } from "react";

const Countdown = ({ targetDate }) => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // ⛔ Prevent SSR mismatch
  if (!mounted || !timeLeft) return null;

  return (
    <div className="flex gap-6 text-center mt-6">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key}>
          <p className="text-3xl font-bold">
            {String(value).padStart(2, "0")}
          </p>
          <span className="text-xs uppercase text-gray-400 tracking-widest">
            {key}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;