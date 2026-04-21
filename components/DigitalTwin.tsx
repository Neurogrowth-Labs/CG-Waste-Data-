import React, { useState } from 'react';
import { Layers, Compass, Play, GitBranch, ArrowRight, Activity, Crosshair } from 'lucide-react';

export default function DigitalTwin() {
  const [scenario, setScenario] = useState('baseline');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Decision Intelligence</h2>
          <p className="text-slate-500">Live Project Digital Twins & Strategic Sustainability Radar.</p>
        </div>
        <div className="flex space-x-2">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center">
             <Crosshair className="w-4 h-4 mr-2 text-slate-400" /> Strategic Radar
           </button>
           <button className="px-4 py-2 bg-slate-900 border border-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center">
             <Layers className="w-4 h-4 mr-2" /> 3D Digital Twin
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
         {/* Sidebar: Scenarios */}
         <div className="col-span-1 flex flex-col space-y-4 overflow-y-auto">
            <h3 className="font-bold text-slate-800 flex items-center">
               <GitBranch className="w-4 h-4 mr-2" /> What-If Simulator
            </h3>
            <p className="text-sm text-slate-500 mb-2">Simulate environmental impact before execution.</p>
            
            {[
              { id: 'baseline', name: 'Baseline Strategy', desc: 'Current project plan' },
              { id: 'opt1', name: 'Optimized Concrete Sourcing', desc: 'Swap to 30% recycled aggregate' },
              { id: 'opt2', name: 'Zero-Waste Timber', desc: 'Implement total site-reuse protocol' }
            ].map(scen => (
              <div 
                key={scen.id} 
                onClick={() => setScenario(scen.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  scenario === scen.id ? 'border-[#0B8F6C] bg-emerald-50/50 shadow-md ring-4 ring-[#0B8F6C]/10' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                 <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-semibold text-sm ${scenario === scen.id ? 'text-[#0B8F6C]' : 'text-slate-800'}`}>{scen.name}</h4>
                    {scenario === scen.id && <Activity className="w-4 h-4 text-[#0B8F6C]" />}
                 </div>
                 <p className="text-xs text-slate-500">{scen.desc}</p>
              </div>
            ))}

            <div className="mt-8 bg-white border border-slate-200 p-4 rounded-xl card-premium">
               <h4 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">Impact Projection</h4>
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Predicted CO2e</span><span className="font-medium text-emerald-600">-12% vs Baseline</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-emerald-500 w-[88%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Waste to Landfill</span><span className="font-medium text-emerald-600">-34% vs Baseline</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-emerald-500 w-[66%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Project Cost</span><span className="font-medium text-amber-600">+2% vs Baseline</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-amber-500 w-[102%]"></div></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Main View: 3D Twin Viewport Placeholder */}
         <div className="col-span-1 lg:col-span-2 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-xl h-[600px] lg:h-auto">
            {/* Overlay UI */}
            <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10 pointer-events-auto">
                 <div className="text-[10px] text-slate-400 font-mono mb-1 flex items-center"><Layers className="w-3 h-3 mr-1"/> BIM DATA <span className="ml-2 text-blue-400 border border-blue-400/30 px-1 rounded bg-blue-400/10">Autodesk Revit</span></div>
                 <div className="flex items-center space-x-4">
                    <div>
                      <div className="text-xl font-bold text-white font-data">412<span className="text-sm text-slate-400">T</span></div>
                      <div className="text-xs text-slate-400">Active Mass</div>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div>
                      <div className="text-xl font-bold text-emerald-400 font-data">89<span className="text-sm text-emerald-600">%</span></div>
                      <div className="text-xs text-slate-400">Tracking Cov.</div>
                    </div>
                 </div>
              </div>
              <div className="bg-[#0B8F6C]/20 text-emerald-200 border border-[#0B8F6C]/30 px-3 py-1.5 rounded-full text-xs font-medium flex items-center self-start pointer-events-auto backdrop-blur-md">
                 <Compass className="w-3 h-3 mr-1.5" /> Simulation Active
              </div>
            </div>

            {/* Faux 3D Wireframe Graphic */}
            <div className="relative w-full h-full flex flex-col items-center justify-center opacity-80 mix-blend-screen pointer-events-none">
               {/* Abstract Grid Backdrop */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px]"></div>
               
               {/* Central Building Hologram representing Digital Twin */}
               <div className="relative z-10 scale-150 bottom-10 origin-bottom transform perspective-1000 rotate-x-[60deg] rotate-z-[-20deg]">
                 <div className="w-32 h-64 border-2 border-[#0B8F6C]/50 bg-[#0B8F6C]/10 shadow-[0_0_30px_rgba(11,143,108,0.2)]"></div>
                 <div className="absolute bottom-0 left-32 w-32 h-48 border-2 border-emerald-400/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
                 <div className="absolute bottom-0 -left-16 w-16 h-32 border-2 border-red-400/50 bg-red-500/10 content-none">
                    <div className="absolute -inset-2 bg-red-500/20 blur-xl rounded-full"></div>
                    <span className="absolute -top-6 -left-10 text-[8px] font-mono text-red-400 bg-black/50 px-1 rounded transform rotate-x-[-60deg] rotate-z-[20deg] whitespace-nowrap">WASTE HOTSPOT (CONCRETE)</span>
                 </div>
               </div>
               
               <div className="absolute bottom-12 z-20 flex flex-col items-center pointer-events-auto">
                 <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium transition-all shadow-xl flex items-center">
                   Interactive Explorer Disabled in Preview
                 </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
