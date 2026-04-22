import React, { useState } from 'react';
import { 
  Factory, Eye, TestTube, Box, DollarSign, Store, ArrowRight,
  TrendingDown, TrendingUp, RefreshCw, CheckCircle, Scan, MapPin, Search
} from 'lucide-react';

const StepWizard = ({ steps, currentStep }: { steps: string[], currentStep: number }) => (
  <div className="flex items-center justify-between w-full mb-8 relative">
    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
    <div className="absolute left-0 top-1/2 h-0.5 bg-purple-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
    {steps.map((label, i) => (
      <div key={label} className="flex flex-col items-center bg-slate-50 px-2 transition-all">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${i <= currentStep ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/30' : 'bg-white text-slate-400 border-slate-300'}`}>
          {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
        </div>
        <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-purple-700' : 'text-slate-400'}`}>{label}</span>
      </div>
    ))}
  </div>
);

const RecyclerView = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'dashboard' | 'intake' | 'inventory' | 'matcher'>('dashboard');
  const [step, setStep] = useState(0);

  const navigateTo = (workflow: any) => {
     setActiveWorkflow(workflow);
     setStep(0);
  };

  if (activeWorkflow === 'intake') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-purple-600" /> Intelligent Intake System
            </h2>
            <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
        </div>

        <div className="card-premium p-8">
           <StepWizard steps={["AI Classification", "Quality Analysis", "Line Assignment", "Log Storage"]} currentStep={step} />
           
           {step === 0 && (
              <div className="text-center py-6 animate-fade-in">
                 <div className="bg-slate-900 border-4 border-slate-700 w-full max-w-md mx-auto aspect-video rounded-xl relative overflow-hidden flex items-center justify-center mb-6">
                    <Scan className="w-16 h-16 text-purple-400 animate-pulse relative z-10" />
                    <div className="absolute inset-0 bg-purple-500/10 z-0"></div>
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] uppercase px-2 py-1 font-mono rounded">CV_CAM_BAY_1</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block w-full max-w-md text-left">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Optical Sorting Result (Job TRK-842)</p>
                    <p className="text-lg font-bold text-slate-800">Mixed Concrete & Embedded Rebar</p>
                 </div>
                 <div className="mt-6"><button onClick={() => setStep(1)} className="btn-primary max-w-md w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">Run Material Safety Analysis</button></div>
              </div>
           )}
           {step === 1 && (
              <div className="text-center py-6 animate-fade-in">
                 <h3 className="text-xl font-bold text-slate-800 mb-6">Contamination Report</h3>
                 <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                       <p className="text-xs text-green-700 uppercase font-bold text-left mb-2">Organic Trace</p>
                       <p className="text-2xl font-bold text-green-600">4%</p>
                       <p className="text-[10px] text-green-600">Pass: Below 5% Limit</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                       <p className="text-xs text-green-700 uppercase font-bold text-left mb-2">Hazardous Elements</p>
                       <p className="text-2xl font-bold text-green-600">0%</p>
                       <p className="text-[10px] text-green-600">Pass: Clean</p>
                    </div>
                 </div>
                 <button onClick={() => setStep(2)} className="btn-primary max-w-lg w-full bg-slate-900 border-none shadow-xl">Approve Clean Grade</button>
              </div>
           )}
           {step === 2 && (
              <div className="text-center py-6 animate-fade-in">
                 <h3 className="text-xl font-bold text-slate-800 mb-6">Assign Sorting Line</h3>
                 <div className="max-w-md mx-auto space-y-3">
                    <button onClick={() => setStep(3)} className="w-full bg-white border-2 border-slate-200 p-4 rounded-xl hover:border-purple-500 focus:border-purple-500 text-left transition-colors group">
                       <p className="font-bold text-slate-800 flex justify-between">Secondary Crusher Line B <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500" /></p>
                       <p className="text-xs text-slate-500 mt-1">Recommended. Extracts rebar electromagnetically.</p>
                    </button>
                    <button className="w-full bg-white border border-slate-200 p-4 rounded-xl hover:bg-slate-50 text-left transition-colors opacity-60">
                       <p className="font-bold text-slate-700">Storage Pile C (Holding)</p>
                       <p className="text-xs text-slate-500 mt-1">Crushers currently at capacity.</p>
                    </button>
                 </div>
              </div>
           )}
           {step === 3 && (
              <div className="text-center py-12 animate-fade-in">
                 <Factory className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-800 mb-2">Intake Allocated & Operating</h3>
                 <p className="text-slate-500 mb-6 text-sm">Material routed to Line B. Output will automatically log to Marketplace Inventory upon completion.</p>
                 <button onClick={() => navigateTo('dashboard')} className="btn-secondary">Return to facility overview</button>
              </div>
           )}
        </div>
      </div>
    );
  }

  if (activeWorkflow === 'inventory') {
     return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                 <Store className="w-6 h-6 mr-3 text-emerald-600" /> Marketplace & Pricing Engine
               </h2>
               <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
           </div>
           
           <div className="card-premium p-8 border-t-4 border-emerald-500">
              <StepWizard steps={["Inventory Selection", "Dynamic Pricing AI", "Publish & Distribute"]} currentStep={step} />
              
              {step === 0 && (
                 <div className="text-center animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Select Product to List</h3>
                    <div className="max-w-lg mx-auto space-y-3 relative text-left">
                       <button onClick={() => setStep(1)} className="w-full bg-white border-2 border-emerald-500 shadow-md p-4 rounded-xl hover:bg-emerald-50 text-left transition-colors">
                          <div className="flex justify-between items-center mb-1">
                             <p className="font-bold text-slate-800">Clean Concrete Aggregate</p>
                             <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">High Demand</span>
                          </div>
                          <p className="text-sm font-data font-bold text-emerald-600">Stock: 450t Ready</p>
                       </button>
                       <button className="w-full bg-white border border-slate-200 p-4 rounded-xl text-left opacity-70 cursor-not-allowed">
                          <p className="font-bold text-slate-600">Scrap Metal</p>
                          <p className="text-sm text-slate-500">Stock: 85t (Pre-sold to foundry)</p>
                       </button>
                    </div>
                 </div>
              )}
              {step === 1 && (
                 <div className="text-center animate-fade-in">
                    <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 inline-block w-full max-w-lg mb-6 shadow-sm">
                       <DollarSign className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                       <h3 className="font-bold text-emerald-900 border-b border-emerald-200 pb-2 mb-4">AI Pricing Recommendation</h3>
                       <div className="grid grid-cols-2 gap-4 text-left">
                          <div>
                             <p className="text-xs text-emerald-700 uppercase font-bold">Standard Base Rate</p>
                             <p className="text-xl font-bold text-slate-500 line-through decoration-red-500">R80/t</p>
                          </div>
                          <div>
                             <p className="text-xs text-emerald-700 uppercase font-bold">Computed Premium Rate</p>
                             <p className="text-3xl font-data font-black text-emerald-600">R85/t</p>
                          </div>
                       </div>
                       <p className="text-xs text-emerald-800 mt-4 bg-white p-2 rounded shadow-sm">Reasoning: Cape Town Metro construction activity is up 12%. Aggregate supply from competitors is limited this week.</p>
                    </div>
                    <div><button onClick={() => setStep(2)} className="btn-primary w-full max-w-lg bg-slate-900 border-none shadow-xl">Approve AI Price & Select All 450t</button></div>
                 </div>
              )}
              {step === 2 && (
                 <div className="text-center py-12 animate-fade-in">
                    <Store className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Live on EDGE Marketplace</h3>
                    <p className="text-slate-500 mb-6 text-sm">Targeted procurement nodes on the platform have been notified of your stock availability.</p>
                    <button onClick={() => navigateTo('dashboard')} className="btn-secondary">Back to Dashboard</button>
                 </div>
              )}
           </div>
        </div>
     );
  }

  if (activeWorkflow === 'matcher') {
     return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                 <RefreshCw className="w-6 h-6 mr-3 text-blue-600" /> Circular Supply Matcher
               </h2>
               <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
           </div>
           
           <div className="card-premium p-8">
              <StepWizard steps={["Match Identified", "Accept Terms", "Schedule Logistics"]} currentStep={step} />
              
              {step === 0 && (
                 <div className="animate-fade-in">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center max-w-lg mx-auto">
                       <MapPin className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                       <h3 className="font-bold text-blue-900 mb-4">Urgent Supply Request Matched</h3>
                       <div className="bg-white p-4 rounded shadow-sm text-left border border-slate-100">
                          <p className="text-xs text-blue-600 font-bold uppercase mb-1">Buyer: Skyline Tower Build (Site Manager)</p>
                          <p className="font-bold text-slate-800">Requires 300t Reclaimed Aggregate</p>
                          <p className="text-sm font-data text-blue-700 mt-2">Bidding R87/t (Above Ask)</p>
                          <p className="text-xs text-slate-500 mt-1">Need delivery by Aug 14th</p>
                       </div>
                    </div>
                    <div className="text-center mt-6">
                       <button onClick={() => setStep(1)} className="btn-primary max-w-lg w-full bg-blue-600 hover:bg-blue-700">Review Term Sheet</button>
                    </div>
                 </div>
              )}
              {step === 1 && (
                 <div className="animate-fade-in text-center">
                    <div className="bg-white border rounded-xl p-6 text-left max-w-lg mx-auto mb-6 font-mono text-sm shadow-sm">
                       <p className="text-xs text-slate-400 mb-2">// BLOCKCHAIN ESCROW PRE-AUTH</p>
                       <p>- BUYER: SKYLINE CONSTRUCTS</p>
                       <p>- SELLER: METRO RECYCLING</p>
                       <p>- COMMODITY: 300T AGGREGATE A-GRADE</p>
                       <p>- TOTAL VALUE: R26,100</p>
                       <p className="font-bold text-green-600 mt-4 border-t pt-2">FUNDS SECURED IN SMART CONTRACT</p>
                    </div>
                    <button onClick={() => setStep(2)} className="btn-primary max-w-lg w-full bg-slate-900 border-none shadow-xl">Accept Deal & Complete Transaction</button>
                 </div>
              )}
              {step === 2 && (
                 <div className="py-12 animate-fade-in text-center">
                    <Truck className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Deal Finalized. Transporters Notified.</h3>
                    <p className="text-slate-500 mb-6 text-sm">Contract deployed to ledger. Verified jobs generated in the Transporter network dispatch board.</p>
                    <button onClick={() => navigateTo('dashboard')} className="btn-secondary">Close Flow</button>
                 </div>
              )}
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-premium p-6 bg-purple-50 border border-purple-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1" onClick={() => navigateTo('intake')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-purple-800 uppercase tracking-wide font-bold">Active Processing</p>
                 <h3 className="text-2xl font-data font-bold text-purple-700 mt-2">Intake Hub</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700"><Eye className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-purple-700 mt-4 font-bold bg-purple-200/50 px-2 py-1 text-center shadow-sm rounded">Open Intake Control &rarr;</p>
        </div>
        
        <div className="card-premium p-6 bg-emerald-50 border border-emerald-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1" onClick={() => navigateTo('inventory')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-emerald-800 uppercase tracking-wide font-bold">List to Marketplace</p>
                 <h3 className="text-xl font-data font-bold text-emerald-700 mt-2">Set AI Pricing</h3>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700"><Store className="w-5 h-5" /></div>
           </div>
           <p className="text-[10px] text-emerald-800 mt-4 font-bold bg-emerald-200/50 px-2 py-1 text-center shadow-sm rounded uppercase">Dynamic Pricing Engine &rarr;</p>
        </div>

        <div className="card-premium p-6 bg-blue-50 border border-blue-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1" onClick={() => navigateTo('matcher')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-blue-800 uppercase tracking-wide font-bold">Circular Matcher</p>
                 <h3 className="text-xl font-bold text-blue-700 mt-2">+1 Match Found</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700"><Search className="w-5 h-5" /></div>
           </div>
           <p className="text-[10px] text-blue-800 mt-4 font-bold bg-blue-200/50 px-2 py-1 text-center shadow-sm rounded uppercase">Review Buyer Bid &rarr;</p>
        </div>

        <div className="card-premium p-6 bg-white flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg Grade</p>
                 <h3 className="text-3xl font-data font-bold text-slate-900 mt-2">A-</h3>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><TestTube className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-slate-500 mt-4 flex items-center">Scan: 4% contamination</p>
        </div>
      </div>
      
      <div className="card-premium p-6">
         <h3 className="font-bold text-slate-800 mb-4">Inventory Breakdown</h3>
         <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
             <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-medium text-slate-800">Clean Concrete Aggregate</span>
                <span className="font-data font-bold text-emerald-600">450t <span className="font-sans font-normal text-xs text-slate-400">(Ready to sell)</span></span>
             </div>
             <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-medium text-slate-800">Mixed Rubble (Pre-sort)</span>
                <span className="font-data font-bold text-slate-600">120t <span className="font-sans font-normal text-xs text-slate-400">(Queued Line A)</span></span>
             </div>
             <div className="flex justify-between py-2">
                <span className="font-medium text-slate-800">Scrap Metal</span>
                <span className="font-data font-bold text-slate-600">85t</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default RecyclerView;
