import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Camera, Fingerprint, Mic, UserCheck, UserX, AlertTriangle, 
  RefreshCw, Upload, Eye, Activity, CheckCircle2, Lock, Cpu, Key, FileText
} from 'lucide-react';
import { 
  PRESET_BIOMETRIC_REGISTER, FaceProfile, FingerprintTemplate, VoiceprintTemplate,
  calculateCosineSimilarity, matchFingerprintMinutiae, matchVoiceprints,
  evaluateMultiModalVerification, MultiModalMatchResult
} from '../lib/biometricSdk';

export const BiometricStudio: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState(PRESET_BIOMETRIC_REGISTER[0]);
  const [activeTab, setActiveTab] = useState<'face' | 'fingerprint' | 'voice' | 'fusion'>('face');
  
  // HUD Overlays State
  const [showMesh, setShowMesh] = useState(true);
  const [showMinutiae, setShowMinutiae] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [livenessOverride, setLivenessOverride] = useState(true);

  // Inbound Live Verification Test States
  const [inboundFace, setInboundFace] = useState<FaceProfile>(PRESET_BIOMETRIC_REGISTER[0].face);
  const [inboundFingerprint, setInboundFingerprint] = useState<FingerprintTemplate>(PRESET_BIOMETRIC_REGISTER[0].fingerprint);
  const [inboundVoice, setInboundVoice] = useState<VoiceprintTemplate>(PRESET_BIOMETRIC_REGISTER[0].voice);

  const faceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fingerprintCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate similarity scores
  const faceScore = calculateCosineSimilarity(selectedPerson.face.embedding512, inboundFace.embedding512);
  const fingerprintScore = matchFingerprintMinutiae(selectedPerson.fingerprint, inboundFingerprint);
  const voiceScore = matchVoiceprints(selectedPerson.voice, inboundVoice);

  const fusionResult: MultiModalMatchResult = evaluateMultiModalVerification(
    faceScore,
    fingerprintScore,
    voiceScore,
    livenessOverride
  );

  // Render Face Canvas
  useEffect(() => {
    if (!faceCanvasRef.current || !inboundFace) return;
    const canvas = faceCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = inboundFace.imageUrl;
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.drawImage(img, 0, 0, 400, 400);

      // Draw bounding box
      const box = inboundFace.boundingBox;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw Face mesh
      if (showMesh) {
        ctx.fillStyle = '#06B6D4';
        for (let i = 0; i < 68; i++) {
          const cx = box.x + 15 + ((i * 13) % (box.width - 30));
          const cy = box.y + 20 + ((i * 17) % (box.height - 40));
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
  }, [inboundFace, showMesh]);

  // Render Fingerprint Canvas
  useEffect(() => {
    if (!fingerprintCanvasRef.current) return;
    const canvas = fingerprintCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 320;

    // Draw dark fingerprint background card
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 320, 320);

    // Draw simulated fingerprint ridge loops
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 2;
    for (let r = 20; r < 140; r += 8) {
      ctx.beginPath();
      ctx.arc(160, 160, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw minutiae points (Red = Endings, Blue = Bifurcations)
    if (showMinutiae) {
      inboundFingerprint.minutiaeList.forEach((m) => {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
        if (m.type === 'bifurcation') {
          ctx.fillStyle = '#3B82F6'; // Blue
        } else {
          ctx.fillStyle = '#EF4444'; // Red
        }
        ctx.fill();

        // Draw angle orientation line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + 10 * Math.cos((m.angle * Math.PI) / 180), m.y + 10 * Math.sin((m.angle * Math.PI) / 180));
        ctx.stroke();
      });
    }
  }, [inboundFingerprint, showMinutiae]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded uppercase font-mono">
              Biometric SDK v4.1
            </span>
            <h2 className="text-xl font-bold flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-indigo-400" />
              Multi-Modal Biometric Security Gate Suite
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Face ID 512D embeddings, ISO 19794-2 Minutiae Fingerprint matcher, and MFCC Acoustic Voiceprint verification for weighbridge gate security.
          </p>
        </div>

        {/* Selected Personnel Context */}
        <div className="flex items-center space-x-3 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <img src={selectedPerson.face.imageUrl} alt={selectedPerson.face.name} className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500" />
          <div>
            <div className="text-xs font-bold text-white">{selectedPerson.face.name}</div>
            <div className="text-[10px] text-emerald-400 font-mono">{selectedPerson.face.registrationId}</div>
          </div>
        </div>
      </div>

      {/* Mode Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-sm shrink-0">
        <button
          onClick={() => setActiveTab('face')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'face'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Facial Recognition (512D Vector & Mesh)</span>
        </button>

        <button
          onClick={() => setActiveTab('fingerprint')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'fingerprint'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>ISO 19794-2 Fingerprint Minutiae</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'voice'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voiceprint MFCC Acoustic Spectrum</span>
        </button>

        <button
          onClick={() => setActiveTab('fusion')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'fusion'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Multi-Modal Gate Fusion Audit</span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-8">

        {/* TAB 1: FACIAL RECOGNITION */}
        {activeTab === 'face' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Camera HUD Canvas */}
            <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-lg flex flex-col h-[480px]">
              <div className="flex justify-between items-center mb-3 text-xs text-slate-300">
                <span className="font-mono text-emerald-400 font-bold flex items-center">
                  <Camera className="w-4 h-4 mr-1.5" /> WEIGHBRIDGE SCANNER HUD
                </span>
                <button onClick={handleSimulateScan} className="px-3 py-1 bg-slate-800 text-slate-200 rounded text-xs font-bold hover:bg-slate-700">
                  Trigger Scan
                </button>
              </div>

              <div className="flex-1 relative bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                <canvas ref={faceCanvasRef} className="w-full h-full object-cover" />
                {isScanning && (
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-slate-900 text-cyan-400 px-4 py-2 rounded font-mono text-xs border border-cyan-500 shadow-lg">
                      EXTRACTING 512D VECTOR EMBEDDING...
                    </span>
                  </div>
                )}
              </div>

              {/* HUD Toggles */}
              <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={showMesh} onChange={(e) => setShowMesh(e.target.checked)} className="rounded bg-slate-800 border-slate-700 text-emerald-500" />
                  <span>68-Point Mesh Overlay</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={livenessOverride} onChange={(e) => setLivenessOverride(e.target.checked)} className="rounded bg-slate-800 border-slate-700 text-cyan-500" />
                  <span>Active Liveness Check Passed</span>
                </label>
              </div>
            </div>

            {/* Right: Facial Metrics */}
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Facial SDK Metrics</h3>

              <div className="p-4 bg-slate-950 text-white rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Cosine Similarity Score</span>
                  <span className="font-mono text-lg font-bold text-emerald-400">{faceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${faceScore}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Match Status: <strong className="text-white">{faceScore >= 80 ? 'AUTHORIZED' : 'UNMATCHED'}</strong></span>
                  <span>Vector Dim: <strong className="text-white">512Float32</strong></span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700">Liveness & Anti-Spoofing Metrics</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block">Status</span>
                    <span className="font-bold text-emerald-700">{inboundFace.liveness.antiSpoofingStatus}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block">Liveness Score</span>
                    <span className="font-bold text-slate-800">{inboundFace.liveness.score}%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FINGERPRINT MINUTIAE */}
        {activeTab === 'fingerprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
              <div className="text-xs text-slate-400 font-mono mb-2">ISO 19794-2 MINUTIAE MESH CANVAS</div>
              <canvas ref={fingerprintCanvasRef} className="rounded-xl border border-slate-800 shadow-inner" />
              <div className="flex space-x-4 mt-3 text-[11px] text-slate-400">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span> Ridge Endings</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1"></span> Ridge Bifurcations</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Fingerprint SDK Analysis</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">NFIQ 2 Quality Score</div>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">
                    Score {selectedPerson.fingerprint.nfiq2Score} <span className="text-xs font-normal text-emerald-600">(Excellent)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Minutiae Count</div>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">
                    {selectedPerson.fingerprint.minutiaeCount} <span className="text-xs font-normal text-slate-500">Points</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 text-white rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Bozorth3 Pattern Match Score</span>
                  <span className="font-mono text-emerald-400 font-bold">{fingerprintScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${fingerprintScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VOICEPRINT ACOUSTIC SPECTRUM */}
        {activeTab === 'voice' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center">
                <Mic className="w-5 h-5 mr-2 text-indigo-600" /> Voiceprint Acoustic SDK (13-Vector MFCC & DTW)
              </h3>
              <p className="text-xs text-slate-500">Passphrase speech spectrum analysis for weighing driver identity verification.</p>
            </div>

            <div className="p-4 bg-slate-950 text-white rounded-xl font-mono text-xs space-y-3">
              <div className="text-emerald-400 font-bold">Passphrase Prompt: "{selectedPerson.voice.passphrase}"</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block">Fundamental Pitch</span>
                  <span className="font-bold text-white">{selectedPerson.voice.pitchHz} Hz</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block">Formant F1</span>
                  <span className="font-bold text-white">{selectedPerson.voice.formants.f1} Hz</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block">Formant F2</span>
                  <span className="font-bold text-white">{selectedPerson.voice.formants.f2} Hz</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block">Spectral Centroid</span>
                  <span className="font-bold text-white">{selectedPerson.voice.spectralCentroidHz} Hz</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-emerald-900">DTW Voice Match Confidence Score</span>
                <div className="text-2xl font-extrabold text-emerald-900 font-data">{voiceScore}%</div>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold">
                Passphrase Authenticated
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: MULTI-MODAL GATE FUSION AUDIT */}
        {activeTab === 'fusion' && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center">
                    <Cpu className="w-5 h-5 mr-2 text-indigo-600" /> Multi-Modal Weighbridge Gate Fusion Evaluator
                  </h3>
                  <p className="text-xs text-slate-500">Combines Face + Fingerprint + Voice ID with SHA256 cryptographic audit seal.</p>
                </div>

                <div className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border flex items-center ${
                  fusionResult.matchStatus === 'ACCESS_GRANTED'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}>
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> {fusionResult.matchStatus}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase">Face ID (50% Weight)</span>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">{fusionResult.faceMatchScore}%</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase">Fingerprint (30% Weight)</span>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">{fusionResult.fingerprintMatchScore}%</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase">Voiceprint (20% Weight)</span>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">{fusionResult.voiceMatchScore}%</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 text-white rounded-xl font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fused Security Score:</span>
                  <span className="font-bold text-emerald-400">{fusionResult.fusionConfidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Liveness Guard:</span>
                  <span className="font-bold text-emerald-400">PASSED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cryptographic Seal:</span>
                  <span className="text-slate-300">{fusionResult.sha256AuditSeal}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BiometricStudio;
