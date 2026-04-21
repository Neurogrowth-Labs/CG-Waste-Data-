import React, { useState } from 'react';
import { Store, RefreshCw, ShoppingCart, MessageSquare, ShieldCheck, MapPin, Truck, Leaf } from 'lucide-react';

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'exchange' | 'collaboration'>('exchange');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Circular Ecosystem</h2>
          <p className="text-slate-500">Waste Exchange Marketplace & Stakeholder Collaboration Hub.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" /> List Material
        </button>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('exchange')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors flex items-center ${
            activeTab === 'exchange' ? 'border-[#0B8F6C] text-[#0B8F6C]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Store className="w-4 h-4 inline mr-2" />
          Circular Material Exchange
        </button>
        <button
          onClick={() => setActiveTab('collaboration')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors flex items-center ${
            activeTab === 'collaboration' ? 'border-[#0B8F6C] text-[#0B8F6C]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Logistics Tracking
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'exchange' ? (
           <div className="space-y-6">
              {/* Stats/Filters */}
              <div className="flex justify-between items-center card-premium p-4">
                 <div className="flex space-x-6 text-sm">
                    <span className="text-slate-600">Available: <strong className="text-slate-900 font-data text-lg">1,204 Tons</strong></span>
                    <span className="text-slate-600">Active Listings: <strong className="text-slate-900 font-data text-lg">42</strong></span>
                    <span className="text-[#0B8F6C] flex items-center"><Leaf className="w-4 h-4 mr-1"/> CO2e Saved: <strong className="font-data text-lg ml-1">890T YTD</strong></span>
                 </div>
                 <div className="flex space-x-2">
                    <select className="text-sm border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none focus:border-[#0B8F6C]">
                      <option>All Materials</option>
                      <option>Concrete & Brick</option>
                      <option>Timber</option>
                      <option>Steel & Scrap</option>
                    </select>
                 </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                   { title: 'Crushed Concrete Aggregate', qty: '450', unit: 'Tons', dist: '12km', location: 'Johannesburg CBD', seller: 'Aveng Group', type: 'Concrete', price: 'R 120/t', match: '98%' },
                   { title: 'Reclaimed Formwork Timber', qty: '12', unit: 'Tons', dist: '3.4km', location: 'Sandton', seller: 'Grinaker-LTA', type: 'Timber', price: 'Offer', match: '85%' },
                   { title: 'Scrap Rebar & Structural Steel', qty: '8', unit: 'Tons', dist: '24km', location: 'Pretoria East', seller: 'WBHO', type: 'Steel', price: 'R 4.5K', match: '70%' },
                 ].map((item, i) => (
                   <div key={i} className="card-premium overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                      <div className="h-32 bg-slate-100 relative border-b border-slate-100">
                         <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/construction/400/200?blur=1')] bg-cover bg-center opacity-80"></div>
                         <div className="absolute top-3 right-3 bg-[#0B8F6C] text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center">
                            <RefreshCw className="w-3 h-3 mr-1" /> {item.match} AI Match
                         </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                         <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h3>
                         </div>
                         <p className="text-xs text-slate-500 mb-4 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {item.location} <span className="mx-2 text-slate-300">•</span> <span className="font-data text-[#0B8F6C]">{item.dist} away</span></p>
                         
                         <div className="grid grid-cols-2 gap-3 text-xs mb-6 flex-1">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                               <span className="block text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Quantity</span>
                               <strong className="text-slate-800 font-data text-lg">{item.qty} <span className="text-xs font-sans text-slate-500 font-normal">{item.unit}</span></strong>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                               <span className="block text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Price</span>
                               <strong className="text-[#0B8F6C] font-data text-lg">{item.price}</strong>
                            </div>
                         </div>

                         <div className="flex items-center justify-between pt-4 mt-auto">
                            <div className="flex items-center">
                               <ShieldCheck className="w-4 h-4 text-[#0B8F6C] mr-1" />
                               <span className="text-xs text-slate-600 font-medium">{item.seller}</span>
                            </div>
                            <button className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center">
                               Procure <ShoppingCart className="w-4 h-4 ml-2" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        ) : (
           <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                 <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Stakeholder Collaboration Hub</h3>
              <p className="text-slate-500 max-w-md mb-6">A unified workspace for Architects, Engineers, Regulators, and Suppliers to share dashboards and facilitate real-time approvals.</p>
              <div className="flex space-x-4">
                 <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Create Workspace</button>
                 <button className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition">Join via Code</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
