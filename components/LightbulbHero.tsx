"use client";

import { useEffect, useRef, useState } from "react";

export default function LightbulbHero() {
  const bulbRef = useRef<SVGSVGElement>(null);
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const [isHappy, setIsHappy] = useState(false);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    // Start glow pulse after mount
    const t = setTimeout(() => setGlowing(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!bulbRef.current) return;
      const rect = bulbRef.current.getBoundingClientRect();

      // Eye centers in SVG coords → screen coords
      const scaleX = rect.width / 200;
      const scaleY = rect.height / 260;

      const eyes = [
        { cx: 78 * scaleX + rect.left, cy: 108 * scaleY + rect.top, setter: setLeftPupil },
        { cx: 122 * scaleX + rect.left, cy: 108 * scaleY + rect.top, setter: setRightPupil },
      ];

      eyes.forEach(({ cx, cy, setter }) => {
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 5;
        const ratio = Math.min(1, maxDist / (dist || 1));
        setter({ x: dx * ratio, y: dy * ratio });
      });
    };

    const handleClick = () => {
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 1200);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="relative select-none">
      {/* Outer glow rings */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ${glowing ? "opacity-100" : "opacity-0"}`}
        style={{ background: "radial-gradient(circle, rgba(253,224,71,0.25) 0%, transparent 70%)", transform: "scale(1.6)" }}
      />

      <svg
        ref={bulbRef}
        viewBox="0 0 200 260"
        width="220"
        height="286"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
        style={{ filter: glowing ? "drop-shadow(0 0 18px rgba(253,224,71,0.7))" : undefined, transition: "filter 1s" }}
      >
        <defs>
          <radialGradient id="bulbGrad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="55%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </radialGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(253,224,71,0.4)" />
            <stop offset="100%" stopColor="rgba(253,224,71,0)" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated floating wrapper */}
        <g style={{ animation: "floatBulb 3s ease-in-out infinite" }}>

          {/* Halo glow */}
          <ellipse cx="100" cy="95" rx="70" ry="68" fill="url(#glowGrad)" />

          {/* Light rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 100 + Math.cos(rad) * 72;
            const y1 = 95 + Math.sin(rad) * 72;
            const x2 = 100 + Math.cos(rad) * 86;
            const y2 = 95 + Math.sin(rad) * 86;
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#FDE047"
                strokeWidth={i % 2 === 0 ? 2.5 : 1.5}
                strokeLinecap="round"
                opacity={i % 2 === 0 ? 0.8 : 0.5}
                style={{ animation: `rayPulse 2s ease-in-out ${i * 0.12}s infinite` }}
              />
            );
          })}

          {/* Main bulb body */}
          <path
            d="M 58,100 C 58,62 142,62 142,100 C 142,123 132,136 129,152 L 71,152 C 68,136 58,123 58,100 Z"
            fill="url(#bulbGrad)"
            filter="url(#softGlow)"
          />

          {/* Bulb highlight / sheen */}
          <ellipse cx="82" cy="82" rx="14" ry="22" fill="rgba(255,255,255,0.45)" transform="rotate(-25 82 82)" />
          <ellipse cx="76" cy="78" rx="5" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-25 76 78)" />

          {/* Screw base — 3 bands */}
          <rect x="71" y="152" width="58" height="13" rx="3" fill="#D97706" />
          <line x1="71" y1="159" x2="129" y2="159" stroke="#B45309" strokeWidth="1" opacity="0.5" />
          <rect x="73" y="165" width="54" height="12" rx="3" fill="#B45309" />
          <line x1="73" y1="171" x2="127" y2="171" stroke="#92400E" strokeWidth="1" opacity="0.5" />
          <rect x="75" y="177" width="50" height="10" rx="3" fill="#92400E" />

          {/* Flat base */}
          <rect x="82" y="187" width="36" height="7" rx="3.5" fill="#78350F" />

          {/* ── Face ── */}

          {/* Left eye white */}
          <circle cx="78" cy="108" r="13" fill="white" />
          {/* Left pupil */}
          <circle
            cx={78 + leftPupil.x}
            cy={108 + leftPupil.y}
            r="8"
            fill="#1e293b"
            style={{ transition: "cx 0.05s, cy 0.05s" }}
          />
          {/* Left highlight */}
          <circle cx={78 + leftPupil.x + 2.5} cy={108 + leftPupil.y - 2.5} r="2.5" fill="white" />

          {/* Right eye white */}
          <circle cx="122" cy="108" r="13" fill="white" />
          {/* Right pupil */}
          <circle
            cx={122 + rightPupil.x}
            cy={108 + rightPupil.y}
            r="8"
            fill="#1e293b"
            style={{ transition: "cx 0.05s, cy 0.05s" }}
          />
          {/* Right highlight */}
          <circle cx={122 + rightPupil.x + 2.5} cy={108 + rightPupil.y - 2.5} r="2.5" fill="white" />

          {/* Eyebrows */}
          <path d="M 68,93 Q 78,88 88,93" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 112,93 Q 122,88 132,93" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />

          {/* Smile — happy or normal */}
          {isHappy ? (
            <path d="M 78,128 Q 100,142 122,128" fill="none" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <path d="M 82,128 Q 100,138 118,128" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Rosy cheeks */}
          <ellipse cx="68" cy="122" rx="9" ry="6" fill="rgba(251,113,133,0.35)" />
          <ellipse cx="132" cy="122" rx="9" ry="6" fill="rgba(251,113,133,0.35)" />

          {/* Happy stars when clicked */}
          {isHappy && (
            <>
              <text x="32" y="75" fontSize="18" style={{ animation: "popStar 1.2s ease-out forwards" }}>✨</text>
              <text x="148" y="75" fontSize="18" style={{ animation: "popStar 1.2s ease-out forwards" }}>✨</text>
            </>
          )}
        </g>

        <style>{`
          @keyframes floatBulb {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes rayPulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes popStar {
            0% { opacity: 1; transform: translateY(0) scale(0.5); }
            60% { opacity: 1; transform: translateY(-20px) scale(1.2); }
            100% { opacity: 0; transform: translateY(-35px) scale(0.8); }
          }
        `}</style>
      </svg>

      {/* Click hint */}
      <p className="text-center text-xs text-yellow-600/60 mt-1 font-medium animate-pulse">点我试试 ✨</p>
    </div>
  );
}
