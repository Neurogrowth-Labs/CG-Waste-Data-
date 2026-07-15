import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Camera, Brain, MessageSquare, Mic, Loader2, Play, Activity, AlertTriangle } from 'lucide-react';
import { searchGrounding, mapsGrounding, analyzeImage, generateThinking, generateText, analyzeSiteWasteStructured } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming we can use this or just render plain text
// Note: Since I cannot install react-markdown, I will render basic text with line breaks.

const Intelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'maps' | 'vision' | 'chat'>('chat');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (activeTab === 'search') {
        const res = await searchGrounding(prompt);
        setResult(res);
      } else if (activeTab === 'maps') {
         // Default location to San Francisco or user geo if available (skipping geo logic for brevity)
        const res = await mapsGrounding(prompt, 37.7749, -122.4194);
        setResult(res);
      } else if (activeTab === 'vision') {
        if (!imagePreview) {
          alert("Please upload an image first");
          setLoading(false);
          return;
        }
        const base64Data = imagePreview.split(',')[1];
        const mimeType = imageFile?.type || 'image/jpeg';
        
        const res = await analyzeSiteWasteStructured(base64Data, mimeType);
        setResult({ structuredVision: res });
      } else if (activeTab === 'chat') {
        // Use Thinking model for complex strategy if 'strategy' or 'plan' is in prompt, else regular text
        if (prompt.toLowerCase().includes('plan') || prompt.toLowerCase().includes('strategy') || prompt.toLowerCase().includes('report')) {
           const res = await generateThinking(prompt);
           setResult({ text: res, isThinking: true });
        } else {
           const res = await generateText(prompt);
           setResult({ text: res });
        }
      }
    } catch (error) {
      console.error(error);
      setResult({ text: "Error processing request. Please check API Key and try again." });
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Brain className="w-6 h-6 mr-2 text-emerald-600" /> AI Waste Analytics Engine</h2>
          <p className="text-slate-500">Waste Prediction, Optimization & Circular Economy Engine powered by Gemini.</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'chat' ? 'border-b-2 border-green-500 text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Brain className="w-4 h-4" />
          <span>Advisor & Thinking</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'search' ? 'border-b-2 border-green-500 text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Search className="w-4 h-4" />
          <span>Regulatory Search</span>
        </button>
        <button
          onClick={() => setActiveTab('maps')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'maps' ? 'border-b-2 border-green-500 text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <MapPin className="w-4 h-4" />
          <span>Recycling Finder</span>
        </button>
        <button
          onClick={() => setActiveTab('vision')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 ${activeTab === 'vision' ? 'border-b-2 border-green-500 text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Camera className="w-4 h-4" />
          <span>Site Analysis</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
        {(!result && !loading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-slate-400 overflow-y-auto w-full">
             <div className="w-16 h-16 bg-[#0B8F6C]/10 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-[#0B8F6C]" />
             </div>
             <p className="max-w-md text-center text-slate-800 text-lg font-medium">Hello, I'm your Green Copilot.</p>
             <p className="max-w-md text-center text-sm mt-1">Select a core capability tab to begin.</p>
             
             {activeTab === 'chat' && (
             <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-slate-200 mt-8 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                   <h4 className="font-bold text-slate-800 text-sm tracking-wider uppercase flex items-center"><Activity className="w-5 h-5 mr-2 text-[#0B8F6C]" /> Predicted Waste Baseline</h4>
                   <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">RISK: HIGH</span>
                </div>
                <div className="mb-2">
                   <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Profile: </span>
                   <span className="text-sm font-semibold text-slate-800">Office Complex Alpha (12,500 m²)</span>
                </div>
                <div className="grid grid-cols-4 gap-3 border-y border-slate-100 py-4 mb-4 font-data">
                   <div className="text-center">
                      <div className="text-[10px] text-slate-400 mb-1">TOTAL (EST.)</div>
                      <div className="text-2xl font-bold text-slate-800">120t</div>
                   </div>
                   <div className="text-center border-l border-slate-100">
                      <div className="text-[10px] text-slate-400 mb-1">CONCRETE</div>
                      <div className="text-2xl font-bold text-slate-800">65t</div>
                   </div>
                   <div className="text-center border-l border-slate-100">
                      <div className="text-[10px] text-slate-400 mb-1">STEEL</div>
                      <div className="text-2xl font-bold text-slate-800">20t</div>
                   </div>
                   <div className="text-center border-l border-slate-100">
                      <div className="text-[10px] text-slate-400 mb-1">TIMBER</div>
                      <div className="text-2xl font-bold text-slate-800">15t</div>
                   </div>
                </div>
                <div className="text-sm bg-emerald-50 text-[#0B8F6C] p-3 rounded-lg border border-emerald-100/50 flex">
                  <Activity className="w-5 h-5 mr-2 shrink-0" />
                  <span>Recommendation: Reduce concrete order target by 10%. Local steel recycler match available within 12km (Est. savings R45,000).</span>
                </div>
             </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl mt-8">
                 <button onClick={() => setPrompt("How can I reduce waste on the Office Complex project?")} className="text-sm bg-white border border-slate-200 p-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-[#0B8F6C]/30 hover:text-[#0B8F6C] transition-all text-left font-medium shadow-sm">"How can I reduce waste on the Office Complex project?"</button>
                 <button onClick={() => setPrompt("Scan BIM context for material optimization...")} className="text-sm bg-white border border-slate-200 p-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-[#0B8F6C]/30 hover:text-[#0B8F6C] transition-all text-left font-medium shadow-sm">"Scan BIM context for material optimization..."</button>
             </div>
          </div>
        )}

        {result && (
          <div className="card-premium p-6 mb-6 animate-fade-in border-t-4 border-t-[#0B8F6C]">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
               <Activity className="w-4 h-4 mr-2 text-[#0B8F6C]" />
               {activeTab === 'chat' && result.isThinking ? 'Deep Reasoning Result' : 'AI Intelligence Output'}
             </h3>
             
             {result.text && (
               <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                 {result.text}
               </div>
             )}

             {result.structuredVision && (
               <div className="space-y-6">
                 {/* Overview */}
                 <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-800">Site Overview Assessment</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm border ${
                        result.structuredVision.risk_level === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                        result.structuredVision.risk_level === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {result.structuredVision.risk_level?.toUpperCase()} RISK
                      </span>
                   </div>
                   <p className="text-sm text-slate-600 leading-relaxed">{result.structuredVision.overview_assessment}</p>
                 </div>

                 {/* Waste Streams Grid */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Identified Waste Streams</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {result.structuredVision.waste_streams?.map((stream: any, idx: number) => (
                         <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-[#0B8F6C]/40 transition-colors">
                           <div className="flex justify-between items-center mb-2">
                             <span className="font-semibold text-slate-800">{stream.material}</span>
                             <span className="text-[#0B8F6C] font-data font-bold">{stream.estimated_percentage}%</span>
                           </div>
                           <p className="text-xs text-slate-500">{stream.description}</p>
                           <div className="w-full bg-slate-100 h-1 mt-3 rounded-full overflow-hidden">
                             <div className="h-full bg-[#0B8F6C]" style={{ width: `${stream.estimated_percentage}%` }}></div>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Hazards List */}
                 {result.structuredVision.hazards_detected?.length > 0 && (
                   <div>
                     <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        HazMat & Safety Risks Detected
                     </h4>
                     <div className="space-y-3">
                       {result.structuredVision.hazards_detected.map((hazard: any, idx: number) => (
                         <div key={idx} className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-bold text-red-800 text-sm tracking-tight">{hazard.hazard_name}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 shadow-sm uppercase">{hazard.severity}</span>
                              </div>
                              <p className="text-xs text-red-600/80">{hazard.action_required}</p>
                            </div>
                            <button className="text-xs bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium hover:bg-red-50 whitespace-nowrap shadow-sm">
                              Generate Abatement Plan
                            </button>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             )}
             
             {/* Grounding Sources */}
             {result.chunks && result.chunks.length > 0 && (
               <div className="mt-4 pt-4 border-t border-slate-100">
                 <h4 className="text-xs font-semibold text-slate-500 mb-2">Sources & References</h4>
                 <div className="space-y-2">
                    {result.chunks.map((chunk: any, i: number) => (
                      <div key={i}>
                        {chunk.web?.uri && (
                          <a href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block truncate">
                             {chunk.web.title || chunk.web.uri}
                          </a>
                        )}
                        {chunk.maps?.placeId && (
                           <div className="text-xs text-slate-600 bg-slate-100 p-2 rounded">
                              <span className="font-semibold">{chunk.maps.title}</span> - <a className="text-blue-500 hover:underline" href={chunk.maps.googleMapsUri} target="_blank">View on Maps</a>
                           </div>
                        )}
                      </div>
                    ))}
                 </div>
               </div>
             )}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            <span className="ml-3 text-slate-500">Processing with Gemini Intelligence...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {activeTab === 'vision' && (
          <div className="mb-4">
             <div className="flex items-center space-x-4 mb-2">
               <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
             </div>
             {imagePreview && (
               <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto rounded border border-slate-200 object-cover" />
             )}
             <p className="text-xs text-slate-400 mt-2">
               Upload a site photo to detect waste streams and potential hazardous materials (HazMat) including context-based risks.
             </p>
          </div>
        )}
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder={
              activeTab === 'search' ? "Ask about latest waste regulations..." :
              activeTab === 'maps' ? "Find concrete recycling centers nearby..." :
              activeTab === 'vision' ? "Describe specific areas to inspect for hazards..." :
              "Ask for a waste reduction strategy (activates Thinking mode)..."
            }
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleExecute}
            disabled={loading}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '...' : 'Run'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Intelligence;