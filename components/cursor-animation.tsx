"use client";

import { useTheme } from "next-themes";

export function CursorAnimation() {
  const { theme } = useTheme();
  // Much lower opacity (0.03 for dark mode, 0.04 for light mode)
  const strokeColor = theme === 'dark' 
    ? 'rgba(255,255,255,0.03)' 
    : 'rgba(0,0,0,0.04)';
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 800 200"
      className="absolute inset-0 w-full h-full mix-blend-soft-light"
      style={{ 
        stroke: strokeColor,
        fill: strokeColor,
        zIndex: 0,
      }}
    >
      <defs>
        <g id="pointer">
          <path d="M1,1 L1,16 L6,13 L9,19 L12,18 L9,12 L15,12 Z" />
        </g>
        
        <g id="file-drag">
          <rect x="-24" y="-24" width="25" height="25" />
          <line x1="-19" y1="-17" x2="-5" y2="-17" strokeWidth="1.5" />
          <line x1="-19" y1="-12" x2="-5" y2="-12" strokeWidth="1.5" />
          <line x1="-19" y1="-7" x2="-5" y2="-7" strokeWidth="1.5" />
          <path d="M1,1 L1,16 L6,13 L9,19 L12,18 L9,12 L15,12 Z" />
        </g>
        
        <g id="write">
          <path d="M-24,-24 L-14,-24 L-12,-22 L-22,-12 L-24,-14 Z" />
          <line x1="-22" y1="-12" x2="-12" y2="-22" />
          <path d="M-24,-14 L-14,-24" />
          <path d="M1,1 L1,16 L6,13 L9,19 L12,18 L9,12 L15,12 Z" />
        </g>
        
        <g id="wait">
          <circle cx="-12" cy="-12" r="12" fill="none" strokeWidth="2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 -12 -12"
              to="360 -12 -12"
              dur="1s"
              repeatCount="indefinite"/>
          </circle>
          <path d="M1,1 L1,16 L6,13 L9,19 L12,18 L9,12 L15,12 Z" />
        </g>
      </defs>
      
      {/* Slower animations (15s instead of 12s) for more subtlety */}
      <use href="#file-drag">
        <animateMotion dur="15s" repeatCount="indefinite" 
          path="M0,100 Q100,50 200,150 T400,50 T600,150 T800,50" begin="0s"/>
      </use>
      <use href="#write">
        <animateMotion dur="15s" repeatCount="indefinite" 
          path="M800,150 Q600,100 400,150 T200,100 T0,150" begin="3s"/>
      </use>
      <use href="#pointer">
        <animateMotion dur="15s" repeatCount="indefinite" 
          path="M0,50 Q200,150 400,50 T800,150" begin="6s"/>
      </use>
      <use href="#wait">
        <animateMotion dur="15s" repeatCount="indefinite" 
          path="M800,100 Q600,150 400,100 T200,150 T0,100" begin="9s"/>
      </use>
      <use href="#file-drag">
        <animateMotion dur="15s" repeatCount="indefinite" 
          path="M0,150 Q200,50 400,150 T800,50" begin="12s"/>
      </use>
    </svg>
  );
}
