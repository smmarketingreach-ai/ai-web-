import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles, Trash2, Copy } from 'lucide-react';

interface EmbeddedChatProps {
  context: string;
  initialMessage?: string;
  title?: string;
}

const EmbeddedChat: React.FC<EmbeddedChatProps> = ({ 
  context, 
  initialMessage = "I can help you refine these results. What would you like to change?",
  title = "Refine with AI"
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: initialMessage,
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setLoading(true);

    // Add User Message
    const newHistory = [
      ...messages,
      { role: 'user', text: userText, timestamp: new Date() } as ChatMessage
    ];
    setMessages(newHistory);

    try {
      // Prepare history for API, injecting context into the system instruction conceptually
      let messageToSend = userText;
      if (messages.length === 1) {
        messageToSend = `Context: ${context}\n\nUser Query: ${userText}`;
      }

      // Convert UI messages to API history format
      const apiHistory = messages.map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await sendChatMessage(messageToSend, apiHistory);

      setMessages(prev => [
        ...prev,
        { role: 'model', text: responseText, timestamp: new Date() } as ChatMessage
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'model', text: "I'm having trouble connecting right now. Please try again.", timestamp: new Date() } as ChatMessage
      ]);
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

  return (
    <div className="bg-[#0A0F2C] border border-[#1E2345] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl mt-8 animate-fade-in-up">
      {/* Header */}
      <div className="bg-[#050505] p-4 border-b border-[#1E2345] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#2663FF] animate-pulse-slow" />
          <h3 className="font-bold text-white">{title}</h3>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', text: initialMessage, timestamp: new Date() }])}
          className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" /> Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
              ${msg.role === 'model' 
                ? 'bg-[#2663FF]/20 border-[#2663FF]/30 text-[#00F2FF]' 
                : 'bg-slate-700 border-slate-600 text-white'}`}
            >
              {msg.role === 'model' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg
              ${msg.role === 'model' 
                ? 'bg-[#1E2345]/50 border border-[#1E2345] text-slate-200 rounded-tl-none' 
                : 'bg-[#2663FF] text-white rounded-tr-none'}`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-[#2663FF]/20 border border-[#2663FF]/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#00F2FF]" />
            </div>
            <div className="bg-[#1E2345]/50 border border-[#1E2345] rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#2663FF]" />
              <span className="text-xs text-slate-400 font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#050505] border-t border-[#1E2345]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to adjust the results..."
            className="w-full bg-[#0A0F2C] border border-[#1E2345] rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#2663FF] transition-all text-sm shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute right-2 top-2 p-2 rounded-lg transition-all
              ${!input.trim() || loading 
                ? 'text-slate-600 cursor-not-allowed' 
                : 'bg-[#2663FF] text-white hover:bg-[#1a55eb]'}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedChat;