
import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Menu, User as UserIcon, X, MapPin, ArrowLeft, Sparkles, Filter, Compass, TrendingUp, History, Palmtree, Waves, Flame, Ship, Zap, Crown, Ghost, Camera, ChevronRight, Magnet } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  suggestions: string[];
  showTotalPrice: boolean;
  onShowTotalPriceChange: (val: boolean) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onHomeClick: () => void;
  onDashboardClick: () => void;
  onSearch: (query: string) => void;
}

const SMART_PLACEHOLDERS = [
  "Search for a castle in Scotland...",
  "Find a villa in the Maldives...",
  "Explore lofts in Manhattan...",
  "Discover retreats in Kyoto...",
  "Search for mansions in Dubai...",
  "A quiet cabin in the Alps...",
  "Glass house in the desert..."
];

const Header: React.FC<HeaderProps> = ({ 
  user, 
  suggestions,
  onLoginClick, 
  onLogout, 
  onHomeClick, 
  onDashboardClick,
  onSearch 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<{label: string, type: 'location' | 'category' | 'recent' | 'vip'}[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSearchExpanded) {
        setPlaceholderIndex((prev) => (prev + 1) % SMART_PLACEHOLDERS.length);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (searchInput === '' || window.innerWidth >= 768) {
          setIsSearchExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => setIsTyping(false), 1000);
    
    if (value.length > 0) {
      const matches = suggestions
        .filter(s => s.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
        .map(s => ({ label: s, type: 'location' as const }));
      
      const categoryMatches = ['Beachfront', 'Luxe', 'Castles', 'Arctic', 'Desert']
        .filter(c => c.toLowerCase().includes(value.toLowerCase()))
        .map(c => ({ label: c, type: 'category' as const }));

      setFilteredSuggestions([...categoryMatches, ...matches]);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([
        { label: 'Royal Palaces', type: 'vip' },
        { label: 'Private Islands', type: 'vip' },
        { label: 'Maldives', type: 'location' },
        { label: 'Switzerland', type: 'location' }
      ]);
      setShowSuggestions(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
      setShowSuggestions(false);
      setIsSearchExpanded(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchInput(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setIsSearchExpanded(false);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] transition-all duration-700 pointer-events-none ${
          isSearchExpanded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <header className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled 
          ? 'bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] h-16' 
          : 'bg-white h-20 md:h-22 border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4 relative">
          
          <div 
            className={`items-center cursor-pointer text-airbnb-red group shrink-0 transition-all duration-500 ${
              isSearchExpanded ? 'hidden md:flex opacity-0 md:opacity-100 scale-90 md:scale-100' : 'flex'
            }`}
            onClick={() => {
              onHomeClick();
              setSearchInput('');
              setIsSearchExpanded(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative">
              <svg className={`fill-current relative transition-all duration-500 ${isScrolled ? 'w-8 h-8' : 'w-9 h-9'}`} viewBox="0 0 32 32">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.42-6.72 3.42-3.481 0-6.358-2.416-6.358-6.478l.002-.23c.011-.94.254-1.821.926-3.425l.145-.353c.987-2.296 5.147-11.006 7.102-14.838l.532-1.024C12.537 1.963 13.992 1 16 1zm0 2c-1.232 0-2.328.711-3.447 2.703l-.504.972C10.134 10.435 6.033 19.04 5.087 21.244l-.133.324c-.551 1.319-.738 2.012-.782 2.686l-.007.228c0 2.87 2.007 4.478 4.358 4.478 1.833 0 3.824-1.125 5.76-3.134l.43-.454.287-.312.288.312.43.454c1.935 2.01 3.927 3.134 5.76 3.134 2.35 0 4.358-1.609 4.358-4.478l-.001-.228c-.044-.674-.231-1.367-.783-2.686l-.133-.324c-.947-2.204-5.048-10.81-6.965-14.571l-.504-.972C18.328 3.711 17.232 3 16 3zm0 15c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 2c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z" />
              </svg>
            </div>
            <div className="flex flex-col ml-3 hidden lg:flex">
              <span className={`font-black tracking-tight transition-all duration-500 leading-none ${isScrolled ? 'text-lg' : 'text-xl'}`}>LuxeStay</span>
            </div>
          </div>

          <div 
            ref={searchRef} 
            className={`flex-1 flex justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isSearchExpanded 
                ? 'fixed md:relative inset-x-0 md:inset-x-auto top-3 md:top-auto px-6 md:p-0 z-[120]' 
                : 'max-w-lg'
            }`}
          >
            <div className={`relative transition-all duration-500 ${
              isSearchExpanded 
                ? 'w-full scale-100' 
                : 'w-12 md:w-[360px] lg:w-[480px]'
            }`}>
              <div className={`absolute -inset-[3px] bg-airbnb-red/10 rounded-[2.5rem] blur-xl transition-all duration-700 pointer-events-none ${isSearchExpanded ? 'opacity-40 scale-105' : 'opacity-0'}`} />

              <form 
                onSubmit={handleSearchSubmit}
                className={`flex items-center transition-all duration-500 overflow-hidden relative group/search bg-white border border-black/10 shadow-sm hover:shadow-md ${
                  isSearchExpanded 
                    ? 'rounded-[2rem] h-14 md:h-16 pl-4 pr-2 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5' 
                    : 'rounded-full h-11 md:h-12'
                }`}
                onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
              >
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsSearchExpanded(false); }}
                  className={`relative p-2 text-black transition-all duration-300 rounded-full hover:bg-gray-100 ${isSearchExpanded ? 'scale-100 opacity-100 mr-1' : 'scale-0 opacity-0 w-0 h-0 invisible'}`}
                >
                  <ArrowLeft size={20} strokeWidth={3} />
                </button>

                <div className="flex-1 flex items-center h-full min-w-0 px-2 relative z-10">
                  <div className="flex-1 relative flex items-center h-full">
                    <div className={`absolute inset-0 flex items-center transition-all duration-500 pointer-events-none ${
                      isSearchExpanded || searchInput ? 'opacity-0 -translate-y-4' : 'opacity-100'
                    }`}>
                      <span className="text-gray-400 font-bold text-[13px] hidden md:inline truncate tracking-tight">
                        {SMART_PLACEHOLDERS[placeholderIndex]}
                      </span>
                    </div>

                    <input 
                      type="text"
                      placeholder={isSearchExpanded ? "Where to?" : ""}
                      className={`w-full bg-transparent outline-none text-sm md:text-base font-black px-1 text-black placeholder:text-gray-400 transition-all duration-500 ${
                        isSearchExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'
                      }`}
                      value={searchInput}
                      onChange={handleInputChange}
                      readOnly={!isSearchExpanded}
                      onFocus={() => setIsSearchExpanded(true)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className={`flex items-center justify-center transition-all duration-500 relative shrink-0 overflow-hidden ${
                    isSearchExpanded 
                      ? 'bg-black text-white px-6 h-10 md:h-12 rounded-[1.2rem] hover:bg-airbnb-red active:scale-95 shadow-md' 
                      : 'bg-airbnb-red text-white w-8 h-8 md:w-9 md:h-9 rounded-full shadow-[0_4px_12px_rgba(255,56,92,0.4)] hover:scale-110 active:scale-90 mr-1'
                  }`}
                >
                  <Search size={isSearchExpanded ? 16 : 14} strokeWidth={4} />
                  {isSearchExpanded && (
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] ml-2 hidden sm:inline">Search</span>
                  )}
                </button>
              </form>

              {showSuggestions && isSearchExpanded && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-100 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] py-6 z-[200] animate-in fade-in slide-in-from-top-4 duration-500 max-h-[70vh] overflow-y-auto no-scrollbar ring-1 ring-black/5">
                  <div className="px-6 space-y-2">
                    {filteredSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center space-x-4 px-4 py-3 text-left hover:bg-gray-50 rounded-2xl transition-all group/item"
                        onClick={() => handleSelectSuggestion(suggestion.label)}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          suggestion.type === 'vip' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {suggestion.type === 'vip' ? <Crown size={18} /> : <MapPin size={18} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">{suggestion.label}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{suggestion.type}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 opacity-0 group-hover/item:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`flex items-center space-x-4 shrink-0 transition-opacity duration-500 ${isSearchExpanded ? 'hidden md:flex opacity-0 md:opacity-100' : 'flex'}`}>
            <button className="hidden lg:block text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Host</button>
            <div className="relative">
              <button 
                className="flex items-center space-x-3 border border-gray-200 rounded-full hover:shadow-md transition-all bg-white p-1.5 pl-3.5 group active:scale-95 ring-1 ring-black/0 focus-within:ring-black/5"
                onClick={() => setShowMenu(!showMenu)}
              >
                <Menu size={18} strokeWidth={2.5} />
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={16} />}
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300 ring-1 ring-black/5">
                  {!user ? (
                    <>
                      <button onClick={() => { onLoginClick(); setShowMenu(false); }} className="w-full text-left px-6 py-3.5 text-sm font-black hover:bg-gray-50 transition-colors">Sign up</button>
                      <button onClick={() => { onLoginClick(); setShowMenu(false); }} className="w-full text-left px-6 py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">Log in</button>
                    </>
                  ) : (
                    <>
                      <div className="px-6 py-4 border-b border-gray-50 mb-2 bg-gray-50/30">
                        <p className="font-black text-sm text-gray-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-airbnb-red font-black uppercase tracking-widest mt-0.5">VIP Member</p>
                      </div>
                      <button onClick={() => { onDashboardClick(); setShowMenu(false); }} className="w-full text-left px-6 py-3.5 text-sm font-bold hover:bg-gray-50 transition-colors">Dashboard</button>
                      <button onClick={() => { onLogout(); setShowMenu(false); }} className="w-full text-left px-6 py-3.5 text-sm text-airbnb-red font-black hover:bg-gray-50 transition-colors">Log out</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
