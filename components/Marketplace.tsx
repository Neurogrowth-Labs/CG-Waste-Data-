import React, { useState, useMemo } from 'react';
import { Store, RefreshCw, ShoppingCart, MessageSquare, ShieldCheck, MapPin, Truck, Leaf, Plus, Globe, Search, Link as LinkIcon, Phone } from 'lucide-react';
import { SUPPLIER_DATABASE, Supplier } from '../lib/suppliers';

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'collaboration'>('suppliers');
  
  // AI Procurement Flow States
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const filteredSuppliers = useMemo(() => {
    return SUPPLIER_DATABASE.filter(s => {
      const matchesSearch = s.Company_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.Specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = regionFilter === 'All' || s.Region === regionFilter;
      const matchesCat = categoryFilter === 'All' || s.Material_Class.includes(categoryFilter) || s.Category.includes(categoryFilter);
      return matchesSearch && matchesRegion && matchesCat;
    });
  }, [searchQuery, regionFilter, categoryFilter]);

  const uniqueRegions = ['All', ...new Set(SUPPLIER_DATABASE.map(s => s.Region))];
  const uniqueCategories = ['All', ...new Set(SUPPLIER_DATABASE.map(s => s.Category))];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Global Sustainable Materials</h2>
          <p className="text-slate-500">Verified Global Supplier Database & AI Procurement Flow</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
          <Globe className="w-4 h-4 mr-2" /> Sync API Registry
        </button>
      </div>

      <div className="flex border-b border-slate-200 shrink-0">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors flex items-center ${
            activeTab === 'suppliers' ? 'border-[#0B8F6C] text-[#0B8F6C]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Store className="w-4 h-4 inline mr-2" />
          Verified Suppliers ({SUPPLIER_DATABASE.length}+)
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
        {activeTab === 'suppliers' ? (
           <div className="space-y-6 pb-6">
              {/* AI Procurement Filters */}
              <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm gap-4">
                 <div className="flex-1 relative w-full">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search material or company (e.g., 'Low-carbon concrete in Cape Town')" 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#0B8F6C] focus:ring-1 focus:ring-[#0B8F6C]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <div className="flex space-x-2 w-full md:w-auto">
                    <select 
                      className="text-sm border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none focus:border-[#0B8F6C]"
                      value={regionFilter}
                      onChange={(e) => setRegionFilter(e.target.value)}
                    >
                      {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select 
                      className="text-sm border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none focus:border-[#0B8F6C]"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      {uniqueCategories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                    </select>
                 </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredSuppliers.map((supplier) => (
                   <div key={supplier.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                      <div className="p-5 flex-1 flex flex-col">
                         <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{supplier.Company_Name}</h3>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">{supplier.Scale}</span>
                         </div>
                         <p className="text-xs text-[#0B8F6C] font-semibold mb-3">{supplier.Material_Class}</p>
                         <p className="text-sm text-slate-600 mb-4 flex-1">{supplier.Specialty}</p>

                         <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                            <div className="bg-slate-50 p-2 rounded flex flex-col">
                               <span className="text-slate-400 uppercase text-[10px] mb-1">Carbon Rating</span>
                               <strong className="text-slate-800 text-sm flex items-center"><Leaf className={`w-3 h-3 mr-1 ${supplier.Carbon_Rating === 'A' ? 'text-emerald-500' : 'text-amber-500'}`} /> Grade {supplier.Carbon_Rating}</strong>
                            </div>
                            <div className="bg-slate-50 p-2 rounded flex flex-col">
                               <span className="text-slate-400 uppercase text-[10px] mb-1">Cost Index</span>
                               <strong className="text-slate-800 text-sm">{'₪'.repeat(supplier.Pricing_Index)}{'₪'.repeat(5 - supplier.Pricing_Index).replace(/₪/g, '<span class="text-slate-200">₪</span>')} <span className="text-slate-400 font-normal">({supplier.Pricing_Index}/5)</span></strong>
                            </div>
                         </div>
                         
                         <div className="space-y-2 mb-4 text-xs text-slate-600">
                           <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2 text-slate-400"/> {supplier.Country} ({supplier.Region})</div>
                           {supplier.Phone && <div className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-slate-400"/> {supplier.Phone}</div>}
                           <div className="flex items-center"><LinkIcon className="w-3.5 h-3.5 mr-2 text-slate-400"/> <a href={`https://${supplier.Website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{supplier.Website}</a></div>
                         </div>

                         <div className="flex flex-wrap gap-1 mb-4">
                           {supplier.Certifications.map(cert => (
                             <span key={cert} className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">{cert}</span>
                           ))}
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                            <div className="flex items-center">
                               <ShieldCheck className="w-4 h-4 text-[#0B8F6C] mr-1" />
                               <span className="text-xs text-slate-600 font-medium">Verified Source</span>
                            </div>
                            <button className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center">
                               Procure <ShoppingCart className="w-4 h-4 ml-2" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {filteredSuppliers.length === 0 && (
                   <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                     No verified suppliers match your AI Procurement criteria.
                   </div>
                 )}
              </div>
           </div>
        ) : (
           <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                 <Truck className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Logistics Integration Hub</h3>
              <p className="text-slate-500 max-w-md mb-6">Track deliveries, monitor scope 3 emissions, and orchestrate reverse logistics for circular materials.</p>
              <div className="flex space-x-4">
                 <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Connect Fleet API</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
