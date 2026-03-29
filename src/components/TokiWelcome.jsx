import React, { useEffect, useState } from "react";

export default function TokiWelcome({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => handleClose(), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => {
      if (onDone) onDone();
    }, 260);
  };

  return (
    <div
      onClick={handleClose}
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
          transform-origin: 160px 190px;
          filter: drop-shadow(0 14px 28px rgba(0,0,0,.28));
        }
        .tw-tail{
          transform-origin: 228px 208px;
          animation: twTail .35s ease-in-out infinite;
        }
        .tw-sound1,.tw-sound2,.tw-sound3{
          transform-origin: 252px 142px;
          animation: twSound 1.1s ease-out infinite;
        }
        .tw-sound2{ animation-delay:.18s; }
        .tw-sound3{ animation-delay:.36s; }
        .tw-title{
          margin-top:18px;
          font-family:'Fredoka',sans-serif;
          font-weight:800;
          font-size:52px;
          line-height:1;
          color:#F0C850;
          letter-spacing:1px;
          text-shadow:0 4px 0 rgba(0,0,0,.16);
          animation: twFadeUp .7s ease-out .18s both;
        }
        .tw-sub{
          margin-top:8px;
          font-family:'Fredoka',sans-serif;
          font-weight:600;
          font-size:22px;
          color:#ECF0F1;
          animation: twFadeUp .7s ease-out .3s both;
        }
        .tw-btn{
          position:absolute;
          bottom:18px;
          left:50%;
          transform:translateX(-50%);
          font-family:'Fredoka',sans-serif;
          font-size:14px;
          font-weight:700;
          color:rgba(255,255,255,.82);
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.12);
          border-radius:999px;
          padding:10px 16px;
          backdrop-filter: blur(4px);
          animation: twFadeUp .7s ease-out .45s both;
          white-space:nowrap;
        }

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
          0%,100%{ transform: rotate(-18deg); }
          50%{ transform: rotate(18deg); }
        }
        @keyframes twSound{
          0%{ opacity:0; transform:scale(.7); }
          20%{ opacity:1; }
          100%{ opacity:0; transform:scale(1.18); }
        }
        @keyframes twFadeUp{
          0%{ opacity:0; transform:translateY(10px); }
          100%{ opacity:1; transform:translateY(0); }
        }

        @media (max-width: 480px){
          .tw-title{ font-size:40px; }
          .tw-sub{ font-size:18px; }
        }
      `}</style>

      <div className="tw-wrap">
        <svg
          className="tw-dog"
          width="280"
          height="280"
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Toki beagle kawaii"
        >
          {/* shadow */}
          <ellipse cx="160" cy="278" rx="82" ry="18" fill="rgba(255,255,255,.08)" />
          <ellipse cx="160" cy="278" rx="52" ry="10" fill="rgba(240,200,80,.12)" />

          {/* tail */}
          <g className="tw-tail">
            <path
              d="M229 208 C248 199,258 181,252 162"
              fill="none"
              stroke="#2B211E"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M229 208 C248 199,258 181,252 162"
              fill="none"
              stroke="#3B312E"
              strokeWidth="7.2"
              strokeLinecap="round"
            />
          </g>

          {/* body */}
          <ellipse cx="160" cy="212" rx="74" ry="56" fill="#FFF6EF" stroke="#2B211E" strokeWidth="4" />
          <path
            d="M111 183 C116 159,135 146,160 146 C194 146,220 167,222 200 C208 188,188 180,160 180 C138 180,123 182,111 183 Z"
            fill="#E9B886"
            stroke="#2B211E"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M160 146 C188 146,210 162,220 183 C215 183,208 183,201 183 C197 168,181 158,160 158 C139 158,123 168,119 183 C112 183,105 183,100 184 C110 162,132 146,160 146 Z"
            fill="#8B5A3C"
          />
          <ellipse cx="160" cy="214" rx="38" ry="28" fill="#FFFDFB" opacity=".72" />

          {/* paws */}
          <ellipse cx="126" cy="256" rx="20" ry="12" fill="#FFF6EF" stroke="#2B211E" strokeWidth="4" />
          <ellipse cx="194" cy="256" rx="20" ry="12" fill="#FFF6EF" stroke="#2B211E" strokeWidth="4" />
          <ellipse cx="126" cy="259" rx="9" ry="4.5" fill="#E9B886" opacity=".7" />
          <ellipse cx="194" cy="259" rx="9" ry="4.5" fill="#E9B886" opacity=".7" />

          {/* collar */}
          <path
            d="M118 187 C132 180,150 176,160 176 C170 176,188 180,202 187 L198 197 C184 192,170 189,160 189 C150 189,136 192,122 197 Z"
            fill="#2F5DA8"
            stroke="#223F71"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="160" cy="198" r="11" fill="#F0C850" stroke="#B7950B" strokeWidth="3" />
          <circle cx="160" cy="198" r="3.2" fill="#B7950B" opacity=".7" />

          {/* head */}
          <circle cx="160" cy="118" r="64" fill="#FFF6EF" stroke="#2B211E" strokeWidth="4" />

          {/* ears */}
          <ellipse cx="108" cy="118" rx="18" ry="40" fill="#E9B886" stroke="#2B211E" strokeWidth="4" transform="rotate(6 108 118)" />
          <ellipse cx="212" cy="118" rx="18" ry="40" fill="#E9B886" stroke="#2B211E" strokeWidth="4" transform="rotate(-6 212 118)" />
          <ellipse cx="108" cy="124" rx="10" ry="24" fill="#8B5A3C" opacity=".9" transform="rotate(6 108 124)" />
          <ellipse cx="212" cy="124" rx="10" ry="24" fill="#8B5A3C" opacity=".9" transform="rotate(-6 212 124)" />

          {/* face patches */}
          <path
            d="M122 92 C132 80,145 74,160 74 C150 89,148 106,148 120 C138 118,130 111,122 92 Z"
            fill="#E9B886"
          />
          <path
            d="M198 92 C188 80,175 74,160 74 C170 89,172 106,172 120 C182 118,190 111,198 92 Z"
            fill="#E9B886"
          />
          <path
            d="M144 70 C149 80,149 97,145 111 C150 114,155 115,160 115 C165 115,170 114,175 111 C171 97,171 80,176 70 C170 66,150 66,144 70 Z"
            fill="#FFFDFB"
          />

          {/* eyes */}
          <ellipse cx="136" cy="116" rx="11" ry="14" fill="#171717" />
          <ellipse cx="184" cy="116" rx="11" ry="14" fill="#171717" />
          <circle cx="132.5" cy="111.2" r="3.6" fill="#fff" />
          <circle cx="180.5" cy="111.2" r="3.6" fill="#fff" />
          <circle cx="139.4" cy="119.6" r="1.4" fill="#fff" />
          <circle cx="187.4" cy="119.6" r="1.4" fill="#fff" />

          {/* brows */}
          <path d="M122 97 Q135 91 147 97" fill="none" stroke="#74482F" strokeWidth="3" strokeLinecap="round" />
          <path d="M173 97 Q185 91 198 97" fill="none" stroke="#74482F" strokeWidth="3" strokeLinecap="round" />

          {/* muzzle */}
          <ellipse cx="160" cy="146" rx="28" ry="20" fill="#FFF6EF" />
          <ellipse cx="160" cy="159" rx="16" ry="9" fill="#FFF6EF" />

          {/* nose */}
          <ellipse cx="160" cy="140" rx="8" ry="6" fill="#171413" />

          {/* mouth */}
          <path d="M147 154 Q160 166 173 154" fill="none" stroke="#7A3E34" strokeWidth="4.4" strokeLinecap="round" />
          <path d="M153 157 Q160 168 167 157" fill="none" stroke="#F28EA7" strokeWidth="3" strokeLinecap="round" opacity=".92" />

          {/* cheeks */}
          <ellipse cx="127" cy="151" rx="8" ry="4.5" fill="#F3B2AE" opacity=".58" />
          <ellipse cx="193" cy="151" rx="8" ry="4.5" fill="#F3B2AE" opacity=".58" />

          {/* sound waves */}
          <g fill="none" stroke="#E67E22" strokeLinecap="round">
            <path className="tw-sound1" d="M232 132 Q238 138 232 144" strokeWidth="4" />
            <path className="tw-sound2" d="M242 126 Q252 138 242 150" strokeWidth="4" />
            <path className="tw-sound3" d="M254 120 Q268 138 254 156" strokeWidth="4" />
          </g>
        </svg>

        <div className="tw-title">TOKI</div>
        <div className="tw-sub">Aprende a decirlo</div>
      </div>

      <div className="tw-btn">Toca para continuar</div>
    </div>
  );
}
