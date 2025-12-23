
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Home, MapPin, Star, Compass, Coffee, ShieldCheck, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Listing, Currency, User } from '../types';

interface ConciergeProps {
  user: User | null;
  listings: Listing[];
  currency: Currency;
  formatPrice: (price: number) => string;
  onSelectListing: (id: string) => void;
}

const QUICK_ACTIONS = [
  { label: "Beach Sanctuaries", icon: <Compass size={12} />, query: "Show me beachfront villas" },
  { label: "Elite Luxe Stays", icon: <Star size={12} />, query: "What are the most popular luxury properties?" },
  { label: "Mountain Escapes", icon: <Home size={12} />, query: "Find me a cabin in the mountains" }
];

const Concierge: React.FC<ConciergeProps> = ({ user, listings, formatPrice, onSelectListing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; suggestions?: Listing[] }[]>([
    { 
      role: 'assistant', 
      content: `Greetings${user ? `, ${user.name}` : ''}. I specialize in curating world-class experiences. How may I assist you today?` 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (customQuery?: string) => {
    const userMessage = customQuery || input;
    if (!userMessage.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = listings.map(l => `${l.title} in ${l.location} (Rating: ${l.rating}) for ${formatPrice(l.price)} per night. Features: ${l.amenities.join(', ')}`).join('; ');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the LuxeStay Global Luxury Travel Specialist. Your tone is highly sophisticated, helpful, and exclusive. 
        User Context: Name is ${user?.name || 'Guest'}.
        Available Inventory: ${context}.
        
        Task: Respond to "${userMessage}". 
        Guidelines:
        1. Recommend exactly 2-3 properties that best match the query.
        2. Use the exact property names and locations.
        3. Mention specific amenities that make them stand out.
        4. Address the user with elegance.
        5. Be concise but evocative.
        6. Always include the price and rating mentioned in the inventory.`,
      });

      const text = response.text || "I'm sorry, I'm currently unable to access our global vault. How else may I serve you?";
      
      const recommended = listings.filter(l => 
        text.toLowerCase().includes(l.title.toLowerCase()) || 
        text.toLowerCase().includes(l.location.toLowerCase().split(',')[0].toLowerCase())
      ).slice(0, 3);

      setMessages(prev => [...prev, { role: 'assistant', content: text, suggestions: recommended }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "My apologies, our network is experiencing a momentary pause. I shall return shortly to assist with your arrangements." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[100] font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-black text-white px-5 py-4 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-500 group flex items-center space-x-3 ring-4 ring-black/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <Sparkles size={20} className="text-white group-hover:rotate-12 transition-transform" />
          <span className="font-black text-[13px] pr-1 tracking-tight">AI Concierge</span>
        </button>
      ) : (
        <div className="bg-white w-[350px] h-[520px] rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-8 fade-in duration-500 ring-1 ring-black/5">
          {/* Compact Header */}
          <div className="bg-black p-5 flex items-center justify-between text-white relative">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-airbnb-red to-rose-600 p-2 rounded-xl shadow-lg">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="font-black text-base tracking-tight leading-tight">Luxe Concierge</p>
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[9px] text-white/50 uppercase font-black tracking-widest">Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-all active:scale-90 group">
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                <div className={`max-w-[95%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                  m.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {m.content}
                </div>
                
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 w-full mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {m.suggestions.map(s => (
                      <button 
                        key={s.id}
                        onClick={() => onSelectListing(s.id)}
                        className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100 hover:border-black transition-all text-left group/s"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img src={s.images[0]} className="w-full h-full object-cover group-hover/s:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[12px] font-black truncate text-gray-900 leading-tight">{s.title}</p>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[10px] text-gray-400 font-bold truncate">{s.location.split(',')[0]}</p>
                            <p className="text-[11px] font-black text-gray-900">{formatPrice(s.price)}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-200 group-hover/s:text-black transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-1.5 bg-white px-4 py-3 rounded-full w-20 border border-gray-100 shadow-sm">
                <div className="w-1 h-1 bg-airbnb-red rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-airbnb-red/60 rounded-full animate-bounce delay-75" />
                <div className="w-1 h-1 bg-airbnb-red/30 rounded-full animate-bounce delay-150" />
              </div>
            )}

            {!isTyping && messages.length < 4 && (
              <div className="flex flex-col space-y-2 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map(action => (
                    <button 
                      key={action.label}
                      onClick={() => handleSend(action.query)}
                      className="flex items-center space-x-1.5 bg-white border border-gray-200 px-3 py-2 rounded-full text-[11px] font-extrabold hover:border-black transition-all shadow-sm"
                    >
                      {action.icon}
                      <span>{action.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compact Input Area */}
          <div className="p-5 bg-white border-t border-gray-50">
            <div className="relative flex items-center group">
              <input 
                type="text"
                placeholder="Message concierge..."
                className="w-full bg-gray-50 py-4 pl-5 pr-12 rounded-2xl outline-none text-xs font-bold border border-transparent focus:bg-white focus:border-black transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="absolute right-2 p-2.5 bg-black text-white rounded-xl hover:bg-airbnb-red transition-all disabled:opacity-10"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Concierge;
