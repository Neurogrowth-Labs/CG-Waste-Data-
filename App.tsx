
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Intelligence from './components/Intelligence';
import CreativeStudio from './components/CreativeStudio';
import LiveAssistant from './components/LiveAssistant';
import DigitalEDGE from './components/DigitalEDGE';
import { ProjectSourceWorkflow, WasteTrackingWorkflow } from './components/Workflows';
import { Auth } from './components/Auth';
import { View, User } from './types';
import { Mic, Plus, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

const ProjectsView = () => {
  const [showNewProject, setShowNewProject] = useState(false);

  if (showNewProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <ProjectSourceWorkflow 
            onComplete={() => setShowNewProject(false)} 
            onCancel={() => setShowNewProject(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Portfolio</h2>
        <button 
          onClick={() => setShowNewProject(true)}
          className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200">
            <tr>
              <th className="p-4">Project Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4">Est. Waste</th>
              <th className="p-4">HazMat Status</th>
              <th className="p-4">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-900">Skyline Tower Phase 2</td>
              <td className="p-4">New York, NY</td>
              <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span></td>
              <td className="p-4">1,250 t</td>
              <td className="p-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                   <AlertTriangle className="w-3 h-3 mr-1.5" />
                   Potential
                </span>
              </td>
              <td className="p-4">
                 <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[100px] mb-1">
                   <div className="bg-green-500 h-1.5 rounded-full" style={{width: '88%'}}></div>
                 </div>
                 <span className="text-xs">88%</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-900">Riverfront Park Demo</td>
              <td className="p-4">London, UK</td>
              <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Planning</span></td>
              <td className="p-4">450 t</td>
              <td className="p-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                   <AlertOctagon className="w-3 h-3 mr-1.5" />
                   Detected
                </span>
              </td>
              <td className="p-4 text-slate-400">-</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-900">Site Alpha Remediation</td>
              <td className="p-4">Austin, TX</td>
              <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Audited</span></td>
              <td className="p-4">80 t</td>
              <td className="p-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                   <CheckCircle className="w-3 h-3 mr-1.5" />
                   Clear
                </span>
              </td>
              <td className="p-4">
                 <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[100px] mb-1">
                   <div className="bg-amber-500 h-1.5 rounded-full" style={{width: '65%'}}></div>
                 </div>
                 <span className="text-xs">65%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TrackingView = () => (
   <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Waste Tracking</h2>
        <p className="text-slate-500">Create digital manifests and track live logistics.</p>
      </div>
      <div className="flex-1 flex items-center justify-center">
         <div className="w-full">
           <WasteTrackingWorkflow />
         </div>
      </div>
   </div>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [showLive, setShowLive] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // You could set view based on role here if needed
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.DASHBOARD);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard initialRole={currentUser.role} />;
      case View.INTELLIGENCE: return <Intelligence />;
      case View.CREATIVE: return <CreativeStudio />;
      case View.EDGE: return <DigitalEDGE />;
      case View.PROJECTS: return <ProjectsView />;
      case View.TRACKING: return <TrackingView />;
      default: return <div className="text-slate-400">Section under development</div>;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView} user={currentUser} onLogout={handleLogout}>
      {renderContent()}

      {/* Floating Action Button for Live Assistant */}
      <button 
        onClick={() => setShowLive(!showLive)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform z-50"
      >
        <Mic className="w-6 h-6" />
      </button>

      {showLive && <LiveAssistant onClose={() => setShowLive(false)} />}
    </Layout>
  );
};

export default App;
