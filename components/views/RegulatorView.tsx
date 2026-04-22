import React, { useState } from 'react';
import { 
  Building2, Map, ShieldAlert, FileSignature, AlertOctagon, 
  Settings, ArrowRight, Eye, TriangleAlert, CheckCircle, Search
} from 'lucide-react';

const StepWizard = ({ steps, currentStep }: { steps: string[], currentStep: number }) => (
  <div className="flex items-center justify-between w-full mb-8 relative">
    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
    <div className="absolute left-0 top-1/2 h-0.5 bg-red-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
    {steps.map((label, i) => (
      <div key={label} className="flex flex-col items-center bg-slate-50 px-2 transition-all">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${i <= currentStep ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30' : 'bg-white text-slate-400 border-slate-300'}`}>
          {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
        </div>
        <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-red-700' : 'text-slate-400'}`}>{label}</span>
      </div>
    ))}
  </div>
);

const RegulatorView = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'dashboard' | 'compliance' | 'permits' | 'simulator'>('dashboard');
  const [step, setStep] = useState(0);

  const navigateTo = (workflow: any) => {
     setActiveWorkflow(workflow);
     setStep(0);
  };

  if (activeWorkflow === 'compliance') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <ShieldAlert className="w-6 h-6 mr-3 text-red-600" /> Smart Enforcement System
            </h2>
            <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
        </div>

        <div className="card-premium p-8">
           <StepWizard steps={["Violation Detected", "Issue Notice", "Assign Inspection"]} currentStep={step} />
           
           {step === 0 && (
              <div className="text-center animate-fade-in">
                 <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-left max-w-lg mx-auto shadow-sm mb-6">
                    <p className="text-xs text-red-600 font-bold uppercase mb-2 flex items-center"><TriangleAlert className="w-4 h-4 mr-1" /> NEMA Act Violation (Sec 14)</p>
                    <p className="font-bold text-slate-900 border-b border-red-100 pb-2 mb-2">Truck T04 (Hazmat Load 88A) Deviated from route by &gt;5km.</p>
                    <p className="text-sm text-slate-700 italic bg-white p-3 rounded border border-red-100">Live AI tracking indicates vessel entered residential sector D without proper clearance.</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                     <button onClick={() => setStep(1)} className="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500">Draft Stop Order</button>
                     <button className="btn-secondary">Dismiss Alert</button>
                 </div>
              </div>
           )}
           {step === 1 && (
              <div className="text-center animate-fade-in">
                 <div className="bg-slate-900 rounded-xl p-6 text-left max-w-lg mx-auto mb-6 shadow-xl">
                    <h3 className="font-bold text-white mb-4">Official Warning Draft</h3>
                    <div className="bg-slate-800 p-4 rounded font-mono text-xs text-red-400 space-y-2 border-l-2 border-red-500">
                       <p>[SYSTEM_GENERATED]</p>
                       <p>To: Logistics Corp LTD</p>
                       <p>Ref: Transport Incident SEC-D</p>
                       <p>Failure to halt operation immediately will result in impoundment under environmental act...</p>
                    </div>
                 </div>
                 <div><button onClick={() => setStep(2)} className="btn-primary w-full max-w-lg">Issue Notice & Pre-Assign Inspector</button></div>
              </div>
           )}
           {step === 2 && (
              <div className="py-12 animate-fade-in text-center">
                 <ShieldAlert className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-800 mb-2">Enforcement Active</h3>
                 <p className="text-slate-500 mb-6 text-sm">Notice transmitted. Area Inspector #44 deployed to coordinates.</p>
                 <button onClick={() => navigateTo('dashboard')} className="btn-secondary">Return to National View</button>
              </div>
           )}
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-premium p-6 bg-red-50 border border-red-100 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1" onClick={() => navigateTo('compliance')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-red-800 uppercase tracking-wide font-bold">Active Violations</p>
                 <h3 className="text-3xl font-data font-bold text-red-600 mt-2">14</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg text-red-700"><AlertOctagon className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-red-700 mt-4 font-bold bg-red-200/50 px-2 py-1 text-center shadow-sm rounded">Open Enforcement UI &rarr;</p>
        </div>

        <div className="card-premium p-6 bg-white flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-transform">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wide font-bold">Pending Permits</p>
                 <h3 className="text-3xl font-data font-bold text-slate-900 mt-2">42</h3>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><FileSignature className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-slate-500 mt-4 font-bold flex items-center bg-slate-100 px-2 py-1 rounded">Auto-Validating...</p>
        </div>
      </div>
    </div>
  );
};

export default RegulatorView;
