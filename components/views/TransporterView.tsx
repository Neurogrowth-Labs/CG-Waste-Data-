import React, { useState } from 'react';
import { 
  Truck, Navigation, MapPin, Scale, FileText, DollarSign, 
  ArrowUpRight, Clock, AlertTriangle, TrendingUp, CheckCircle, Search, Map
} from 'lucide-react';

const StepWizard = ({ steps, currentStep }: { steps: string[], currentStep: number }) => (
  <div className="flex items-center justify-between w-full mb-8 relative">
    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
    <div className="absolute left-0 top-1/2 h-0.5 bg-blue-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
    {steps.map((label, i) => (
      <div key={label} className="flex flex-col items-center bg-slate-50 px-2 transition-all">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${i <= currentStep ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30' : 'bg-white text-slate-400 border-slate-300'}`}>
          {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
        </div>
        <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-blue-700' : 'text-slate-400'}`}>{label}</span>
      </div>
    ))}
  </div>
);

const TransporterView = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'dashboard' | 'routing' | 'weighbridge' | 'revenue'>('dashboard');
  const [step, setStep] = useState(0);

  const navigateTo = (workflow: any) => {
     setActiveWorkflow(workflow);
     setStep(0);
  };

  if (activeWorkflow === 'routing') {
     return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                 <Navigation className="w-6 h-6 mr-3 text-blue-600" /> Smart Logistics Routing Engine
               </h2>
               <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Back</button>
           </div>
           
           <div className="card-premium p-8">
              <StepWizard steps={["Pickup Specs", "Optimize Route", "Navigate & Track", "Confirm Delivery"]} currentStep={step} />
              
              {step === 0 && (
                 <div className="text-center animate-fade-in">
                    <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 inline-block text-left w-full max-w-md">
                       <p className="text-xs font-bold text-slate-500 uppercase">Job Allocation: #TRK-842</p>
                       <h3 className="text-lg font-bold text-slate-900 mt-1 mb-4">18 Tons Demolition Concrete</h3>
                       <p className="text-sm"><strong>From:</strong> Site Alpha (Zone B)</p>
                       <p className="text-sm"><strong>To:</strong> Metro Recycling Plant</p>
                       <p className="text-sm mt-2 text-slate-500 italic">Expected load time: 10:30 AM</p>
                    </div>
                    <div className="mt-6"><button onClick={() => setStep(1)} className="btn-primary w-full max-w-md bg-blue-600 hover:bg-blue-700 focus:ring-blue-500">Calculate Optimal Route</button></div>
                 </div>
              )}
              {step === 1 && (
                 <div className="text-center animate-fade-in">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 inline-block w-full max-w-lg mb-6 shadow-sm">
                       <Map className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                       <h3 className="font-bold text-blue-900">AI Route Optimization Complete</h3>
                       <p className="text-sm text-blue-800 mt-2">Bypassing heavy traffic on N1 highway. Re-routed via M4.</p>
                       <div className="flex justify-center space-x-4 mt-4">
                          <div className="bg-white px-3 py-2 rounded-lg border border-blue-100"><span className="text-xs text-slate-500 block">Est Time</span><span className="font-bold text-slate-800">45 Mins</span></div>
                          <div className="bg-white px-3 py-2 rounded-lg border border-blue-100"><span className="text-xs text-slate-500 block">Fuel Predicted</span><span className="font-bold text-green-600">-22% cost</span></div>
                       </div>
                    </div>
                    <div><button onClick={() => setStep(2)} className="btn-primary w-full max-w-md bg-blue-600 hover:bg-blue-700">Start Navigation</button></div>
                 </div>
              )}
              {step === 2 && (
                 <div className="text-center animate-fade-in">
                    <div className="relative w-full max-w-lg mx-auto h-48 bg-slate-200 rounded-xl overflow-hidden shadow-inner mb-6 flex items-center justify-center border border-slate-300">
                       <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                       <Truck className="w-10 h-10 text-blue-600 animate-bounce relative z-10" />
                       <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 font-bold text-sm text-slate-800 shadow rounded">In Transit (45km/h)</div>
                    </div>
                    <div><button onClick={() => setStep(3)} className="btn-primary w-full max-w-md bg-green-600 hover:bg-green-700">Arrived at Destination</button></div>
                 </div>
              )}
              {step === 3 && (
                 <div className="text-center animate-fade-in py-12">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Job Logged & Delivery Confirmed</h3>
                   <p className="text-slate-500 mb-8">Data synced with central dashboard. Ready for next allocation.</p>
                   <button onClick={() => navigateTo('dashboard')} className="btn-secondary">Close Job Workflow</button>
                 </div>
              )}
           </div>
        </div>
     );
  }

  if (activeWorkflow === 'weighbridge') {
     return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                 <Scale className="w-6 h-6 mr-3 text-green-600" /> Digital Weighbridge Flow
               </h2>
               <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
           </div>
           
           <div className="card-premium p-8 text-center bg-slate-900 text-white shadow-xl">
              {step === 0 && (
                 <div className="py-8 animate-fade-in">
                    <Scale className="w-16 h-16 text-slate-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-400 font-mono mb-2">Awaiting Scale IoT Data...</p>
                    <button onClick={() => setStep(1)} className="px-4 py-2 mt-4 bg-white/10 hover:bg-white/20 text-white rounded transition text-sm">Simulate Truck Drive On</button>
                 </div>
              )}
              {step === 1 && (
                 <div className="py-8 animate-fade-in">
                    <p className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-4">Live Scale Reading</p>
                    <div className="text-7xl font-data font-black text-green-400 tracking-tighter shrink-0 mb-2">
                       18.4 <span className="text-3xl text-slate-500">t</span>
                    </div>
                    <p className="text-green-400 font-bold mb-6 flex justify-center items-center"><CheckCircle className="w-4 h-4 mr-1"/> Weight Stable</p>
                    <button onClick={() => setStep(2)} className="px-6 py-3 bg-green-500 hover:bg-green-600 font-bold text-white rounded-lg shadow-lg">Validate & Record</button>
                 </div>
              )}
              {step === 2 && (
                 <div className="py-8 animate-fade-in text-left bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Auto-Generated Compliance Record</h3>
                    <div className="font-mono text-sm text-slate-300 space-y-2 border-l-2 border-green-500 pl-4 py-2">
                       <p className="text-xs text-slate-500">Blockchain Hash</p>
                       <p className="font-bold">0x7f8a...3d4e5f6a</p>
                       <p className="text-xs text-slate-500 mt-2">Material / Weight</p>
                       <p className="font-bold">Conc_Demo_Clean / 18,400 kg</p>
                    </div>
                    <button onClick={() => setStep(3)} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-lg shadow-lg">Submit to Regulator System</button>
                 </div>
              )}
              {step === 3 && (
                 <div className="py-12 animate-fade-in text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Submission Successful</h3>
                    <p className="text-slate-400 mb-6 text-sm">Contractor and Recycler dashboards have been updated.</p>
                    <button onClick={() => navigateTo('dashboard')} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Return Home</button>
                 </div>
              )}
           </div>
        </div>
     );
  }

  if (activeWorkflow === 'revenue') {
     return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                 <DollarSign className="w-6 h-6 mr-3 text-amber-500" /> Revenue Optimization System
               </h2>
               <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
           </div>
           
           <div className="card-premium p-8 border-t-4 border-amber-500">
              <StepWizard steps={["Better Option Detected", "Compare Facilities", "Switch Destination", "Route Updated"]} currentStep={step} />
              
              {step === 0 && (
                 <div className="text-center animate-fade-in">
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 inline-block w-full max-w-md shadow-sm">
                       <TrendingUp className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                       <h3 className="font-bold text-amber-900 border-b border-amber-200 pb-2 mb-2">Dynamic Opportunity Detected</h3>
                       <p className="text-sm text-amber-800">You are currently carrying 18.4t of clean concrete to Metro Plant.</p>
                       <p className="font-bold text-amber-700 mt-2 bg-white px-3 py-2 rounded-lg border border-amber-100 shadow-sm inline-block">EcoCrush is offering +15% per ton</p>
                    </div>
                    <div className="mt-6"><button onClick={() => setStep(1)} className="btn-primary w-full max-w-md bg-amber-600 hover:bg-amber-700 focus:ring-amber-500">Compare Market Prices</button></div>
                 </div>
              )}
              {step === 1 && (
                 <div className="text-center animate-fade-in">
                    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                       <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 opacity-60">
                          <p className="font-bold text-slate-700">Metro Plant (Current)</p>
                          <p className="text-sm mt-1">R80 / ton</p>
                          <p className="text-xs text-slate-500 font-mono mt-1">+ 22 km travel</p>
                       </div>
                       <div className="border-2 border-green-500 rounded-xl p-4 bg-green-50 shadow-md transform scale-105">
                          <p className="font-bold text-green-800">EcoCrush Recycling</p>
                          <p className="text-xl font-bold text-green-700 mt-1">R92 / ton</p>
                          <p className="text-xs text-green-600 font-mono mt-1">+ 18 km travel (Closer)</p>
                       </div>
                    </div>
                    <div><button onClick={() => setStep(2)} className="btn-primary w-full max-w-md bg-blue-600 hover:bg-blue-700">Accept Switch (-4km travel, +R220 profit)</button></div>
                 </div>
              )}
              {step === 2 && (
                 <div className="text-center py-12 animate-fade-in">
                    <Map className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin-slow" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Rerouting Logistics</h3>
                    <p className="text-slate-500 mb-6">GPS has been updated. Generating contract adjustment for EcoCrush.</p>
                    <button onClick={() => navigateTo('dashboard')} className="btn-primary bg-slate-900 border-none shadow-xl">Complete & Resume Drive</button>
                 </div>
              )}
           </div>
        </div>
     );
  }

  // Dashboard View
  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-premium p-6 bg-white flex flex-col justify-between">
           <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Jobs Today</p>
           <h3 className="text-3xl font-data font-bold text-slate-900 mt-2">14 <span className="text-lg text-slate-400">/ 18</span></h3>
           <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full" style={{width: '75%'}}></div></div>
        </div>
        <div className="card-premium p-6 bg-white flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-transform shadow-md border border-slate-200" onClick={() => navigateTo('routing')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Fuel Savings</p>
                 <h3 className="text-3xl font-data font-bold text-slate-900 mt-2">24%</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><TrendingUp className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-blue-600 mt-4 font-bold">Try Routing Engine &rarr;</p>
        </div>
        
        <div className="card-premium p-6 bg-amber-50 border border-amber-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-transform shadow-md" onClick={() => navigateTo('revenue')}>
           <p className="text-sm font-medium text-amber-800 uppercase tracking-wide flex items-center"><DollarSign className="w-4 h-4 mr-1"/> Revenue Opps</p>
           <h3 className="text-2xl font-data font-bold text-amber-700 mt-2">+15% Premium Found</h3>
           <p className="text-xs text-amber-800 mt-4 font-bold bg-amber-200/50 px-2 py-1 rounded inline-block text-center w-full shadow-sm">EcoCrush Bypass Active &rarr;</p>
        </div>

        <div className="card-premium p-6 bg-green-50 border border-green-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-transform shadow-md" onClick={() => navigateTo('weighbridge')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-sm font-medium text-green-800 uppercase tracking-wide">T-04 Arriving</p>
                 <h3 className="text-[11px] font-bold text-green-700 mt-2 tracking-wide uppercase">Initiate Handshake</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg text-green-700"><Scale className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-green-700 mt-4 font-bold w-full bg-green-200/50 px-2 py-1 text-center shadow-sm rounded">Open Weighbridge tool &rarr;</p>
        </div>
      </div>

      <div className="card-premium p-6 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
         <h3 className="font-bold mb-4 relative z-10 flex items-center"><Search className="w-5 h-5 mr-2 text-slate-400" /> Dispatch & Job Board</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {[
               { id: 'JOB-942', loc: 'Site Alpha', type: 'Concrete', price: 'R4,200', status: 'In Progress' },
               { id: 'JOB-945', loc: 'Site Charlie', type: 'Mixed Demo', price: 'R3,800', status: 'Pending' }
            ].map((job, i) => (
               <div key={i} className="p-4 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-xl cursor-pointer" onClick={() => navigateTo('routing')}>
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-mono text-xs text-blue-300 font-bold">{job.id}</span>
                     <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${job.status === 'In Progress' ? 'bg-blue-500/20 text-blue-200' : 'bg-white/10 text-slate-300'}`}>{job.status}</span>
                  </div>
                  <p className="font-bold text-lg">{job.loc}</p>
                  <p className="text-xs text-slate-400 mb-3">{job.type} • 18 Tons Expected</p>
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-data font-bold text-green-400">{job.price}</span>
                     {job.status === 'Pending' ? (
                        <button className="bg-white text-slate-900 px-3 py-1 text-xs font-bold rounded">Accept Job</button>
                     ): (
                        <span className="text-blue-300 bg-blue-900/40 px-3 py-1 rounded text-xs">Assigned to T-02</span >
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default TransporterView;
