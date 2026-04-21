import React, { useState } from 'react';
import { Scale, FileCheck, CheckCircle2, AlertCircle, FileText, Download, ChevronRight, Activity } from 'lucide-react';

export default function ComplianceEngine() {
  const [activeTab, setActiveTab] = useState<'status' | 'reports'>('status');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Compliance Engine</h2>
          <p className="text-slate-500">Automated checks, reporting, and permit workflows aligned with DFFE & NEMA.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'status' ? 'border-[#0B8F6C] text-[#0B8F6C]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Scale className="w-4 h-4 inline mr-2" />
          Regulatory Health
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'reports' ? 'border-[#0B8F6C] text-[#0B8F6C]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Automated Reporting
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'status' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'National Environmental Management Act (NEMA)', status: 'Compliant', score: 98 },
                { title: 'DFFE Waste Regulations', status: 'Action Required', score: 82 },
                { title: 'Local Municipal By-Laws', status: 'Compliant', score: 100 }
              ].map((reg, i) => (
                <div key={i} className="card-premium p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight pr-4">{reg.title}</h3>
                    {reg.status === 'Compliant' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-4xl font-bold text-slate-900 font-data">{reg.score}</span>
                    <span className="text-sm text-slate-500 pb-1">/ 100 Score</span>
                  </div>
                  <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${reg.score > 90 ? 'bg-[#0B8F6C]' : 'bg-amber-500'}`} style={{width: `${reg.score}%`}}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                 <h4 className="font-semibold text-slate-800">Active Permit Workflows</h4>
                 <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">2 Pending Approval</span>
               </div>
               <div className="divide-y divide-slate-100">
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                     <div className="flex items-center">
                        <FileCheck className="w-5 h-5 text-slate-400 mr-4" />
                        <div>
                           <p className="font-medium text-slate-800 text-sm">Hazardous Waste Transit Permit (Haz-Class 3)</p>
                           <p className="text-xs text-slate-500 mt-0.5">Submitted via API to Municipal Environmental Office</p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-4">
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded">In Review</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                     </div>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                     <div className="flex items-center">
                        <FileCheck className="w-5 h-5 text-emerald-500 mr-4" />
                        <div>
                           <p className="font-medium text-slate-800 text-sm">Demolition Waste Recovery Declaration</p>
                           <p className="text-xs text-slate-500 mt-0.5">Approved on 12/04/2026</p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-4">
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">Approved</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Generate Reports</h3>
                {[
                  { name: 'ESG Quarterly Disclosures', desc: 'Full emissions & waste diversion rates.' },
                  { name: 'Comprehensive Waste Audit', desc: 'Site-by-site material breakdown.' },
                  { name: 'Carbon Footprint Analysis', desc: 'Scope 3 transport emissions mapped.' }
                ].map((rep, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm group">
                     <div>
                        <p className="font-semibold text-slate-800 text-sm">{rep.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{rep.desc}</p>
                     </div>
                     <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                     </button>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-center border border-slate-800">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                 <Activity className="w-8 h-8 text-emerald-400 mb-4" />
                 <h3 className="text-xl font-bold mb-2">Live API Integration Active</h3>
                 <p className="text-slate-400 text-sm mb-6">Your NEMA compliance data is currently syncing directly to local regulatory endpoints securely.</p>
                 <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-emerald-400">
                    <div>&gt; POST /api/v1/compliance/nema-sync</div>
                    <div>&gt; Payload verified</div>
                    <div>&gt; Checksum: 0x8F9B2A...</div>
                    <div className="text-slate-500 mt-2">// Next automated sync in 12hrs</div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
