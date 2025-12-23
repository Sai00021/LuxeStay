
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import ListingCard from './components/ListingCard';
import AuthModal from './components/AuthModal';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import MapView from './components/MapView';
import Concierge from './components/Concierge';
import { User, Listing, Currency } from './types';
import { api } from './services/api';
import { CURRENCIES } from './constants';
import { Instagram, Twitter, Facebook, Search, Filter, Map as MapIcon, List, Sparkles, Globe, Heart, ChevronDown, Check, X, DollarSign, Waves, Wifi, Utensils, Wind, Car, Briefcase, User as UserIcon, Briefcase as TripsIcon } from 'lucide-react';

const POPULAR_AMENITIES = [
  { label: 'Wifi', icon: <Wifi size={14} /> },
  { label: 'Pool', icon: <Waves size={14} /> },
  { label: 'Kitchen', icon: <Utensils size={14} /> },
  { label: 'Air conditioning', icon: <Wind size={14} /> },
  { label: 'Free parking', icon: <Car size={14} /> },
  { label: 'Dedicated workspace', icon: <Briefcase size={14} /> }
];

const ALL_AMENITIES = [
  'Wifi', 'Pool', 'Kitchen', 'Air conditioning', 'Free parking', 'Dedicated workspace',
  'Infinity Pool', 'Butler Service', 'Garden', 'Beach Access', 'Fireplace',
  'Mountain View', 'River View', 'Heated rooms', 'Private Chef', 'Library',
  'Meditation Room', 'Gym', 'Breakfast included', 'Boat transfer'
];

