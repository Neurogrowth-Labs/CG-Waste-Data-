import React, { useState } from 'react';
import { Video, Image as ImageIcon, Wand2, Play, Download, Loader2, Maximize2 } from 'lucide-react';
import { generateHighQualityImage, generateVideo, editImage } from '../services/geminiService';

const CreativeStudio: React.FC = () => {
  const [mode, setMode] = useState<'veo' | 'image_gen' | 'image_edit'>('veo');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMedia, setResultMedia] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imgSize, setImgSize] = useState<'1K'|'2K'|'4K'>('1K');
  
  // Image Edit State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const checkApiKey = async () => {
     if (window.aistudio && window.aistudio.hasSelectedApiKey) {
       const hasKey = await window.aistudio.hasSelectedApiKey();
       if (!hasKey) {
         await window.aistudio.openSelectKey();
         // Assume success after dialog
       }
     }
  };

  const handleRun = async () => {
    setLoading(true);
    setResultMedia(null);
    try {
      if (mode === 'veo') {
        await checkApiKey();
        // Veo Generation
        let videoUrl;
        if (uploadFile && preview) {
           // Image to Video
           videoUrl = await generateVideo(prompt, preview.split(',')[1], uploadFile.type, aspectRatio as any);
        } else {
           // Text to Video
           videoUrl = await generateVideo(prompt, undefined, undefined, aspectRatio as any);
        }
        setResultMedia(videoUrl);

      } else if (mode === 'image_gen') {
        await checkApiKey();
        const imgUrl = await generateHighQualityImage(prompt, aspectRatio, imgSize);
        setResultMedia(imgUrl);

      } else if (mode === 'image_edit') {
        // Nano Banana Edit
        if (!preview || !uploadFile) {
          alert("Upload an image to edit");
          setLoading(false);
          return;
        }
        const edited = await editImage(prompt, preview.split(',')[1], uploadFile.type);
        setResultMedia(edited);
      }
    } catch (e) {
      console.error(e);
      alert("Generation failed. See console.");
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setUploadFile(f);
      const r = new FileReader();
      r.onloadend = () => setPreview(r.result as string);
      r.readAsDataURL(f);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Controls */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
          Creative Studio
        </h2>

        <div className="space-y-6">
          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => { setMode('veo'); setResultMedia(null); }}
              className={`py-2 text-xs font-medium rounded-md flex flex-col items-center justify-center space-y-1 ${mode === 'veo' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Video className="w-4 h-4" />
              <span>Veo Video</span>
            </button>
            <button
              onClick={() => { setMode('image_gen'); setResultMedia(null); }}
              className={`py-2 text-xs font-medium rounded-md flex flex-col items-center justify-center space-y-1 ${mode === 'image_gen' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gen Image</span>
            </button>
            <button
              onClick={() => { setMode('image_edit'); setResultMedia(null); }}
              className={`py-2 text-xs font-medium rounded-md flex flex-col items-center justify-center space-y-1 ${mode === 'image_edit' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Edit Image</span>
            </button>
          </div>

          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm h-24 resize-none"
              placeholder={
                mode === 'veo' ? "Describe the video (e.g. A drone shot of a construction site...)" :
                mode === 'image_gen' ? "Describe the image to generate..." :
                "Describe the edit (e.g. Add a safety fence...)"
              }
            />
          </div>

          {(mode === 'image_edit' || mode === 'veo') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {mode === 'veo' ? 'Reference Image (Optional)' : 'Source Image (Required)'}
              </label>
              <input type="file" onChange={handleFileUpload} accept="image/*" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
              {preview && <img src={preview} className="mt-2 h-20 w-auto rounded border" alt="preview" />}
            </div>
          )}

          {/* Configs */}
          <div className="grid grid-cols-2 gap-4">
             {(mode === 'veo' || mode === 'image_gen') && (
               <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Aspect Ratio</label>
                 <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full text-sm border-slate-300 rounded-md border p-2">
                   <option value="16:9">16:9 (Landscape)</option>
                   <option value="9:16">9:16 (Portrait)</option>
                   {mode === 'image_gen' && <option value="1:1">1:1 (Square)</option>}
                   {mode === 'image_gen' && <option value="4:3">4:3</option>}
                 </select>
               </div>
             )}
             {mode === 'image_gen' && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Resolution</label>
                  <select value={imgSize} onChange={(e) => setImgSize(e.target.value as any)} className="w-full text-sm border-slate-300 rounded-md border p-2">
                    <option value="1K">1K</option>
                    <option value="2K">2K (Pro)</option>
                    <option value="4K">4K (Pro)</option>
                  </select>
                </div>
             )}
          </div>

          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
            {mode === 'veo' ? 'Generate Video' : mode === 'image_gen' ? 'Generate Image' : 'Apply Edit'}
          </button>
          
          {mode === 'veo' && <p className="text-xs text-slate-400 text-center">Video generation takes a few minutes.</p>}
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-2 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
         {!resultMedia && !loading && (
           <div className="text-slate-600 flex flex-col items-center">
             <Maximize2 className="w-12 h-12 mb-4 opacity-20" />
             <p>Result will appear here</p>
           </div>
         )}
         
         {loading && (
           <div className="text-white flex flex-col items-center">
             <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
             <p className="animate-pulse">Creating masterpiece...</p>
           </div>
         )}

         {resultMedia && !loading && (
           <div className="w-full h-full flex items-center justify-center bg-black p-4">
             {mode === 'veo' ? (
                <video controls src={resultMedia} className="max-h-full max-w-full rounded shadow-2xl" autoPlay loop />
             ) : (
                <img src={resultMedia} className="max-h-full max-w-full rounded shadow-2xl object-contain" alt="Generated" />
             )}
           </div>
         )}
      </div>
    </div>
  );
};

export default CreativeStudio;
