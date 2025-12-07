import React, { useState, useRef } from 'react';
import { analyzeCreative } from '../services/geminiService';
import { CreativeAnalysisResult } from '../types';
import { 
  Loader2, Upload, ScanEye, AlertTriangle, ThumbsUp, Activity, 
  Zap, Image as ImageIcon, Video as VideoIcon, CheckCircle2, Bot,
  X, FileVideo, FileImage, RefreshCw, ChevronRight
} from 'lucide-react';
import EmbeddedChat from './EmbeddedChat';

const CreativeAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreativeAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // 20MB Limit for inline data (approx)
    if (file.size > 20 * 1024 * 1024) {
      alert("File size must be under 20MB for analysis.");
      return;
    }
    
    // Check if image or video
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert("Please upload an image or video file.");
        return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    
    try {
      const base64Data = await convertToBase64(selectedFile);
      const data = await analyzeCreative(base64Data, selectedFile.type, context);
      setResult(data);
    } catch (e) {
      alert("Analysis failed. Please try a different file.");
    } finally {
      setLoading(false);
    }
  };

  const resetAudit = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setContext('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const isVideo = selectedFile?.type.startsWith('video/');

  return (
    <div className="min-h-full w-full relative pb-20">
      {/* Local Background Overlay for better text contrast over 3D cubes */}
      <div className="absolute inset-0 bg-[#050505]/60 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10 pt-8 px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 animate-fade-in-up">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2663FF]/20 border border-[#2663FF]/30 text-[#00F2FF] text-xs font-bold uppercase tracking-wider mb-2">
              <ScanEye className="w-3 h-3" /> Creative Intelligence
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Creative Audit
            </h2>
            <p className="text-slate-400 max-w-lg">
              Upload your ad creative. Get an instant AI performance prediction.
            </p>
          </div>
          
          {result && (
            <button 
              onClick={resetAudit}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-slate-300 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> New Audit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* INPUT SECTION - Sticky on Desktop */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 animate-fade-in-up delay-100 z-20">
             
             {/* Upload Card */}
             <div className="glass-card rounded-2xl p-6 border-t border-white/10 bg-[#0A0F2C]/80 backdrop-blur-xl">
                <div 
                    className={`border-2 border-dashed rounded-xl transition-all h-[320px] relative overflow-hidden group flex flex-col items-center justify-center
                      ${previewUrl 
                        ? 'border-[#2663FF]/50 bg-black/40' 
                        : 'border-white/10 bg-white/5 hover:border-[#00F2FF]/50 hover:bg-white/10 cursor-pointer'}`}
                    onClick={() => !previewUrl && fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
                    }}
                >
                    {previewUrl ? (
                      <>
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                          {isVideo ? (
                              <video 
                                  src={previewUrl} 
                                  controls 
                                  className="max-h-full max-w-full rounded shadow-lg object-contain" 
                              />
                          ) : (
                              <img 
                                  src={previewUrl} 
                                  alt="Preview" 
                                  className="max-h-full max-w-full rounded shadow-lg object-contain" 
                              />
                          )}
                        </div>
                        
                        <div className="absolute top-4 right-4 z-10">
                           <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                resetAudit();
                            }}
                            className="p-2 bg-black/60 text-white hover:bg-red-500/80 rounded-full transition-colors backdrop-blur-md border border-white/10"
                           >
                            <X className="w-4 h-4" />
                           </button>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 z-10">
                           <div className="px-3 py-1 bg-black/60 rounded-full text-xs text-white font-mono border border-white/10 flex items-center gap-2 backdrop-blur-md">
                              {isVideo ? <FileVideo className="w-3 h-3 text-[#00F2FF]" /> : <FileImage className="w-3 h-3 text-[#00F2FF]" />}
                              {selectedFile?.name.substring(0, 20)}{selectedFile && selectedFile.name.length > 20 ? '...' : ''}
                           </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-20 h-20 bg-[#1E2345] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border border-white/5 shadow-inner">
                          <Upload className="w-10 h-10 text-slate-400 group-hover:text-[#00F2FF] transition-colors" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Upload Creative</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-[200px] mx-auto">
                          Drag & drop or click to upload your ad asset.
                        </p>
                        <div className="flex justify-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className="bg-white/5 px-2 py-1 rounded border border-white/5">JPG</span>
                            <span className="bg-white/5 px-2 py-1 rounded border border-white/5">PNG</span>
                            <span className="bg-white/5 px-2 py-1 rounded border border-white/5">MP4</span>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*,video/*" 
                      onChange={handleFileChange} 
                    />
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Ad Context (Optional)
                      </label>
                      <textarea
                        className="w-full bg-[#050505] border border-[#1E2345] rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#2663FF] text-sm transition-all resize-none h-20"
                        placeholder="Targeting women 30+ interested in yoga. Goal: Sales."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                      />
                  </div>

                  <button
                      onClick={handleAnalyze}
                      disabled={loading || !selectedFile}
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group shadow-lg
                        ${loading || !selectedFile 
                          ? 'bg-[#1E2345] cursor-not-allowed text-slate-500 border border-[#1E2345]' 
                          : 'bg-[#2663FF] hover:bg-[#1a55eb] border border-[#2663FF] hover:shadow-[#2663FF]/25 hover:scale-[1.01]'}`}
                    >
                      <div className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            Run Audit <ScanEye className="w-5 h-5" />
                          </>
                        )}
                      </div>
                    </button>
                </div>
             </div>
          </div>

          {/* OUTPUT SECTION */}
          <div className="lg:col-span-7 space-y-6">
            {!result && !loading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card rounded-2xl p-12 text-center animate-fade-in-up delay-200 border-dashed border-white/10 bg-transparent">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                   <Activity className="w-10 h-10 text-slate-500" />
                 </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Audit</h3>
                <p className="max-w-xs mx-auto text-slate-500 text-sm">
                  Upload your creative on the left to unlock AI-powered insights about your ad's potential.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Score Card */}
                <div className="glass-card rounded-2xl p-8 relative overflow-hidden bg-[#0A0F2C]/90">
                   <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2663FF]/20 blur-[80px] rounded-full pointer-events-none"></div>
                   
                   <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-[#00F2FF]" />
                        <span className="text-sm font-bold text-[#00F2FF] uppercase tracking-wider">AI Prediction</span>
                     </div>
                     
                     <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                          <div className={`text-7xl font-black ${getScoreColor(result.score)} tracking-tighter`}>
                              {result.score}
                          </div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Overall Score</div>
                        </div>
                        
                        <div className="flex-1 w-full grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Stop Potential</div>
                                <div className={`text-lg font-bold ${result.stopScrollPotential === 'High' ? 'text-green-400' : result.stopScrollPotential === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {result.stopScrollPotential}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Asset Format</div>
                                <div className="text-lg font-bold text-white flex items-center gap-2">
                                  {isVideo ? <VideoIcon className="w-4 h-4 text-[#2663FF]" /> : <ImageIcon className="w-4 h-4 text-[#2663FF]" />}
                                  {isVideo ? 'Video' : 'Image'}
                                </div>
                            </div>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Analysis Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl p-6 border-t-2 border-emerald-500 bg-[#0A0F2C]/80">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-6 uppercase tracking-wide">
                            <ThumbsUp className="w-4 h-4" /> Strong Points
                        </h4>
                        <ul className="space-y-4">
                            {result.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{s}</span>
                            </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border-t-2 border-amber-500 bg-[#0A0F2C]/80">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-6 uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4" /> Opportunities
                        </h4>
                        <ul className="space-y-4">
                            {result.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                <span className="leading-relaxed">{s}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Overall Verdict */}
                <div className="glass-card rounded-2xl p-8 border border-[#2663FF]/30 bg-gradient-to-r from-[#2663FF]/10 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Bot className="w-24 h-24 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                       <Bot className="w-5 h-5 text-[#00F2FF]" /> Gemini Verdict
                    </h4>
                    <p className="text-slate-200 leading-relaxed text-sm relative z-10">
                       "{result.overallFeedback}"
                    </p>
                </div>

                {/* Chat Integration */}
                <div className="pt-4">
                   <div className="glass-card rounded-2xl p-1 border-none bg-gradient-to-r from-[#2663FF]/20 to-[#00F2FF]/10">
                      <EmbeddedChat 
                        context={`Creative Analysis for ${isVideo ? 'Video' : 'Image'}. Score: ${result.score}. Feedback: ${result.overallFeedback}`} 
                        title="Refine this Creative"
                        initialMessage="I've analyzed your creative. I can help you write a brief for your editor to fix the weak points." 
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

export default CreativeAnalyzer;