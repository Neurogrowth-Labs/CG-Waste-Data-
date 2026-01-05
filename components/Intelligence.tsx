import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Camera, Brain, MessageSquare, Mic, Loader2, Play } from 'lucide-react';
import { searchGrounding, mapsGrounding, analyzeImage, generateThinking, generateText } from '../services/geminiService';
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
        
        // Enforce HazMat identification in the prompt with context fallback
        const visionPrompt = prompt 
          ? `${prompt}\n\nIMPORTANT: You must specifically check for and list any potential hazardous materials (HazMat) visible in the image, such as asbestos, lead paint, or chemical containers. If none are clearly visible, you must note potential risks based on the site's context. Format this as a distinct 'Hazardous Materials Assessment' section.`
          : "Analyze this construction site image for waste management purposes.\n\n1. **Waste Identification**: List visible waste streams.\n2. **Hazardous Materials Assessment**: CRITICAL. Explicitly identify and list any potential hazardous materials (HazMat) visible, such as asbestos, lead paint, or chemical containers. If none are clearly visible, note potential risks based on the site's context (e.g. 'Demolition of pre-1990 structure suggests asbestos risk').\n3. **Recommendations**: Tailored safety or disposal advice.";

        const res = await analyzeImage(visionPrompt, base64Data, mimeType);
        setResult({ text: res });
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
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {result && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-6 animate-fade-in">
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
               {activeTab === 'chat' && result.isThinking ? 'Deep Reasoning Result' : 'Analysis Result'}
             </h3>
             <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap">
               {result.text}
             </div>
             
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
  );
};

export default Intelligence;