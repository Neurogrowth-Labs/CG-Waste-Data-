
import React, { useState, useEffect } from 'react';
import { 
  Building2, HardHat, Recycle, Truck, Globe, Shield, UserCog, LogOut, Code, AlertTriangle, Blocks
} from 'lucide-react';
import { auth } from '../lib/firebaseClient';
import { signOut } from 'firebase/auth';

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
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

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start shadow-sm mb-6 max-w-4xl">
         <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 shrink-0 mt-0.5" />
         <div>
            <h4 className="text-sm font-bold text-amber-900">Interaction & Workflow Redirects</h4>
            <p className="text-xs text-amber-800 mt-1">This role view has been upgraded with deep-linked multi-step tooling. Look for action buttons inside the operational cards to trigger flows.</p>
         </div>
      </div>

      {/* Role Specific Content */}
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
