import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Trash2, Globe, DollarSign, Recycle, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Loader2, Camera, Mic, 
  Wrench, Activity, CheckCircle, ArrowRight, LayoutDashboard, Brain,
  Search, LineChart
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass = "bg-white", onClick }: any) => (
  <div 
    onClick={onClick}
    className={`${colorClass} p-6 card-premium flex flex-col justify-between ${onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1' : ''}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-data font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg text-[#0B8F6C]">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {trend && (
      <div className={`flex items-center mt-4 text-xs font-medium ${trend === 'up' ? 'text-[#0B8F6C]' : 'text-error'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        <span className="font-data">{trendValue}</span>
      </div>
    )}
  </div>
);

const StepWizard = ({ steps, currentStep }: { steps: string[], currentStep: number }) => (
  <div className="flex items-center justify-between w-full mb-8 relative">
    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
    <div className="absolute left-0 top-1/2 h-0.5 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
    {steps.map((label, i) => (
      <div key={label} className="flex flex-col items-center bg-slate-50 px-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${i <= currentStep ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30' : 'bg-white text-slate-400 border-slate-300'}`}>
          {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
        </div>
        <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-green-700' : 'text-slate-400'}`}>{label}</span>
      </div>
    ))}
  </div>
);

const SiteManagerView = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'dashboard' | 'capture' | 'spike_alert' | 'optimization' | 'risk_factor' | 'waste_details' | 'waste_simulation'>('dashboard');
  const [step, setStep] = useState(0);
  const queryClient = useQueryClient();

  const { data: metrics = { totalWaste: 0, diversionRate: 0, materialBreakdown: [] as any[] }, isLoading: loading } = useQuery({
    queryKey: ['site_metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.from('waste_logs').select('*').limit(100);
      if (error) throw error;
      
      let total = 0;
      let diverted = 0;
      const bMap: Record<string, number> = {};

      if (data && data.length > 0) {
        data.forEach(curr => {
          const weight = curr.weight || 0;
          const material = curr.material || '';
          total += weight;
          if (['Concrete', 'Metal', 'Wood'].includes(material)) {
            diverted += weight;
          }
          bMap[material] = (bMap[material] || 0) + weight;
        });
      }

      return {
        totalWaste: total,
        diversionRate: total > 0 ? (diverted / total) * 100 : 0,
        materialBreakdown: Object.keys(bMap).map(k => ({ name: k, value: bMap[k] })).sort((a,b) => b.value - a.value)
      };
    }
  });

  useEffect(() => {
    const subscription = supabase.channel('public:waste_logs_siteManager')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'waste_logs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['site_metrics'] });
      }).subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, [queryClient]);

  const navigateTo = (workflow: any) => {
     setActiveWorkflow(workflow);
     setStep(0);
  };

  if (activeWorkflow === 'capture') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Camera className="w-6 h-6 mr-3 text-[#1F7A5B]" /> Smart Waste Capture Flow
            </h2>
            <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Cancel</button>
        </div>
        <div className="card-premium p-8">
           <StepWizard steps={["Capture Image", "AI Classification", "Analyze Impact", "Select Action"]} currentStep={step} />
           
           {step === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setStep(1)}>
                 <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-slate-700">Click to capture waste pile</h3>
                 <p className="text-sm text-slate-500 mt-2">or speak your entry: "10 tons concrete removed"</p>
              </div>
           )}
           {step === 1 && (
              <div className="space-y-6 text-center animate-fade-in">
                 <Brain className="w-16 h-16 text-emerald-500 mx-auto animate-pulse" />
                 <h3 className="text-xl font-bold text-slate-800">AI Classification Complete</h3>
                 <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl max-w-md mx-auto shadow-sm">
                    <p className="text-sm text-emerald-800 font-bold uppercase tracking-widest mb-1">Detected Material</p>
                    <p className="text-3xl font-data font-black text-emerald-600 mb-2">Clean Concrete (14.2t)</p>
                    <p className="text-xs text-emerald-700">Confidence: 98%</p>
                 </div>
                 <button onClick={() => setStep(2)} className="btn-primary">Compare vs Plan</button>
              </div>
           )}
           {step === 2 && (
              <div className="space-y-6 text-center animate-fade-in">
                 <h3 className="text-xl font-bold text-slate-800">Plan vs Actual Impact</h3>
                 <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                       <p className="text-xs text-red-500 uppercase font-bold">Concrete Variance</p>
                       <p className="text-2xl font-bold text-red-700 mt-1">+14% Over Plan</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                       <p className="text-xs text-amber-600 uppercase font-bold">Cost Leakage</p>
                       <p className="text-2xl font-bold text-amber-700 mt-1">R120,000</p>
                    </div>
                 </div>
                 <button onClick={() => setStep(3)} className="btn-primary">Resolve & Take Action</button>
              </div>
           )}
           {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                 <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Select Next Action</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-200 p-4 rounded-xl hover:border-emerald-500 hover:shadow-md cursor-pointer bg-white transition-all text-center" onClick={() => setStep(4)}>
                       <Activity className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                       <h4 className="font-bold text-slate-800">Reuse On-Site</h4>
                       <p className="text-xs text-slate-500 mt-1">Send to Sector 4 Boundary Wall</p>
                    </div>
                    <div className="border border-slate-200 p-4 rounded-xl hover:border-blue-500 hover:shadow-md cursor-pointer bg-white transition-all text-center" onClick={() => navigateTo('dashboard')}>
                       <Recycle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                       <h4 className="font-bold text-slate-800">Send to Recycler</h4>
                       <p className="text-xs text-slate-500 mt-1">Route to EcoCrush (+R5,000 credit)</p>
                    </div>
                    <div className="border border-slate-200 p-4 rounded-xl hover:border-slate-500 hover:shadow-md cursor-pointer bg-white transition-all text-center">
                       <Trash2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                       <h4 className="font-bold text-slate-800">Temporary Storage</h4>
                       <p className="text-xs text-slate-500 mt-1">Log in offline mode for later</p>
                    </div>
                 </div>
              </div>
           )}
           {step === 4 && (
              <div className="text-center py-12 animate-fade-in">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Waste Logged & Action Assigned</h3>
                 <p className="text-slate-500 mb-8">Dashboard and procurement teams have been auto-notified.</p>
                 <button onClick={() => navigateTo('dashboard')} className="btn-primary">Return to Command Center</button>
              </div>
           )}
        </div>
      </div>
    );
  }

  if (activeWorkflow === 'spike_alert') {
     return (
       <div className="space-y-6 animate-fade-in max-w-4xl mx-auto flex flex-col min-h-[600px] overflow-hidden">
         <div className="flex items-center justify-between shrink-0">
             <h2 className="text-xl font-bold text-red-700 flex items-center">
               <AlertTriangle className="w-6 h-6 mr-3 text-red-600" /> Incident Response: Concrete Spike Detected
             </h2>
             <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Abort</button>
         </div>
         <div className="card-premium p-8 border-t-4 border-t-red-500 shadow-xl flex-1 overflow-y-auto">
             <StepWizard steps={["Breakdown", "Identify Team", "Open Optimizer", "Push Update"]} currentStep={step} />
             {step === 0 && (
                <div className="space-y-6 text-center mt-8">
                   <div className="bg-red-50 p-6 rounded-xl inline-block text-left w-full max-w-md">
                      <p className="text-sm font-bold text-red-900 border-b border-red-200 pb-2 mb-2">Root Cause Breakdown</p>
                      <p className="text-sm text-red-800">Activity: <strong className="font-data">Foundation Pouring (Sector 4)</strong></p>
                      <p className="text-sm text-red-800 mt-1">Variance: <strong className="font-data text-red-600">+14.2% Above BIM Baseline</strong></p>
                      <p className="text-sm text-red-800 mt-1">Predicted Delay Impact: <strong className="font-data">2 Days</strong></p>
                   </div>
                   <div><button onClick={() => setStep(1)} className="btn-primary">Identify Responsible Entity</button></div>
                </div>
             )}
             {step === 1 && (
                <div className="space-y-6 text-center animate-fade-in mt-8">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block text-left w-full max-w-md">
                      <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Responsible Team</p>
                      <div className="flex items-center">
                         <div className="w-10 h-10 bg-slate-300 rounded-full mr-3"></div>
                         <div>
                            <p className="font-bold text-slate-800">Sub-Contractor A</p>
                            <p className="text-xs text-slate-500">Contact: John Doe | Auto-Notified</p>
                         </div>
                      </div>
                   </div>
                   <div><button onClick={() => setStep(2)} className="btn-primary">Open Material Optimization Tool</button></div>
                </div>
             )}
             {step === 2 && (
                <div className="space-y-6 animate-fade-in text-center mt-8">
                   <div className="border border-slate-200 rounded-xl bg-slate-900 text-slate-300 p-8">
                       <Wrench className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                       <h3 className="font-bold text-white mb-2">Autodesk Revit Integration Active</h3>
                       <p className="text-sm text-slate-400 mb-6">Highlighting overused materials and simulating alternatives.</p>
                       <div className="bg-slate-800 p-4 rounded text-left">
                          <p className="text-green-400 font-mono text-sm">&gt; AI Scenario: Reduce next concrete order by 10% to off-set leak.</p>
                          <p className="text-green-400 font-mono text-sm">&gt; Status: Structural integrity validated.</p>
                       </div>
                   </div>
                   <button onClick={() => setStep(3)} className="btn-primary shadow-lg shadow-green-500/30">Approve Scenario & Resolve</button>
                </div>
             )}
             {step === 3 && (
                <div className="text-center py-12 animate-fade-in mt-8">
                   <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-blue-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Procurement Restructured</h3>
                   <p className="text-slate-500 mb-8">Contractor notified, Revit model updated, and next materials order automatically revised.</p>
                   <button onClick={() => navigateTo('dashboard')} className="btn-secondary font-bold">Close Incident</button>
                </div>
             )}
         </div>
       </div>
     );
  }

  if (activeWorkflow === 'risk_factor') {
     return (
       <div className="space-y-6 animate-fade-in max-w-4xl mx-auto flex flex-col min-h-[600px] overflow-hidden">
         <div className="flex items-center justify-between shrink-0">
             <h2 className="text-xl font-bold text-amber-700 flex items-center">
               <AlertTriangle className="w-6 h-6 mr-3 text-amber-600" /> Cost Leakage & Risk Factor Tools
             </h2>
             <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Abort</button>
         </div>
         <div className="card-premium p-8 border-t-4 border-t-amber-500 shadow-xl flex-1 overflow-y-auto mt-2">
             <StepWizard steps={["Identify Leakage", "Identify Team", "Open Optimizer", "Push Update"]} currentStep={step} />
             {step === 0 && (
                <div className="space-y-6 text-center mt-8">
                   <div className="bg-red-50 p-6 rounded-xl inline-block text-left w-full max-w-md">
                      <p className="text-sm font-bold text-red-900 border-b border-red-200 pb-2 mb-2">Root Cause Breakdown</p>
                      <p className="text-sm text-red-800">Activity: <strong className="font-data">Foundation Pouring (Sector 4)</strong></p>
                      <p className="text-sm text-red-800 mt-1">Variance: <strong className="font-data text-red-600">+14.2% Above BIM Baseline</strong></p>
                      <p className="text-sm text-red-800 mt-1">Financial Impact: <strong className="font-data">R120,000 Leakage</strong></p>
                   </div>
                   <div><button onClick={() => setStep(1)} className="btn-primary">Identify Responsible Entity</button></div>
                </div>
             )}
             {step === 1 && (
                <div className="space-y-6 text-center animate-fade-in mt-8">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block text-left w-full max-w-md">
                      <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Responsible Team</p>
                      <div className="flex items-center">
                         <div className="w-10 h-10 bg-slate-300 rounded-full mr-3"></div>
                         <div>
                            <p className="font-bold text-slate-800">Sub-Contractor A</p>
                            <p className="text-xs text-slate-500">Contact: John Doe | Auto-Notified</p>
                         </div>
                      </div>
                   </div>
                   <div><button onClick={() => setStep(2)} className="btn-primary">Open Material Optimization Tool</button></div>
                </div>
             )}
             {step === 2 && (
                <div className="space-y-6 animate-fade-in text-center mt-8">
                   <div className="border border-slate-200 rounded-xl bg-slate-900 text-slate-300 p-8">
                       <Wrench className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                       <h3 className="font-bold text-white mb-2">Autodesk Revit Integration Active</h3>
                       <p className="text-sm text-slate-400 mb-6">Highlighting overused materials and simulating alternatives.</p>
                       <div className="bg-slate-800 p-4 rounded text-left">
                          <p className="text-green-400 font-mono text-sm">&gt; AI Scenario: Reduce next concrete order by 10% to off-set leak.</p>
                          <p className="text-green-400 font-mono text-sm">&gt; Status: Structural integrity validated.</p>
                       </div>
                   </div>
                   <button onClick={() => setStep(3)} className="btn-primary shadow-lg shadow-green-500/30">Approve Scenario & Resolve</button>
                </div>
             )}
             {step === 3 && (
                <div className="text-center py-12 animate-fade-in mt-8">
                   <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-blue-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Procurement Restructured</h3>
                   <p className="text-slate-500 mb-8">Contractor notified, Revit model updated, and next materials order automatically revised.</p>
                   <button onClick={() => navigateTo('dashboard')} className="btn-secondary font-bold">Close Risk Factor</button>
                </div>
             )}
         </div>
       </div>
     );
  }

  if (activeWorkflow === 'waste_details') {
     return (
       <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
         <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold text-slate-800 flex items-center">
               <Trash2 className="w-6 h-6 mr-3 text-slate-600" /> Full Waste Generated Details
             </h2>
             <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Back to Dashboard</button>
         </div>
         <div className="card-premium p-6">
            <h3 className="text-lg font-bold mb-4">Site Generation Log</h3>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-3">Material Tag</th>
                      <th className="p-3">Source Sector</th>
                      <th className="p-3">Volume (t)</th>
                      <th className="p-3">Cost Basis</th>
                      <th className="p-3">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">Concrete Class C</td>
                      <td className="p-3 text-slate-600">Sector 4</td>
                      <td className="p-3 font-data text-slate-900">14.2</td>
                      <td className="p-3 font-data">R24,000</td>
                      <td className="p-3"><span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold">Leaking</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">Grade 1 Timber</td>
                      <td className="p-3 text-slate-600">Sector 1</td>
                      <td className="p-3 font-data text-slate-900">8.1</td>
                      <td className="p-3 font-data">R12,500</td>
                      <td className="p-3"><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Diverted</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">Scrap Steel</td>
                      <td className="p-3 text-slate-600">Sector 2</td>
                      <td className="p-3 font-data text-slate-900">12.0</td>
                      <td className="p-3 font-data">R48,000</td>
                      <td className="p-3"><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Recycled</span></td>
                    </tr>
                 </tbody>
               </table>
            </div>
            <div className="mt-6 flex justify-end">
               <button className="btn-primary flex items-center"><Search className="w-4 h-4 mr-2" /> View Extended Ledger</button>
            </div>
         </div>
       </div>
     );
  }

  if (activeWorkflow === 'waste_simulation') {
    return (
       <div className="space-y-6 animate-fade-in max-w-4xl mx-auto flex flex-col min-h-[600px] overflow-hidden">
         <div className="flex items-center justify-between shrink-0">
             <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
               <Brain className="w-6 h-6 mr-3 text-indigo-600" /> Waste Simulation Dashboard
             </h2>
             <button onClick={() => navigateTo('dashboard')} className="btn-secondary text-sm">Exit Simulator</button>
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="card-premium p-6 bg-indigo-50 border border-indigo-200">
                    <p className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Projected Total Setup</p>
                    <h3 className="text-3xl font-data font-bold text-indigo-900 mt-2">52,400<span className="text-sm">t</span></h3>
                    <p className="text-xs text-indigo-700 mt-2 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Model Trained</p>
                </div>
                <div className="card-premium p-6 col-span-2">
                    <h3 className="text-sm font-bold text-slate-800 mb-2">Simulation Tools</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="p-3 border border-slate-200 rounded-lg hover:border-indigo-500 hover:shadow-md text-left transition-all group pointer-events-none">
                         <div className="flex items-center mb-1"><Activity className="w-4 h-4 text-indigo-600 flex-shrink-0 mr-2" /><span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">Inject Spike Scenario</span></div>
                         <p className="text-[10px] text-slate-500">Run a stress test on procurement</p>
                       </button>
                       <button className="p-3 border border-slate-200 rounded-lg hover:border-indigo-500 hover:shadow-md text-left transition-all group pointer-events-none">
                         <div className="flex items-center mb-1"><LineChart className="w-4 h-4 text-indigo-600 flex-shrink-0 mr-2" /><span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">View Trajectory</span></div>
                         <p className="text-[10px] text-slate-500">Extrapolate to completion date</p>
                       </button>
                    </div>
                </div>
            </div>
            
            <div className="card-premium p-8 text-center text-slate-500">
                <h3 className="font-bold text-slate-800 mb-4 animate-pulse">Running Full Operational Monte Carlo Simulation...</h3>
                <div className="bg-slate-900 text-green-400 font-mono text-left p-4 rounded-xl text-xs overflow-hidden h-32 relative">
                   <div className="absolute inset-x-4 inset-y-4 flex flex-col justify-end">
                      <p>&gt; Re-evaluating Bill of Quantities...</p>
                      <p>&gt; Calculating weather-related delay impacts...</p>
                      <p>&gt; Adjusting waste generation factor per standard deviation...</p>
                      <p>&gt; Scenario 17 computed. Leakage risk: HIGH.</p>
                   </div>
                </div>
            </div>
         </div>
       </div>
    );
  }

  // Dashboard View defaults
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap gap-3">
         <button onClick={() => navigateTo('capture')} className="btn-primary text-sm px-4 py-2 flex items-center shadow-lg shadow-green-600/20 hover:-translate-y-0.5 transition-transform">
            <Camera className="w-4 h-4 mr-2" /> Log Waste Capture
         </button>
         <button onClick={() => navigateTo('waste_simulation')} className="btn-secondary text-sm px-4 py-2 flex items-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 hover:-translate-y-0.5 transition-transform">
            <Brain className="w-4 h-4 mr-2" /> Simulate Waste Spike
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Total Waste Generated" value={loading ? "..." : `${(metrics.totalWaste + 42500).toFixed(1)}t`} icon={Trash2} trend="down" trendValue="-4.2%" colorClass="bg-white hover:border-slate-300" onClick={() => navigateTo('waste_details')} />
        <KPICard title="Concrete Usage Variance" value="+14%" icon={Activity} trend="up" trendValue="Requires Action" colorClass="bg-red-50 border border-red-100" onClick={() => navigateTo('spike_alert')} />
        <KPICard title="Cost Leakage Alert" value="R120k" icon={DollarSign} trend="up" trendValue="Risk Factor" colorClass="bg-amber-50 border border-amber-100" onClick={() => navigateTo('risk_factor')} />
        <KPICard title="Recycling Rate" value={loading ? "..." : `${(metrics.diversionRate > 0 ? metrics.diversionRate : 68).toFixed(1)}%`} icon={Recycle} trend="up" trendValue="+2%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Live Waste Command Dashboard</h3>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">Real-Time vs Plan</span>
          </div>
          <div className="h-72">
            {loading ? (
               <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300"/></div>
            ) : metrics.materialBreakdown.length === 0 ? (
               <div className="h-full flex items-center justify-center text-slate-400">Syncing data from Field Sensors...</div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={metrics.materialBreakdown} layout="vertical" onClick={() => navigateTo('spike_alert')} style={{cursor: 'pointer'}}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#64748B', fontFamily: 'Inter'}} />
                       <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} />
                       <Bar dataKey="value" fill="#0B8F6C" radius={[0, 4, 4, 0]} barSize={20} />
                   </BarChart>
               </ResponsiveContainer>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Click a data bar to redirect to Root Cause Analysis</p>
        </div>

        <div className="col-span-1 flex flex-col space-y-4">
           <div className="card-premium p-6 flex-1 flex flex-col bg-slate-900 border-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertTriangle className="w-24 h-24 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4 flex items-center z-10"><AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Waste Risk Engine</h3>
              
              <div className="space-y-4 z-10 flex-1">
                 <div className="bg-black/20 p-3 rounded-lg border border-red-500/50 hover:bg-black/40 cursor-pointer transition-colors" onClick={() => navigateTo('spike_alert')}>
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-red-400 text-xs font-bold font-mono">SPIKE DETECTED</span>
                       <span className="text-xs text-slate-400">Just Now</span>
                    </div>
                    <p className="text-sm text-slate-200">Concrete waste tracking +14.2% above baseline.</p>
                    <p className="text-xs text-red-300 mt-2 font-bold flex items-center group">
                       View Root Cause Breakdown <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SiteManagerView;
