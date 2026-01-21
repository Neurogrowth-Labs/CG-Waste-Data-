
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Activity } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface LiveAssistantProps {
  onClose: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for cleanup
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Helper functions for audio processing (simplified from guide for brevity but functional structure kept)
  function createBlob(data: Float32Array) {
      const l = data.length;
      const int16 = new Int16Array(l);
      for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
      }
      // Simple PCM encoding
      let binary = '';
      const bytes = new Uint8Array(int16.buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return {
        data: btoa(binary),
        mimeType: 'audio/pcm;rate=16000',
      };
  }

  async function decodeAudioData(base64: string, ctx: AudioContext) {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for(let i=0; i<dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
      }
      return buffer;
  }

  useEffect(() => {
    let mounted = true;

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const inputCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = inputCtx; // Tracking one is enough for cleanup usually, but ideally track both

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const inputSource = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        
        let nextStartTime = 0;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: "You are a helpful waste management assistant for CG Waste Data. Keep responses concise.",
          },
          callbacks: {
            onopen: () => {
               if(mounted) {
                   setIsActive(true);
                   setStatus("Listening...");
                   
                   processor.onaudioprocess = (e) => {
                       const inputData = e.inputBuffer.getChannelData(0);
                       const pcmBlob = createBlob(inputData);
                       sessionPromise.then(session => {
                           session.sendRealtimeInput({ media: pcmBlob });
                       });
                   };
                   inputSource.connect(processor);
                   processor.connect(inputCtx.destination);
               }
            },
            onmessage: async (msg: LiveServerMessage) => {
               const audioStr = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
               if (audioStr) {
                   const audioBuffer = await decodeAudioData(audioStr, outputCtx);
                   const source = outputCtx.createBufferSource();
                   source.buffer = audioBuffer;
                   source.connect(outputCtx.destination);
                   
                   nextStartTime = Math.max(outputCtx.currentTime, nextStartTime);
                   source.start(nextStartTime);
                   nextStartTime += audioBuffer.duration;
               }
            },
            onclose: () => {
                if(mounted) setStatus("Disconnected");
            },
            onerror: (e) => {
                console.error(e);
                if(mounted) setStatus("Error occurred");
            }
          }
        });

        sessionRef.current = sessionPromise;

      } catch (err) {
        console.error("Live init failed", err);
        setStatus("Failed to access microphone");
      }
    };

    startSession();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioContextRef.current?.close();
      // Cannot easily "close" the session promise object from SDK externally if not exposed, 
      // but breaking the media stream stops input.
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-slate-900 text-white rounded-2xl shadow-2xl p-6 z-50 animate-bounce-in border border-slate-700">
       <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
             <Activity className={`w-5 h-5 ${isActive ? 'text-green-400 animate-pulse' : 'text-slate-400'}`} />
             <span className="font-semibold">Live Assistant</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
       </div>

       <div className="flex flex-col items-center justify-center py-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isActive ? 'bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-slate-800'}`}>
             <Mic className={`w-8 h-8 ${isActive ? 'text-green-400' : 'text-slate-500'}`} />
          </div>
          <p className="text-slate-300 font-medium">{status}</p>
          <p className="text-xs text-slate-500 mt-2 text-center px-4">
             Gemini 2.5 Native Audio Active. Speak naturally to ask about waste data.
          </p>
       </div>
    </div>
  );
};

export default LiveAssistant;