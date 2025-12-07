import React, { useState } from 'react';
import { generateAudienceData } from '../services/geminiService';
import { AudienceResult } from '../types';
import { Sparkles, Copy, Check, Target, Zap, Globe, ChevronRight } from 'lucide-react';
import EmbeddedChat from './EmbeddedChat';

const AudienceGenerator: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [demographic, setDemographic] = useState('Adults 18-45');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AudienceResult[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!productName || !description) return;
    setLoading(true);
    setResults(null);
    try {
      const data = await generateAudienceData(productName, description, demographic);
      setResults(data);
    } catch (e) {
      alert("Failed to generate audience. Please check API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyInterests = (interests: string[], index: number) => {
    navigator.clipboard.writeText(interests.join(', '));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Construct context for the chat based on current results
  const chatContext = `
    Product: ${productName}
    Description: ${description}
    Target Demographic: ${demographic}
    Current Generated Audiences: ${JSON.stringify(results || [])}
  `;

  return (
    <div className="min-h-screen w-full relative pb-20">
      {/* Background Effect Container */}
      <div className="absolute inset-0 animated-gradient-bg pointer-events-none fixed z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12 pt-8 px-4">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-none bg-white/5 text-[#00F2FF] text-xs font-bold uppercase tracking-wider mb-2 shadow-lg backdrop-blur-md">
            <Sparkles className="w-3 h-3" /> AI Targeting Engine
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 tracking-tighter drop-shadow-lg">
            Find Your Perfect<br/>Audience
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            Enter your product details below. Our AI scans millions of data points to find the highest-converting buyers for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* INPUT SECTION - Glass Card */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-8 space-y-6 animate-fade-in-up delay-100 sticky top-4 border-t border-white/20">
             <div>
                <label className="block text-xs font-bold text-[#00F2FF] uppercase tracking-wider mb-2 ml-1">Product Name</label>
                <input
                  type="text"
                  className="w-full glass-input rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
                  placeholder="e.g. Smart Yoga Mat"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
             </div>
             
             <div>
                <label className="block text-xs font-bold text-[#00F2FF] uppercase tracking-wider mb-2 ml-1">Product Description</label>
                <textarea
                  className="w-full glass-input rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none text-sm font-medium h-32 resize-none"
                  placeholder="Self-rolling mat that connects to Alexa and tracks posture..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-[#00F2FF] uppercase tracking-wider mb-2 ml-1">Location / Demo</label>
                <input
                  type="text"
                  className="w-full glass-input rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
                  value={demographic}
                  onChange={(e) => setDemographic(e.target.value)}
                />
             </div>

             <button
                onClick={handleGenerate}
                disabled={loading || !productName}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group shadow-xl
                  ${loading || !productName 
                    ? 'bg-white/10 cursor-not-allowed text-slate-500' 
                    : 'bg-gradient-to-r from-[#2663FF] to-[#00F2FF] hover:scale-[1.02] hover:shadow-[#00F2FF]/40'}`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span>AI Thinking</span>
                      <div className="flex items-center">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </>
                  ) : (
                    <>
                      Generate Targeting <Zap className="w-4 h-4 fill-white" />
                    </>
                  )}
                </div>
             </button>
          </div>

          {/* OUTPUT SECTION */}
          <div className="lg:col-span-8 space-y-6">
            {!results && !loading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center glass-card rounded-3xl p-8 text-center animate-fade-in-up delay-200 border-dashed border-white/10">
                 <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                   <Target className="w-10 h-10 text-white/20" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">Ready to Optimize</h3>
                 <p className="text-slate-400 max-w-sm">Enter your product details to reveal the "Futuristic Demo" output.</p>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {results.map((audience, idx) => (
                  <div 
                    key={idx} 
                    className="glass-card rounded-3xl p-8 animate-fade-in-up hover:border-[#00F2FF]/30 transition-all duration-300 group"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Avatar / Score Column */}
                      <div className="flex flex-col items-center md:items-start gap-4 min-w-[120px]">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-4xl shadow-inner border border-white/10">
                          {audience.personaEmoji}
                        </div>
                        <div className="text-center md:text-left">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</div>
                          <div className="text-3xl font-black text-[#00F2FF]">{audience.matchScore}</div>
                        </div>
                      </div>

                      {/* Content Column */}
                      <div className="flex-1 space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#00F2FF] transition-colors">
                            {audience.segmentName}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                             <span className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-[#2663FF]" /> {audience.demographics}</span>
                             <span className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-[#2663FF]" /> {audience.estimatedReach} Reach</span>
                          </div>
                        </div>

                        {/* Interests Box */}
                        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                           <div className="flex justify-between items-center mb-3">
                             <span className="text-xs font-bold text-[#00F2FF] uppercase tracking-wider">🎯 Interest Stack</span>
                             <button 
                               onClick={() => copyInterests(audience.interests, idx)}
                               className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                             >
                               {copiedIndex === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                               {copiedIndex === idx ? 'Copied' : 'Copy'}
                             </button>
                           </div>
                           <div className="flex flex-wrap gap-2">
                             {audience.interests.map((int, i) => (
                               <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 hover:bg-white/10 hover:border-white/30 transition-all cursor-default">
                                 {int}
                               </span>
                             ))}
                           </div>
                        </div>

                        {/* Logic */}
                        <div className="flex gap-3">
                           <div className="w-1 bg-gradient-to-b from-[#2663FF] to-transparent rounded-full opacity-50"></div>
                           <p className="text-sm text-slate-400 italic leading-relaxed">
                             "{audience.reasoning}"
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Chat Integration */}
                <div className="animate-fade-in-up delay-300 pt-6">
                   <div className="glass-card rounded-2xl p-6 border-none bg-gradient-to-r from-[#2663FF]/20 to-[#00F2FF]/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-[#00F2FF]" />
                        <h3 className="font-bold text-white">Refine with AI</h3>
                      </div>
                      <EmbeddedChat 
                        context={chatContext}
                        title="Audience Assistant"
                        initialMessage="I've generated these futuristic segments. Want to narrow them down or find a different angle?"
                      />
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceGenerator;