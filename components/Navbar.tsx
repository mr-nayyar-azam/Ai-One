
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { LogoStatus, User, View, Theme } from '../types';

interface NavbarProps {
  logoStatus: LogoStatus;
  currentView: View;
  onNavigate: (view: View) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  logoStatus, 
  currentView,
  onNavigate, 
  user, 
  onLogin, 
  onLogout,
  theme,
  onThemeChange
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavLink: React.FC<{ label: string; target: View; active: boolean }> = ({ label, target, active }) => (
    <button 
      onClick={() => { onNavigate(target); setIsMobileMenuOpen(false); }}
      className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all relative group ${
        active ? 'text-white' : 'text-slate-400 hover:text-white'
      }`}
    >
      {label}
      <span className={`absolute -bottom-2 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </button>
  );

  const themeIcons = {
    light: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M6.364 6.364l.707.707m10.607 10.607l.707.707M12 8a4 4 0 110 8 4 4 0 010-8z" strokeWidth={2}/></svg>,
    dark: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeWidth={2}/></svg>,
    system: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={2}/></svg>
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-20 md:h-24 transition-all duration-500 flex items-center px-6 md:px-12 ${
        scrolled 
          ? 'backdrop-blur-2xl bg-slate-950/90 border-b border-white/10 dark:bg-slate-950/90 dark:border-white/10 light:bg-white/90 light:border-slate-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Logo status={logoStatus} onNavigate={onNavigate} />
          
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-12">
            <NavLink label="Intelligence" target="home" active={currentView === 'home'} />
            <NavLink label="Directory" target="directory" active={currentView === 'directory'} />
            <NavLink label="Saved" target="saved" active={currentView === 'saved'} />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Theme Toggle */}
            <div className="relative" ref={themeRef}>
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all"
              >
                {themeIcons[theme]}
              </button>
              {showThemeMenu && (
                <div className="absolute top-full right-0 mt-4 w-40 rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                  {(['light', 'dark', 'system'] as Theme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => { onThemeChange(t); setShowThemeMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest ${
                        theme === t ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {themeIcons[t]}
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all pr-4"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-xs font-black text-white">
                        {user.name[0]}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-slate-300">{user.name.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 text-slate-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2}/></svg>
                </button>

                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-4 w-64 rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logged in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { onNavigate('dashboard'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-xs font-bold text-slate-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth={2}/></svg>
                      Dashboard
                    </button>
                    <button 
                      onClick={() => { onNavigate('saved'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-xs font-bold text-slate-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth={2}/></svg>
                      Saved Intelligence
                    </button>
                    <div className="h-px bg-white/5 my-2 mx-2" />
                    <button 
                      onClick={() => { onLogout(); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-xs font-bold text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth={2}/></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="px-6 py-2.5 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                Sign In
              </button>
            )}

            {/* Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" />
          <div className="relative h-full flex flex-col p-8 pt-32 gap-6">
            <NavLink label="Intelligence Engine" target="home" active={currentView === 'home'} />
            <NavLink label="Tool Directory" target="directory" active={currentView === 'directory'} />
            <NavLink label="Saved Collection" target="saved" active={currentView === 'saved'} />
            {user && <NavLink label="Dashboard" target="dashboard" active={currentView === 'dashboard'} />}
            
            <div className="mt-auto pt-8 border-t border-white/5">
              {!user ? (
                <button 
                  onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 rounded-xl bg-white text-slate-950 font-black uppercase text-[10px] tracking-widest"
                >
                  Get Started
                </button>
              ) : (
                <button 
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-black uppercase text-[10px] tracking-widest"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
