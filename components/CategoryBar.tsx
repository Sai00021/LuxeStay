
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { Map as MapIcon, List } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string | null;
  onSelect: (category: string) => void;
  viewMode: 'grid' | 'map';
  onToggleView: () => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelect, viewMode, onToggleView }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed left-0 right-0 bg-white/95 backdrop-blur-xl z-40 transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'top-16 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] border-b border-gray-100 py-1' 
        : 'top-20 md:top-22 border-b border-gray-100 py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-10 overflow-x-auto no-scrollbar flex-1 mr-6 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => onSelect(cat.label)}
                className={`flex flex-col items-center group space-y-2 min-w-max pt-2 pb-1 transition-all relative outline-none ${
                  isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'text-black scale-110' : 'text-gray-500'}`}>
                  {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 20 })}
                </div>
                <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-black' : 'text-gray-500'}`}>
                  {cat.label}
                </span>
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all ${
                  isActive ? 'bg-black scale-x-100' : 'bg-transparent scale-x-0'
                }`}></div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center pl-4 border-l border-gray-100 ml-2">
          <button
            onClick={onToggleView}
            className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold text-[12px] shadow-sm hover:shadow-md hover:border-black transition-all active:scale-95"
          >
            {viewMode === 'grid' ? (
              <>
                <span className="hidden sm:inline">Show Map</span>
                <MapIcon size={16} />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Show List</span>
                <List size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
