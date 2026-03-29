import React from "react";

export default function TokiLogo({ size = 64, speaking = true, opacity = 1, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo de Toki"
      style={{ display: "block", opacity, ...style }}
    >
      <defs>
        <radialGradient id="tokiLogoBg" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#F7E2C8" />
          <stop offset="100%" stopColor="#E7B582" />
        </radialGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.06)" />

      {/* ears */}
      <ellipse cx="14" cy="28" rx="7.5" ry="14" fill="#8B5A3C" transform="rotate(-10 14 28)" />
      <ellipse cx="50" cy="28" rx="7.5" ry="14" fill="#8B5A3C" transform="rotate(10 50 28)" />
      <ellipse cx="15.2" cy="31" rx="3.5" ry="8" fill="#A66B45" opacity=".45" />
      <ellipse cx="48.8" cy="31" rx="3.5" ry="8" fill="#A66B45" opacity=".45" />

      {/* head */}
      <circle cx="32" cy="30" r="19" fill="url(#tokiLogoBg)" />

      {/* forehead patch */}
      <path
        d="M27 12.5 C29.5 17,29.5 21.8,27 26.2 C30 28.2,34 28.2,37 26.2 C34.5 21.8,34.5 17,37 12.5 C34.5 10.8,29.5 10.8,27 12.5 Z"
        fill="#FFFDFB"
        opacity=".95"
      />

      {/* muzzle */}
      <ellipse cx="32" cy="37.5" rx="10" ry="7.8" fill="#FFF6EF" />
      <ellipse cx="32" cy="41.8" rx="6.2" ry="3.6" fill="#FFF6EF" />

      {/* eyes */}
      <ellipse cx="24.5" cy="29.5" rx="4.6" ry="5.9" fill="#161616" />
      <ellipse cx="39.5" cy="29.5" rx="4.6" ry="5.9" fill="#161616" />
      <circle cx="23.2" cy="27.2" r="1.4" fill="#fff" />
      <circle cx="38.2" cy="27.2" r="1.4" fill="#fff" />
      <circle cx="25.5" cy="30.2" r=".65" fill="#fff" />
      <circle cx="40.5" cy="30.2" r=".65" fill="#fff" />

      {/* brows */}
      <path d="M20.5 22.8 Q24.5 20.7 28.2 22.6" fill="none" stroke="#74482F" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M35.8 22.6 Q39.5 20.7 43.5 22.8" fill="none" stroke="#74482F" strokeWidth="1.4" strokeLinecap="round" />

      {/* nose */}
      <ellipse cx="32" cy="35.2" rx="3" ry="2.2" fill="#171413" />

      {/* mouth speaking */}
      {speaking ? (
        <>
          <ellipse cx="34.8" cy="41.8" rx="5.5" ry="4.8" fill="#8F433C" />
          <path d="M31.6 40.2 Q34.8 44.5 38 40.2" fill="#F4A2B6" />
          <path d="M27 39.4 Q30.5 42.5 34.2 41.3" fill="none" stroke="#7A3E34" strokeWidth="1.8" strokeLinecap="round" />
          {/* speech spark */}
          <path d="M47 17 L48.4 20 L51.5 21.3 L48.4 22.6 L47 25.6 L45.6 22.6 L42.5 21.3 L45.6 20 Z" fill="#F0C850" />
        </>
      ) : (
        <path d="M28 40 Q32 43.5 36 40" fill="none" stroke="#7A3E34" strokeWidth="1.8" strokeLinecap="round" />
      )}

      {/* subtle outline */}
      <circle cx="32" cy="30" r="19" fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="1.2" />
    </svg>
  );
}
