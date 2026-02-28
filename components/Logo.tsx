
import React, { useState, useEffect } from 'react';
import { LogoStatus, View } from '../types';

interface LogoProps {
  status: LogoStatus;
  onNavigate?: (view: View) => void;
}

const Logo: React.FC<LogoProps> = ({ status, onNavigate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [simulatedSearching, setSimulatedSearching] = useState(false);

  // Sync with external searching status
  useEffect(() => {
    if (status === 'searching') {
      setIsScanning(true);
      setSimulatedSearching(true);
    } else if (status === 'idle') {
      setIsScanning(false);
      setSimulatedSearching(false);
    }
  }, [status]);

  const handleClick = () => {
    setIsScanning(true);
    setSimulatedSearching(true);
    
    if (onNavigate) onNavigate('home');
    
    // Simulate searching state for exactly 1 second as requested
    setTimeout(() => {
      // Only revert if we are not still externally in a searching state
      if (status !== 'searching') {
        setIsScanning(false);
        setSimulatedSearching(false);
      }
    }, 1000);
  };

  // Determine active visual state (internal simulation vs external prop)
  const isSearchingVisual = simulatedSearching || status === 'searching';
  const isSuccessVisual = status === 'success' && !simulatedSearching;
  const isNoResultsVisual = status === 'no-results' && !simulatedSearching;

  return (
    <div 
      onClick={handleClick}
      className={`group flex items-center gap-3 cursor-pointer select-none transition-all duration-500 ease-in-out
        ${isNoResultsVisual ? 'animate-logo-shake' : ''}
        ${status === 'idle' && !simulatedSearching ? 'animate-logo-idle' : ''}
      `}
      role="banner"
      aria-label="AI ONE Azam Zest Logo"
    >
      {/* Circular Icon Container */}
      <div className={`relative w-12 h-12 rounded-full bg-[#0f172a] border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out
        group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:border-cyan-500/30
        ${isSearchingVisual ? 'animate-logo-pulse ring-1 ring-cyan-400/20' : ''}
        ${isSuccessVisual ? 'border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : ''}
      `}>
        
        {/* Scanning Light Sweep (Top to Bottom) */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent w-full h-[60%] -top-full pointer-events-none opacity-0
          ${isScanning ? 'animate-logo-scan' : ''}
        `} />

        {/* Stylized "A" SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className={`w-7 h-7 transition-all duration-300 ease-in-out group-hover:-translate-y-[3px]
            ${isSuccessVisual ? 'text-green-400' : 'text-white'}
            ${isNoResultsVisual ? 'text-slate-500' : ''}
          `}
          fill="currentColor"
        >
          {/* Main "A" Frame */}
          <path d="M50 18L22 82H36L50 50L64 82H78L50 18Z" />
          {/* Inner Negative Notch */}
          <path d="M50 58L45 70H55L50 58Z" fill="#0f172a" />
          {/* Brand-Specific Cyan Accents */}
          <path d="M50 18L44 31H56L50 18Z" className="text-cyan-400" fill="currentColor" />
          <path d="M30 72L22 82H32L30 72Z" className="text-cyan-400" fill="currentColor" />
          <path d="M70 72L78 82H68L70 72Z" className="text-cyan-400" fill="currentColor" />
        </svg>

        {/* Tactile Ripple Effect */}
        {isScanning && (
          <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-logo-ripple" />
        )}
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <span className={`text-2xl font-black tracking-tight transition-all duration-300
          ${isSuccessVisual ? 'text-green-400' : 'text-white group-hover:text-cyan-50 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]'}
          ${isNoResultsVisual ? 'text-slate-500' : ''}
        `}>
          AI ONE
        </span>
        <span className={`text-[11px] font-bold text-slate-500 uppercase tracking-widest transition-opacity
          group-hover:opacity-100 group-hover:text-slate-300
          ${isSuccessVisual ? 'text-green-600' : 'opacity-70'}
        `}>
          Azam Zest
        </span>
      </div>

      <style>{`
        @keyframes logo-scan {
          0% { top: -100%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes logo-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }

        @keyframes logo-ripple {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes logo-shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-2px); }
          40%, 80% { transform: translateX(2px); }
        }

        @keyframes logo-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
        }

        .animate-logo-scan {
          animation: logo-scan 0.8s ease-in-out forwards;
        }

        .animate-logo-idle {
          animation: logo-idle 4s ease-in-out infinite;
        }

        .animate-logo-ripple {
          animation: logo-ripple 0.6s ease-out forwards;
        }

        .animate-logo-shake {
          animation: logo-shake 0.4s ease-in-out;
        }

        .animate-logo-pulse {
          animation: logo-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Logo;
