"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const calculateTimeLeft = (targetDate) => {
  const difference = new Date(targetDate) - new Date();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const IronCountdown = ({
  targetDate,
  footer = " With great power comes great responsibility ",
  accentColor = "#f54242ff",
}) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));
  const [flashSecs, setFlashSecs] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = calculateTimeLeft(targetDate);
      setTimeLeft((prev) => {
        if (prev && prev.seconds !== next.seconds) {
          setFlashSecs(true);
          setTimeout(() => setFlashSecs(false), 300);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const pad = (n) => String(n).padStart(2, "0");
  const units = [
    { key: "days", value: timeLeft.days },
    { key: "hours", value: timeLeft.hours },
    { key: "minutes", value: timeLeft.minutes },
    { key: "seconds", value: timeLeft.seconds },
  ];

  return (
    <StyledWrapper $accent={accentColor}>
      <div className="sp-wrap">
        {/* Corner circuits — replaces corner webs */}
        <svg
          className="corner-web tl"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          <path d="M0 0 L120 0 L0 120 Z" fill={accentColor} opacity="0.04" />
          <path
            d="M0,10 L30,10 L30,30 L60,30"
            stroke={accentColor}
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M0,30 L15,30 L15,55 L40,55"
            stroke={accentColor}
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M10,0 L10,20 L35,20 L35,50"
            stroke={accentColor}
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M30,0 L30,10"
            stroke={accentColor}
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M50,0 L50,15 L70,15"
            stroke={accentColor}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M0,50 L20,50"
            stroke={accentColor}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
          <circle cx="30" cy="10" r="1.5" fill={accentColor} opacity="0.7" />
          <circle cx="30" cy="30" r="1.5" fill={accentColor} opacity="0.7" />
          <circle cx="10" cy="20" r="1.5" fill={accentColor} opacity="0.7" />
          <circle cx="15" cy="30" r="1" fill={accentColor} opacity="0.5" />
          <circle cx="35" cy="20" r="1" fill={accentColor} opacity="0.5" />
        </svg>

        <svg
          className="corner-web tr"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          <path d="M120 0 L0 0 L120 120 Z" fill={accentColor} opacity="0.04" />
          <path
            d="M120,10 L90,10 L90,30 L60,30"
            stroke={accentColor}
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M120,30 L105,30 L105,55 L80,55"
            stroke={accentColor}
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M110,0 L110,20 L85,20 L85,50"
            stroke={accentColor}
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M90,0 L90,10"
            stroke={accentColor}
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <circle cx="90" cy="10" r="1.5" fill={accentColor} opacity="0.7" />
          <circle cx="90" cy="30" r="1.5" fill={accentColor} opacity="0.7" />
          <circle cx="110" cy="20" r="1.5" fill={accentColor} opacity="0.7" />
          <circle cx="105" cy="30" r="1" fill={accentColor} opacity="0.5" />
        </svg>

        {/* Timer grid — unchanged from SpiderCountdown */}
        <div className="sp-grid">
          {units.map(({ key, value }) => (
            <div className="sp-unit-wrap" key={key}>
              <div className="sp-unit">
                <span
                  className={`sp-num${key === "seconds" && flashSecs ? " flash" : ""}`}
                >
                  {pad(value)}
                </span>
                <span className="sp-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {footer && <div className="sp-footer">{footer}</div>}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .sp-wrap {
    position: relative;
    background: #0a0a0f;
    border-radius: 5px;
    padding: 40px 24px 32px;
    overflow: hidden;
    font-family: "Rajdhani", "Segoe UI", sans-serif;
  }

  .corner-web {
    position: absolute;
    opacity: 0.18;
    pointer-events: none;
  }
  .corner-web.tl {
    top: 0;
    left: 0;
  }
  .corner-web.tr {
    top: 0;
    right: 0;
  }

  .sp-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  .sp-unit-wrap {
    position: relative;
  }

  .sp-unit-wrap:not(:last-child)::after {
    content: ":";
    font-family: "Bebas Neue", "Impact", sans-serif;
    font-size: 32px;
    color: ${({ $accent }) => $accent};
    position: absolute;
    right: -9px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    opacity: 0.6;
    line-height: 1;
  }

  .sp-unit {
    position: relative;
    background: #12121a;
    border: 1px solid ${({ $accent }) => $accent}22;
    border-radius: 10px;
    padding: 20px 8px 12px;
    text-align: center;
    overflow: hidden;
  }

  .sp-unit::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ $accent }) => $accent},
      transparent
    );
    opacity: 0.8;
  }

  .sp-unit::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30%;
    height: 1px;
    background: ${({ $accent }) => $accent}55;
  }

  .sp-num {
    font-family: "Bebas Neue", "Impact", sans-serif;
    font-size: clamp(35px, 6vw, 56px);
    color: #fff;
    line-height: 1;
    letter-spacing: 0.02em;
    display: block;
    transition: color 0.15s;
  }

  .sp-num.flash {
    color: ${({ $accent }) => $accent};
  }

  .sp-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #ffffff55;
    text-transform: uppercase;
    margin-top: 6px;
    display: block;
  }

  .sp-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: #fffffff3;
    text-transform: uppercase;
    position: relative;
    z-index: 2;
  }
`;

export default IronCountdown;
