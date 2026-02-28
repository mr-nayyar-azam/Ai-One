
import React from 'react';
import Logo from './Logo';
import { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/5 py-16 md:py-20 px-6 md:px-12 bg-slate-950/50 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
        {/* Brand Section */}
        <div className="flex flex-col gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="opacity-90 hover:opacity-100 transition-opacity">
            <Logo status="idle" onNavigate={onNavigate} />
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-loose">
            Precision Intelligence layer<br/>for the tool ecosystem.<br/>
            <span className="text-slate-700 mt-2 block italic font-medium lowercase tracking-normal text-sm">by Azam Zest.</span>
          </p>
          
          <div className="flex gap-4 mt-2 justify-center sm:justify-start">
            <a 
              href="https://www.instagram.com/mr_nayyar_azam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-slate-900 hover:border-blue-500/50 hover:scale-110 hover:shadow-2xl transition-all duration-300 group"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/nayyar-azam-75631732a" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-slate-900 hover:border-blue-500/50 hover:scale-110 hover:shadow-2xl transition-all duration-300 group"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="flex flex-col gap-6 items-center sm:items-start">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40">Intelligence</span>
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <FooterLink label="Directory" onClick={() => onNavigate('directory')} />
            <FooterLink label="API Access" onClick={() => onNavigate('intelligence-api')} />
            <FooterLink label="Transparency" onClick={() => onNavigate('trust-report')} />
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center sm:items-start">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40">About</span>
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <FooterLink label="Vision" onClick={() => onNavigate('about')} />
            <FooterLink label="Azam Zest" onClick={() => onNavigate('azam-zest')} />
            <FooterLink label="Join Us" onClick={() => onNavigate('careers')} />
            <FooterLink label="Contact" onClick={() => onNavigate('contact')} />
          </div>
        </div>

        {/* Status / Contact */}
        <div className="flex flex-col gap-6 items-center lg:items-end text-center lg:text-right">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40">Operations</span>
          <div className="flex flex-col gap-5 items-center lg:items-end">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-[9px] font-black uppercase text-green-400 tracking-widest shadow-lg shadow-green-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Active Core
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
              © 2026 AI ONE.<br/>Global Intelligent Layer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="text-slate-500 hover:text-white text-xs font-bold transition-all hover:translate-x-1"
  >
    {label}
  </button>
);

export default Footer;
