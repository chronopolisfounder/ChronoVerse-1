import React from "react";
import "./GlowingAvatar.css";

export default function GlowingAvatar({ size = 128 }) {
  return (
    <div className="chrono-avatar" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bg" cx="64" cy="64" r="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4CFFEB" />
            <stop offset="1" stopColor="#072518" />
          </radialGradient>
          <linearGradient id="avatar" x1="64" y1="28" x2="64" y2="118" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B5FEF2" />
            <stop offset="1" stopColor="#143926" />
          </linearGradient>
          <linearGradient id="neck" x1="64" y1="98" x2="64" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A5FFF9" />
            <stop offset="1" stopColor="#207A5C" />
          </linearGradient>
        </defs>
        {/* Pulsing outer ring */}
        <circle
          className="avatar-glow"
          cx="64"
          cy="64"
          r="62"
          fill="url(#bg)"
          stroke="#00FFB2"
          strokeWidth="4"
        />
        {/* Head */}
        <ellipse cx="64" cy="54" rx="30" ry="28" fill="url(#avatar)" />
        <ellipse cx="58" cy="48" rx="10" ry="6" fill="#E9F7FF" opacity="0.33" />
        {/* Body */}
        <ellipse cx="64" cy="98" rx="38" ry="22" fill="url(#neck)" />
        <ellipse cx="64" cy="104" rx="18" ry="7" fill="#FFFFFF" opacity="0.10" />
        {/* Animated scanning band */}
        <rect x="44" y="62" width="40" height="6" rx="3" fill="#00FFB2" opacity="0.65">
          <animate attributeName="x" values="44;84;44" dur="3s" repeatCount="indefinite" />
          <animate attributeName="width" values="40;10;40" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
        </rect>
        {/* Chin line */}
        <ellipse cx="64" cy="72" rx="10" ry="2" fill="#27FFE5" opacity="0.4" />
      </svg>
    </div>
);
}
