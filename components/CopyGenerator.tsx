import React, { useState } from 'react';
import { generateAdCopyData } from '../services/geminiService';
import { CopyResult } from '../types';
import { Copy, Sparkles, MessageSquare, PenTool, Image as ImageIcon, Check, Zap, ShoppingBag, MousePointer2 } from 'lucide-react';
import EmbeddedChat from './EmbeddedChat';

const CopyGenerator: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [benefits, setBenefits] = useState('');
  const [tone, setTone] = useState('Persuasive & Urgent');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CopyResult[] | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productName || !benefits) return;
    setLoading(true);
    setResults(null);
    try {
      const data = await generateAdCopyData(productName, benefits, tone);
      setResults(data);
    } catch (e) {
      alert("Failed to generate copy.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Construct context for the chat
  const chatContext = `
    Product: ${productName}
    Benefits: ${benefits}
    Tone: ${tone}
    Current Generated Copy: ${JSON.stringify(results || [])}
  `;

  return (
    <div className="min-h-screen w-full relative pb-20">
      {/* Background Effect Container */}
      <div className="absolute inset-0 animated-gradient-bg pointer-events-none fixed z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12 pt-8 px-4">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-none bg-white/5 text-[#00F2FF] text-xs font-bold uppercase tracking-wider mb-2 shadow-lg backdrop-blur-md">
            <PenTool className="w-3 h-3" /> AI Copywriter
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 tracking-tighter drop-shadow-lg">
            High-Converting<br/>Ad Copy
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            Generate persuasive headlines, primary text, and descriptions in seconds using proven direct-response frameworks.
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
                  placeholder="e.g. GlowUp Serum"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-[#00F2FF] uppercase tracking-wider mb-2 ml-1">Key Benefits</label>
                <textarea
                  className="w-full glass-input rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none text-sm font-medium h-32 resize-none"
                  placeholder="List features, pain points solved, and guarantees..."
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-[#00F2FF] uppercase tracking-wider mb-2 ml-1">Tone</label>
                <div className="relative">
                  <select
                    className="w-full glass-input rounded-xl px-4 py-4 text-white focus:outline-none text-sm font-medium appearance-none cursor-pointer"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option className="bg-[#0A0F2C]">Persuasive & Urgent</option>
                    <option className="bg-[#0A0F2C]">Friendly & Casual</option>
                    <option className="bg-[#0A0F2C]">Professional & Authoritative</option>
                    <option className="bg-[#0A0F2C]">Emotional & Story-driven</option>
                    <option className="bg-[#0A0F2C]">Witty & Humorous</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
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
                      <span>Writing Magic</span>
                      <div className="flex items-center">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </>
                  ) : (
                    <>
                      Generate Copy <Sparkles className="w-4 h-4 fill-white" />
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
                   <MessageSquare className="w-10 h-10 text-white/20" />
                 </div>
                <h3 className="text-2xl font-bold text-white mb-2">Writer's Block?</h3>
                <p className="max-w-sm mx-auto text-slate-400">Fill in your product benefits. We'll write 3 distinct ad variations optimized for clicks.</p>
              </div>
            )}

            {results && (
              <div className="space-y-8">
                {results.map((ad, idx) => (
                  <div 
                    key={idx} 
                    className="glass-card rounded-3xl overflow-hidden animate-fade-in-up hover:border-[#00F2FF]/30 transition-all duration-300 group"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                     {/* Card Header */}
                     <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                            ${idx === 0 ? 'bg-purple-500/20 text-purple-400' : idx === 1 ? 'bg-[#00F2FF]/20 text-[#00F2FF]' : 'bg-[#2663FF]/20 text-[#2663FF]'}`}>
                            <span className="font-bold text-sm">#{idx + 1}</span>
                          </div>
                          <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            {ad.angle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
                          <Zap className="w-3 h-3 text-yellow-400" /> High CTR
                        </div>
                     </div>
                     
                     <div className="p-8 space-y-8">
                        {/* Primary Text Section */}
                        <div className="group/text relative p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                          <div className="flex justify-between items-center mb-2">
                             <label className="text-xs font-bold text-[#00F2FF] uppercase tracking-wider">Primary Text</label>
                             <button 
                                onClick={() => copyToClipboard(ad.primaryText, `primary-${idx}`)} 
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors opacity-0 group-hover/text:opacity-100"
                              >
                               {copiedField === `primary-${idx}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                               {copiedField === `primary-${idx}` ? 'Copied' : 'Copy'}
                             </button>
                          </div>
                          <p className="text-slate-200 whitespace-pre-line text-sm leading-relaxed font-light">{ad.primaryText}</p>
                        </div>
                        
                        {/* Mock Ad Preview */}
                        <div className="bg-[#050505]/50 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
                           <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                              <span className="w-2 h-2 rounded-full bg-yellow-500/50"></span>
                              <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                              <span className="ml-2 text-[10px] text-slate-500 font-mono">Mobile Feed Preview</span>
                           </div>
                           
                           <div className="p-4">
                              {/* Fake Image Placeholder */}
                              <div className="aspect-video bg-gradient-to-br from-[#1E2345] to-[#0A0F2C] rounded-lg mb-3 flex flex-col items-center justify-center text-slate-500 border border-white/5 relative group/img cursor-pointer">
                                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                  <span className="text-xs font-medium">Creative Asset Placeholder</span>
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                    1080 x 1080
                                  </div>
                              </div>
                              
                              {/* Headline & CTA */}
                              <div className="flex justify-between items-center gap-4 bg-[#1E2345]/30 p-3 rounded-lg border border-white/5">
                                 <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-400 truncate mb-0.5">Your Site Display Link</div>
                                    <div 
                                      className="font-bold text-white text-sm leading-tight truncate cursor-pointer hover:text-[#00F2FF] transition-colors flex items-center gap-2 group/head"
                                      onClick={() => copyToClipboard(ad.headline, `head-${idx}`)}
                                    >
                                       {ad.headline}
                                       {copiedField === `head-${idx}` && <Check className="w-3 h-3 text-green-400" />}
                                    </div>
                                    <div 
                                      className="text-xs text-slate-400 truncate mt-0.5 cursor-pointer hover:text-white transition-colors group/desc"
                                      onClick={() => copyToClipboard(ad.description, `desc-${idx}`)}
                                    >
                                      {ad.description}
                                    </div>
                                 </div>
                                 <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-xs font-bold border border-white/10 transition-colors whitespace-nowrap">
                                   Shop Now
                                 </button>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex gap-2">
                           <button 
                             onClick={() => {
                               const fullCopy = `${ad.headline}\n\n${ad.primaryText}\n\n${ad.description}`;
                               copyToClipboard(fullCopy, `all-${idx}`);
                             }}
                             className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-colors flex items-center justify-center gap-2"
                           >
                             {copiedField === `all-${idx}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                             Copy Full Ad
                           </button>
                        </div>
                     </div>
                  </div>
                ))}

                {/* Embedded Chat for Refinement */}
                <div className="animate-fade-in-up delay-300 pt-6">
                   <div className="glass-card rounded-2xl p-6 border-none bg-gradient-to-r from-[#2663FF]/20 to-[#00F2FF]/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-[#00F2FF]" />
                        <h3 className="font-bold text-white">Refine with AI</h3>
                      </div>
                      <EmbeddedChat 
                        context={chatContext} 
                        title="Copy Assistant"
                        initialMessage="I've drafted 3 variations based on your inputs. How do they look? I can make them shorter, punchier, or change the angle for you." 
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

export default CopyGenerator;