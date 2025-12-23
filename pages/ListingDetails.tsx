
import React, { useState, useEffect, useCallback } from 'react';
import { Star, Share, Heart, MapPin, Award, Calendar, ShieldCheck, ChevronLeft, ChevronRight, Grid, X, User as UserIcon, MessageCircle, Flag, DoorOpen, Coffee, Zap, TrendingDown, Info } from 'lucide-react';
import { Listing, Booking, User, Review, Currency } from '../types';
import { api } from '../services/api';

interface ListingDetailsProps {
  listingId: string;
  user: User | null;
  currency: Currency;
  formatPrice: (price: number) => string;
  onBack: () => void;
  onBookingSuccess: () => void;
  onLoginRequired: () => void;
}

const PhotoCarouselModal: React.FC<{ 
  images: string[]; 
  initialIndex: number; 
  onClose: () => void 
}> = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = useCallback(() => setCurrentIndex((prev) => (prev + 1) % images.length), [images.length]);
  const handlePrev = useCallback(() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, handleNext, handlePrev]);

  return (
    <div className="fixed inset-0 bg-black/98 z-[110] flex flex-col animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-8 py-6 text-white z-10">
        <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all active:scale-90"><X size={28} /></button>
        <div className="text-sm font-bold tracking-widest">{currentIndex + 1} / {images.length}</div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        <button onClick={handlePrev} className="absolute left-8 z-20 p-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all active:scale-90"><ChevronLeft size={32} /></button>
        <img key={currentIndex} src={images[currentIndex]} className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg select-none animate-in zoom-in-95 duration-500" />
        <button onClick={handleNext} className="absolute right-8 z-20 p-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all active:scale-90"><ChevronRight size={32} /></button>
      </div>
    </div>
  );
};

