import React, { useState } from 'react';
import { ToolType } from '../types';
import { 
  CheckCircle2, ArrowRight, Target, MessageSquareText, Image as ImageIcon, 
  DollarSign, BarChart3, Globe, Zap, Shield, Crown, Rocket 
} from 'lucide-react';

// --- Step 1: Survey ---
export const OnboardingSurvey: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [platform, setPlatform] = useState('Facebook / Meta');
  const [spend, setSpend] = useState('');
  const [source, setSource] = useState('');

  const isComplete = platform && spend && source;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Welcome to AdsBoot.ai</h2>
        <p className="text-slate-400">Let's personalize your experience. Answer 3 quick questions.</p>
      </div>

      <div className="bg-[#0A0F2C] border border-[#1E2345] rounded-2xl p-8 space-y-8 shadow-2xl">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-300">1. Which platform do you primarily run ads on?</label>
          <select 
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-[#050505] border border-[#1E2345] rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-[#2663FF] focus:outline-none transition"
          >
            <option>Facebook / Instagram (Meta)</option>
            <option>TikTok Ads</option>
            <option>Google / YouTube Ads</option>
            <option>Pinterest Ads</option>
            <option>LinkedIn Ads</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-300">2. How much do you spend on ads monthly?</label>
          <select 
            value={spend}
            onChange={(e) => setSpend(e.target.value)}
            className="w-full bg-[#050505] border border-[#1E2345] rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-[#2663FF] focus:outline-none transition"
          >
            <option value="" disabled>Select your budget range</option>
            <option>Less than $1,000</option>
            <option>$1,000 - $5,000</option>
            <option>$5,000 - $25,000</option>
            <option>$25,000+</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-300">3. How did you hear about this AI?</label>
          <input 
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. YouTube, Friend, Google Search..."
            className="w-full bg-[#050505] border border-[#1E2345] rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-[#2663FF] focus:outline-none transition"
          />
        </div>

        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            ${isComplete 
              ? 'bg-[#2663FF] hover:bg-[#1a55eb] text-white shadow-lg shadow-[#2663FF]/25 hover:scale-[1.02]' 
              : 'bg-[#1E2345] text-slate-500 cursor-not-allowed'}`}
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- Step 2: Service Selection ---
export const OnboardingServices: React.FC<{ onSelect: (tool: ToolType) => void }> = ({ onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-3">Choose Your Path</h2>
        <p className="text-slate-400">Which tool do you want to start with?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            tool: ToolType.AUDIENCE, 
            icon: Target, 
            title: "Audience Targeting", 
            desc: "Find hidden interest groups and competitor audiences." 
          },
          { 
            tool: ToolType.COPY, 
            icon: MessageSquareText, 
            title: "Ad Copy Generator", 
            desc: "Write high-converting headlines and primary text instantly." 
          },
          { 
            tool: ToolType.CREATIVE, 
            icon: ImageIcon, 
            title: "Creative Audit", 
            desc: "Analyze your images or videos for stopping power." 
          }
        ].map((item, idx) => (
          <div 
            key={idx}
            onClick={() => onSelect(item.tool)}
            className="group bg-[#0A0F2C] border border-[#1E2345] hover:border-[#2663FF] p-8 rounded-2xl cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2663FF]/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-[#1E2345] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2663FF] transition-colors">
              <item.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-sm text-slate-400 mb-8">{item.desc}</p>
            <button className="mt-auto px-6 py-2 rounded-lg bg-[#050505] border border-[#1E2345] text-sm font-bold text-white group-hover:bg-[#2663FF] group-hover:border-[#2663FF] transition-all">
              Select & Continue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Step 3: Pricing ---
export const OnboardingPricing: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-3">Select a Plan</h2>
        <p className="text-slate-400">Start for free, upgrade when you scale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Free Plan */}
        <div className="bg-[#0A0F2C] border border-[#1E2345] rounded-2xl p-8 hover:border-slate-500 transition-colors">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-300">Free Starter</h3>
            <div className="text-3xl font-bold text-white mt-2">$0 <span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-4 mb-8">
             <li className="flex gap-3 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-500" /> 3 Daily Audience Searches</li>
             <li className="flex gap-3 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-500" /> Basic Ad Copy</li>
             <li className="flex gap-3 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-500" /> No Creative Audit</li>
          </ul>
          <button onClick={onFinish} className="w-full py-3 bg-[#1E2345] hover:bg-[#2a3055] text-white rounded-xl font-bold border border-[#2a3055]">
            Start Free
          </button>
        </div>

        {/* Pro Plan ($499) */}
        <div className="bg-[#0A0F2C] border border-[#2663FF] rounded-2xl p-8 relative transform md:scale-105 shadow-2xl shadow-[#2663FF]/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2663FF] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
             Most Popular
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#00F2FF]">Pro Marketer</h3>
            <div className="text-4xl font-bold text-white mt-2">$499 <span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-4 mb-8">
             <li className="flex gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> Unlimited Audience Data</li>
             <li className="flex gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> Advanced Copy & Hooks</li>
             <li className="flex gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> 50 Creative Audits/mo</li>
             <li className="flex gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> AdsBoot AI Chat Access</li>
          </ul>
          <button onClick={onFinish} className="w-full py-4 bg-[#2663FF] hover:bg-[#1a55eb] text-white rounded-xl font-bold shadow-lg">
            Get Started
          </button>
        </div>

        {/* Agency Plan ($1099) */}
        <div className="bg-[#0A0F2C] border border-[#1E2345] rounded-2xl p-8 hover:border-[#00F2FF] transition-colors">
          <div className="mb-4">
             <div className="flex items-center gap-2 mb-1">
               <h3 className="text-xl font-bold text-white">Agency</h3>
               <Crown className="w-5 h-5 text-yellow-400" />
             </div>
            <div className="text-3xl font-bold text-white mt-2">$1,099 <span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-4 mb-8">
             <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> Everything in Pro</li>
             <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> Unlimited Creative Audits</li>
             <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> 5 Team Seats</li>
             <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00F2FF]" /> Priority 24/7 Support</li>
          </ul>
          <button onClick={onFinish} className="w-full py-3 bg-[#1E2345] hover:bg-[#2a3055] text-white rounded-xl font-bold border border-[#2a3055]">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};