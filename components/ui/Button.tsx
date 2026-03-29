import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text?: string;
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  target?: string;
  rel?: string;
  /** Show the arc reactor icon (default: true) */
  showIcon?: boolean;
  /** Override accent color (default: Iron Man gold) */
  accentColor?: string;
}

// const ArcIcon = () => (
//   <svg
//     viewBox="0 0 16 16"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     width="16"
//     height="16"
//   >
//     <circle
//       cx="8"
//       cy="8"
//       r="7"
//       stroke="currentColor"
//       strokeWidth="1"
//       opacity="0.5"
//     />
//     <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.15" />
//     <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.9" />
//     <line
//       x1="8"
//       y1="1"
//       x2="8"
//       y2="4"
//       stroke="currentColor"
//       strokeWidth="1"
//       opacity="0.7"
//     />
//     <line
//       x1="8"
//       y1="12"
//       x2="8"
//       y2="15"
//       stroke="currentColor"
//       strokeWidth="1"
//       opacity="0.7"
//     />
//     <line
//       x1="1"
//       y1="8"
//       x2="4"
//       y2="8"
//       stroke="currentColor"
//       strokeWidth="1"
//       opacity="0.7"
//     />
//     <line
//       x1="12"
//       y1="8"
//       x2="15"
//       y2="8"
//       stroke="currentColor"
//       strokeWidth="1"
//       opacity="0.7"
//     />
//   </svg>
// );

const Button = ({
  text = "Launch",
  href,
  onClick,
  target = "_blank",
  rel,
  showIcon = true,
  accentColor,
}: ButtonProps) => {
  const inner = (
    <div className="im-outer">
      {/* Animated border pulse ring */}
      <div className="im-pulse" />
      {/* Scan line sweep */}
      <div className="im-scan" />
      {/* Corner accent marks */}
      <div className="im-corner im-corner--tl" />
      <div className="im-corner im-corner--br" />
      {/* Main body */}
      <div className="im-inner">
        {showIcon && (
          <span className="im-icon">
            {/* <ArcIcon /> */}
          </span>
        )}
        <span className="im-text">{text}</span>
      </div>
    </div>
  );

  return (
    <StyledWrapper $accent={accentColor}>
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          className="im-btn"
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {inner}
        </a>
      ) : (
        <button
          className="im-btn"
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        >
          {inner}
        </button>
      )}
    </StyledWrapper>
  );
};

/* ─── Styled ─────────────────────────────────────────────────────────────── */

const StyledWrapper = styled.div<{ $accent?: string }>`
  display: inline-block;

  --im-gold: ${({ $accent }) => $accent ?? "#c8922a"};
  --im-gold-light: ${({ $accent }) => ($accent ? $accent + "cc" : "#f5c842")};
  --im-red: #c0392b;
  --im-red-bright: #e74c3c;

  /* Reset button / anchor */
  .im-btn {
    all: unset;
    display: inline-block;
    cursor: pointer;
    position: relative;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  /* ── Outer container (handles the angled-border gradient layer) ─────── */
  .im-outer {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Gradient border shell */
  .im-outer::before {
    content: "";
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      135deg,
      var(--im-gold),
      var(--im-red),
      var(--im-gold-light),
      var(--im-red-bright),
      var(--im-gold)
    );
    background-size: 300% 300%;
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    animation: imBorderShimmer 3s ease infinite;
    opacity: 0.85;
    transition: opacity 0.25s;
    z-index: 0;
  }

  /* Hover shimmer overlay */
  .im-outer::after {
    content: "";
    position: absolute;
    inset: -1px;
    background: linear-gradient(
      135deg,
      var(--im-gold-light) 0%,
      transparent 40%,
      var(--im-gold) 100%
    );
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    opacity: 0;
    transition: opacity 0.25s;
    z-index: 0;
  }

  .im-btn:hover .im-outer::after {
    opacity: 0.6;
  }
  .im-btn:hover .im-outer::before {
    opacity: 1;
  }

  /* ── Inner body ──────────────────────────────────────────────────────── */
  .im-inner {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    background: linear-gradient(135deg, #1a0e05 0%, #0d0a08 40%, #1a1005 100%);
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    font-family: "Orbitron", "Share Tech Mono", monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--im-gold-light);
    transition:
      color 0.2s,
      transform 0.15s;
    white-space: nowrap;
  }

  .im-btn:hover .im-inner {
    color: #fff8e0;
    transform: scale(1.03);
  }

  .im-btn:active .im-inner {
    transform: scale(0.97);
  }

  /* ── Arc reactor icon ────────────────────────────────────────────────── */
  .im-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--im-gold-light);
    transition: color 0.2s;
  }

  .im-btn:hover .im-icon {
    color: #fff8e0;
  }

  /* ── Corner accent triangles ─────────────────────────────────────────── */
  .im-corner {
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--im-gold-light);
    z-index: 3;
    transition: background 0.2s;
  }

  .im-corner--tl {
    top: 3px;
    left: 16px;
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }

  .im-corner--br {
    bottom: 3px;
    right: 16px;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
  }

  .im-btn:hover .im-corner {
    background: #fff8e0;
  }

  /* ── Scan sweep ──────────────────────────────────────────────────────── */
  .im-scan {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(245, 200, 66, 0.14),
      transparent
    );
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    animation: imScanLine 3.5s ease-in-out infinite;
    pointer-events: none;
    z-index: 2;
  }

  /* ── Pulse ring ──────────────────────────────────────────────────────── */
  .im-pulse {
    position: absolute;
    inset: -6px;
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    border: 1px solid var(--im-gold);
    opacity: 0;
    animation: imPulseRing 3.5s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Keyframes ───────────────────────────────────────────────────────── */
  @keyframes imBorderShimmer {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes imScanLine {
    0% {
      left: -100%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    60% {
      left: 150%;
      opacity: 0.5;
    }
    61%,
    100% {
      left: -100%;
      opacity: 0;
    }
  }

  @keyframes imPulseRing {
    0%,
    60% {
      opacity: 0;
      transform: scale(1);
    }
    65% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: scale(1.04);
    }
  }
`;

export default Button;
