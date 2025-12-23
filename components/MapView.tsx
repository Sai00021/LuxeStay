
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Plus, Minus, List, Navigation, Star, X, ChevronRight, Wifi, Waves, Wind, Car, Utensils } from 'lucide-react';
import { Listing, Category, Currency } from '../types';

interface MapViewProps {
  listings: Listing[];
  currency: Currency;
  formatPrice: (price: number) => string;
  onListingClick: (id: string) => void;
  onBackToList?: () => void;
}

declare var L: any;

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Wifi': <Wifi size={10} />,
  'Pool': <Waves size={10} />,
  'Infinity Pool': <Waves size={10} />,
  'Air conditioning': <Wind size={10} />,
  'Free parking': <Car size={10} />,
  'Kitchen': <Utensils size={10} />,
};

const getCategoryStyles = (category: string) => {
  switch (category) {
    case Category.BEACHFRONT:
      return { color: '#0ea5e9', bg: 'bg-sky-50', border: 'border-sky-200' };
    case Category.CABINS:
      return { color: '#92400e', bg: 'bg-amber-50', border: 'border-amber-200' };
    case Category.CASTLES:
      return { color: '#7e22ce', bg: 'bg-purple-50', border: 'border-purple-200' };
    case Category.AMAZING_VIEWS:
      return { color: '#15803d', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case Category.LUXE:
      return { color: '#be123c', bg: 'bg-rose-50', border: 'border-rose-200' };
    case Category.DESERT:
      return { color: '#b45309', bg: 'bg-orange-50', border: 'border-orange-200' };
    case Category.ARCTIC:
      return { color: '#0369a1', bg: 'bg-blue-50', border: 'border-blue-200' };
    case Category.TINY_HOMES:
      return { color: '#0f766e', bg: 'bg-teal-50', border: 'border-teal-200' };
    default:
      return { color: '#FF385C', bg: 'bg-pink-50', border: 'border-pink-200' };
  }
};

const getCategoryIconSvg = (category: string, color: string) => {
  const size = "14";
  const strokeWidth = "2.5";
  
  switch (category) {
    case Category.BEACHFRONT:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2c1 .5 2 2 2 4.5V10"/><path d="M12 10v12"/><path d="M12 10a8.5 8.5 0 0 1 8.5 8.5"/><path d="M8 16.2A11.5 11.5 0 0 1 12 10"/></svg>`;
    case Category.CABINS:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    case Category.CASTLES:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20v-9H2v9"/><path d="M18 11V4H6v7"/><path d="M15 11V8h-6v3"/><path d="M4 11V7h2"/><path d="M20 11V7h-2"/><rect x="10" y="16" width="4" height="4"/></svg>`;
    case Category.AMAZING_VIEWS:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
    case Category.LUXE:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l3 12"/><path d="M13 3l3 6-3 12"/><path d="M2 9h20"/></svg>`;
    case Category.DESERT:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    case Category.ARCTIC:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>`;
    case Category.TINY_HOMES:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3"/><path d="M9 17h6"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }
};

const MapView: React.FC<MapViewProps> = ({ listings, currency, formatPrice, onListingClick, onBackToList }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterGroupRef = useRef<any>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        scrollWheelZoom: true,
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        tap: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      clusterGroupRef.current = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 40,
        animate: true,
        animateAddingMarkers: true
      });
      
      mapRef.current.addLayer(clusterGroupRef.current);
      
      mapRef.current.on('click', () => {
        setSelectedListing(null);
      });

      setIsMapReady(true);
    }

    clusterGroupRef.current.clearLayers();

    const bounds = L.latLngBounds([]);
    let hasCoords = false;

    listings.forEach(listing => {
      if (listing.coordinates) {
        hasCoords = true;
        const { lat, lng } = listing.coordinates;
        const styles = getCategoryStyles(listing.category);
        const iconSvg = getCategoryIconSvg(listing.category, styles.color);
        
        const isSelected = selectedListing?.id === listing.id;

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="transition-all duration-500 ease-out flex items-center justify-center">
              <div class="${isSelected ? 'bg-black text-white scale-125 ring-4 ring-black/20 ring-offset-2 shadow-lg' : 'bg-white text-gray-900 shadow-md border-gray-200'} border rounded-full px-1 py-1 pr-3 font-extrabold text-[12px] flex items-center space-x-1.5 transition-all duration-300 active:scale-95 group/marker">
                <div class="w-6 h-6 flex items-center justify-center rounded-full ${isSelected ? 'bg-white/20' : styles.bg} ${isSelected ? 'border-transparent' : styles.border} border">
                  ${iconSvg.replace('stroke="' + styles.color + '"', `class="${isSelected ? 'stroke-white' : ''}" stroke="${isSelected ? '#fff' : styles.color}"`)}
                </div>
                <span class="whitespace-nowrap">${formatPrice(listing.price)}</span>
              </div>
            </div>
          `,
          iconSize: [120, 40],
          iconAnchor: [60, 20]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });
        
        if (isSelected) {
          marker.setZIndexOffset(1000);
        }

        if (window.innerWidth >= 768) {
          const popupContent = document.createElement('div');
          popupContent.className = 'w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-none hover:shadow-xl transition-all duration-500 group/popup ring-1 ring-gray-100';
          popupContent.innerHTML = `
            <div class="relative w-full aspect-[4/3] overflow-hidden">
              <img src="${listing.images[0]}" class="w-full h-full object-cover transition-transform duration-1000 group-hover/popup:scale-110" loading="lazy" />
            </div>
            <div class="p-3">
              <div class="flex justify-between items-start mb-1">
                <span class="font-extrabold text-[14px] truncate pr-2 group-hover/popup:text-airbnb-red transition-colors">${listing.location}</span>
                <div class="flex items-center space-x-1 text-xs shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span class="font-extrabold">${listing.rating}</span>
                </div>
              </div>
              <div class="flex items-baseline space-x-1">
                <span class="text-sm font-extrabold">${formatPrice(listing.price)}</span>
                <span class="font-bold text-gray-400 text-[9px] uppercase tracking-tighter">night</span>
              </div>
            </div>
          `;

          popupContent.addEventListener('click', (e) => {
            e.stopPropagation();
            onListingClick(listing.id);
          });

          marker.bindPopup(popupContent, {
            maxWidth: 240,
            minWidth: 240,
            closeButton: false,
            offset: L.point(0, -10),
            className: 'airbnb-popup'
          });

          marker.on('mouseover', function () {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            this.openPopup();
          });

          marker.on('mouseout', function () {
            hoverTimeoutRef.current = window.setTimeout(() => {
              this.closePopup();
            }, 300);
          });
        }

        marker.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          setSelectedListing(listing);
          mapRef.current.flyTo([lat, lng], Math.max(mapRef.current.getZoom(), 12), {
            duration: 1.5,
            easeLinearity: 0.25
          });
        });

        clusterGroupRef.current.addLayer(marker);
        bounds.extend([lat, lng]);
      }
    });

    if (hasCoords && !selectedListing) {
      mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [listings, currency, formatPrice, onListingClick, selectedListing?.id]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.flyTo([latitude, longitude], 15, { duration: 2 });
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  return (
    <div className="w-full h-[800px] md:h-[calc(100vh-12rem)] relative overflow-hidden rounded-[2.5rem] border shadow-xl bg-gray-100 animate-in zoom-in-95 duration-700">
      
      {!isMapReady && (
        <div className="absolute inset-0 z-50 bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-airbnb-red rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Atlas...</p>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full z-10" />
      
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-full px-4">
        <div className="bg-white px-6 py-2.5 rounded-full shadow-lg text-[10px] font-black text-gray-900 border border-gray-100 uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700 pointer-events-auto flex items-center space-x-3">
          <div className="w-2 h-2 bg-airbnb-red rounded-full animate-pulse" />
          <span>Explore destinations by budget and location</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20 flex flex-col space-y-3 items-end">
        <div className="flex flex-col space-y-1 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl p-1.5 ring-1 ring-black/5">
          <button 
            onClick={handleLocateMe}
            className={`p-3 hover:bg-gray-100 text-gray-700 rounded-xl transition-all active:scale-90 ${isLocating ? 'animate-pulse text-airbnb-red' : ''}`}
            title="Locate Me"
          >
            <Navigation size={22} strokeWidth={2.5} />
          </button>
          <div className="h-px bg-gray-100 mx-2"></div>
          <button 
            onClick={handleZoomIn}
            className="p-3 hover:bg-gray-100 text-gray-700 rounded-xl transition-all active:scale-90"
            title="Zoom In"
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-3 hover:bg-gray-100 text-gray-700 rounded-xl transition-all active:scale-90"
            title="Zoom Out"
          >
            <Minus size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {selectedListing && (
        <div className="md:hidden absolute inset-x-4 bottom-24 z-[60] animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div 
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex h-40 ring-1 ring-black/5"
            onClick={() => onListingClick(selectedListing.id)}
          >
            <div className="w-[35%] relative h-full">
              <img src={selectedListing.images[0]} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedListing(null); }}
                className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full p-2 shadow-md text-gray-900 border border-gray-100"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[15px] truncate text-gray-900 tracking-tight leading-tight">{selectedListing.location}</h4>
                <p className="text-[9px] font-black text-airbnb-red uppercase tracking-widest truncate mt-1">{selectedListing.category}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-lg font-black text-gray-900">{formatPrice(selectedListing.price)}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">night</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
