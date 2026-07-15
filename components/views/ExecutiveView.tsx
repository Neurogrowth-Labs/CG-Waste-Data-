import React, { useState } from 'react';
import { 
  Building2, TrendingUp, Cpu, Activity, Globe, ArrowRight, 
  MapPin, AlertTriangle, ShieldCheck, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StepWizard = ({ steps, currentStep }: { steps: string[], currentStep: number }) => (
  <div className="flex items-center justify-between w-full mb-8 relative">
    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
    <div className="absolute left-0 top-1/2 h-0.5 bg-indigo-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
    {steps.map((label, i) => (
      <div key={label} className="flex flex-col items-center bg-slate-50 px-2 transition-all">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${i <= currentStep ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-400 border-slate-300'}`}>
          {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
        </div>
        <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-indigo-700' : 'text-slate-400'}`}>{label}</span>
      </div>
    ))}
  </div>
);

const ExecutiveView = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'dashboard' | 'digitalTwin' | 'esg' | 'leakage' | 'greenCopilot'>('dashboard');
  const [step, setStep] = useState(0);

  const navigateTo = (workflow: any) => {
     setActiveWorkflow(workflow);
     setStep(0);
  };

  if (activeWorkflow === 'digitalTwin') {
    return (
       <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                 <Cpu className="w-6 h-6 mr-3 text-indigo-600" /> Digital Twin & AI Forecast Engine
               </h2>
               <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
           </div>
           
           <div className="card-premium p-8">
              <StepWizard steps={["Run Simulation", "Compare Scenarios", "Select Best Option", "Apply to Project"]} currentStep={step} />
              
              {step === 0 && (
                 <div className="text-center animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 mb-6 relative overflow-hidden">
                       <Cpu className="w-24 h-24 text-indigo-500/20 absolute -bottom-6 -right-6" />
                       <h3 className="font-bold text-white mb-2 relative z-10">BIM Integration Active</h3>
                       <p className="text-sm text-slate-400 mb-6 relative z-10">Simulating long-term impact of adopting pre-cast concrete walls on Phase 3 construction.</p>
                       <div className="flex space-x-3 relative z-10 justify-center">
                          <span className="bg-white/10 px-3 py-1 rounded text-xs text-white">Adjusting tolerances...</span>
                          <span className="bg-white/10 px-3 py-1 rounded text-xs text-white">Recalculating overages...</span>
                       </div>
                    </div>
                    <div><button onClick={() => setStep(1)} className="btn-primary w-full max-w-md bg-indigo-600 hover:bg-indigo-700">Compile Forecast Projection</button></div>
                 </div>
              )}
              {step === 1 && (
                 <div className="animate-fade-in">
                    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                       <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center opacity-60">
                          <p className="text-xs text-slate-500 font-bold uppercase mb-2">Scenario A (Current)</p>
                          <p className="text-xl font-bold text-slate-800">Standard Pour</p>
                          <p className="text-sm font-data text-red-500 mt-2">Predicted Waste: 1,200t</p>
                       </div>
                       <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-center shadow-lg transform scale-105">
                          <p className="text-xs text-indigo-600 font-bold uppercase mb-2">Scenario B (Simulated)</p>
                          <p className="text-xl font-bold text-indigo-900">Pre-cast Transition</p>
                          <p className="text-sm font-data text-green-600 mt-2">Predicted Waste: 980t</p>
                          <p className="text-[10px] text-indigo-700 font-bold bg-indigo-100 mt-2 py-1 rounded">-18% Reduction // +R320k ROI</p>
                       </div>
                    </div>
                    <div className="text-center"><button onClick={() => setStep(2)} className="btn-primary w-full max-w-md bg-indigo-600 hover:bg-indigo-700">Select Scenario B</button></div>
                 </div>
              )}
              {step === 2 && (
                 <div className="text-center py-6 animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 font-mono">Pushing changes to live project...</h3>
                    <div className="bg-slate-100 p-4 rounded-xl max-w-md mx-auto text-left border border-slate-200 mb-6">
                       <p className="text-sm flex items-center mb-2"><CheckCircle className="w-4 h-4 text-green-500 mr-2"/> Updating CAD variables</p>
                       <p className="text-sm flex items-center mb-2"><CheckCircle className="w-4 h-4 text-green-500 mr-2"/> Re-writing procurement bill</p>
                       <p className="text-sm flex items-center"><CheckCircle className="w-4 h-4 text-slate-400 mr-2 animate-pulse"/> Notifying Project Manager...</p>
                    </div>
                    <button onClick={() => setStep(3)} className="btn-primary w-full max-w-md bg-slate-900 border-none shadow-xl">Confirm & Finalize Sync</button>
                 </div>
              )}
              {step === 3 && (
                 <div className="py-12 animate-fade-in text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Teams Notified Successfully</h3>
                    <p className="text-slate-500 mb-6 text-sm">Site Manager and Procurement have received updated specifications.</p>
                    <button onClick={() => navigateTo('dashboard')} className="btn-secondary">Close Forecast</button>
                 </div>
              )}
           </div>
       </div>
    );
  }

  if (activeWorkflow === 'greenCopilot') {
     return (
       <div className="space-y-6 animate-fade-in max-w-4xl mx-auto flex flex-col h-[600px]">
         <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-800 flex items-center">
               <Activity className="w-6 h-6 mr-3 text-[#1F7A5B]" /> Green AI Copilot
             </h2>
             <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Exit</button>
         </div>
         <div className="card-premium flex-1 flex flex-col p-0 overflow-hidden outline outline-2 outline-indigo-500 outline-offset-2">
            <div className="flex-1 bg-slate-50 p-6 overflow-y-auto font-mono text-sm space-y-6">
               <div className="flex flex-col items-end">
                  <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-md shadow-sm">
                     "How do I reduce our current waste leakage on the Eastern Cape project?"
                  </div>
               </div>
               <div className="flex flex-col items-start">
                  <div className="bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm max-w-lg shadow-sm">
                     <p className="mb-3">I've analyzed the live data matrix. Here are the top actions you can take immediately:</p>
                     <div className="space-y-2">
                        <button className="w-full text-left bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-2 rounded text-indigo-800 font-sans font-bold text-xs flex justify-between items-center transition-colors">
                           1. Run BIM Material Optimization (Wood +12% overage) <ArrowRight className="w-3 h-3" />
                        </button>
                        <button className="w-full text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-2 rounded text-emerald-800 font-sans font-bold text-xs flex justify-between items-center transition-colors">
                           2. Schedule Emergency Transport to Recycler (+R4k saving) <ArrowRight className="w-3 h-3" />
                        </button>
                        <button className="w-full text-left bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded text-slate-800 font-sans font-bold text-xs flex justify-between items-center transition-colors" onClick={() => navigateTo('leakage')}>
                           3. View Full Cost Leakage Alert Breakdown <ArrowRight className="w-3 h-3" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
               <div className="relative">
                  <input type="text" placeholder="Type your strategic query..." className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none pr-12" />
                  <button className="absolute right-2 top-1.5 p-2 text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"><ArrowRight className="w-4 h-4" /></button>
               </div>
            </div>
         </div>
       </div>
     );
  }

  // Dashboard View
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-premium p-6 bg-indigo-50 border border-indigo-100 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1" onClick={() => navigateTo('digitalTwin')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-indigo-800 uppercase tracking-wide font-bold">Predictive Model</p>
                 <h3 className="text-xl font-data font-bold text-indigo-700 mt-2">Digital Twin</h3>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700"><Cpu className="w-5 h-5" /></div>
           </div>
           <p className="text-[10px] text-indigo-800 mt-4 font-bold bg-indigo-200/50 px-2 py-1 text-center shadow-sm rounded uppercase">Run BIM Forecasts &rarr;</p>
        </div>
        
        <div className="card-premium p-6 bg-slate-900 border border-slate-800 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1 group" onClick={() => navigateTo('greenCopilot')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide font-bold">Universal AI</p>
                 <h3 className="text-xl font-data font-bold text-white mt-2">Green Copilot</h3>
              </div>
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Activity className="w-5 h-5 group-hover:animate-pulse" /></div>
           </div>
           <p className="text-[10px] text-black mt-4 font-bold bg-emerald-400 px-2 py-1 text-center shadow-sm rounded uppercase">Ask AI a Question &rarr;</p>
        </div>

        <div className="card-premium p-6 bg-white flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">ESG Score</p>
                 <h3 className="text-3xl font-data font-bold text-slate-900 mt-2">A+</h3>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-teal-600"><Globe className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-slate-500 mt-4">Blockchain verified ledgers</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveView;
