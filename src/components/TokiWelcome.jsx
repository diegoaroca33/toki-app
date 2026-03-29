import React, { useEffect, useState } from "react";

export default function TokiWelcome({ onDone, duration = 3000 }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => handleDone(), duration);
    return () => clearTimeout(t);
  }, [duration]);

  const handleDone = () => {
    setLeaving(true);
    setTimeout(() => {
      if (onDone) onDone();
    }, 260);
  };

  return (
    <div
      onClick={handleDone}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(180deg,#0B1D3A 0%, #122548 45%, #1A3060 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        opacity: leaving ? 0 : 1,
        transition: "opacity .26s ease",
      }}
    >
      <style>{`
        .tw-wrap{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          animation: twIntro .9s cubic-bezier(.2,.8,.2,1) both;
          transform-origin:center bottom;
          padding:24px;
        }
        .tw-dog{
          animation: twBob 2.2s ease-in-out infinite;
          transform-origin: 160px 180px;
          filter: drop-shadow(0 12px 28px rgba(0,0,0,.28));
        }
        .tw-tail{
          transform-origin: 86px 194px;
          animation: twTail .34s ease-in-out infinite;
        }
        .tw-paw{
          transform-origin: 232px 188px;
          animation: twWave .9s ease-in-out infinite;
        }
        .tw-mouth{
          animation: twSmile 1.8s ease-in-out infinite;
          transform-origin: 160px 165px;
        }
        .tw-title{
          margin-top:18px;
          font-family:'Fredoka',sans-serif;
          font-weight:800;
          font-size:52px;
          line-height:1;
          color:#F0C850;
          letter-spacing:1px;
          text-shadow: 0 4px 0 rgba(0,0,0,.16);
          animation: twFadeUp .7s ease-out .2s both;
        }
        .tw-sub{
          margin-top:8px;
          font-family:'Fredoka',sans-serif;
          font-weight:600;
          font-size:22px;
          color:#ECF0F1;
          opacity:.98;
          animation: twFadeUp .7s ease-out .32s both;
        }
        .tw-skip{
          position:absolute;
          bottom:18px;
          right:18px;
          font-family:'Fredoka',sans-serif;
          font-size:14px;
          font-weight:700;
          color:rgba(255,255,255,.72);
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.12);
          border-radius:999px;
          padding:10px 14px;
          backdrop-filter: blur(4px);
          animation: twFadeUp .7s ease-out .5s both;
        }
        .tw-glow1,.tw-glow2,.tw-glow3{
          animation: twSpark 1.8s ease-in-out infinite;
          transform-origin:center;
        }
        .tw-glow2{ animation-delay:.35s; }
        .tw-glow3{ animation-delay:.7s; }

        @keyframes twIntro{
          0%{ transform: translateY(120px) scale(.92); opacity:0; }
          60%{ transform: translateY(-12px) scale(1.02); opacity:1; }
          100%{ transform: translateY(0px) scale(1); opacity:1; }
        }
        @keyframes twBob{
          0%,100%{ transform: translateY(0px); }
          50%{ transform: translateY(-4px); }
        }
        @keyframes twTail{
          0%,100%{ transform: rotate(-20deg); }
          50%{ transform: rotate(24deg); }
        }
        @keyframes twWave{
          0%,100%{ transform: rotate(-14deg); }
          50%{ transform: rotate(14deg); }
        }
        @keyframes twSmile{
          0%,100%{ transform: scale(1); }
          50%{ transform: scale(1.04,1.08); }
        }
        @keyframes twFadeUp{
          0%{ opacity:0; transform: translateY(10px); }
          100%{ opacity:1; transform: translateY(0); }
        }
        @keyframes twSpark{
          0%,100%{ opacity:.25; transform: scale(.7); }
          50%{ opacity:.95; transform: scale(1.15); }
        }

        @media (max-width: 480px){
          .tw-title{ font-size:40px; }
          .tw-sub{ font-size:18px; }
        }
      `}</style>

      <div className="tw-wrap">
        <svg
          className="tw-dog"
          width="320"
          height="320"
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Bienvenida TOKI"
        >
          {/* floor glow */}
          <ellipse cx="160" cy="275" rx="88" ry="18" fill="rgba(255,255,255,.08)" />
          <ellipse cx="160" cy="275" rx="58" ry="10" fill="rgba(240,200,80,.12)" />

          {/* stars/glow */}
          <circle className="tw-glow1" cx="76" cy="76" r="7" fill="rgba(240,200,80,.75)" />
          <circle className="tw-glow2" cx="248" cy="72" r="5.5" fill="rgba(255,255,255,.75)" />
          <circle className="tw-glow3" cx="264" cy="126" r="6" fill="rgba(46,204,113,.75)" />

          {/* tail */}
          <g className="tw-tail">
            <path
              d="M86 194 C56 177, 52 147, 75 136 C89 130, 101 140, 99 150 C97 158, 90 164, 90 172 C90 181, 100 188, 110 192"
              fill="none"
              stroke="#8B5A3C"
              strokeWidth="13"
              strokeLinecap="round"
            />
          </g>

          {/* body */}
          <ellipse cx="160" cy="188" rx="80" ry="58" fill="#C98A57" />
          <ellipse cx="160" cy="198" rx="44" ry="32" fill="#FFF5EA" />
          <ellipse cx="206" cy="176" rx="25" ry="18" fill="#A86A43" opacity=".9" />

          {/* legs */}
          <rect x="108" y="214" width="22" height="42" rx="10" fill="#C98A57" />
          <rect x="172" y="214" width="22" height="42" rx="10" fill="#C98A57" />
          <ellipse cx="119" cy="258" rx="18" ry="10" fill="#8B5A3C" />
          <ellipse cx="183" cy="258" rx="18" ry="10" fill="#8B5A3C" />
          <ellipse cx="119" cy="254" rx="11" ry="6" fill="#E6B58A" />
          <ellipse cx="183" cy="254" rx="11" ry="6" fill="#E6B58A" />

          {/* waving paw */}
          <g className="tw-paw">
            <rect x="214" y="176" width="18" height="40" rx="9" fill="#C98A57" />
            <ellipse cx="223" cy="175" rx="15" ry="9" fill="#8B5A3C" />
            <ellipse cx="223" cy="171" rx="9" ry="5" fill="#E6B58A" />
          </g>

          {/* head */}
          <ellipse cx="160" cy="122" rx="74" ry="62" fill="#E9B886" />

          {/* ears */}
          <ellipse cx="92" cy="132" rx="20" ry="47" fill="#8B5A3C" transform="rotate(2 92 132)" />
          <ellipse cx="228" cy="132" rx="20" ry="47" fill="#8B5A3C" transform="rotate(-2 228 132)" />
          <ellipse cx="97" cy="145" rx="10" ry="26" fill="#A66B45" opacity=".45" />
          <ellipse cx="223" cy="145" rx="10" ry="26" fill="#A66B45" opacity=".45" />

          {/* forehead patch */}
          <path
            d="M138 63 C147 79,147 96,138 112 C151 121,169 121,182 112 C173 96,173 79,182 63 C172 55,148 55,138 63 Z"
            fill="#FFFFFF"
            opacity=".95"
          />

          {/* muzzle */}
          <ellipse cx="160" cy="160" rx="34" ry="24" fill="#FFF6EF" />
          <ellipse cx="160" cy="173" rx="20" ry="11" fill="#FFF6EF" />

          {/* eyes */}
          <ellipse cx="132" cy="126" rx="12" ry="16" fill="#171717" />
          <ellipse cx="188" cy="126" rx="12" ry="16" fill="#171717" />
          <circle cx="128" cy="121" r="4.2" fill="#fff" />
          <circle cx="184" cy="121" r="4.2" fill="#fff" />
          <circle cx="135.5" cy="129.5" r="1.9" fill="#fff" />
          <circle cx="191.5" cy="129.5" r="1.9" fill="#fff" />

          {/* brows */}
          <path d="M112 104 Q130 96 146 103" fill="none" stroke="#74482F" strokeWidth="3" strokeLinecap="round" />
          <path d="M174 103 Q190 96 208 104" fill="none" stroke="#74482F" strokeWidth="3" strokeLinecap="round" />

          {/* nose */}
          <ellipse cx="160" cy="151" rx="10" ry="7" fill="#171413" />

          {/* mouth smile */}
          <g className="tw-mouth">
            <path d="M141 170 Q160 188 179 170" fill="none" stroke="#7A3E34" strokeWidth="4.8" strokeLinecap="round" />
            <path d="M150 174 Q160 184 170 174" fill="none" stroke="#F28EA7" strokeWidth="3.2" strokeLinecap="round" opacity=".92" />
          </g>

          {/* blush */}
          <ellipse cx="114" cy="164" rx="9" ry="5.5" fill="#F3B2AE" opacity=".62" />
          <ellipse cx="206" cy="164" rx="9" ry="5.5" fill="#F3B2AE" opacity=".62" />
        </svg>

        <div className="tw-title">TOKI</div>
        <div className="tw-sub">Aprende a decirlo</div>
      </div>

      <div className="tw-skip">Toca para continuar</div>
    </div>
  );
}
