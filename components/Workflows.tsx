import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Truck, Scale, MapPin, ClipboardCheck, ArrowRight, Wand2, Calculator, Save, Loader2, Calendar, History, Layers, Info } from 'lucide-react';

// --- Shared Components ---

const Stepper = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, index) => (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              index + 1 <= currentStep
                ? 'bg-green-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          <span className={`text-xs mt-2 font-medium ${index + 1 <= currentStep ? 'text-green-700' : 'text-slate-400'}`}>
            {step}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${index + 1 < currentStep ? 'bg-green-500' : 'bg-slate-200'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// --- Workflow 1: Waste Source Identification (Project Profiling) ---

export const ProjectSourceWorkflow: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isPredicting, setIsPredicting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Commercial Renovation',
    phase: 'Demolition',
    buildingYear: '1985',
    historicalData: 'none',
    area: '5000',
    duration: '6',
    concrete: 0,
    metal: 0,
    wood: 0,
    hazmat: false
  });
  
  const [aiReasoning, setAiReasoning] = useState<string[]>([]);

  // Smart Default: Update duration based on area/type
  useEffect(() => {
    if (formData.type === 'Demolition') {
      setFormData(prev => ({ ...prev, duration: '2' }));
    }
  }, [formData.type]);

  const handlePredict = () => {
    setIsPredicting(true);
    setAiReasoning([]);
    
    // Simulate AI calculation delay
    setTimeout(() => {
      // --- AI PREDICTION ENGINE ---
      
      const area = parseInt(formData.area) || 0;
      const duration = parseInt(formData.duration) || 1;
      const year = parseInt(formData.buildingYear) || 2000;
      let reasons: string[] = [];
      
      // 1. Base Intensity by Phase (Tonnes per 1,000 sq ft)
      let intensity = 0;
      let ratios = { concrete: 0.33, metal: 0.33, wood: 0.33 };

      switch (formData.phase) {
        case 'Demolition':
          intensity = 150; 
          ratios = { concrete: 0.70, metal: 0.20, wood: 0.10 };
          reasons.push("Phase 'Demolition' sets high waste intensity baseline.");
          break;
        case 'Structural':
          intensity = 60;
          ratios = { concrete: 0.50, metal: 0.30, wood: 0.20 };
          reasons.push("Phase 'Structural' emphasizes concrete and steel offcuts.");
          break;
        case 'Fit-out':
          intensity = 25; 
          ratios = { concrete: 0.10, metal: 0.40, wood: 0.50 };
          reasons.push("Phase 'Fit-out' reduces total volume, increases wood/packaging mix.");
          break;
        default:
          intensity = 30;
      }

      // 2. Building Age Factor
      let ageMultiplier = 1.0;
      if (year < 1980) {
        ageMultiplier = 1.25;
        ratios.concrete += 0.1; // Older buildings have more heavy masonry
        ratios.wood -= 0.1;
        reasons.push(`Building Age (${year}): Pre-1980 construction adds +25% density mass.`);
        
        // Auto-detect Hazmat risk
        if (year < 1990 && !formData.hazmat) {
             setFormData(prev => ({...prev, hazmat: true}));
             reasons.push("Context Risk: Construction date < 1990 flags potential Asbestos/Lead.");
        }
      } else {
        reasons.push(`Modern construction (${year}) implies optimized material usage.`);
      }

      // 3. Historical Data Correlation
      let historyMultiplier = 1.0;
      if (formData.historicalData === 'similar_urban') {
        historyMultiplier = 0.92;
        reasons.push("Historical Data: Similar urban projects suggest 8% efficiency gain.");
      } else if (formData.historicalData === 'similar_industrial') {
        historyMultiplier = 1.05;
        reasons.push("Historical Data: Industrial benchmarks suggest 5% volume increase.");
      }

      // 4. Calculate Final Volume
      const durationFactor = 1 + (duration * 0.005); // Minor drift for longer projects
      const totalEstWaste = (area / 1000) * intensity * ageMultiplier * historyMultiplier * durationFactor;

      // Normalize ratios if they drifted
      const totalRatio = ratios.concrete + ratios.metal + ratios.wood;
      ratios.concrete /= totalRatio;
      ratios.metal /= totalRatio;
      ratios.wood /= totalRatio;

      setFormData(prev => ({
        ...prev,
        concrete: Math.round(totalEstWaste * ratios.concrete),
        metal: Math.round(totalEstWaste * ratios.metal),
        wood: Math.round(totalEstWaste * ratios.wood),
      }));
      
      setAiReasoning(reasons);
      setIsPredicting(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">New Project Profile</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <Stepper currentStep={step} steps={['Project Context', 'AI Forecasting', 'Baselines']} />

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Skyline Tower Phase 2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  />
                </div>
            </div>

            {/* Context Factors */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center">
                    <Layers className="w-4 h-4 mr-1" /> Contextual Factors
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Project Type</label>
                        <select 
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm"
                        >
                        <option value="Commercial Renovation">Commercial Renovation</option>
                        <option value="Demolition">Demolition</option>
                        <option value="New Construction">New Construction</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Phase</label>
                        <select 
                        value={formData.phase}
                        onChange={e => setFormData({...formData, phase: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm"
                        >
                        <option value="Demolition">Demolition & Strip-out</option>
                        <option value="Structural">Structural / Shell</option>
                        <option value="Fit-out">Interior Fit-out</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Building Year</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={formData.buildingYear}
                                onChange={e => setFormData({...formData, buildingYear: e.target.value})}
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg outline-none text-sm" 
                            />
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Historical Data</label>
                        <div className="relative">
                            <select 
                                value={formData.historicalData}
                                onChange={e => setFormData({...formData, historicalData: e.target.value})}
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm appearance-none"
                            >
                                <option value="none">None (Use Global Avg)</option>
                                <option value="similar_urban">Site Alpha (Urban)</option>
                                <option value="similar_industrial">Site Beta (Industrial)</option>
                            </select>
                            <History className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Floor Area (sq. ft)</label>
                <input 
                  type="number" 
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Months)</label>
                <input 
                  type="number" 
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
               <h3 className="font-semibold text-slate-800">Predicted Waste Streams</h3>
               <button 
                 onClick={handlePredict}
                 disabled={isPredicting}
                 className="flex items-center text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isPredicting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                 {isPredicting ? 'Analyzing...' : 'Run AI Prediction'}
               </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
               <div className="p-4 border border-slate-200 rounded-lg text-center bg-white shadow-sm">
                  <span className="block text-xs text-slate-500 uppercase font-semibold">Concrete</span>
                  <div className="relative">
                    <input 
                        type="number" 
                        value={formData.concrete}
                        onChange={e => setFormData({...formData, concrete: parseInt(e.target.value) || 0})}
                        className="mt-2 w-full text-center font-bold text-xl border-b border-slate-300 focus:border-green-500 outline-none pb-1 text-slate-800"
                    />
                  </div>
                  <span className="text-xs text-slate-400">tonnes</span>
               </div>
               <div className="p-4 border border-slate-200 rounded-lg text-center bg-white shadow-sm">
                  <span className="block text-xs text-slate-500 uppercase font-semibold">Metal</span>
                  <input 
                    type="number" 
                    value={formData.metal}
                    onChange={e => setFormData({...formData, metal: parseInt(e.target.value) || 0})}
                    className="mt-2 w-full text-center font-bold text-xl border-b border-slate-300 focus:border-green-500 outline-none pb-1 text-slate-800"
                  />
                  <span className="text-xs text-slate-400">tonnes</span>
               </div>
               <div className="p-4 border border-slate-200 rounded-lg text-center bg-white shadow-sm">
                  <span className="block text-xs text-slate-500 uppercase font-semibold">Wood</span>
                  <input 
                    type="number" 
                    value={formData.wood}
                    onChange={e => setFormData({...formData, wood: parseInt(e.target.value) || 0})}
                    className="mt-2 w-full text-center font-bold text-xl border-b border-slate-300 focus:border-green-500 outline-none pb-1 text-slate-800"
                  />
                  <span className="text-xs text-slate-400">tonnes</span>
               </div>
            </div>

            {aiReasoning.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-indigo-800 uppercase flex items-center mb-2">
                        <Info className="w-4 h-4 mr-1.5" /> Prediction Insights
                    </h4>
                    <ul className="space-y-1.5">
                        {aiReasoning.map((reason, idx) => (
                            <li key={idx} className="text-xs text-indigo-700 flex items-start">
                                <span className="mr-2">•</span> {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${formData.hazmat ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
               <input 
                 type="checkbox" 
                 checked={formData.hazmat} 
                 onChange={e => setFormData({...formData, hazmat: e.target.checked})}
                 className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
               />
               <div>
                  <label className="block text-sm font-medium text-slate-900">Hazardous Material Risk</label>
                  <p className="text-xs text-slate-500">
                    {formData.hazmat ? "Flagged: Age or context indicates Asbestos/Lead risk." : "No significant risk detected."}
                  </p>
               </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Save className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Ready to Initialize</h3>
            <p className="text-slate-600 max-w-sm mx-auto">
              Based on your profile, we've set a baseline diversion target of <strong className="text-slate-900">85%</strong>.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg text-left max-w-sm mx-auto text-sm space-y-2">
               <div className="flex justify-between">
                 <span className="text-slate-500">Total Est. Volume:</span>
                 <span className="font-medium">{formData.concrete + formData.metal + formData.wood} tonnes</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-500">Building Year:</span>
                 <span className="font-medium">{formData.buildingYear}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-500">Compliance Region:</span>
                 <span className="font-medium">Global (Standard)</span>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
         {step > 1 && (
           <button 
             onClick={() => setStep(step - 1)}
             className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
           >
             Back
           </button>
         )}
         <button 
           onClick={() => step < 3 ? setStep(step + 1) : onComplete()}
           className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium transition-colors flex items-center"
         >
           {step < 3 ? 'Continue' : 'Create Project'}
           {step < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
         </button>
      </div>
    </div>
  );
};

// --- Workflow 2: Waste Tracking Workflow (Manifesting) ---

export const WasteTrackingWorkflow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [manifestId, setManifestId] = useState('');
  
  // Smart Defaults State
  const [loadData, setLoadData] = useState({
    material: 'Concrete',
    weight: '12.4',
    hauler: 'EcoHaul Logistics (Preferred)',
    destination: 'City Recycling Center #4 (3.2 miles)'
  });

  const generateManifest = () => {
    setLoading(true);
    setTimeout(() => {
      setManifestId(`MNF-${Math.floor(Math.random() * 10000)}`);
      setStep(3);
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setStep(1);
    setManifestId('');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">New Waste Manifest</h2>
            <p className="text-xs text-slate-400">Site Alpha • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6">
          <Stepper currentStep={step} steps={['Load Details', 'Logistics', 'Manifest']} />

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Material Stream</label>
                 <div className="grid grid-cols-2 gap-3">
                    {['Concrete', 'Metal', 'Mixed', 'Wood'].map(m => (
                      <button 
                        key={m}
                        onClick={() => setLoadData({...loadData, material: m})}
                        className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                          loadData.material === m 
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Net Weight (Tonnes)</label>
                 <div className="relative">
                   <input 
                     type="number" 
                     value={loadData.weight}
                     onChange={e => setLoadData({...loadData, weight: e.target.value})}
                     className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-lg font-mono font-medium"
                   />
                   <div className="absolute left-4 top-3.5 text-slate-400">
                     <Scale className="w-5 h-5" />
                   </div>
                   <div className="absolute right-4 top-2">
                      <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-1 rounded uppercase tracking-wide">
                        IoT Live
                      </span>
                   </div>
                 </div>
                 <p className="text-xs text-slate-500 mt-2 ml-1">
                   Reading from Gate A Scale • calibrated 2 days ago.
                 </p>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start space-x-3 mb-4">
                   <Truck className="w-5 h-5 text-slate-500 mt-0.5" />
                   <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Hauler</label>
                      <select 
                        value={loadData.hauler}
                        onChange={e => setLoadData({...loadData, hauler: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none"
                      >
                        <option>EcoHaul Logistics (Preferred)</option>
                        <option>City Waste Services</option>
                        <option>Site Fleet #4</option>
                      </select>
                   </div>
                </div>
                <div className="flex items-start space-x-3">
                   <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                   <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Destination</label>
                      <select 
                        value={loadData.destination}
                        onChange={e => setLoadData({...loadData, destination: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none"
                      >
                         <option>City Recycling Center #4 (3.2 miles)</option>
                         <option>Regional Landfill (15.4 miles)</option>
                         <option>Recovery Yard B (8.1 miles)</option>
                      </select>
                      <p className="text-xs text-green-600 mt-1 flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Approved Facility
                      </p>
                   </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                 <h4 className="text-sm font-medium text-slate-800 mb-2">Proof of Origin</h4>
                 <div className="h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-400 cursor-pointer transition-colors">
                    <ClipboardCheck className="w-6 h-6 mb-2" />
                    <span className="text-xs">Tap to verify manifest</span>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center animate-fade-in py-4">
              <div className="w-32 h-32 bg-white p-2 mx-auto mb-4 border border-slate-200 rounded-lg shadow-sm">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${manifestId}`} alt="QR" className="w-full h-full" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{manifestId}</h3>
              <p className="text-green-600 font-medium mb-6">Manifest Generated Successfully</p>
              
              <div className="bg-slate-50 rounded-lg p-4 text-left text-sm space-y-2 mb-6">
                 <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Material</span>
                    <span className="font-semibold">{loadData.material}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Weight</span>
                    <span className="font-semibold">{loadData.weight} t</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Hauler</span>
                    <span className="font-semibold truncate w-32 text-right">{loadData.hauler}</span>
                 </div>
              </div>

              <button onClick={handleReset} className="text-slate-500 hover:text-slate-800 text-sm font-medium">
                 Start New Load
              </button>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
           {step < 3 ? (
             <div className="flex space-x-3">
               {step > 1 && (
                 <button onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-white transition-colors">
                   Back
                 </button>
               )}
               <button 
                 onClick={() => step === 2 ? generateManifest() : setStep(step + 1)}
                 disabled={loading}
                 className="flex-1 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-md transition-all flex justify-center items-center"
               >
                 {loading ? <span className="animate-pulse">Processing...</span> : step === 2 ? 'Generate Manifest' : 'Continue'}
               </button>
             </div>
           ) : (
             <button className="w-full py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 shadow-md transition-all">
               Print Ticket
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
