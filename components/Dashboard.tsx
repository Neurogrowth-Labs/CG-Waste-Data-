
import React, { useState, useEffect } from 'react';
import { 
  Building2, HardHat, Recycle, Truck, Globe, Shield, UserCog, LogOut, Code, AlertTriangle, Blocks
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { usePlatformMetrics } from '../lib/platformData';

import SiteManagerView from './views/SiteManagerView';
import TransporterView from './views/TransporterView';
import RecyclerView from './views/RecyclerView';
import ExecutiveView from './views/ExecutiveView';
import RegulatorView from './views/RegulatorView';
import InvestorView from './views/InvestorView';

// --- Main Dashboard Component ---

interface DashboardProps {
  initialRole?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ initialRole = 'manager' }) => {
  const role = initialRole;
  const { metrics, isLoading, isError } = usePlatformMetrics();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const renderDashboard = () => {
    switch (role) {
      case 'manager': return <SiteManagerView />;
      case 'transporter': return <TransporterView />;
      case 'recycler': return <RecyclerView />;
      case 'executive': return <ExecutiveView />;
      case 'regulator': return <RegulatorView />;
      case 'investor': return <InvestorView />;
      default: return <SiteManagerView />;
    }
  };

  const getRoleIcon = (currentRole: string) => {
    switch (currentRole) {
      case 'manager': return <HardHat className="w-5 h-5 mr-3" />;
      case 'transporter': return <Truck className="w-5 h-5 mr-3" />;
      case 'recycler': return <Recycle className="w-5 h-5 mr-3" />;
      case 'executive': return <Building2 className="w-5 h-5 mr-3" />;
      case 'regulator': return <Shield className="w-5 h-5 mr-3" />;
      case 'investor': return <Globe className="w-5 h-5 mr-3" />;
      default: return <UserCog className="w-5 h-5 mr-3" />;
    }
  };

  const getRoleTitle = (currentRole: string) => {
    switch (currentRole) {
      case 'manager': return 'Site Manager / Contractor';
      case 'transporter': return 'Waste Operator / Transporter';
      case 'recycler': return 'Recycling Facility';
      case 'executive': return 'Executive / Developer';
      case 'regulator': return 'Government / Regulator';
      case 'investor': return 'Investor / ESG Auditor';
      default: return 'Site Manager / Contractor';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header & Context Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card-premium p-6 bg-slate-900 border-none shadow-xl text-white relative z-20">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Blocks className="w-32 h-32 text-[#12B76A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-data flex items-center">
            {getRoleIcon(role)} {getRoleTitle(role)}
          </h1>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm leading-relaxed">
            {role === 'manager' && 'Control waste in real-time and reduce cost on-site. AI integration active.'}
            {role === 'transporter' && 'Move waste efficiently, profitably, and transparently.'}
            {role === 'recycler' && 'Maximize material recovery and profitability. Live sensor sync online.'}
            {role === 'executive' && 'Strategic control, cost reduction, and ESG performance.'}
            {role === 'regulator' && 'Enforce compliance, monitor impact, and improve policy.'}
            {role === 'investor' && 'Verify sustainability claims and measure real impact. TCFD active.'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
          >
             <LogOut className="w-4 h-4 mr-2" />
             <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm mb-6 max-w-5xl">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start">
               <AlertTriangle className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${isError ? 'text-amber-500' : 'text-emerald-500'}`} />
               <div>
                  <h4 className="text-sm font-bold text-slate-900">Cross-role data synchronization</h4>
                  <p className="text-xs text-slate-600 mt-1">All role dashboards read from the shared waste log stream. Empty states now show zero until production data is available instead of mock metrics.</p>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
               <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Manifests</p>
                  <p className="font-data font-bold text-slate-900">{isLoading ? '...' : metrics.activeManifests}</p>
               </div>
               <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Waste</p>
                  <p className="font-data font-bold text-slate-900">{isLoading ? '...' : `${metrics.totalWaste.toFixed(1)}t`}</p>
               </div>
               <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Diversion</p>
                  <p className="font-data font-bold text-slate-900">{isLoading ? '...' : `${metrics.diversionRate.toFixed(0)}%`}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Role Specific Content */}
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
