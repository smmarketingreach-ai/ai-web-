import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { 
  Send, Bot, User, Sparkles, Loader2, Trash2, 
  Lightbulb, TrendingUp, Target, MessageSquare, 
  Copy, Download, Share2, AlertCircle, Zap, ShieldCheck,
  BrainCircuit, ChevronRight
} from 'lucide-react';

const QUICK_PROMPTS = [
  { 
    icon: Target, 
    title: "Audience Strategy", 
    desc: "Plan a testing structure",
    prompt: "I have a $500 budget. Create a Facebook Ads testing strategy for a new high-ticket dropshipping product. Include audience sizes and exclusion layers." 
  },
  { 
    icon: MessageSquare, 
    title: "Viral Hooks", 
    desc: "Stop the scroll instantly",
    prompt: "Write 5 controversy-driven hooks for a skincare ad targeting women over 40. The angle is 'Big Beauty Brands are lying to you'." 
  },
  { 
    icon: TrendingUp, 
    title: "Fix Rising CPA", 
    desc: "Troubleshoot expensive ads",
    prompt: "My CPA has increased by 40% over the last 3 days on a scaling campaign. Frequency is 1.2. What steps should I take to stabilize it?" 
  },
  { 
    icon: Lightbulb, 
    title: "Creative Concepts", 
    desc: "UGC video ideas",
    prompt: "Give me 3 UGC video concepts for a dog toy that plays on emotion. Describe the visual sequence and the voiceover for each." 
  }
];

const AiAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I am **AdsBoot AI**, your dedicated marketing intelligence unit. \n\nI'm trained on millions of ad data points to help you scale. We can discuss:\n• Full-funnel strategy\n• ROAS optimization\n• Copywriting & Scripts\n\nSelect a quick prompt below or type your specific challenge.",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendChatMessage(textToSend, history);

      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I'm encountering a temporary connection issue. Please check your API key or internet connection.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-100px)] p-6">
      
      {/* LEFT: Main Chat Interface */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <Bot className="w-8 h-8 text-[#00F2FF]" />
               AdsBoot AI
             </h2>
             <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Online • v2.5 Flash Model
             </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMessages([messages[0]])}
              className="px-4 py-2 bg-[#1E2345] hover:bg-red-500/20 hover:text-red-400 text-slate-400 text-xs font-bold rounded-lg transition-all flex items-center gap-2 border border-[#1E2345]"
            >
              <Trash2 className="w-4 h-4" /> Reset Memory
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-[#0A0F2C] border border-[#1E2345] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg mt-1
                  ${msg.role === 'model' 
                    ? 'bg-[#2663FF]/20 border-[#2663FF]/30 text-[#00F2FF]' 
                    : 'bg-slate-700 border-slate-600 text-white'}`}
                >
                  {msg.role === 'model' ? <BrainCircuit className="w-6 h-6" /> : <User className="w-5 h-5" />}
                </div>
                
                <div className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed shadow-xl relative group
                  ${msg.role === 'model' 
                    ? 'bg-[#050505] border border-[#1E2345] text-slate-200 rounded-tl-none' 
                    : 'bg-[#2663FF] text-white rounded-tr-none'}`}
                >
                  <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  
                  {/* Message Footer Info */}
                  <div className={`flex items-center gap-3 mt-3 opacity-40 text-[10px] uppercase font-bold tracking-wider ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'model' && (
                       <button 
                         onClick={() => copyToClipboard(msg.text)}
                         className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                       >
                         <Copy className="w-3 h-3" /> Copy
                       </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Prompts (Only show if few messages) */}
            {messages.length < 3 && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 px-4 animate-fade-in-up">
                {QUICK_PROMPTS.map((qp, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(qp.prompt)}
                    className="text-left bg-[#1E2345]/30 hover:bg-[#1E2345] border border-[#1E2345] hover:border-[#2663FF] p-4 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-[#0A0F2C] rounded-lg text-[#00F2FF] group-hover:scale-110 transition-transform">
                         <qp.icon className="w-4 h-4" />
                       </div>
                       <span className="font-bold text-white text-sm">{qp.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{qp.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-[#2663FF]/20 border border-[#2663FF]/30 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-6 h-6 text-[#00F2FF]" />
                </div>
                <div className="bg-[#050505] border border-[#1E2345] rounded-2xl rounded-tl-none p-4 flex items-center gap-3 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[#00F2FF]" /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FF] to-white font-bold">
                    AdsBoot AI is thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[#0A0F2C] border-t border-[#1E2345] relative z-20">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AdsBoot anything..."
                className="w-full bg-[#050505] border border-[#1E2345] rounded-xl pl-5 pr-16 py-5 text-white focus:outline-none focus:ring-2 focus:ring-[#2663FF] focus:border-transparent transition-all shadow-inner font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className={`absolute right-3 top-3 p-2.5 rounded-lg transition-all
                  ${!input.trim() || loading 
                    ? 'text-slate-600 cursor-not-allowed bg-[#1E2345]' 
                    : 'bg-[#2663FF] text-white hover:bg-[#1a55eb] shadow-lg shadow-[#2663FF]/20 hover:scale-105'}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-3 text-[10px] text-slate-500 flex items-center justify-center gap-1">
               <ShieldCheck className="w-3 h-3" /> Secure conversation. AI data is not used for training public models.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Details & Context Sidebar (Hidden on mobile) */}
      <div className="hidden lg:flex w-80 flex-col gap-6 h-full overflow-y-auto pb-6">
        
        {/* About Card */}
        <div className="bg-[#0A0F2C] border border-[#1E2345] rounded-2xl p-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2663FF] to-[#00F2FF] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-[#2663FF]/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Pro Tips</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            AdsBoot AI works best when you provide context. Instead of "Write an ad", try "Write a fear-based ad for a $50 supplement targeting busy moms".
          </p>
          <div className="h-1 w-full bg-[#1E2345] rounded-full mb-4 overflow-hidden">
            <div className="h-full w-3/4 bg-[#00F2FF]"></div>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Context Memory: 75% Available
          </div>
        </div>

        {/* Model Specs */}
        <div className="bg-[#0A0F2C] border border-[#1E2345] rounded-2xl p-6 flex-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#1E2345] pb-2">
            System Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Active Model</div>
              <div className="text-sm font-semibold text-[#00F2FF]">Gemini 2.5 Flash</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Knowledge Cutoff</div>
              <div className="text-sm font-semibold text-white">Aug 2024</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Response Mode</div>
              <div className="flex items-center gap-2">
                 <span className="px-2 py-1 bg-[#2663FF]/20 text-[#2663FF] text-[10px] rounded border border-[#2663FF]/30 font-bold">CREATIVE</span>
                 <span className="px-2 py-1 bg-[#1E2345] text-slate-400 text-[10px] rounded border border-[#1E2345]">PRECISE</span>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4 border-b border-[#1E2345] pb-2">
            Suggested Workflows
          </h3>
          <ul className="space-y-3">
             <li className="flex items-center gap-2 text-xs text-slate-300 hover:text-[#00F2FF] cursor-pointer transition-colors">
               <ChevronRight className="w-3 h-3 text-[#2663FF]" /> Analyze my competitor
             </li>
             <li className="flex items-center gap-2 text-xs text-slate-300 hover:text-[#00F2FF] cursor-pointer transition-colors">
               <ChevronRight className="w-3 h-3 text-[#2663FF]" /> Calculate Break-even ROAS
             </li>
             <li className="flex items-center gap-2 text-xs text-slate-300 hover:text-[#00F2FF] cursor-pointer transition-colors">
               <ChevronRight className="w-3 h-3 text-[#2663FF]" /> Write email follow-up sequence
             </li>
             <li className="flex items-center gap-2 text-xs text-slate-300 hover:text-[#00F2FF] cursor-pointer transition-colors">
               <ChevronRight className="w-3 h-3 text-[#2663FF]" /> Generate A/B test ideas
             </li>
          </ul>
        </div>
        
        {/* Export/Actions */}
        <button className="w-full py-4 bg-[#1E2345] hover:bg-[#2663FF] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-[#1E2345] hover:border-[#2663FF] shadow-lg">
           <Download className="w-4 h-4" /> Export Chat Log
        </button>

      </div>
    </div>
  );
};

export default AiAssistant;