import React from "react";
import { isSober } from "../utils.js";

export default function TokiLogoPro({ size = 130, sober, animated = true, style = {} }) {
  const useSober = sober !== undefined ? sober : isSober();
  const src = useSober ? "/toki-logo-sober.png" : "/toki-logo.png";

  return (
    <>
      {animated && <style>{`
        @keyframes tokiPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>}
      <img
        src={src}
        alt="TOKI logo"
        width={size}
        height={size}
        style={{
          display: "block",
          objectFit: "contain",
          margin: "0 auto -20px",
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,.2))",
          animation: animated ? "tokiPulse 2s ease-in-out infinite" : "none",
          ...style,
        }}
      />
    </>
  );
}
