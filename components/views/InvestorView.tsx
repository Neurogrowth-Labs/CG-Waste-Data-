import React, { useState } from 'react';
import { 
  Building2, LineChart, ShieldCheck, Download, Filter, FileText, CheckCircle, Search, Activity
} from 'lucide-react';

const InvestorView = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'dashboard' | 'esg_report' | 'audit_trail'>('dashboard');
  const [step, setStep] = useState(0);

  const navigateTo = (workflow: any) => {
     setActiveWorkflow(workflow);
     setStep(0);
  };

  if (activeWorkflow === 'audit_trail') {
     return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
           <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                 <ShieldCheck className="w-6 h-6 mr-3 text-emerald-600" /> Immutable Audit Trail
               </h2>
               <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Close</button>
           </div>
           
           <div className="card-premium p-8">
              {step === 0 && (
                 <div className="animate-fade-in text-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Trace Material Lifecycle</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl max-w-lg mx-auto p-4 mb-6">
                       <input type="text" placeholder="Enter Hash, Project ID, or Asset ID..." className="w-full bg-white border border-slate-300 rounded px-4 py-3 outline-none text-sm mb-4" defaultValue="HSH-0x7F8..." />
                       <button onClick={() => setStep(1)} className="btn-primary w-full shadow-md"><Search className="w-4 h-4 mr-2 inline" /> Locate Asset</button>
                    </div>
                 </div>
              )}
              {step === 1 && (
                 <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Asset Ledger Found</h3>
                    <div className="max-w-xl mx-auto relative border-l-2 border-emerald-200 pl-6 pb-6 space-y-8">
                       <div className="relative">
                          <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white"><CheckCircle className="w-3 h-3 text-white"/></div>
                          <p className="text-xs text-slate-400 font-mono mb-1">2026-04-12 10:30 AM</p>
                          <h4 className="font-bold text-slate-800">Origination: Sector Alpha</h4>
                          <p className="text-sm text-slate-600">18.4t Concrete logged by AI visual capture.</p>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white"><CheckCircle className="w-3 h-3 text-white"/></div>
                          <p className="text-xs text-slate-400 font-mono mb-1">2026-04-12 02:45 PM</p>
                          <h4 className="font-bold text-slate-800">IoT Weighbridge Validation</h4>
                          <p className="text-sm text-slate-600">Truck T-04 certified. Hash: 0x7f8a9b2c...</p>
                       </div>
                       <div className="relative bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                          <div className="absolute -left-[51px] top-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white"><CheckCircle className="w-3 h-3 text-white"/></div>
                          <p className="text-xs text-emerald-800 font-mono mb-1">2026-04-14 09:15 AM</p>
                          <h4 className="font-bold text-emerald-900">Transformation & Resale</h4>
                          <p className="text-sm text-emerald-700">Sold as Aggregate A-grade to Skyline Tower Build via Marketplace.</p>
                       </div>
                    </div>
                    <div className="text-center mt-8">
                       <button onClick={() => setStep(2)} className="btn-primary"><Download className="w-4 h-4 mr-2 inline"/> Export Chain of Custody (PDF)</button>
                    </div>
                 </div>
              )}
              {step === 2 && (
                 <div className="py-12 animate-fade-in text-center">
                    <FileText className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Audit Report Generated</h3>
                    <p className="text-slate-500 mb-6 text-sm">Secure PDF has been downloaded. Signature verified.</p>
                    <button onClick={() => navigateTo('dashboard')} className="btn-secondary">Close Tool</button>
                 </div>
              )}
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-6 animate-fade-in">
       
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium p-6 bg-emerald-50 border border-emerald-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1" onClick={() => navigateTo('audit_trail')}>
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-emerald-800 uppercase tracking-wide font-bold">Investigate Asset</p>
                 <h3 className="text-2xl font-data font-bold text-emerald-700 mt-2">Audit Trail</h3>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700"><ShieldCheck className="w-5 h-5" /></div>
           </div>
           <p className="text-[10px] text-emerald-800 mt-4 font-bold bg-emerald-200/50 px-2 py-1 text-center shadow-sm rounded uppercase">Trace Material Lifecycle &rarr;</p>
        </div>

        <div className="card-premium p-6 bg-slate-900 border border-slate-800 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-medium text-slate-400 uppercase tracking-wide font-bold">Financial Analysis</p>
                 <h3 className="text-xl font-data font-bold text-white mt-2">ROI Analyzer</h3>
              </div>
              <div className="p-2 bg-white/10 rounded-lg text-white"><Activity className="w-5 h-5" /></div>
           </div>
           <p className="text-[10px] text-slate-900 mt-4 font-bold bg-white px-2 py-1 text-center shadow-sm rounded uppercase">Compare Project Savings &rarr;</p>
        </div>
      </div>
      
    </div>
  );
};

export default InvestorView;
