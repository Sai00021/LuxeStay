
import React, { useState, useEffect } from 'react';
import { User, Booking, Listing, Review, Currency } from '../types';
import { api } from '../services/api';
import { Calendar, Home, CheckCircle, Star, X, Heart, Eye, TrendingUp, DollarSign, Users, Award } from 'lucide-react';
import ListingCard from '../components/ListingCard';

interface DashboardProps {
  user: User;
  currency: Currency;
  formatPrice: (price: number) => string;
  onListingClick: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, currency, formatPrice, onListingClick }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'wishlist' | 'listings' | 'recent'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [wishlist, setWishlist] = useState<Listing[]>([]);
  const [recentViewed, setRecentViewed] = useState<Listing[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const fetchDashboardData = async () => {
    const bData = await api.getUserBookings(user.id);
    const allListings = await api.getListings();
    const wIds = api.getWishlist(user.id);
    const rIds = api.getRecentlyViewed(user.id);
    
    setBookings(bData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    setListings(allListings.filter(l => l.hostId === user.id));
    setWishlist(allListings.filter(l => wIds.includes(l.id)));
    setRecentViewed(rIds.map(id => allListings.find(l => l.id === id)).filter((l): l is Listing => !!l));
    setWishlistIds(wIds);
    setLoading(false);
  };

  useEffect(() => { fetchDashboardData(); }, [user.id]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewBooking) return;
    await api.createReview({ listingId: reviewBooking.listingId, userId: user.id, userName: user.name, userAvatar: user.avatar, rating, comment }, reviewBooking.id);
    setReviewBooking(null);
    fetchDashboardData();
  };

  const handleToggleWishlist = async (listingId: string) => {
    const newList = await api.toggleWishlistItem(user.id, listingId);
    setWishlistIds(newList);
    const allListings = await api.getListings();
    setWishlist(allListings.filter(l => newList.includes(l.id)));
  };

  if (loading) return (
    <div className="pt-60 text-center flex flex-col items-center">
       <div className="w-10 h-10 border-4 border-gray-100 border-t-airbnb-red rounded-full animate-spin mb-4"></div>
       <p className="font-bold text-gray-500">Syncing your account...</p>
    </div>
  );

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Account Dashboard</h1>
          <p className="text-gray-500 font-bold mt-2">Welcome back, {user.name} · Premier Member</p>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-6 py-4 rounded-3xl shadow-sm">
           <div className="w-10 h-10 rounded-full bg-airbnb-red flex items-center justify-center text-white"><Award size={20} /></div>
           <div><p className="text-sm font-extrabold text-gray-900">Identity Verified</p><p className="text-[11px] font-bold text-green-600 uppercase">Secure Profile</p></div>
        </div>
      </div>
      
      <div className="flex space-x-10 border-b border-gray-100 mb-12 overflow-x-auto no-scrollbar">
        {[
          { id: 'bookings', label: 'My Bookings', count: bookings.length },
          { id: 'wishlist', label: 'Wishlist', count: wishlist.length },
          { id: 'recent', label: 'History', count: recentViewed.length },
          { id: 'listings', label: 'Hosting', count: listings.length }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-5 text-lg font-bold transition relative whitespace-nowrap flex items-center space-x-2.5 ${
              activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black animate-in fade-in slide-in-from-left-full"></div>}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'bookings' && (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4">
            {bookings.length === 0 ? (
              <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                <Calendar className="mx-auto mb-6 text-gray-300" size={64} />
                <h3 className="text-2xl font-extrabold">No upcoming adventures</h3>
                <p className="text-gray-500 mt-3 font-medium">Ready for your next journey?</p>
              </div>
            ) : (
              bookings.map(booking => <BookingCard key={booking.id} booking={booking} formatPrice={formatPrice} onReviewClick={() => setReviewBooking(booking)} onListingClick={() => onListingClick(booking.listingId)} />)
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: 'Total Earnings', value: formatPrice(482000), icon: <DollarSign size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
                 { label: 'Avg. Occupancy', value: '82%', icon: <TrendingUp size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                 { label: 'Total Guests', value: '154', icon: <Users size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                 { label: 'Host Rating', value: '4.98', icon: <Star size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>{stat.icon}</div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {listings.map(listing => (
                 <div key={listing.id} className="group border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white" onClick={() => onListingClick(listing.id)}>
                    <div className="relative h-56 overflow-hidden">
                       <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                       <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] text-white font-extrabold uppercase tracking-widest">Active Listing</div>
                    </div>
                    <div className="p-8">
                       <h3 className="font-extrabold text-xl text-gray-900 mb-2 truncate">{listing.title}</h3>
                       <div className="flex items-center space-x-1 text-gray-500 font-bold text-sm mb-6"><Star size={14} fill="#FF385C" className="text-airbnb-red" /><span>{listing.rating}</span> · <span>{listing.location}</span></div>
                       <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                          <span className="font-extrabold text-gray-900">{formatPrice(listing.price)}<span className="text-gray-400 font-bold text-xs">/night</span></span>
                          <button className="text-sm font-extrabold underline decoration-gray-300 hover:text-airbnb-red transition">Edit Stats</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4">
              {wishlist.map(l => (
                <ListingCard 
                  key={l.id} 
                  listing={l} 
                  currency={currency}
                  formatPrice={formatPrice}
                  isSaved={true} 
                  onToggleSave={(e) => { e.stopPropagation(); handleToggleWishlist(l.id); }} 
                  onClick={() => onListingClick(l.id)} 
                />
              ))}
           </div>
        )}

        {activeTab === 'recent' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4">
              {recentViewed.map(l => (
                <ListingCard 
                  key={l.id} 
                  listing={l} 
                  currency={currency}
                  formatPrice={formatPrice}
                  isSaved={wishlistIds.includes(l.id)} 
                  onToggleSave={(e) => { e.stopPropagation(); handleToggleWishlist(l.id); }} 
                  onClick={() => onListingClick(l.id)} 
                />
              ))}
           </div>
        )}
      </div>

      {reviewBooking && <ReviewModal isOpen={true} onClose={() => setReviewBooking(null)} onSubmit={handleReviewSubmit} />}
    </div>
  );
};

const BookingCard: React.FC<{ booking: Booking, formatPrice: (price: number) => string, onReviewClick: () => void, onListingClick: () => void }> = ({ booking, formatPrice, onReviewClick, onListingClick }) => {
  const [listing, setListing] = useState<Listing | null>(null);
  useEffect(() => { api.getListingById(booking.listingId).then(setListing); }, [booking.listingId]);
  if (!listing) return <div className="h-48 bg-gray-50 rounded-3xl animate-pulse"></div>;

  return (
    <div className="group flex flex-col md:flex-row bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={onListingClick}>
      <div className="md:w-80 h-64 md:h-auto overflow-hidden relative">
        <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <div className="absolute top-6 left-6 flex items-center space-x-2 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full shadow-lg border border-gray-100">
           <CheckCircle size={14} className="text-green-500" />
           <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-900">{booking.status}</span>
        </div>
      </div>
      <div className="flex-1 p-10 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-airbnb-red mb-2">{listing.category}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{listing.title}</h3>
              <p className="text-gray-500 font-bold mt-1">{listing.location}</p>
            </div>
          </div>
          
          <div className="flex gap-12 border-t border-gray-50 pt-8">
            <div><p className="text-[10px] font-extrabold uppercase text-gray-400 mb-1 tracking-widest">Journey Dates</p><p className="font-extrabold text-gray-900">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p></div>
            <div><p className="text-[10px] font-extrabold uppercase text-gray-400 mb-1 tracking-widest">Grand Total</p><p className="font-extrabold text-gray-900">{formatPrice(booking.totalPrice)}</p></div>
          </div>
        </div>
        
        <div className="mt-10 flex flex-wrap gap-6 items-center border-t border-gray-50 pt-8">
          <button className="text-sm font-extrabold underline decoration-gray-300 hover:text-airbnb-red transition">View Receipt</button>
          {!booking.reviewed && (
            <button onClick={(e) => { e.stopPropagation(); onReviewClick(); }} className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-extrabold hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200">Rate your stay</button>
          )}
          {booking.reviewed && <span className="text-sm text-gray-400 font-extrabold italic">Stay rated · {listing.rating}★</span>}
          <button className="text-sm font-extrabold text-red-500 hover:underline ml-auto">Cancel Stay</button>
        </div>
      </div>
    </div>
  );
};

const ReviewModal: React.FC<{ isOpen: boolean, onClose: () => void, onSubmit: (rating: number, comment: string) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
          <span className="font-extrabold text-lg">Your Experience</span>
          <div className="w-10"></div>
        </div>
        
        <div className="p-10 space-y-10">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold mb-3 tracking-tight">How was the magic?</h3>
            <p className="text-gray-500 font-bold text-base px-10">Sharing your thoughts helps us maintain the LuxeStay standard for all guests.</p>
          </div>

          <div className="flex justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)} className="transition-transform active:scale-90 p-1">
                <Star size={44} fill={(hoverRating || rating) >= star ? '#FF385C' : 'none'} className={(hoverRating || rating) >= star ? 'text-airbnb-red' : 'text-gray-200'} strokeWidth={2} />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-400 block ml-1">Observations</label>
            <textarea className="w-full border border-gray-200 rounded-2xl p-6 min-h-[160px] outline-none focus:ring-4 focus:ring-airbnb-red/5 focus:border-airbnb-red transition-all font-medium text-gray-700 bg-gray-50/30" placeholder="Was the view as described? Any hidden gems nearby?..." value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>

          <button onClick={() => onSubmit(rating, comment)} disabled={!comment.trim()} className="w-full bg-airbnb-red text-white py-5 rounded-2xl font-extrabold text-lg hover:bg-[#E31C5F] transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-airbnb-red/20">Publish Review</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
