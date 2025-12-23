
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isHost: boolean;
}

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  coordinates?: { lat: number; lng: number };
  images: string[];
  category: string;
  rating: number;
  reviewsCount: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  reviewed?: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // Rate relative to INR (base)
  locale: string;
}

export enum Category {
  AMAZING_VIEWS = 'Amazing views',
  BEACHFRONT = 'Beachfront',
  CABINS = 'Cabins',
  TINY_HOMES = 'Tiny homes',
  CASTLES = 'Castles',
  ARCTIC = 'Arctic',
  DESERT = 'Desert',
  LUXE = 'Luxe',
}
