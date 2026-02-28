
import React, { useState } from 'react';
import { SearchParams, SkillLevel, Category, Pricing, SearchMode } from '../types';

interface SearchPanelProps {
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
  searchMode: SearchMode;
  onSearchModeChange: (mode: SearchMode) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch, isSearching, searchMode, onSearchModeChange }) => {
  const initialParams: SearchParams = {
    query: '',
    budget: '',
    skill: '',
    category: '', 
    pricing: '',
    studentDiscount: false,
    searchMode: 'Both'
  };

  const [params, setParams] = useState<SearchParams>(initialParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ ...params, searchMode });
  };

  const handleClear = () => {
    setParams(initialParams);
    onSearchModeChange('Both');
  };

  const filterChips = ["Trending", "Editor's Pick", "Top Rated", "New Release"];
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const toggleChip = (chip: string) => {
    setActiveChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
    // Simulate query expansion
    if (!activeChips.includes(chip)) {
      setParams(p => ({ ...p, query: p.query ? `${p.query} ${chip}` : chip }));
    }
  };

  const SelectWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col gap-2 group/select">
      <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1 transition-colors group-focus-within/select:text-blue-400">
        {label}
      </label>
      <div className="relative">
        {children}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within/select:text-blue-400 group-hover/select:text-slate-300 transition-colors">
          <svg className="w-4 h-4 transition-transform duration-300 group-focus-within/select:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  const selectClasses = "w-full bg-slate-950/50 border border-white/5 rounded-xl pl-4 pr-10 py-3.5 md:py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:scale-[1.01] appearance-none cursor-pointer hover:bg-slate-950/80 transition-all duration-300 text-sm font-medium";

  return (
    <div className="w-full max-w-5xl mx-auto px-1 md:px-0">
      <form 
        onSubmit={handleSearch}
        className="rounded-3xl md:rounded-[2.5rem] backdrop-blur-3xl bg-slate-900/40 shadow-2xl border border-white/10 p-6 md:p-10 flex flex-col gap-6 md:gap-8 transition-all duration-500"
      >
        {/* Platform Selector */}
        <div className="flex flex-col gap-4">
          <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Discovery Mode</label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950/50 rounded-2xl border border-white/5">
            {(["Web Only", "App Only", "Both"] as SearchMode[]).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => onSearchModeChange(mode)}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  searchMode === mode 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Row 1: Main Search */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">What are you looking for?</label>
          <div className="relative group">
            <input 
              type="text"
              placeholder="Search tools, apps, repositories..."
              value={params.query}
              onChange={(e) => setParams({ ...params, query: e.target.value })}
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 md:py-7 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 md:focus:scale-[1.01] focus:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all duration-500 placeholder:text-slate-700 group-hover:bg-slate-950/80 text-lg md:text-xl font-medium"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within:opacity-100 group-focus-within:scale-110 transition-all duration-500 hidden sm:block">
               <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 px-1">
            {filterChips.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  activeChips.includes(chip)
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
          <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1 opacity-80">
            Intelligent category detection enabled
          </p>

        {/* Row 2: Budget and Skill */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <SelectWrapper label="Budget Intent">
            <select 
              value={params.budget}
              onChange={(e) => setParams({ ...params, budget: e.target.value as any })}
              className={selectClasses}
            >
              <option value="" className="bg-slate-900">Any Budget</option>
              <option value="Low" className="bg-slate-900">Low (Free/Freemium)</option>
              <option value="Medium" className="bg-slate-900">Medium (Balanced)</option>
              <option value="High" className="bg-slate-900">High (Pro/Enterprise)</option>
            </select>
          </SelectWrapper>

          <SelectWrapper label="Skill Level">
            <select 
              value={params.skill}
              onChange={(e) => setParams({ ...params, skill: e.target.value as SkillLevel })}
              className={selectClasses}
            >
              <option value="" className="bg-slate-900">Any Skill Level</option>
              <option value="beginner" className="bg-slate-900">Beginner Friendly</option>
              <option value="intermediate" className="bg-slate-900">Intermediate</option>
              <option value="advanced" className="bg-slate-900">Power User</option>
            </select>
          </SelectWrapper>
        </div>

        {/* Row 3: Student Toggle and Actions */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center border-t border-white/5 pt-6 md:pt-8">
          <div className="w-full md:col-span-5 flex items-center justify-center md:justify-start gap-4 px-2">
            <button 
              type="button"
              onClick={() => setParams({ ...params, studentDiscount: !params.studentDiscount })}
              className="flex items-center gap-3 group focus:outline-none p-2 rounded-xl transition-all"
            >
              <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${params.studentDiscount ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800 border border-white/5'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-500 ease-out ${params.studentDiscount ? 'left-6' : 'left-1'}`} />
              </div>
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${params.studentDiscount ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                Student Status
              </span>
            </button>
          </div>

          <div className="w-full md:col-span-7 flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              type="button"
              onClick={handleClear}
              className="flex-1 h-[52px] md:h-[60px] rounded-2xl font-black text-slate-500 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-[10px] md:text-xs uppercase tracking-widest"
            >
              Reset
            </button>
            <button 
              type="submit"
              disabled={isSearching}
              className={`relative flex-[2] h-[52px] md:h-[60px] rounded-2xl font-black transition-all duration-500 overflow-hidden group outline-none ${
                isSearching 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                  : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_200%] hover:bg-[100%_100%] text-white shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSearching ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-4 w-4 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="tracking-widest uppercase text-[10px] font-black">Scanning...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="tracking-widest uppercase text-xs md:text-sm">Find Intelligence</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
