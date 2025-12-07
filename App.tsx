import React, { useState, useEffect, useRef } from 'react';
import { ToolType } from './types';
import AudienceGenerator from './components/AudienceGenerator';
import CopyGenerator from './components/CopyGenerator';
import CreativeAnalyzer from './components/CreativeAnalyzer';
import AiAssistant from './components/AiAssistant';
import { OnboardingSurvey, OnboardingServices, OnboardingPricing } from './components/OnboardingFlow';
import { 
  LayoutDashboard, Users, MessageSquareText, Image as ImageIcon, Menu, X, 
  CheckCircle2, ArrowRight, Zap, BarChart3, Globe, Shield, ChevronDown, Star,
  Cpu, Target, Rocket, Sparkles, Lock, Mail, Play, TrendingUp, AlertCircle, XCircle,
  Bot
} from 'lucide-react';

// --- Auth Modal Component ---
const AuthModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: () => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailPattern.test(email)) {
        setError("Please enter a valid Gmail address (example@gmail.com)");
        return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate "Real" API Login Delay
    setTimeout(() => {
      setLoading(false);
      // Save session to Local Storage (Persistence)
      localStorage.setItem('adsboot_token', 'mock_token_' + Date.now());
      localStorage.setItem('adsboot_user', email);
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in perspective-1000">
      <div className="relative w-full max-w-md bg-[#0A0F2C] border border-[#1E2345] rounded-2xl shadow-2xl overflow-hidden animate-scale-in transform transition-transform duration-500 hover:rotate-x-2">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#2663FF]/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#2663FF]/30">
              <Lock className="w-6 h-6 text-[#00F2FF]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp ? 'Start optimizing your ads in seconds.' : 'Login to access your dashboard.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  className="w-full bg-[#050505] border border-[#1E2345] rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2663FF] focus:ring-1 focus:ring-[#2663FF] transition-all shadow-inner"
                  placeholder="Enter Gmail only"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  className="w-full bg-[#050505] border border-[#1E2345] rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#2663FF] focus:ring-1 focus:ring-[#2663FF] transition-all shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2663FF] hover:bg-[#1a55eb] text-white rounded-lg font-bold shadow-lg shadow-[#2663FF]/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 transform active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                isSignUp ? 'Get Started Free' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#00F2FF] hover:text-[#00F2FF]/80 font-semibold transition-colors"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>
        <div className="bg-[#050505] p-4 text-center text-xs text-slate-500 border-t border-[#1E2345]">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

// --- 3D Background Component ---
const Background3D = () => {
  return (
    <div className="scene-3d">
      {/* Floating Cubes */}
      <div className="cube-wrapper" style={{ top: '10%', left: '5%', animation: 'floatAnimation 8s infinite ease-in-out' }}>
         <div className="cube" style={{ transform: 'scale(0.8)' }}>
           <div className="cube__face cube__face--front"></div>
           <div className="cube__face cube__face--back"></div>
           <div className="cube__face cube__face--right"></div>
           <div className="cube__face cube__face--left"></div>
           <div className="cube__face cube__face--top"></div>
           <div className="cube__face cube__face--bottom"></div>
         </div>
      </div>

      <div className="cube-wrapper" style={{ top: '60%', right: '10%', animation: 'floatAnimation 12s infinite ease-in-out reverse' }}>
         <div className="cube" style={{ transform: 'scale(1.2)' }}>
           <div className="cube__face cube__face--front"></div>
           <div className="cube__face cube__face--back"></div>
           <div className="cube__face cube__face--right"></div>
           <div className="cube__face cube__face--left"></div>
           <div className="cube__face cube__face--top"></div>
           <div className="cube__face cube__face--bottom"></div>
         </div>
      </div>

       <div className="cube-wrapper" style={{ top: '80%', left: '15%', animation: 'floatAnimation 15s infinite ease-in-out' }}>
         <div className="cube" style={{ transform: 'scale(0.5)' }}>
           <div className="cube__face cube__face--front"></div>
           <div className="cube__face cube__face--back"></div>
           <div className="cube__face cube__face--right"></div>
           <div className="cube__face cube__face--left"></div>
           <div className="cube__face cube__face--top"></div>
           <div className="cube__face cube__face--bottom"></div>
         </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // State to track user selection during onboarding
  const [selectedService, setSelectedService] = useState<ToolType | null>(null);

  // Check for persistence on Mount
  useEffect(() => {
    const token = localStorage.getItem('adsboot_token');
    const email = localStorage.getItem('adsboot_user');
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  // Wrapper for actions that require login
  const handleProtectedAction = (action: () => void) => {
    if (isLoggedIn) {
      action();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setUserEmail(localStorage.getItem('adsboot_user') || 'User');
    // Start Onboarding Flow
    setCurrentTool(ToolType.ONBOARDING_SURVEY);
  };

  const handleLogout = () => {
    localStorage.removeItem('adsboot_token');
    localStorage.removeItem('adsboot_user');
    setIsLoggedIn(false);
    setCurrentTool(ToolType.DASHBOARD);
  }

  // --- Onboarding Flow Handlers ---
  const handleSurveyComplete = () => {
    setCurrentTool(ToolType.ONBOARDING_SERVICES);
  };

  const handleServiceSelected = (tool: ToolType) => {
    setSelectedService(tool);
    setCurrentTool(ToolType.ONBOARDING_PRICING);
  };

  const handlePricingComplete = () => {
    // Redirect to the tool they selected, or default to AI Chat if none selected (fallback)
    setCurrentTool(selectedService || ToolType.AI_CHAT);
  };


  const renderContent = () => {
    // If not logged in, force Dashboard view (which acts as landing page)
    if (!isLoggedIn) {
      return <Dashboard onSelect={(tool) => handleProtectedAction(() => setCurrentTool(tool))} />;
    }

    switch (currentTool) {
      // Onboarding
      case ToolType.ONBOARDING_SURVEY:
        return <OnboardingSurvey onNext={handleSurveyComplete} />;
      case ToolType.ONBOARDING_SERVICES:
        return <OnboardingServices onSelect={handleServiceSelected} />;
      case ToolType.ONBOARDING_PRICING:
        return <OnboardingPricing onFinish={handlePricingComplete} />;
      
      // Main Tools
      case ToolType.AI_CHAT:
        return <AiAssistant />;
      case ToolType.AUDIENCE:
        return <AudienceGenerator />;
      case ToolType.COPY:
        return <CopyGenerator />;
      case ToolType.CREATIVE:
        return <CreativeAnalyzer />;
      default:
        return <Dashboard onSelect={(tool) => setCurrentTool(tool)} />;
    }
  };

  const NavItem = ({ tool, icon: Icon, label }: { tool: ToolType, icon: any, label: string }) => (
    <button
      onClick={() => {
        handleProtectedAction(() => {
          setCurrentTool(tool);
          setMobileMenuOpen(false);
        });
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${currentTool === tool && isLoggedIn
          ? 'bg-[#2663FF] text-white shadow-lg shadow-[#2663FF]/20 transform scale-[1.02]' 
          : 'text-slate-400 hover:bg-[#1E2345] hover:text-white hover:translate-x-1'}`}
    >
      <Icon className={`w-5 h-5 ${currentTool === tool ? 'animate-pulse' : 'group-hover:text-[#00F2FF]'}`} />
      <span className="font-medium">{label}</span>
      {!isLoggedIn && <Lock className="w-3 h-3 ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      <Background3D />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={handleLoginSuccess} 
      />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0A0F2C]/90 backdrop-blur-xl border-r border-[#1E2345] h-screen fixed left-0 top-0 z-20 p-6 shadow-2xl">
        <div className="flex items-center gap-3 px-2 mb-10 cursor-pointer group" onClick={() => setCurrentTool(ToolType.DASHBOARD)}>
          <div className="w-8 h-8 bg-[#2663FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#2663FF]/30 group-hover:rotate-12 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AdsBoot.ai
          </h1>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem tool={ToolType.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-[#00F2FF] uppercase tracking-wider">AI Assistant</div>
          <NavItem tool={ToolType.AI_CHAT} icon={Bot} label="AI Chat" />

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-[#00F2FF] uppercase tracking-wider">Services</div>
          <NavItem tool={ToolType.AUDIENCE} icon={Users} label="Targeting Audience" />
          <NavItem tool={ToolType.COPY} icon={MessageSquareText} label="Ads Copy Maker" />
          <NavItem tool={ToolType.CREATIVE} icon={ImageIcon} label="Creative Audit" />
        </nav>

        <div className="mt-auto pt-6 border-t border-[#1E2345] px-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2663FF] to-[#00F2FF] flex items-center justify-center font-bold text-xs uppercase shadow-md border border-white/10">
                 {userEmail.substring(0, 2)}
               </div>
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-bold truncate">{userEmail}</div>
                 <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-white transition-colors">Sign Out</button>
               </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="w-full py-3 bg-[#1E2345] hover:bg-[#2663FF] text-white rounded-lg text-sm font-bold transition-all border border-[#1E2345] hover:border-[#2663FF] shadow-lg"
            >
              Log In / Sign Up
            </button>
          )}
          <div className="mt-4 flex items-center gap-2 text-[#00F2FF] text-[10px] uppercase tracking-wider font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse"></div>
            System Operational
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-[#0A0F2C]/90 backdrop-blur border-b border-[#1E2345] z-30 px-4 py-3 flex items-center justify-between shadow-xl">
         <div className="flex items-center gap-2" onClick={() => setCurrentTool(ToolType.DASHBOARD)}>
            <div className="w-8 h-8 bg-[#2663FF] rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">AdsBoot.ai</span>
         </div>
         <div className="flex items-center gap-4">
            {!isLoggedIn && (
               <button onClick={() => setShowAuthModal(true)} className="text-sm font-bold text-[#2663FF]">Login</button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
         </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0A0F2C] z-20 pt-24 px-6 lg:hidden animate-fade-in perspective-1000">
          <nav className="space-y-2 transform rotate-x-2">
            <NavItem tool={ToolType.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem tool={ToolType.AI_CHAT} icon={Bot} label="AI Chat" />
            <NavItem tool={ToolType.AUDIENCE} icon={Users} label="Targeting Audience" />
            <NavItem tool={ToolType.COPY} icon={MessageSquareText} label="Ads Copy Maker" />
            <NavItem tool={ToolType.CREATIVE} icon={ImageIcon} label="Creative Audit" />
            <button 
              onClick={() => { 
                if(isLoggedIn) handleLogout();
                else setShowAuthModal(true); 
                setMobileMenuOpen(false); 
              }}
              className="w-full mt-8 py-3 bg-[#2663FF] text-white rounded-xl font-bold shadow-lg"
            >
              {isLoggedIn ? 'Sign Out' : 'Login / Sign Up'}
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-0 overflow-y-auto mt-16 lg:mt-0 relative scroll-smooth h-screen perspective-1000">
        <div className="mx-auto relative z-10">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- 3D Tilt Card Component ---
const TiltCard = ({ icon: Icon, title, desc, onClick, image }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10deg to 10deg)
    const rotateX = ((y / rect.height) - 0.5) * -20;
    const rotateY = ((x / rect.width) - 0.5) * 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group bg-[#0A0F2C]/80 backdrop-blur-md border border-[#1E2345] hover:border-[#00F2FF]/50 rounded-3xl cursor-pointer transition-transform duration-100 ease-out relative overflow-hidden shadow-2xl flex flex-col h-full transform-style-preserve-3d"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="h-40 overflow-hidden relative rounded-t-3xl" style={{ transform: 'translateZ(20px)' }}>
          <img src={image} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] to-transparent"></div>
          <div className={`absolute bottom-4 left-6 w-12 h-12 bg-[#1E2345]/80 rounded-xl flex items-center justify-center text-[#00F2FF] shadow-lg backdrop-blur-md border border-[#2663FF]/30`}>
            <Icon className="w-6 h-6" />
          </div>
      </div>
      
      <div className="p-8 pt-6 flex-1 flex flex-col" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00F2FF] transition-colors">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed flex-1">
            {desc}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/50 group-hover:text-white transition-colors">
            Start Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ transform: 'translateZ(40px)' }}></div>
    </div>
  );
};

// --- Landing Page Components ---

const PricingCard = ({ title, price, features, recommended, onChoose }: any) => (
  <div className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:rotate-1 transform-style-preserve-3d
    ${recommended 
      ? 'bg-[#0A0F2C] border-[#2663FF] shadow-2xl shadow-[#2663FF]/20 transform scale-105 z-10' 
      : 'bg-[#0A0F2C]/50 border-[#1E2345] hover:border-slate-600'}`}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2663FF] to-[#00F2FF] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 z-20">
        <Sparkles className="w-3 h-3" /> Most Popular
      </div>
    )}
    <div className="mb-8" style={{ transform: 'translateZ(20px)' }}>
      <h3 className={`text-lg font-medium mb-2 ${recommended ? 'text-[#00F2FF]' : 'text-slate-400'}`}>{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-white">${price}</span>
        <span className="text-slate-500">/month</span>
      </div>
    </div>
    
    <ul className="space-y-4 mb-8 flex-1" style={{ transform: 'translateZ(10px)' }}>
      {features.map((feat: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${recommended ? 'text-[#00F2FF]' : 'text-slate-600'}`} />
          <span className={i < 2 ? 'text-white' : ''}>{feat}</span>
        </li>
      ))}
    </ul>

    <button 
      onClick={onChoose}
      className={`w-full py-4 rounded-xl font-bold transition-all relative overflow-hidden group
      ${recommended
        ? 'bg-[#2663FF] hover:bg-[#1a55eb] text-white shadow-lg shadow-[#2663FF]/25'
        : 'bg-[#1E2345] hover:bg-[#2a3055] text-white border border-[#1E2345]'}`}
        style={{ transform: 'translateZ(30px)' }}
    >
      <span className="relative z-10">Choose {title}</span>
    </button>
  </div>
);

const BenefitItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex gap-4 group">
    <div className="mt-1">
      <div className="w-6 h-6 rounded-full bg-[#2663FF]/20 flex items-center justify-center border border-[#2663FF]/30 group-hover:scale-110 transition-transform">
        <CheckCircle2 className="w-4 h-4 text-[#00F2FF]" />
      </div>
    </div>
    <div>
      <h4 className="font-bold text-white mb-1 group-hover:text-[#00F2FF] transition-colors">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, quote, avatar }: any) => (
  <div className="bg-[#0A0F2C] border border-[#1E2345] p-6 rounded-2xl relative hover:border-[#00F2FF]/30 transition-all hover:-translate-y-1">
     <div className="flex items-center gap-1 text-yellow-400 mb-4">
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
     </div>
     <p className="text-slate-300 text-sm leading-relaxed mb-6">"{quote}"</p>
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1E2345] overflow-hidden border border-white/10">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
           <div className="text-white font-bold text-sm">{name}</div>
           <div className="text-slate-500 text-xs">{role}</div>
        </div>
     </div>
  </div>
);

const FaqItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#1E2345]">
      <button 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-slate-200 group-hover:text-[#00F2FF] transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-6 text-slate-400 text-sm leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<{ onSelect: (t: ToolType) => void }> = ({ onSelect }) => {
  return (
    <div className="flex flex-col relative z-10">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 lg:px-12 border-b border-[#1E2345] bg-gradient-to-b from-[#0A0F2C]/80 to-[#050505]/90 overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2663FF]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2663FF]/10 border border-[#2663FF]/20 text-[#00F2FF] text-xs font-medium uppercase tracking-wider mb-4 animate-fade-in-up">
                    <Zap className="w-3 h-3" /> AI-Powered Facebook Ads
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] animate-fade-in-up delay-100" style={{ textShadow: '0 0 40px rgba(38, 99, 255, 0.3)' }}>
                    Boost Your Ads with <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2663FF] via-[#00F2FF] to-white">
                    AdsBoot.ai
                    </span>
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200">
                    The ultimate toolkit for marketers. Generate detailed audience targeting, write high-converting copy, and audit your creatives in seconds.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 animate-fade-in-up delay-300">
                    <button 
                    onClick={() => onSelect(ToolType.AUDIENCE)}
                    className="px-8 py-4 bg-[#2663FF] hover:bg-[#1a55eb] text-white rounded-full font-bold shadow-xl shadow-[#2663FF]/25 transition-all hover:scale-105 flex items-center gap-2 relative overflow-hidden group"
                    >
                    <span className="relative z-10 flex items-center gap-2">Find Audiences <ArrowRight className="w-5 h-5" /></span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                    </button>
                    <button 
                        onClick={() => onSelect(ToolType.CREATIVE)}
                        className="px-8 py-4 bg-[#1E2345] hover:bg-[#2a3055] text-white rounded-full font-semibold border border-[#1E2345] transition-all"
                    >
                    Audit Creative
                    </button>
                </div>
                <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                   <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00F2FF]" /> No Credit Card Req</div>
                   <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00F2FF]" /> Free Trial Available</div>
                </div>
            </div>
            <div className="relative animate-fade-in-up delay-500 hidden lg:block perspective-1000">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-[#1E2345] transform rotate-y-minus-12 rotate-x-6 transition-transform hover:rotate-0 duration-700">
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                        alt="Dashboard Preview" 
                        className="w-full h-auto object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0A0F2C]/80 backdrop-blur border border-[#1E2345] rounded-xl flex items-center gap-4 transform translate-z-20">
                        <div className="w-10 h-10 rounded-full bg-[#00F2FF]/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-[#00F2FF]" />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">Optimization Complete</div>
                            <div className="text-slate-400 text-xs">Targeting audience generated successfully.</div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#2663FF] rounded-full blur-[60px] opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00F2FF] rounded-full blur-[60px] opacity-10"></div>
            </div>
        </div>
      </section>

      {/* Trusted By Strip */}
      <div className="border-b border-[#1E2345] bg-[#050505]/80 backdrop-blur-sm">
         <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-lg font-bold text-slate-500">Trusted by marketers at:</span>
            <div className="font-bold text-white text-xl flex items-center gap-2"><Globe className="w-5 h-5"/> Shopify</div>
            <div className="font-bold text-white text-xl flex items-center gap-2"><Target className="w-5 h-5"/> Meta Ads</div>
            <div className="font-bold text-white text-xl flex items-center gap-2"><Zap className="w-5 h-5"/> WooCommerce</div>
            <div className="font-bold text-white text-xl flex items-center gap-2"><BarChart3 className="w-5 h-5"/> TikTok</div>
         </div>
      </div>

      {/* Stats Bar */}
      <section className="border-b border-[#1E2345] bg-[#0A0F2C]/50 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { label: 'Campaigns Launched', value: '10k+' },
            { label: 'Marketers', value: '2,500+' },
            { label: 'Hours Saved', value: '50/mo' },
            { label: 'AI Accuracy', value: '98%' }
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">{stat.value}</div>
              <div className="text-xs text-[#2663FF] uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Tools Grid (Now with 3D Tilt) */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">Three Powerful Services</h3>
          <p className="text-slate-400">Everything you need to launch high-converting Facebook Ads.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
          <TiltCard 
            title="1. Detailed Audience Targeting"
            desc="Don't target blindly. Our AI generates precise interest layers, competitor audiences, and behavioral segments tailored to your product."
            icon={Users}
            image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop"
            onClick={() => onSelect(ToolType.AUDIENCE)}
          />
          <TiltCard 
            title="2. Ads Copy Maker"
            desc="Write persuasive ad copy in seconds. Get headlines, primary text, and descriptions using proven marketing frameworks like AIDA."
            icon={MessageSquareText}
            image="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2573&auto=format&fit=crop"
            onClick={() => onSelect(ToolType.COPY)}
          />
          <TiltCard 
            title="3. Creative Audit & Info"
            desc="Upload your photo or creative to get instant feedback. Find out if your ad is good or needs improvement before you spend budget."
            icon={ImageIcon}
            image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop"
            onClick={() => onSelect(ToolType.CREATIVE)}
          />
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-[#050505]/50 border-y border-[#1E2345] backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">Stop Burning Budget</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               <div className="bg-[#0A0F2C]/30 p-8 rounded-2xl border border-red-900/30 relative overflow-hidden group hover:bg-[#0A0F2C]/50 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-900"></div>
                  <h4 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                     <XCircle className="w-5 h-5"/> The Old Way
                  </h4>
                  <ul className="space-y-4 text-slate-400">
                     <li className="flex gap-3"><X className="w-4 h-4 text-red-500 mt-1"/> Guessing Interest Targeting</li>
                     <li className="flex gap-3"><X className="w-4 h-4 text-red-500 mt-1"/> Hiring expensive copywriters ($2k+)</li>
                     <li className="flex gap-3"><X className="w-4 h-4 text-red-500 mt-1"/> Launching ads and praying they work</li>
                     <li className="flex gap-3"><X className="w-4 h-4 text-red-500 mt-1"/> Hours spent analyzing spreadsheets</li>
                  </ul>
               </div>

               <div className="bg-[#0A0F2C] p-8 rounded-2xl border border-[#2663FF] shadow-2xl shadow-[#2663FF]/10 relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#2663FF]"></div>
                  <h4 className="text-xl font-bold text-[#00F2FF] mb-6 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5"/> The AdsBoot Way
                  </h4>
                  <ul className="space-y-4 text-white">
                     <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-[#00F2FF] mt-1"/> AI-driven Precise Interests</li>
                     <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-[#00F2FF] mt-1"/> Instant Copy Generation ($499/mo)</li>
                     <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-[#00F2FF] mt-1"/> Pre-launch Creative Audit Score</li>
                     <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-[#00F2FF] mt-1"/> 3-Step Workflow in under 5 minutes</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Deep Dive / Why Section */}
      <section className="bg-[#0A0F2C]/30 py-24 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl md:text-4xl font-bold text-white">Why Choose AdsBoot.ai?</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                The Facebook Ads landscape has changed. Privacy updates have made tracking harder, meaning your creative and copy need to do the heavy lifting. AdsBoot is built for this new era.
              </p>
              
              <div className="space-y-6">
                <BenefitItem 
                  title="Optimize Creative Performance" 
                  desc="Get actionable insights on your photos and videos. Know exactly what to fix to increase your Click-Through Rate (CTR)." 
                />
                <BenefitItem 
                  title="Precise Audience Data" 
                  desc="Stop guessing interests. Our AI finds the hidden gems that your competitors are missing." 
                />
                <BenefitItem 
                  title="Speed to Market" 
                  desc="Generate weeks worth of testing material in minutes. Focus on strategy, not manual work." 
                />
              </div>
            </div>
            
            <div className="relative perspective-1000">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2663FF] to-[#00F2FF] rounded-2xl opacity-20 blur-xl animate-pulse"></div>
              <div className="relative bg-[#0A0F2C] border border-[#1E2345] rounded-2xl p-8 shadow-2xl transform rotate-y-6 hover:rotate-y-0 transition-transform duration-500">
                 <div className="flex items-center gap-4 mb-6 border-b border-[#1E2345] pb-6">
                    <div className="w-12 h-12 rounded-full bg-[#1E2345] flex items-center justify-center">
                       <Cpu className="w-6 h-6 text-[#00F2FF]" />
                    </div>
                    <div>
                       <div className="font-bold text-white">AdsBoot Engine</div>
                       <div className="text-xs text-[#00F2FF]">Processing live request...</div>
                    </div>
                 </div>
                 <div className="space-y-3 font-mono text-xs md:text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Analyzing Product...</span>
                      <span className="text-[#00F2FF]">Done</span>
                    </div>
                    <div className="w-full bg-[#1E2345] h-1.5 rounded-full overflow-hidden">
                       <div className="bg-[#00F2FF] w-full h-full"></div>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-2">
                      <span>Identifying Competitors...</span>
                      <span className="text-[#00F2FF]">Done</span>
                    </div>
                    <div className="w-full bg-[#1E2345] h-1.5 rounded-full overflow-hidden">
                       <div className="bg-[#00F2FF] w-[90%] h-full"></div>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-2">
                      <span>Generating Hooks...</span>
                      <span className="text-[#00F2FF]">Done</span>
                    </div>
                    <div className="w-full bg-[#1E2345] h-1.5 rounded-full overflow-hidden">
                       <div className="bg-[#00F2FF] w-[85%] h-full"></div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-[#1E2345] rounded border border-[#2663FF]/30 text-slate-300 transform translate-x-2">
                       <span className="text-[#00F2FF]">Targeting Recommendation:</span> Focus on "Engaged Shoppers" intersected with "Sustainable Living" for max ROI.
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
         <h3 className="text-3xl font-bold text-white mb-16 text-center">Loved by Growth Marketers</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
               name="Sarah Jenkins" 
               role="E-com Founder" 
               quote="I used to spend 5 hours a week targeting. Now I do it in 5 minutes. My ROAS went from 1.5 to 3.2 in two weeks."
               avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
            />
            <TestimonialCard 
               name="Marcus Chen" 
               role="Agency Owner" 
               quote="The Creative Audit tool is a game changer. It saves us from launching bad ads that would have wasted client budget."
               avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
            />
            <TestimonialCard 
               name="Elena Rodriguez" 
               role="Dropshipper" 
               quote="The copy generator understands direct response marketing better than most freelancers I've hired."
               avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
            />
         </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-[#1E2345]">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">How It Works</h3>
          <p className="text-slate-400">Three simple steps to your next winning campaign.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Target, title: "1. Define Your Goal", desc: "Choose whether you need an audience, copy, or a creative check. Enter your product details." },
            { icon: Cpu, title: "2. AI Processing", desc: "Our Gemini 2.5 engine analyzes your inputs against proven marketing frameworks and behavioral data." },
            { icon: BarChart3, title: "3. Launch & Scale", desc: "Copy-paste the results directly into Ads Manager. Watch your ROAS climb." }
          ].map((step, i) => (
            <div key={i} className="text-center relative group">
               <div className="w-16 h-16 mx-auto bg-[#0A0F2C] rounded-2xl flex items-center justify-center border border-[#1E2345] mb-6 relative z-10 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-white group-hover:text-[#00F2FF]" />
               </div>
               {i !== 2 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-[#1E2345] -z-0"></div>}
               <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
               <p className="text-slate-400 text-sm px-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-[#1E2345]">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h3>
          <p className="text-slate-400">Choose the plan that fits your scaling needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <PricingCard 
              title="Starter" 
              price="499" 
              features={[
                '50 Audience Searches/mo', 
                'Unlimited Ad Copy', 
                '1 User Seat',
                'Basic Email Support'
              ]} 
              recommended={false}
              onChoose={() => onSelect(ToolType.AUDIENCE)}
           />
           <PricingCard 
              title="Growth" 
              price="999" 
              features={[
                '200 Audience Searches/mo', 
                'Creative Audit (AI Vision)', 
                '3 User Seats', 
                'Priority Support',
                'Competitor Analysis'
              ]} 
              recommended={true}
              onChoose={() => onSelect(ToolType.CREATIVE)}
           />
           <PricingCard 
              title="Agency" 
              price="1999" 
              features={[
                'Unlimited Searches', 
                'Bulk Creative Audit', 
                '10+ User Seats', 
                'Dedicated Account Manager',
                'White-label Reports'
              ]} 
              recommended={false}
              onChoose={() => onSelect(ToolType.AUDIENCE)}
           />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 lg:px-12 max-w-4xl mx-auto w-full border-t border-[#1E2345]">
        <h3 className="text-3xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h3>
        <div className="space-y-2">
          <FaqItem 
            q="How accurate is the audience data?" 
            a="AdsBoot.ai uses the latest available interest categories from Facebook's API documentation and behavioral trends. We recommend testing 2-3 audiences to see which performs best."
          />
          <FaqItem 
            q="Can I audit videos?" 
            a="Yes, you can upload a representative frame (screenshot) of your video or a photo ad to get feedback on the visual elements, clarity, and stopping power."
          />
          <FaqItem 
            q="Is this suitable for dropshipping?" 
            a="Absolutely. Dropshippers love AdsBoot because speed is everything. You can test products faster by generating copy and audiences in seconds."
          />
          <FaqItem 
            q="What model powers this tool?" 
            a="We use Google's Gemini 2.5 Flash model, optimized for speed and complex reasoning, ensuring your marketing angles are creative and logically sound."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0F2C] border-t border-[#1E2345] py-12 px-6 lg:px-12 text-center md:text-left relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
               <div className="w-6 h-6 bg-[#2663FF] rounded flex items-center justify-center">
                 <Rocket className="w-3 h-3 text-white" />
               </div>
               <span className="font-bold text-lg text-white">AdsBoot.ai</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs mx-auto md:mx-0">
              The ultimate AI companion for Facebook Advertisers. Build better campaigns, faster.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => onSelect(ToolType.AUDIENCE)} className="hover:text-[#00F2FF]">Audience Tool</button></li>
              <li><button onClick={() => onSelect(ToolType.COPY)} className="hover:text-[#00F2FF]">Copy Generator</button></li>
              <li><button onClick={() => onSelect(ToolType.CREATIVE)} className="hover:text-[#00F2FF]">Creative Audit</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1E2345] pt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} AdsBoot.ai. All rights reserved. Not affiliated with Meta/Facebook.
        </div>
      </footer>
    </div>
  );
};

export default App;