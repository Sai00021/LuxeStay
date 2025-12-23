
import { User, Listing, Booking, Category, Review } from '../types';
import { MOCK_LISTINGS } from '../constants';

const STORAGE_KEYS = {
  USER: 'luxestay_user',
  LISTINGS: 'luxestay_listings',
  BOOKINGS: 'luxestay_bookings',
  REVIEWS: 'luxestay_reviews',
  WISHLIST: 'luxestay_wishlist',
  RECENTLY_VIEWED: 'luxestay_recently_viewed',
};

// Seed initial data if not present
if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(MOCK_LISTINGS));
}

if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
}

if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
}

if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify({}));
}

if (!localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED)) {
  localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify({}));
}

export const api = {
  // Auth
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  
  login: async (email: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: 'u1',
          name: email.split('@')[0],
          email: email,
          isHost: true,
          avatar: `https://ui-avatars.com/api/?name=${email}&background=FF385C&color=fff`
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  },

  loginWithSocial: async (provider: 'google' | 'facebook'): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const name = provider === 'google' ? 'Google User' : 'Facebook Friend';
        const email = `${provider.toLowerCase()}@example.com`;
        const user: User = {
          id: `u_${provider}_${Math.random().toString(36).substr(2, 5)}`,
          name: name,
          email: email,
          isHost: true,
          avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=${provider === 'google' ? '4285F4' : '1877F2'}&color=fff`
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        resolve(user);
      }, 1500); // Simulate OAuth 2.0 redirect/popup delay
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Wishlist
  getWishlist: (userId: string): string[] => {
    const wishlistData = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '{}');
    return wishlistData[userId] || [];
  },

  toggleWishlistItem: async (userId: string, listingId: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wishlistData = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '{}');
        const userWishlist: string[] = wishlistData[userId] || [];
        
        let newList: string[];
        if (userWishlist.includes(listingId)) {
          newList = userWishlist.filter(id => id !== listingId);
        } else {
          newList = [...userWishlist, listingId];
        }
        
        wishlistData[userId] = newList;
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistData));
        resolve(newList);
      }, 300);
    });
  },

  // Recently Viewed
  getRecentlyViewed: (userId: string): string[] => {
    const recentlyViewedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED) || '{}');
    return recentlyViewedData[userId] || [];
  },

  addRecentlyViewed: (userId: string, listingId: string): void => {
    const recentlyViewedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED) || '{}');
    let userRecentlyViewed: string[] = recentlyViewedData[userId] || [];
    
    // Remove if already exists to move it to the front
    userRecentlyViewed = userRecentlyViewed.filter(id => id !== listingId);
    
    // Add to front
    userRecentlyViewed.unshift(listingId);
    
    // Keep only last 12
    if (userRecentlyViewed.length > 12) {
      userRecentlyViewed = userRecentlyViewed.slice(0, 12);
    }
    
    recentlyViewedData[userId] = userRecentlyViewed;
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewedData));
  },

  // Listings
  getListings: async (category?: string, search?: string, amenities?: string[], minPrice?: number, maxPrice?: number): Promise<Listing[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let listings: Listing[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
        
        if (category) {
          listings = listings.filter(l => l.category === category);
        }
        
        if (search) {
          const query = search.toLowerCase().trim();
          listings = listings.filter(l => 
            l.location.toLowerCase().includes(query) || 
            l.title.toLowerCase().includes(query) ||
            l.description.toLowerCase().includes(query) ||
            l.category.toLowerCase().includes(query) ||
            l.amenities.some(amenity => amenity.toLowerCase().includes(query))
          );
        }

        if (amenities && amenities.length > 0) {
          listings = listings.filter(l => 
            amenities.every(selected => 
              l.amenities.some(a => a.toLowerCase() === selected.toLowerCase())
            )
          );
        }

        if (minPrice !== undefined) {
          listings = listings.filter(l => l.price >= minPrice);
        }

        if (maxPrice !== undefined) {
          listings = listings.filter(l => l.price <= maxPrice);
        }
        
        resolve(listings);
      }, 500);
    });
  },

  getListingById: async (id: string): Promise<Listing | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const listings: Listing[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
        resolve(listings.find(l => l.id === id) || null);
      }, 300);
    });
  },

  // Bookings
  createBooking: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBooking: Booking = { ...booking, id: Math.random().toString(36).substr(2, 9), reviewed: false };
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        bookings.push(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        resolve(newBooking);
      }, 1000);
    });
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    return bookings.filter(b => b.userId === userId);
  },

  // Reviews
  getReviewsByListingId: async (listingId: string): Promise<Review[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews: Review[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
        resolve(reviews.filter(r => r.listingId === listingId));
      }, 400);
    });
  },

  createReview: async (review: Omit<Review, 'id' | 'createdAt'>, bookingId: string): Promise<Review> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          ...review,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString()
        };
        
        // Save Review
        const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
        reviews.push(newReview);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

        // Update Booking Status
        const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        const bookingIdx = bookings.findIndex(b => b.id === bookingId);
        if (bookingIdx !== -1) {
          bookings[bookingIdx].reviewed = true;
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        }

        // Update Listing Stats (simplified)
        const listings: Listing[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
        const listIdx = listings.findIndex(l => l.id === review.listingId);
        if (listIdx !== -1) {
          const l = listings[listIdx];
          const newCount = l.reviewsCount + 1;
          const newRating = ((l.rating * l.reviewsCount) + review.rating) / newCount;
          listings[listIdx] = { ...l, reviewsCount: newCount, rating: Number(newRating.toFixed(2)) };
          localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
        }

        resolve(newReview);
      }, 800);
    });
  }
};