const MIN_LIMIT = 0;
const MAX_LIMIT = 200000;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_LIMIT, MAX_LIMIT]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'details' | 'dashboard'>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const priceFilterRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = useCallback((priceInINR: number) => {
    const converted = priceInINR * currency.rate;
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0
    }).format(converted);
  }, [currency]);

  const searchSuggestions = useMemo(() => {
    const locations = listings.map(l => l.location);
    const categories = listings.map(l => l.category);
    const keywords = ['Beach', 'Modern', 'Villa', 'Cabin', 'Royal', 'Suite', 'India'];
    return Array.from(new Set([...locations, ...categories, ...keywords])).sort();
  }, [listings]);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setWishlistIds(api.getWishlist(currentUser.id));
    }
    fetchListings();
  }, []);

  useEffect(() => {
    fetchListings(selectedCategory || undefined, searchQuery, selectedAmenities, priceRange[0], priceRange[1]);
  }, [selectedCategory, searchQuery, selectedAmenities, priceRange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (priceFilterRef.current && !priceFilterRef.current.contains(event.target as Node)) {
        setIsPriceFilterOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchListings = async (category?: string, query?: string, amenities?: string[], min?: number, max?: number) => {
    setLoading(true);
    const data = await api.getListings(category, query, amenities, min, max);
    setListings(data);
    setLoading(false);
  };

  const handleLogin = async (email: string) => {
    const user = await api.login(email);
    setUser(user);
    setWishlistIds(api.getWishlist(user.id));
    setIsAuthModalOpen(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const user = await api.loginWithSocial(provider);
    setUser(user);
    setWishlistIds(api.getWishlist(user.id));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setWishlistIds([]);
    setCurrentView('home');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSelectedAmenities([]);
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange([MIN_LIMIT, MAX_LIMIT]);
  };

  const handleToggleSave = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const newList = await api.toggleWishlistItem(user.id, listingId);
    setWishlistIds(newList);
  };

  const openListingDetails = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('details');
    window.scrollTo(0, 0);
  };

  const handleBookingSuccess = () => {
    setCurrentView('dashboard');
    window.scrollTo(0, 0);
  };

  const isPriceModified = priceRange[0] !== MIN_LIMIT || priceRange[1] !== MAX_LIMIT;

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Header 
        user={user}
        suggestions={searchSuggestions}
        showTotalPrice={showTotalPrice}
        onShowTotalPriceChange={setShowTotalPrice}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onHomeClick={() => { 
          setCurrentView('home'); 
          setSelectedCategory(null); 
          setSearchQuery('');
          setSelectedAmenities([]);
          setPriceRange([MIN_LIMIT, MAX_LIMIT]);
          setViewMode('grid');
        }}
        onDashboardClick={() => setCurrentView('dashboard')}
        onSearch={handleSearch}
      />

      {currentView === 'home' && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <CategoryBar 
            selectedCategory={selectedCategory} 
            onSelect={setSelectedCategory} 
            viewMode={viewMode}
            onToggleView={() => setViewMode(prev => prev === 'grid' ? 'map' : 'grid')}
          />
          
          <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 transition-all duration-500 ${isScrolled ? 'pt-32' : 'pt-36 md:pt-40'}`}>
            <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30 p-4 rounded-3xl border border-gray-100 relative z-30">
              <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1 relative">
                
                <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm space-x-3">
                  <span className="text-[11px] font-black whitespace-nowrap">Display total price</span>
                  <button 
                    onClick={() => setShowTotalPrice(!showTotalPrice)}
                    className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-1 ${showTotalPrice ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${showTotalPrice ? 'translate-x-5' : 'translate-x-0 shadow-sm'}`} />
                  </button>
                </div>

                <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                <div className="relative" ref={filterRef}>
                  <button 
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`flex items-center space-x-2 border px-4 py-2.5 rounded-2xl font-bold text-[12px] transition-all bg-white shadow-sm active:scale-95 ${
                      isFilterDropdownOpen || selectedAmenities.length > 0 
                        ? 'border-black ring-2 ring-black/5 shadow-md' 
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <Filter size={14} />
                    <span>Amenities</span>
                    {selectedAmenities.length > 0 && (
                      <span className="bg-black text-white rounded-full px-1.5 py-0.5 text-[9px] font-black">
                        {selectedAmenities.length}
                      </span>
                    )}
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isFilterDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl py-6 px-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-black text-sm text-gray-900">Features</h4>
                        {selectedAmenities.length > 0 && (
                          <button onClick={() => setSelectedAmenities([])} className="text-[10px] font-black uppercase text-airbnb-red">Clear</button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                        {ALL_AMENITIES.map(amenity => (
                          <div 
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className="flex items-center justify-between group cursor-pointer"
                          >
                            <span className={`text-[13px] font-bold ${selectedAmenities.includes(amenity) ? 'text-black' : 'text-gray-500'}`}>{amenity}</span>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              selectedAmenities.includes(amenity) ? 'bg-black border-black' : 'border-gray-200'
                            }`}>
                              {selectedAmenities.includes(amenity) && <Check size={12} className="text-white" strokeWidth={4} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={priceFilterRef}>
                  <button 
                    onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                    className={`flex items-center space-x-2 border px-4 py-2.5 rounded-2xl font-bold text-[12px] transition-all bg-white shadow-sm active:scale-95 ${
                      isPriceFilterOpen || isPriceModified 
                        ? 'border-black ring-2 ring-black/5 shadow-md' 
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <DollarSign size={14} />
                    <span>Price</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isPriceFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isPriceFilterOpen && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl py-6 px-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <h4 className="font-black text-sm text-gray-900 mb-6">Price Range</h4>
                      <div className="space-y-6">
                        <div className="relative h-1.5 bg-gray-100 rounded-full">
                          <div className="absolute h-full bg-black rounded-full" style={{ left: `${(priceRange[0] / MAX_LIMIT) * 100}%`, right: `${100 - (priceRange[1] / MAX_LIMIT) * 100}%` }} />
                          <input type="range" min={MIN_LIMIT} max={MAX_LIMIT} step={1000} value={priceRange[0]} onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1] - 5000), priceRange[1]])} className="absolute w-full h-full appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full" />
                          <input type="range" min={MIN_LIMIT} max={MAX_LIMIT} step={1000} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0] + 5000)])} className="absolute w-full h-full appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                <div className="flex items-center space-x-2">
                  {POPULAR_AMENITIES.map(amenity => (
                    <button
                      key={amenity.label}
                      onClick={() => toggleAmenity(amenity.label)}
                      className={`px-4 py-2.5 rounded-2xl border text-[11px] font-black transition-all duration-300 whitespace-nowrap flex items-center space-x-1.5 ${
                        selectedAmenities.includes(amenity.label)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                      }`}
                    >
                      {amenity.icon}
                      <span>{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-square bg-gray-50 rounded-[2rem]"></div>
                    <div className="h-5 bg-gray-50 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-50 rounded-lg w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-40 bg-gray-50/20 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
                <Search size={48} className="text-gray-200 mb-6" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">No stays found</h2>
                <button onClick={clearFilters} className="mt-8 bg-black text-white px-8 py-3 rounded-full font-black hover:scale-105 transition-all text-sm">Clear filters</button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {listings.map((listing) => (
                      <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        showTotalPrice={showTotalPrice}
                        currency={currency}
                        formatPrice={formatPrice}
                        isSaved={wishlistIds.includes(listing.id)}
                        onToggleSave={(e) => handleToggleSave(e, listing.id)}
                        onClick={() => openListingDetails(listing.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <MapView 
                    listings={listings} 
                    currency={currency}
                    formatPrice={formatPrice}
                    onListingClick={openListingDetails}
                    onBackToList={() => setViewMode('grid')}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {currentView === 'details' && selectedListingId && (
        <div className="animate-in slide-in-from-right-10 fade-in duration-700">
          <ListingDetails 
            listingId={selectedListingId} 
            user={user}
            currency={currency}
            formatPrice={formatPrice}
            onBack={() => setCurrentView('home')}
            onBookingSuccess={handleBookingSuccess}
            onLoginRequired={() => setIsAuthModalOpen(true)}
          />
        </div>
      )}

      {currentView === 'dashboard' && (
        <div className="animate-in slide-in-from-left-10 fade-in duration-700">
          <Dashboard user={user!} currency={currency} formatPrice={formatPrice} onListingClick={openListingDetails} />
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSocialLogin={handleSocialLogin}
      />

      <Concierge user={user} listings={listings} currency={currency} formatPrice={formatPrice} onSelectListing={openListingDetails} />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-gray-100 z-50 h-18 px-6 flex items-center justify-between shadow-lg">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center space-y-1 ${currentView === 'home' ? 'text-airbnb-red' : 'text-gray-400'}`}>
          <Search size={22} />
          <span className="text-[9px] font-black uppercase">Explore</span>
        </button>
        <button onClick={() => { if (!user) setIsAuthModalOpen(true); else setCurrentView('dashboard'); }} className={`flex flex-col items-center space-y-1 ${currentView === 'dashboard' ? 'text-airbnb-red' : 'text-gray-400'}`}>
          <Heart size={22} />
          <span className="text-[9px] font-black uppercase">Wishlist</span>
        </button>
        <button onClick={() => { if (!user) setIsAuthModalOpen(true); else setCurrentView('dashboard'); }} className="flex flex-col items-center space-y-1 text-gray-400">
          <UserIcon size={22} />
          <span className="text-[9px] font-black uppercase">Profile</span>
        </button>
      </nav>

      <footer className="hidden md:block bg-white border-t border-gray-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-12">
          <div><h4 className="font-black text-[11px] mb-6 uppercase text-gray-400">Support</h4><ul className="space-y-4 text-sm text-gray-500 font-bold"><li>Help Center</li><li>LuxeCover</li></ul></div>
          <div><h4 className="font-black text-[11px] mb-6 uppercase text-gray-400">Hosting</h4><ul className="space-y-4 text-sm text-gray-500 font-bold"><li>List your home</li><li>Host resources</li></ul></div>
          <div><h4 className="font-black text-[11px] mb-6 uppercase text-gray-400">LuxeStay</h4><ul className="space-y-4 text-sm text-gray-500 font-bold"><li>Newsroom</li><li>Careers</li></ul></div>
          <div><h4 className="font-black text-[11px] mb-6 uppercase text-gray-400">Follow Us</h4><div className="flex space-x-4"><Instagram size={18} /><Twitter size={18} /></div></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-bold">
          <span>© 2024 LuxeStay Private Limited.</span>
          <div className="flex items-center space-x-6 text-black">
            <button className="flex items-center space-x-2">
              <Globe size={14} />
              <span>English (Intl)</span>
            </button>
            <div className="relative" ref={currencyRef}>
              <button onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)} className="font-black flex items-center space-x-1 uppercase">
                <span>{currency.symbol} {currency.code}</span>
                <ChevronDown size={12} />
              </button>
              {isCurrencyMenuOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-40 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[200]">
                  {CURRENCIES.map(curr => (
                    <button key={curr.code} onClick={() => { setCurrency(curr); setIsCurrencyMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-[11px] font-bold ${currency.code === curr.code ? 'text-airbnb-red bg-airbnb-red/5' : 'text-gray-600 hover:bg-gray-50'}`}>{curr.code}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
