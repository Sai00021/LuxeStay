
import React, { useState } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight, Wifi, Waves, Wind, Car, Utensils } from 'lucide-react';
import { Listing, Currency } from '../types';

interface ListingCardProps {
  listing: Listing;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
  onClick: () => void;
  showTotalPrice?: boolean;
  currency: Currency;
  formatPrice: (price: number) => string;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Wifi': <Wifi size={12} />,
  'Pool': <Waves size={12} />,
  'Infinity Pool': <Waves size={12} />,
  'Air conditioning': <Wind size={12} />,
  'Free parking': <Car size={12} />,
  'Kitchen': <Utensils size={12} />,
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, isSaved, onToggleSave, onClick, showTotalPrice, formatPrice }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentImg((prev) => (prev + 1) % listing.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentImg((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const baseTotal = listing.price * 5;
  const conciergeFee = 2500;
  const grandTotal = baseTotal + conciergeFee;

  return (
    <div 
      className="group cursor-pointer flex flex-col space-y-3 animate-in fade-in duration-500"
      onClick={onClick}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl ring-1 ring-black/5">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full opacity-20" />
          </div>
        )}
        
        <img 
          src={listing.images[currentImg]} 
          alt={listing.title}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition duration-1000 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button 
            onClick={prevImg}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all active:scale-90 border border-gray-100"
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          <button 
            onClick={nextImg}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all active:scale-90 border border-gray-100"
          >
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

        {listing.rating >= 4.9 && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-xl px-4 py-1.5 rounded-full flex items-center space-x-2 ring-1 ring-black/5 animate-in slide-in-from-left-4 duration-500 z-10">
            <Star size={12} fill="black" />
            <span className="text-[10px] font-black uppercase tracking-widest">Luxe Favorite</span>
          </div>
        )}

        <button 
          onClick={onToggleSave}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-500 hover:scale-125 active:scale-90 z-20 ${
            isSaved ? 'scale-110' : 'text-white drop-shadow-2xl'
          }`}
        >
          <Heart 
            size={24} 
            fill={isSaved ? "#FF385C" : "rgba(0,0,0,0.4)"} 
            stroke={isSaved ? "#FF385C" : "white"}
            strokeWidth={isSaved ? 0 : 2.5}
            className="transition-all duration-300"
          />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/10 backdrop-blur-sm p-1.5 rounded-full z-10">
          {listing.images.slice(0, 5).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === currentImg ? 'bg-white scale-125' : 'bg-white/40'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-1.5 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-black text-[15px] text-gray-900 truncate pr-4 tracking-tight leading-tight">{listing.location}</h3>
          <div className="flex items-center space-x-1 shrink-0 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
            <Star size={13} fill="currentColor" className="text-gray-900" />
            <span className="text-[13px] font-black text-gray-900">{listing.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-gray-500 text-[13px] font-bold">
          <div className="truncate pr-2">
            {listing.category} · {listing.bedrooms} bedroom
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            {listing.amenities.slice(0, 3).map((amn, i) => (
              <div key={i} className="text-gray-300 hover:text-gray-900 transition-colors" title={amn}>
                {AMENITY_ICONS[amn] || null}
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-1.5">
          <div className="flex items-baseline space-x-1.5">
            <span className="font-black text-gray-900 text-base">{formatPrice(listing.price)}</span>
            <span className="text-gray-400 font-bold text-[13px] uppercase tracking-tighter">night</span>
          </div>
          {showTotalPrice && (
            <div className="mt-1 flex flex-col space-y-0.5 animate-in slide-in-from-top-1 duration-300">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex justify-between items-center">
                <span>{formatPrice(listing.price)} x 5 nights</span>
                <span>{formatPrice(baseTotal)}</span>
              </div>
              <div className="text-gray-900 text-[14px] font-black border-t border-gray-50 pt-1 mt-1 flex justify-between items-center">
                <span>Total <span className="text-[11px] text-gray-400 font-bold">(incl. fees)</span></span>
                <span className="underline underline-offset-4 decoration-airbnb-red/30">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