const ListingDetails: React.FC<ListingDetailsProps> = ({ listingId, user, formatPrice, onBack, onBookingSuccess, onLoginRequired }) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [guests, setGuests] = useState(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [mobileImgIndex, setMobileImgIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const [listingData, reviewsData] = await Promise.all([
        api.getListingById(listingId),
        api.getReviewsByListingId(listingId)
      ]);
      setListing(listingData);
      setReviews(reviewsData);
      if (user) {
        setIsSaved(api.getWishlist(user.id).includes(listingId));
        api.addRecentlyViewed(user.id, listingId);
      }
      setLoading(false);
    };
    fetch();
  }, [listingId, user]);

  const handleBook = async () => {
    if (!user) { onLoginRequired(); return; }
    if (!listing) return;
    setBookingLoading(true);
    await api.createBooking({
      listingId: listing.id,
      userId: user.id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      totalPrice: listing.price * 3 + 2500,
      guests: guests,
      status: 'confirmed'
    });
    setBookingLoading(false);
    onBookingSuccess();
  };

  const handleToggleSave = async () => {
    if (!user) { onLoginRequired(); return; }
    const newList = await api.toggleWishlistItem(user.id, listingId);
    setIsSaved(newList.includes(listingId));
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-14 h-14 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-black font-extrabold text-lg tracking-tight">Curating your sanctuary...</p>
      </div>
    </div>
  );
  
  if (!listing) return <div className="pt-40 text-center font-bold text-xl">Sanctuary not found</div>;

  const displayImages = [...listing.images].slice(0, 5);

  return (
    <div className="pt-0 md:pt-24 pb-32 md:pb-20 max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8">
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-4 pointer-events-none">
        <button 
          onClick={onBack} 
          className="p-3 bg-white rounded-full shadow-xl pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div className="flex space-x-3 pointer-events-auto">
          <button className="p-3 bg-white rounded-full shadow-xl active:scale-90 transition-transform"><Share size={20} /></button>
          <button onClick={handleToggleSave} className="p-3 bg-white rounded-full shadow-xl active:scale-90 transition-transform">
            <Heart size={20} fill={isSaved ? "#FF385C" : "none"} stroke={isSaved ? "#FF385C" : "black"} strokeWidth={isSaved ? 0 : 2.5} />
          </button>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between mb-10">
        <button onClick={onBack} className="flex items-center space-x-3 font-extrabold text-sm hover:translate-x-[-4px] transition-transform"><ChevronLeft size={18} /><span>Discover more stays</span></button>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 hover:bg-gray-50 px-5 py-2.5 rounded-2xl transition font-extrabold text-sm underline decoration-gray-200 decoration-2"><Share size={14} /><span>Share</span></button>
          <button onClick={handleToggleSave} className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl transition font-extrabold text-sm underline decoration-gray-200 decoration-2 ${isSaved ? 'text-airbnb-red' : 'hover:bg-gray-50'}`}>
            <Heart size={14} fill={isSaved ? "#FF385C" : "none"} stroke={isSaved ? "#FF385C" : "currentColor"} strokeWidth={isSaved ? 0 : 2} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="mb-10 px-6 md:px-0 hidden md:block">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">{listing.title}</h1>
        <div className="flex items-center space-x-6 text-sm font-bold text-gray-500">
           <div className="flex items-center space-x-1.5 text-black">
              <Star size={16} fill="black" />
              <span>{listing.rating}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span className="underline decoration-2">{listing.reviewsCount} reviews</span>
           </div>
           <div className="flex items-center space-x-1.5 underline decoration-2 hover:text-black cursor-pointer">
              <MapPin size={16} />
              <span>{listing.location}</span>
           </div>
        </div>
      </div>

      <div className="relative md:rounded-[3rem] overflow-hidden group mb-10 md:mb-16 h-[320px] md:h-[560px] shadow-2xl shadow-black/5 ring-1 ring-black/5">
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-full">
          <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}>
            <img src={displayImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
            <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500" />
          </div>
          {displayImages.slice(1).map((img, i) => (
            <div key={i} className="cursor-pointer overflow-hidden relative" onClick={() => { setGalleryIndex(i+1); setIsGalleryOpen(true); }}>
              <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
              <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500" />
            </div>
          ))}
        </div>

        <div className="md:hidden h-full relative">
          <img src={listing.images[mobileImgIndex]} className="w-full h-full object-cover" />
          <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
            {mobileImgIndex + 1} / {listing.images.length}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 flex">
             {listing.images.slice(0, 10).map((_, i) => (
               <div key={i} className={`flex-1 transition-all ${i === mobileImgIndex ? 'bg-white' : 'bg-white/20'}`} />
             ))}
          </div>
        </div>
        
        <button 
          onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }} 
          className="hidden md:flex absolute bottom-10 right-10 bg-white/90 backdrop-blur-md border border-gray-100 px-8 py-4 rounded-2xl items-center space-x-3 font-extrabold text-sm shadow-2xl active:scale-95 transition-all hover:bg-white"
        >
          <Grid size={18} /><span>Explore all {listing.images.length} photos</span>
        </button>
      </div>

      <div className="px-6 md:px-0">
        <div className="md:hidden mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">{listing.title}</h1>
          <div className="flex items-center space-x-4 text-sm font-bold text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap">
             <div className="flex items-center space-x-1.5 text-black">
                <Star size={16} fill="black" />
                <span>{listing.rating}</span>
                <span className="text-gray-300 mx-1">·</span>
                <span className="underline decoration-2">{listing.reviewsCount} reviews</span>
             </div>
             <div className="flex items-center space-x-1.5 underline decoration-2">
                <MapPin size={16} />
                <span>{listing.location}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            <div className="border-b border-gray-100 pb-12">
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900">Curated by {listing.location.split(',')[0]}</h2>
                    <p className="text-gray-500 font-extrabold text-base md:text-lg tracking-tight">{listing.guests} guests · {listing.bedrooms} bedroom · {listing.beds} bed · {listing.bathrooms} bath</p>
                 </div>
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-xl">
                    <img src={`https://ui-avatars.com/api/?name=Luxe+Host&background=000&color=fff`} className="w-full h-full object-cover" />
                 </div>
              </div>
            </div>
            
            <div className="space-y-10 border-b border-gray-100 pb-12">
              <div className="flex space-x-6 md:space-x-8">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-black/5 flex items-center justify-center text-black shrink-0"><DoorOpen size={24} /></div>
                <div>
                   <p className="font-extrabold text-gray-900 text-base md:text-lg">Self Check-in</p>
                   <p className="text-gray-400 font-bold text-sm md:text-[15px] mt-2 leading-relaxed">Check yourself in with the smartlock for total privacy and convenience.</p>
                </div>
              </div>
              <div className="flex space-x-6 md:space-x-8">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-black/5 flex items-center justify-center text-black shrink-0"><Award size={24} /></div>
                <div>
                   <p className="font-extrabold text-gray-900 text-base md:text-lg">Luxe Experience</p>
                   <p className="text-gray-400 font-bold text-sm md:text-[15px] mt-2 leading-relaxed">Verified for its high-end amenities and exceptional design standards.</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-12">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">The Story</h3>
              <p className="text-gray-600 leading-loose text-lg md:text-xl whitespace-pre-line font-medium opacity-95">{listing.description}</p>
              <button className="font-extrabold underline decoration-2 mt-8 text-black text-base md:text-lg">Read full narrative</button>
            </div>
          </div>

          <div className="relative">
            <div className="hidden lg:block sticky top-32 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-black/10 ring-1 ring-black/5">
              <div className="flex justify-between items-center mb-10">
                 <div className="flex flex-col">
                    <span className="text-3xl font-extrabold text-gray-900">{formatPrice(listing.price)}</span>
                    <span className="text-gray-400 font-extrabold text-xs uppercase tracking-widest mt-1">Per night</span>
                 </div>
                 <div className="bg-gray-50 px-4 py-2 rounded-2xl flex items-center space-x-1.5 font-extrabold text-sm">
                    <Star size={14} fill="black" />
                    <span>{listing.rating}</span>
                    <span className="text-gray-300">·</span>
                    <span className="underline decoration-1">{listing.reviewsCount}</span>
                 </div>
              </div>

              <div className="border border-gray-200 rounded-[2rem] overflow-hidden text-sm mb-10 ring-4 ring-black/0 focus-within:ring-black/5 transition-all">
                 <div className="flex border-b border-gray-200">
                    <div className="flex-1 p-5 border-r border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer">
                       <p className="text-[10px] font-extrabold uppercase text-gray-400 mb-1 tracking-widest">Arrival</p>
                       <p className="font-extrabold text-gray-900">Add date</p>
                    </div>
                    <div className="flex-1 p-5 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer">
                       <p className="text-[10px] font-extrabold uppercase text-gray-400 mb-1 tracking-widest">Departure</p>
                       <p className="font-extrabold text-gray-900">Add date</p>
                    </div>
                 </div>
                 <div className="p-5 flex flex-col group cursor-pointer hover:bg-gray-50 transition-colors">
                    <p className="text-[10px] font-extrabold uppercase text-gray-400 mb-1 tracking-widest">Guest Count</p>
                    <select className="bg-transparent font-extrabold text-gray-900 outline-none cursor-pointer text-base" value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                 </div>
              </div>

              <button 
                onClick={handleBook} 
                disabled={bookingLoading} 
                className="w-full bg-black text-white py-5 rounded-[2rem] font-extrabold text-lg hover:bg-gray-900 shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3 mb-4"
              >
                {bookingLoading ? (
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Book Experience</span>
                )}
              </button>
              <p className="text-center text-[12px] font-extrabold text-gray-400 tracking-tight mb-8">Final confirmation on next step</p>

              <div className="space-y-5 font-bold text-gray-500 border-t border-gray-100 pt-8">
                 <div className="flex justify-between items-center">
                    <span className="underline decoration-gray-200 decoration-2">{formatPrice(listing.price)} x 3 nights</span>
                    <span className="text-gray-900">{formatPrice(listing.price * 3)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="underline decoration-gray-200 decoration-2">LuxeStay concierge fee</span>
                    <span className="text-gray-900">{formatPrice(2500)}</span>
                 </div>
                 <div className="border-t border-gray-100 pt-6 flex justify-between font-extrabold text-gray-900 text-2xl tracking-tight">
                    <span>Grand total</span>
                    <span>{formatPrice(listing.price * 3 + 2500)}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white border-t border-gray-100 px-6 py-5 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-1">
             <span className="text-xl font-black text-gray-900">{formatPrice(listing.price)}</span>
             <span className="text-xs text-gray-400 font-bold">night</span>
          </div>
          <button className="text-[10px] font-black underline uppercase text-gray-900 tracking-widest mt-1">Add dates</button>
        </div>
        <button 
          onClick={handleBook}
          disabled={bookingLoading}
          className="bg-airbnb-red text-white px-10 py-4.5 rounded-[1.5rem] font-black text-[15px] shadow-xl shadow-airbnb-red/20 active:scale-95 transition-all"
        >
          {bookingLoading ? 'Processing...' : 'Reserve Stay'}
        </button>
      </div>

      {isGalleryOpen && <PhotoCarouselModal images={listing.images} initialIndex={galleryIndex} onClose={() => setIsGalleryOpen(false)} />}
    </div>
  );
};

export default ListingDetails;
