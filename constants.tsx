
import React from 'react';
import { 
  Mountain, 
  Umbrella, 
  Home, 
  Warehouse, 
  Castle, 
  Snowflake, 
  Sun, 
  Gem 
} from 'lucide-react';
import { Category, Listing, Currency } from './types';

export const CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', label: 'INR', rate: 1, locale: 'en-IN' },
  { code: 'USD', symbol: '$', label: 'USD', rate: 0.012, locale: 'en-US' },
  { code: 'EUR', symbol: '€', label: 'EUR', rate: 0.011, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'GBP', rate: 0.0095, locale: 'en-GB' },
];

export const CATEGORIES = [
  { label: Category.AMAZING_VIEWS, icon: <Mountain size={24} /> },
  { label: Category.BEACHFRONT, icon: <Umbrella size={24} /> },
  { label: Category.CABINS, icon: <Home size={24} /> },
  { label: Category.TINY_HOMES, icon: <Warehouse size={24} /> },
  { label: Category.CASTLES, icon: <Castle size={24} /> },
  { label: Category.ARCTIC, icon: <Snowflake size={24} /> },
  { label: Category.DESERT, icon: <Sun size={24} /> },
  { label: Category.LUXE, icon: <Gem size={24} /> },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'maldives-1',
    hostId: 'host-maldives',
    title: 'The Azure Overwater Villa',
    description: 'A sanctuary suspended over the crystalline waters of the Baa Atoll. This ultra-luxury villa features a private infinity pool, a glass-bottomed living room, and direct ladder access to a vibrant coral reef.',
    price: 95000,
    location: 'Baa Atoll, Maldives',
    coordinates: { lat: 5.1755, lng: 73.0185 },
    images: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1506929199175-fe09cf1cb943?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.BEACHFRONT,
    rating: 4.95, // LUXE FAVORITE
    reviewsCount: 154,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Private Pool', 'Butler Service', 'Glass Floors', 'Wifi', 'Air conditioning']
  },
  {
    id: 'swiss-1',
    hostId: 'host-swiss',
    title: 'The Alpine Glass Prism',
    description: 'High-altitude living on the edge of the Aletsch Glacier. This architecturally unique glass prism offers 270-degree views of the Swiss Alps. Designed for winter lovers.',
    price: 68000,
    location: 'Valais, Switzerland',
    coordinates: { lat: 46.4251, lng: 8.0416 },
    images: [
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1549144464-4dd240187548?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.ARCTIC,
    rating: 4.92, // LUXE FAVORITE
    reviewsCount: 72,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['Ski Access', 'Heated Spa', 'Glacier View', 'Fireplace', 'Wifi']
  },
  {
    id: 'bali-1',
    hostId: 'host-bali',
    title: 'The Bamboo Infinity Retreat',
    description: 'An architectural marvel crafted entirely from sustainable bamboo, nestled in the heart of the Balinese jungle. Relax in the hanging daybeds.',
    price: 42000,
    location: 'Ubud, Bali',
    coordinates: { lat: -8.5069, lng: 115.2625 },
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.LUXE,
    rating: 4.87,
    reviewsCount: 312,
    guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    amenities: ['Infinity Pool', 'Private Chef', 'Open-air Bath', 'Wifi', 'Yoga Deck']
  },
  {
    id: 'ny-loft-1',
    hostId: 'host-ny',
    title: 'The Industrial Sky Loft',
    description: 'High-contrast urban luxury in the heart of Tribeca. This massive loft features 15ft ceilings, original exposed brick, and views of the Empire State Building.',
    price: 52000,
    location: 'Manhattan, New York',
    coordinates: { lat: 40.7186, lng: -74.0062 },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1536376074432-8d63d392823c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.TINY_HOMES,
    rating: 4.90, // LUXE FAVORITE
    reviewsCount: 89,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['City View', 'Chef Kitchen', 'Smart Home', 'Wifi', 'Gym Access']
  },
  {
    id: 'in-lotus-1',
    hostId: 'host-lotus',
    title: 'The Lotus Petal Sanctuary',
    description: 'A masterpiece of modern architecture offering views of the world-famous Lotus Temple. Experience a stay defined by peace and ethereal light.',
    price: 32000,
    location: 'New Delhi, India',
    coordinates: { lat: 28.5535, lng: 77.2588 },
    images: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581005762142-f87505bc871e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595841696662-509f6e568593?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.AMAZING_VIEWS,
    rating: 4.88,
    reviewsCount: 267,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Temple View', 'Meditation Garden', 'Reflection Pool', 'Wifi', 'Air conditioning']
  },
  {
    id: 'in-jaisal-1',
    hostId: 'host-jaisal',
    title: 'The Gilded Sands Pavilion',
    description: 'An ultra-luxurious desert sanctuary. Experience the "Golden City" from the comfort of a temperature-controlled royal tent.',
    price: 22000,
    location: 'Jaisalmer, Rajasthan',
    coordinates: { lat: 26.9157, lng: 70.9083 },
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.DESERT,
    rating: 4.82,
    reviewsCount: 142,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Desert Safari', 'Private Dunes', 'Stargazing', 'Wifi', 'Royal Dinner']
  },
  {
    id: 'in-gulmarg-1',
    hostId: 'host-gulmarg',
    title: 'Khyber\'s Peak Glass Igloo',
    description: 'A futuristic glass dome nestled in the snow-capped peaks of Gulmarg. Watch the snowfall from your heated bed.',
    price: 35000,
    location: 'Gulmarg, Jammu & Kashmir',
    coordinates: { lat: 34.0484, lng: 74.3805 },
    images: [
      'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517044493812-f47ef80a397b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1549144464-4dd240187548?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.ARCTIC,
    rating: 4.89,
    reviewsCount: 89,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['360° Glass Dome', 'Ski Access', 'Heated floors', 'Fireplace', 'Wifi']
  },
  {
    id: 'in-1',
    hostId: 'host-in-1',
    title: 'Sacred Heights Heritage Villa',
    description: 'A serene retreat nestled in the lush greenery of the Tirumala Hills. This heritage villa combines traditional architecture with luxury.',
    price: 40000,
    location: 'Tirumala Hills, Andhra Pradesh',
    coordinates: { lat: 13.6833, lng: 79.3500 },
    images: [
      'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=year&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1524491989942-d27c02e400ac?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.AMAZING_VIEWS,
    rating: 4.88,
    reviewsCount: 456,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['Temple View', 'Traditional Meals', 'Meditation Room', 'Wifi', 'Garden']
  },
  {
    id: 'in-taj-1',
    hostId: 'host-taj-1',
    title: 'Royal Taj View Palace',
    description: 'Wake up to the most iconic view in the world. This luxury palace suite offers an unobstructed view of the Taj Mahal.',
    price: 55000,
    location: 'Agra, Uttar Pradesh',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544161515-4af6b1d462c2?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.AMAZING_VIEWS,
    rating: 4.99, // LUXE FAVORITE
    reviewsCount: 892,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Taj Mahal View', 'Butler Service', 'Royal Breakfast', 'Wifi', 'Pool']
  },
  {
    id: 'kyoto-1',
    hostId: 'host-kyoto',
    title: 'Zen Garden Ryokan',
    description: 'A tranquil Ryokan-style sanctuary with a private rock garden. Experience the art of Japanese hospitality.',
    price: 48000,
    location: 'Kyoto, Japan',
    coordinates: { lat: 35.0116, lng: 135.7681 },
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505069190533-5173aa067057?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.AMAZING_VIEWS,
    rating: 4.88,
    reviewsCount: 204,
    guests: 2,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: ['Tatami Mats', 'Tea Ceremony', 'Zen Garden', 'Wifi', 'Breakfast']
  },
  {
    id: 'amalfi-1',
    hostId: 'host-amalfi',
    title: 'Cliffside Amalfi Villa',
    description: 'Perched on the rugged cliffs of Positano, this vibrant villa offers sweeping views of the Mediterranean Sea.',
    price: 72000,
    location: 'Positano, Italy',
    coordinates: { lat: 40.6281, lng: 14.4850 },
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1612730871336-cc594c776097?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.BEACHFRONT,
    rating: 4.85,
    reviewsCount: 188,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['Sea View', 'Infinity Pool', 'Wine Cellar', 'Wifi', 'Terrace']
  },
  {
    id: 'kenya-1',
    hostId: 'host-kenya',
    title: 'Mara Safari Lodge',
    description: 'Experience the wild in luxury. This boutique lodge offers unobstructed views of the savanna.',
    price: 38000,
    location: 'Maasai Mara, Kenya',
    coordinates: { lat: -1.4061, lng: 35.0839 },
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511497584788-8767fe771822?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.AMAZING_VIEWS,
    rating: 4.85,
    reviewsCount: 96,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Savanna View', 'Safari Tours', 'Plunge Pool', 'Wifi', 'Outdoor shower']
  },
  {
    id: 'paris-1',
    hostId: 'host-paris',
    title: 'Haussmann Chic Loft',
    description: 'Elegant Parisian living with views of the Eiffel Tower. This designer loft features high ceilings.',
    price: 45000,
    location: 'Paris, France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1471623432079-b009d30b6729?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.LUXE,
    rating: 4.88,
    reviewsCount: 142,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Tower View', 'Library', 'French Breakfast', 'Wifi', 'Concierge']
  },
  {
    id: 'iceland-1',
    hostId: 'host-iceland',
    title: 'Aurora Glass Cabin',
    description: 'Sleep under the Northern Lights in this minimalist glass cabin in the remote Icelandic wilderness.',
    price: 52000,
    location: 'Reykjavik, Iceland',
    coordinates: { lat: 64.1265, lng: -21.8174 },
    images: [
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.ARCTIC,
    rating: 4.84,
    reviewsCount: 68,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Northern Lights', 'Hot Tub', 'Star Gazing', 'Wifi', 'Remote Location']
  },
  {
    id: 'santorini-1',
    hostId: 'host-greece',
    title: 'Oia Infinity Villa',
    description: 'Experience the ultimate Aegean escape in this white-washed villa featuring a private infinity pool and the world\'s most famous sunset views.',
    price: 85000,
    location: 'Oia, Santorini',
    coordinates: { lat: 36.4618, lng: 25.3753 },
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.AMAZING_VIEWS,
    rating: 4.98, // LUXE FAVORITE
    reviewsCount: 312,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['Infinity Pool', 'Sunset View', 'Wine Terrace', 'Wifi', 'Luxury Linen']
  },
  {
    id: 'scotland-1',
    hostId: 'host-scot',
    title: 'Highland Royal Castle',
    description: 'Live like royalty in this meticulously restored 14th-century castle. Overlooking a private loch with sprawling mist-covered grounds.',
    price: 120000,
    location: 'Inverness, Scotland',
    coordinates: { lat: 57.4778, lng: -4.2247 },
    images: [
      'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1524413159040-4f51e8e4b22?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.CASTLES,
    rating: 4.97, // LUXE FAVORITE
    reviewsCount: 88,
    guests: 10,
    bedrooms: 6,
    beds: 8,
    bathrooms: 6,
    amenities: ['Private Loch', 'Grand Hall', 'Chef Service', 'Fireplace', 'Library']
  },
  {
    id: 'dubai-1',
    hostId: 'host-dubai',
    title: 'Sky-High City Penthouse',
    description: 'An architectural feat in the clouds. This penthouse offers 360-degree views of the Burj Khalifa and the Arabian Gulf.',
    price: 150000,
    location: 'Downtown, Dubai',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1536376074432-8d63d392823c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.LUXE,
    rating: 4.94, // LUXE FAVORITE
    reviewsCount: 42,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 3,
    amenities: ['Private Lift', 'Infinity Pool', 'Cinema Room', 'Smart Home', 'Valet']
  },
  {
    id: 'mexico-1',
    hostId: 'host-tulum',
    title: 'Tulum Beach Eco-Resort',
    description: 'Sustainable luxury at its finest. Wake up to the sound of waves and the rustle of jungle leaves in this open-concept masterpiece.',
    price: 45000,
    location: 'Tulum, Mexico',
    coordinates: { lat: 20.2114, lng: -87.4654 },
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.BEACHFRONT,
    rating: 4.91, // LUXE FAVORITE
    reviewsCount: 215,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Private Beach', 'Yoga Shala', 'Organic Kitchen', 'Jungle View', 'Wifi']
  },
  {
    id: 'aspen-1',
    hostId: 'host-aspen',
    title: 'Aspen A-Frame Peak Cabin',
    description: 'A cozy architectural icon in the heart of the Rockies. Perfect for those who seek high-contrast snowy landscapes and warm fireplace nights.',
    price: 58000,
    location: 'Aspen, Colorado',
    coordinates: { lat: 39.1911, lng: -106.8175 },
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1549144464-4dd240187548?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.CABINS,
    rating: 4.89,
    reviewsCount: 154,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['Ski-in/Ski-out', 'Outdoor Hot Tub', 'Fireplace', 'Heated floors', 'Wifi']
  },
  {
    id: 'capetown-1',
    hostId: 'host-sa',
    title: 'Table Mountain View Villa',
    description: 'An architectural jewel perched on the slopes of Lions Head. Experience breathtaking sunsets over the Atlantic Ocean with direct views of the iconic Table Mountain.',
    price: 32000,
    location: 'Cape Town, South Africa',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    images: [
      'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1536376074432-8d63d392823c?auto=format&fit=crop&q=80&w=1200'
    ],
    category: Category.AMAZING_VIEWS,
    rating: 4.87,
    reviewsCount: 112,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['Mountain View', 'Ocean View', 'Infinity Pool', 'Wifi', 'Wine Cellar']
  }
];
