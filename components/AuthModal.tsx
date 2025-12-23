
import React, { useState } from 'react';
import { X, Facebook, ShieldCheck, Check, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  onSocialLogin: (provider: 'google' | 'facebook') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onSocialLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (mode === 'signup' && !agreed) return;
    
    setIsLoading(true);
    // Simulate a more realistic auth process
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
      // We actually call onLogin after a delay to simulate "Accepting the magic link"
      setTimeout(() => {
        onLogin(email);
        setStep('form'); // Reset for next time
      }, 2500);
    }, 1200);
  };

  const handleSocialClick = (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    onSocialLogin(provider);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-500 animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-[520px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 ring-1 ring-black/5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-90 group"
            aria-label="Close"
          >
            <X size={20} className="text-gray-900 group-hover:rotate-90 transition-transform" />
          </button>
          <span className="font-extrabold text-[12px] uppercase tracking-[0.2em] text-gray-400">
            {step === 'form' ? (mode === 'login' ? 'Access Sanctuary' : 'Join the Elite') : 'Verification Sent'}
          </span>
          <div className="w-10"></div>
        </div>
        
        <div className="p-10">
          {step === 'form' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-10 text-center">
                <div className="inline-flex p-3 bg-airbnb-red/5 rounded-2xl mb-6 text-airbnb-red">
                  <Sparkles size={28} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Begin Your Journey'}
                </h2>
                <p className="text-gray-500 mt-3 text-base font-medium">
                  {mode === 'login' 
                    ? 'Enter your credentials to access your private retreats.' 
                    : 'Create an account to discover curated global sanctuaries.'}
                </p>
              </div>

              {/* Mode Switcher - Sliding Pill style */}
              <div className="relative flex bg-gray-100 p-1.5 rounded-2xl mb-10">
                <div 
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-300 ease-out ${
                    mode === 'login' ? 'left-1.5' : 'left-[calc(50%+3px)]'
                  }`}
                />
                <button 
                  onClick={() => setMode('login')}
                  className={`flex-1 py-3 text-sm font-extrabold rounded-xl relative z-10 transition-colors ${
                    mode === 'login' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Log in
                </button>
                <button 
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 text-sm font-extrabold rounded-xl relative z-10 transition-colors ${
                    mode === 'signup' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Display Name"
                      className="w-full px-6 py-4.5 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none text-[15px] font-bold transition-all focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-gray-400"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full px-6 py-4.5 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none text-[15px] font-bold transition-all focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors">
                    <Mail size={18} />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div 
                    className="flex items-start space-x-4 py-3 cursor-pointer group/agree" 
                    onClick={() => setAgreed(!agreed)}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center shrink-0 ${
                      agreed ? 'bg-black border-black scale-110' : 'border-gray-200 group-hover/agree:border-gray-400'
                    }`}>
                      {agreed && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                      I agree to the <span className="underline font-bold text-gray-800">Elite Terms</span> and the <span className="underline font-bold text-gray-800">Sanctuary Privacy Policy</span>.
                    </p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading || !!socialLoading || (mode === 'signup' && !agreed)}
                  className="w-full bg-black text-white py-5 rounded-[1.5rem] font-extrabold text-lg hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-black/10 flex items-center justify-center space-x-3 group/btn"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Continue Access' : 'Register Profile'}</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="flex items-center my-10 space-x-4">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-[10px] text-gray-300 uppercase font-extrabold tracking-[0.3em]">Discovery Access</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSocialClick('google')}
                  disabled={isLoading || !!socialLoading}
                  className="group relative border border-gray-100 p-4 rounded-2xl font-extrabold text-[14px] flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    {socialLoading === 'google' ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    <span>Google</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleSocialClick('facebook')}
                  disabled={isLoading || !!socialLoading}
                  className="group relative border border-gray-100 p-4 rounded-2xl font-extrabold text-[14px] flex items-center justify-center hover:bg-[#1877F2]/5 hover:border-[#1877F2]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    {socialLoading === 'facebook' ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Facebook size={20} className="text-[#1877F2]" fill="#1877F2" />
                    )}
                    <span className="text-gray-700 group-hover:text-[#1877F2] transition-colors">Facebook</span>
                  </div>
                </button>
              </div>

              <div className="mt-10 flex items-center justify-center space-x-3 text-gray-400 bg-gray-50 py-4 rounded-2xl border border-gray-100">
                 <ShieldCheck size={18} className="text-airbnb-red" />
                 <span className="text-[12px] font-extrabold tracking-tight">Enterprise Grade Encryption Active</span>
              </div>
            </div>
          ) : (
            /* Success / Magic Link State */
            <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-700">
               <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 animate-bounce">
                  <Mail size={48} />
               </div>
               <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Magic Link Sent</h2>
               <p className="text-gray-500 mt-5 text-lg font-medium max-w-sm mx-auto leading-relaxed">
                  A secure access link has been dispatched to <span className="text-black font-extrabold">{email}</span>. Check your inbox to continue.
               </p>
               <div className="mt-12 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 inline-flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Awaiting Identity Confirmation</span>
               </div>
               <button 
                 onClick={() => setStep('form')}
                 className="mt-10 block w-full text-sm font-extrabold text-gray-400 hover:text-black transition-colors underline decoration-gray-200 underline-offset-8"
               >
                 Didn't receive it? Try again
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
