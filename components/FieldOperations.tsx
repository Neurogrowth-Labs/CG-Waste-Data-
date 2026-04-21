import React, { useState } from 'react';
import { Camera, MapPin, Truck, Radio, CheckCircle, AlertTriangle, Play, Smartphone, Wifi, Loader2 } from 'lucide-react';

export default function FieldOperations() {
  const [activeTab, setActiveTab] = useState<'capture' | 'iot'>('capture');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Field Operations Tools</h2>
          <p className="text-slate-500">Smart Site Capture & IoT Integration for Real-Time execution.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('capture')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'capture' ? 'border-green-600 text-green-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Smartphone className="w-4 h-4 inline mr-2" />
          Smart Site Capture App
        </button>
        <button
          onClick={() => setActiveTab('iot')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'iot' ? 'border-green-600 text-green-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Wifi className="w-4 h-4 inline mr-2" />
          IoT Waste Monitoring
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'capture' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#0B8F6C] rounded-xl p-6 text-white shadow-sm flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center"><Camera className="w-5 h-5 mr-2 text-white/90" /> AI Classification Camera</h3>
                    <p className="text-emerald-50 max-w-md text-sm">Real-time object detection processing. Point camera at waste pile.</p>
                  </div>
                  <div className="flex space-x-2">
                     <span className="px-3 py-1 bg-black/20 rounded text-xs font-mono flex items-center"><MapPin className="w-3 h-3 mr-1"/> GEO-LOCKED</span>
                  </div>
               </div>
               <div className="flex bg-black/20 rounded-lg overflow-hidden border border-white/10">
                  <div className="w-1/3 bg-[url('https://picsum.photos/seed/rubble/300/300')] bg-cover bg-center relative">
                     <div className="absolute inset-0 border-2 border-emerald-400 m-4 rounded animate-pulse"></div>
                     <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 text-[10px] font-mono rounded">IMG_#8821</div>
                  </div>
                  <div className="w-2/3 p-4 font-mono text-xs flex flex-col justify-center space-y-2">
                     <div className="flex justify-between">
                        <span>Concrete</span>
                        <span className="text-white font-bold">78%</span>
                     </div>
                     <div className="w-full bg-black/30 rounded-full h-1"><div className="bg-emerald-400 h-1 rounded-full" style={{width: '78%'}}></div></div>
                     
                     <div className="flex justify-between mt-2">
                        <span>Steel Rebar</span>
                        <span className="text-white font-bold">15%</span>
                     </div>
                     <div className="w-full bg-black/30 rounded-full h-1"><div className="bg-blue-400 h-1 rounded-full" style={{width: '15%'}}></div></div>
                     
                     <div className="flex justify-between mt-2">
                        <span>Mixed/Unknown</span>
                        <span className="text-white font-bold">7%</span>
                     </div>
                     <div className="w-full bg-black/30 rounded-full h-1"><div className="bg-slate-400 h-1 rounded-full" style={{width: '7%'}}></div></div>
                     
                     <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                        <span className="text-emerald-100">AI Verified Output:</span>
                        <span className="font-bold bg-white text-[#0B8F6C] px-2 py-1 rounded">Concrete</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
               <h4 className="font-bold text-slate-800 mb-4">Daily Logs Sent</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                     <span className="flex items-center text-slate-600"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Concrete Segregation</span>
                     <span className="font-medium">10:45 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="flex items-center text-slate-600"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Timber Waste Log</span>
                     <span className="font-medium">08:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="flex items-center text-slate-600"><Camera className="w-4 h-4 mr-2 text-blue-500" /> Auto-Categorization</span>
                     <span className="font-medium">07:15 AM</span>
                  </div>
               </div>
               <button className="mt-6 w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                 View Full Daily Report
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Smart Bin A1 - Concrete', weight: '4.2 Tons', capacity: 85, status: 'warning' },
                  { name: 'Smart Bin B2 - Timber', weight: '1.1 Tons', capacity: 45, status: 'normal' },
                  { name: 'RFID Scanner Gate Check', weight: 'Live Monitor', capacity: 100, status: 'active', desc: 'Material Movement Tracking' },
                ].map((sensor, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                           <Radio className={`w-5 h-5 mr-3 ${sensor.status === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`} />
                           <h4 className="font-semibold text-slate-800 text-sm">{sensor.name}</h4>
                        </div>
                     </div>
                     <p className="text-2xl font-bold text-slate-900 mb-1">{sensor.weight}</p>
                     
                     {sensor.capacity && sensor.desc === undefined ? (
                       <div className="mt-4">
                         <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-500">Capacity</span>
                           <span className="font-medium">{sensor.capacity}%</span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-2">
                           <div className={`h-2 rounded-full ${sensor.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${sensor.capacity}%`}}></div>
                         </div>
                       </div>
                     ) : (
                        <p className="text-xs text-slate-500 mt-2">{sensor.desc}</p>
                     )}
                     
                     {sensor.status === 'warning' && (
                       <p className="text-xs text-amber-600 mt-4 flex items-center font-medium bg-amber-50 py-1 px-2 rounded-md border border-amber-100">
                         <AlertTriangle className="w-3 h-3 mr-1" /> Predictive Overflow Alert
                       </p>
                     )}
                  </div>
                ))}
             </div>
             
             <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center h-64 border border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/drone/1000/400?grayscale')] opacity-30 bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">Drone Mapping API</span>
                  <h3 className="text-xl font-bold text-white mb-2">Live Topographical Demolition Scan</h3>
                  <p className="text-slate-400 text-sm mb-4">Tracking volumetric changes across Site Sector Alpha</p>
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center mx-auto shadow-lg shadow-emerald-900/50">
                    <Play className="w-4 h-4 mr-2 fill-current" /> Stream Live Feed
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
