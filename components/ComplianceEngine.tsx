import React, { useState } from 'react';
import { Scale, FileCheck, CheckCircle2, AlertCircle, FileText, Download, ChevronRight, Activity, Lock, BarChart3 } from 'lucide-react';
import { User } from '../types';
import ReportingEngine from './ReportingEngine';

interface ComplianceEngineProps {
  user?: User;
}

export default function ComplianceEngine({ user }: ComplianceEngineProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'reports'>('reports');

  // RBAC checks for NEMA reporting features
  const isAuthorizedManager = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Compliance & Enterprise Reporting Engine</h2>
          <p className="text-slate-500">Automated checks, BI analytics, JSON template generation, and permit workflows aligned with DFFE & NEMA.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'reports' ? 'border-[#0B8F6C] text-[#0B8F6C]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Reporting Studio & BI Canvas
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'status' ? 'border-[#0B8F6C] text-[#0B8F6C]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Scale className="w-4 h-4 inline mr-2" />
          Regulatory Health & Permits
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'reports' ? (
          <ReportingEngine user={user} />
        ) : (
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
        )}
      </div>
    </div>
  );
}

