import React from "react";

export default function TokiLogoPro({ size = 64, animated = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TOKI logo"
    >
      <style>{`
        .tlp-mouth {
          transform-origin: 39px 40px;
        }
        .tlp-sound-1,
        .tlp-sound-2,
        .tlp-sound-3 {
          transform-origin: 47px 34px;
        }
        ${animated ? `
        .tlp-mouth { animation: tlpTalk .58s ease-in-out infinite; }
        .tlp-tongue { animation: tlpTongue .58s ease-in-out infinite; transform-origin: 39px 42px; }
        .tlp-sound-1 { animation: tlpSound 1.1s ease-out infinite; }
        .tlp-sound-2 { animation: tlpSound 1.1s ease-out .18s infinite; }
        .tlp-sound-3 { animation: tlpSound 1.1s ease-out .36s infinite; }
        ` : ``}

        @keyframes tlpTalk {
          0%,100% { transform: scaleY(1) translateY(0px); }
          50% { transform: scaleY(1.24) translateY(.5px); }
        }
        @keyframes tlpTongue {
          0%,100% { transform: scaleY(1) translateY(0px); }
          50% { transform: scaleY(1.08) translateY(.6px); }
        }
        @keyframes tlpSound {
          0% { opacity: 0; transform: scale(.72); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.18); }
        }
      `}</style>

      <rect x="0" y="0" width="64" height="64" rx="16" fill="rgba(255,255,255,0)" />

      <g transform="translate(2 1)">
        {/* far ear */}
        <ellipse cx="22" cy="26" rx="6.8" ry="13.5" fill="#8B5A3C" transform="rotate(-18 22 26)" />
        <ellipse cx="23" cy="29" rx="3.1" ry="7.3" fill="#A66B45" opacity=".42" transform="rotate(-18 23 29)" />

        {/* near ear */}
        <ellipse cx="41" cy="25.5" rx="8.4" ry="15.8" fill="#8B5A3C" transform="rotate(10 41 25.5)" />
        <ellipse cx="41.5" cy="29.5" rx="3.9" ry="8.7" fill="#A66B45" opacity=".42" transform="rotate(10 41.5 29.5)" />

        {/* head */}
        <path d="M15 31 C15 20.5, 23.5 11.5, 34.5 11.5 C44.5 11.5, 50.5 18.5, 50.5 28 C50.5 38.5, 43 46, 33 46 C22.5 46, 15 39.5, 15 31 Z" fill="#E9B886" />

        {/* white forehead patch */}
        <path d="M28.5 13.2 C30.4 17.4,30.2 22.2,27.8 26.5 C30.8 29,34.3 29.3,37.3 27.3 C35.2 22.4,35.4 17.5,37.4 13.7 C34.9 11.9,31 11.7,28.5 13.2 Z" fill="#FFFDFB" opacity=".96" />

        {/* muzzle */}
        <ellipse cx="37.8" cy="34.2" rx="10.2" ry="8.1" fill="#FFF6EF" />
        <ellipse cx="39.2" cy="38.6" rx="5.9" ry="3.7" fill="#FFF6EF" />

        {/* far eye */}
        <ellipse cx="28.3" cy="27.8" rx="3.6" ry="4.8" fill="#171717" />
        <circle cx="27.3" cy="25.9" r="1.15" fill="#fff" />
        <circle cx="29.6" cy="28.5" r=".55" fill="#fff" />

        {/* near eye */}
        <ellipse cx="38.2" cy="28.4" rx="4.8" ry="6.1" fill="#171717" />
        <circle cx="36.9" cy="26.1" r="1.5" fill="#fff" />
        <circle cx="39.9" cy="29.4" r=".72" fill="#fff" />

        {/* brows */}
        <path d="M24.5 21.8 Q27.8 20.1 31.2 21.5" fill="none" stroke="#74482F" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M34.2 21.6 Q38.8 19.6 42.7 22.1" fill="none" stroke="#74482F" strokeWidth="1.35" strokeLinecap="round" />

        {/* nose */}
        <ellipse cx="38.7" cy="31.9" rx="2.8" ry="2.05" fill="#171413" />

        {/* speaking mouth */}
        <g className="tlp-mouth">
          <path d="M37.6 35.8 C40.2 35.5, 42.7 36.7, 44.2 39 C42.9 41.9, 39.8 43.6, 36.8 43 C35.2 41.3, 35.2 37.6, 37.6 35.8 Z" fill="#8F433C" />
          <path className="tlp-tongue" d="M37.8 40 C39.2 39.6,40.6 40.2,41.3 41.5 C40.5 42.8,39.1 43.2,37.9 42.6 C37.2 41.8,37.2 40.7,37.8 40 Z" fill="#F4A2B6" />
          <path d="M34.1 36.9 Q36.5 38.1 37.8 39.6" fill="none" stroke="#7A3E34" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* cheek blush */}
        <ellipse cx="31.6" cy="36.7" rx="3.3" ry="1.85" fill="#F3B2AE" opacity=".62" />

        {/* sound waves */}
        <g fill="none" stroke="#F0C850" strokeLinecap="round">
          <path className="tlp-sound-1" d="M47.2 31.8 Q50 34.6 47.2 37.4" strokeWidth="2.1" />
          <path className="tlp-sound-2" d="M50.7 29.5 Q55.5 34.6 50.7 39.7" strokeWidth="2.1" />
          <path className="tlp-sound-3" d="M54.5 27 Q60.7 34.6 54.5 42.2" strokeWidth="2.1" />
        </g>

        {/* outline */}
        <path d="M15 31 C15 20.5, 23.5 11.5, 34.5 11.5 C44.5 11.5, 50.5 18.5, 50.5 28 C50.5 38.5, 43 46, 33 46 C22.5 46, 15 39.5, 15 31 Z" fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
      </g>
    </svg>
  );
}
