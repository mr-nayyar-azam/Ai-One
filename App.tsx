
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import SearchPanel from './components/SearchPanel';
import ToolCard from './components/ToolCard';
import Logo from './components/Logo';
import Footer from './components/Footer';
import { Recommendation, SearchParams, LogoStatus, User, HistoryItem, View, Category, Tool, Theme, SearchMode } from './types';
import { findTools } from './services/intelligenceEngine';
import { TOOLS_DATA } from './constants';

const App: React.FC = () => {
  // SaaS State
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [logoStatus, setLogoStatus] = useState<LogoStatus>("idle");
  const [activeParams, setActiveParams] = useState<SearchParams | null>(null);
  const [directoryFilter, setDirectoryFilter] = useState<Category | "">("");
  const [theme, setTheme] = useState<Theme>('dark');
  const [searchMode, setSearchMode] = useState<SearchMode>('Both');

  // Auth Simulation
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('ai_one_user');
    const savedHistory = localStorage.getItem('ai_one_history');
    const savedTheme = localStorage.getItem('ai_one_theme') as Theme;
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Sync state to local DB
  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_one_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_one_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ai_one_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoggingIn(true);
    // Simulation of Google OAuth Flow
    setTimeout(() => {
      const mockGoogleUser: User = {
        id: 'google-1092384723',
        email: 'mrnayyarazam@gmail.com',
        name: 'Nayyar Azam',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nayyar',
        savedTools: [],
        tier: 'pro',
        preferences: {
          categoryInteractions: {},
          recentCategories: []
        },
        loginMethod: 'google',
        theme: 'dark'
      };
      
      // Merge with any existing local data for this email if it exists
      const existing = localStorage.getItem(`user_data_${mockGoogleUser.email}`);
      const finalUser = existing ? { ...mockGoogleUser, ...JSON.parse(existing) } : mockGoogleUser;
      
      setUser(finalUser);
      setIsLoggingIn(false);
      setView('home');
    }, 1200);
  }, []);

  const handleLogout = useCallback(() => {
    if (user) {
      // Save current state to permanent "database" before clearing session
      localStorage.setItem(`user_data_${user.email}`, JSON.stringify(user));
    }
    setUser(null);
    setView('home');
  }, [user]);

  const handleNavigate = useCallback((newView: View) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // --- SMART INTERACTION TRACKING ---
  const trackInteraction = useCallback((category: Category, points: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedInteractions = { ...prev.preferences.categoryInteractions };
      updatedInteractions[category] = (updatedInteractions[category] || 0) + points;
      
      const updatedRecent = [category, ...prev.preferences.recentCategories.filter(c => c !== category)].slice(0, 3);
      
      return {
        ...prev,
        preferences: {
          categoryInteractions: updatedInteractions,
          recentCategories: updatedRecent as Category[]
        }
      };
    });
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Transmission received. Our intelligence unit will respond shortly.");
  };

  const handleSaveToggle = useCallback(async (toolId: string) => {
    if (!user) {
      handleLogin();
      return;
    }

    const tool = TOOLS_DATA.find(t => t.id === toolId);
    if (!tool) return;

    // Optimistic UI Toggle
    const isCurrentlySaved = user.savedTools.includes(toolId);
    
    // Simulate Backend API Latency
    setUser(prev => {
      if (!prev) return prev;
      const newSaves = isCurrentlySaved 
        ? prev.savedTools.filter(id => id !== toolId)
        : [...prev.savedTools, toolId];
      
      return { ...prev, savedTools: newSaves };
    });

    if (!isCurrentlySaved) {
      trackInteraction(tool.category, 5); // Saving is a high-intent signal
    }

    // Actual "API Call" Simulation
    try {
      // await api.post('/save-tool', { toolId, userId: user.id });
      console.log(`${isCurrentlySaved ? 'Unsaved' : 'Saved'} tool: ${toolId}`);
    } catch (e) {
      // Revert if API fails (not implemented in this mock but this is the structure)
      console.error("Save failed, reverting UI...");
    }
  }, [user, handleLogin, trackInteraction]);

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsSearching(true);
    setLogoStatus("searching");
    setActiveParams(params);

    try {
      const recommendations = await findTools(params, user?.preferences, user?.savedTools || []);
      setResults(recommendations);
      setIsSearching(false);
      setView('results');
      
      // Track interaction for searched category if it was an intent lock
      if (recommendations.length > 0) {
        trackInteraction(recommendations[0].category, 2);
      }

      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        query: params.query || 'Category Filter',
        category: recommendations[0]?.category || 'Various',
        timestamp: Date.now(),
        resultsCount: recommendations.length
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('ai_one_history', JSON.stringify(updatedHistory));

      setLogoStatus(recommendations.length > 0 ? "success" : "no-results");
      setTimeout(() => setLogoStatus("idle"), 1500);
    } catch (error) {
      console.error("Search failed:", error);
      setIsSearching(false);
      setLogoStatus("no-results");
      setTimeout(() => setLogoStatus("idle"), 1500);
    }
  }, [history, user, trackInteraction]);

  // View: Saved
  const categorizedSavedTools = useMemo(() => {
    const saved = TOOLS_DATA.filter(t => user?.savedTools.includes(t.id));
    const groups: Record<string, Recommendation[]> = {};
    
    saved.forEach((tool, idx) => {
      if (!groups[tool.category]) groups[tool.category] = [];
      groups[tool.category].push({
        ...tool,
        rank: idx + 1,
        intelligence_score: 90,
        score_breakdown: {
          relevance: 25,
          features: 15,
          preference_fit: 20,
          platform: 10,
          reviews: 10,
          popularity: 10,
          free_access: 5,
          trust: 5
        },
        is_intent_match: true,
        is_saved: true
      });
    });
    
    return Object.entries(groups) as [string, Recommendation[]][];
  }, [user]);

  // Derived content for directory
  const directoryTools = useMemo(() => {
    const filtered = directoryFilter 
      ? TOOLS_DATA.filter(t => t.category === directoryFilter)
      : TOOLS_DATA;
    
    return filtered.map((tool, index) => ({
      ...tool,
      rank: index + 1,
      intelligence_score: 85,
      score_breakdown: {
        relevance: 22,
        features: 13,
        preference_fit: 18,
        platform: 9,
        reviews: 9,
        popularity: 9,
        free_access: 5,
        trust: 5
      },
      is_intent_match: true,
      is_saved: user?.savedTools?.includes(tool.id) || false
    }));
  }, [directoryFilter, user]);

  const savedToolsList = useMemo(() => {
    return TOOLS_DATA
      .filter(t => user?.savedTools?.includes(t.id))
      .map((tool, index) => ({
        ...tool,
        rank: index + 1,
        intelligence_score: 92,
        score_breakdown: {
          relevance: 24,
          features: 14,
          preference_fit: 19,
          platform: 10,
          reviews: 10,
          popularity: 10,
          free_access: 5,
          trust: 5
        },
        is_intent_match: true,
        is_saved: true
      }));
  }, [user]);

  return (
    <div className={`min-h-screen selection:bg-blue-500/30 overflow-x-hidden mesh-gradient ${theme}`}>
      <Navbar 
        logoStatus={logoStatus} 
        currentView={view}
        onNavigate={handleNavigate} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        theme={theme}
        onThemeChange={toggleTheme}
      />

      <main className="pt-24 md:pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Auth Loading State */}
        {isLoggingIn && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm font-black text-white uppercase tracking-[0.3em]">Authenticating with Google...</p>
            </div>
          </div>
        )}

        {/* --- VIEW: HOME --- */}
        {view === 'home' && (
          <section className="flex flex-col items-center text-center py-10 md:py-24 animate-in fade-in duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-8 shadow-lg shadow-blue-500/5">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
               Universal Intelligence Active
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 max-w-5xl">
              <span className="text-white">Precision Ranking for</span><br/>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">10 Trillion+ Tools.</span>
            </h1>
            
            <p className="text-slate-500 text-sm md:text-lg font-medium max-w-2xl mb-12 leading-relaxed px-4">
              AI-powered discovery engine with multilingual intent understanding. 
              We index, filter, and score software across the entire internet to find your perfect match.
            </p>

            <SearchPanel 
              onSearch={handleSearch} 
              isSearching={isSearching} 
              searchMode={searchMode}
              onSearchModeChange={setSearchMode}
            />
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-white">10T+</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Indexed Tools</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-white">Any</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Language</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-white">Strict</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Filtering</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-white">99%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Intent Match</span>
               </div>
            </div>
          </section>
        )}

        {/* --- VIEW: SAVED --- */}
        {view === 'saved' && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">My Intelligence</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Access your persistent tool collection</p>
            </div>

            {categorizedSavedTools.length === 0 ? (
              <div className="py-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth={2}/></svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-4">No Tools Saved</h2>
                <p className="text-slate-500 max-w-md mb-8">Start exploring the directory or intelligence engine to build your collection.</p>
                <button onClick={() => setView('directory')} className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Explore Directory</button>
              </div>
            ) : (
              <div className="space-y-20">
                {categorizedSavedTools.map(([category, tools]) => (
                  <div key={category} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-black text-white whitespace-nowrap">{category}</h3>
                      <div className="h-px w-full bg-white/5" />
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{tools.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onSaveToggle={handleSaveToggle} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* --- VIEW: DIRECTORY --- */}
        {view === 'directory' && (
          <section className="animate-in fade-in duration-700 py-4 md:py-12">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">Directory</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Global Index v1.0.2</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["", "Coding Assistance", "Image Generation", "Research Tools", "File Optimization"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setDirectoryFilter(cat as Category)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      directoryFilter === cat 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                    }`}
                  >
                    {cat || 'All Tools'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {directoryTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} onSaveToggle={handleSaveToggle} />
              ))}
            </div>
          </section>
        )}

        {/* --- VIEW: RESULTS --- */}
        {view === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <aside className="lg:col-span-4 space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl dark:bg-slate-900/40 dark:border-white/5 light:bg-white light:border-slate-200 shadow-xl">
                <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-widest">Intelligence Profile</h2>
                <div className="space-y-6">
                  {isSearching ? (
                    <div className="space-y-4">
                      <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                      <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Primary Intent</span>
                        <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-600 dark:text-blue-300 font-bold">{results?.[0]?.category || 'Detecting...'}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Search Mode</span>
                        <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm text-purple-600 dark:text-purple-300 font-bold">{activeParams?.searchMode}</div>
                      </div>
                    </>
                  )}
                  {user && (user.preferences.recentCategories?.length || 0) > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preference Boost Active</span>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.recentCategories.map(c => (
                          <span key={c} className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-[9px] text-green-600 dark:text-green-400 font-black rounded-md">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={() => setView('home')} className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all">New Search</button>
                </div>
              </div>
            </aside>
            <div className="lg:col-span-8 space-y-12">
              {isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[400px] rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse" />
                  ))}
                </div>
              ) : results && results.length === 0 ? (
                <div className="py-24 flex flex-col items-center text-center bg-slate-900/40 rounded-3xl border border-white/5">
                  <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-4">No High-Score Matches</h2>
                  <p className="text-slate-500 max-w-md mb-8">Our discovery engine couldn't find tools matching your strict criteria with a score above 80.</p>
                  <button onClick={() => setView('request-tool')} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Request This Tool</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {results.map((tool, idx) => {
                    const isNextPlatform = idx > 0 && results[idx-1].platform.includes('Web') && !tool.platform.includes('Web');
                    return (
                      <React.Fragment key={tool.id}>
                        {isNextPlatform && activeParams?.searchMode === 'Both' && (
                          <div className="col-span-full py-8 flex items-center gap-6">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">Mobile App Discoveries</span>
                            <div className="h-px flex-1 bg-white/10" />
                          </div>
                        )}
                        <ToolCard tool={tool} onSaveToggle={handleSaveToggle} />
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW: REQUEST TOOL --- */}
        {view === 'request-tool' && (
          <section className="animate-in fade-in py-12 max-w-2xl mx-auto text-center">
             <h1 className="text-4xl font-black text-white mb-8">Request a New Tool</h1>
             <p className="text-slate-500 mb-12">Can't find what you're looking for? Tell our indexing engine what's missing and we'll prioritize it for the next crawl.</p>
             <div className="p-10 rounded-3xl bg-slate-900/40 border border-white/5 text-left">
                <form onSubmit={(e) => { e.preventDefault(); alert("Request submitted to indexing queue."); setView('home'); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Tool Name or Feature Idea</label>
                    <input required type="text" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. AI Voice Modulator for Linux" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Why is this needed?</label>
                    <textarea required rows={4} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Describe the use case..." />
                  </div>
                  <button className="w-full py-4 bg-blue-600 rounded-xl text-white font-black text-xs uppercase tracking-widest">Submit Request</button>
                </form>
             </div>
          </section>
        )}

        {/* --- VIEW: DASHBOARD --- */}
        {view === 'dashboard' && user && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-8 mb-16">
               <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl">
                 {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-600 flex items-center justify-center text-3xl font-black text-white">{user.name[0]}</div>}
               </div>
               <div>
                 <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{user.name}</h1>
                 <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2">Verified Profile • {user.tier} Intelligence Access</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Intelligence</h3>
                  <div className="text-4xl font-black text-white mb-2">{user.savedTools.length}</div>
                  <p className="text-xs text-slate-600 font-medium">Tools currently indexed in your profile.</p>
               </div>
               <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Preference Accuracy</h3>
                  <div className="text-4xl font-black text-white mb-2">94.2%</div>
                  <p className="text-xs text-slate-600 font-medium">Model precision based on your interactions.</p>
               </div>
               <div className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Subscription</h3>
                  <div className="text-4xl font-black text-white mb-2">PRO</div>
                  <p className="text-xs text-slate-400 font-medium">Full access to Azam Zest priority ranking.</p>
               </div>
            </div>
          </section>
        )}

        {/* --- VIEW: AZAM-ZEST --- */}
        {view === 'azam-zest' && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-8 md:py-12 max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-10 md:mb-12 tracking-tighter">Azam Zest</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                <h3 className="text-xl md:text-2xl font-black text-blue-400 uppercase tracking-widest">Digital Architecting</h3>
                <p className="text-slate-300 leading-relaxed text-base md:text-lg font-medium">Azam Zest is a digital-first architectural studio focusing on the intersection of human psychology and tool intelligence.</p>
                <div className="p-6 rounded-2xl bg-white/5 border-l-4 border-blue-500">
                  <p className="text-sm text-slate-400 italic font-medium">"Design is not just appearance, it's how accurately it serves user intent."</p>
                </div>
              </div>
              <div className="order-1 lg:order-2 aspect-square rounded-[2rem] md:rounded-[3rem] bg-slate-900 border border-white/5 relative overflow-hidden flex items-center justify-center shadow-2xl">
                  <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
                  <Logo status="idle" onNavigate={handleNavigate} />
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: CONTACT --- */}
        {view === 'contact' && (
          <section className="animate-in fade-in py-12 max-w-2xl mx-auto text-center">
             <h1 className="text-4xl font-black text-white mb-8">Contact Intelligence Support</h1>
             <div className="p-10 rounded-3xl bg-slate-900/40 border border-white/5 text-left">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Subject</label>
                    <input type="text" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" placeholder="API Access, Partnership, etc." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Message</label>
                    <textarea rows={4} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Enter your query..." />
                  </div>
                  <button className="w-full py-4 bg-blue-600 rounded-xl text-white font-black text-xs uppercase tracking-widest">Send Transmission</button>
                </form>
             </div>
          </section>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
