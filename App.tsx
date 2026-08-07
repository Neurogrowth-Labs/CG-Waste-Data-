
import React, { Suspense, useState, useEffect } from 'react';
import Layout from './components/Layout';

import { RealtimeNotifications } from './components/RealtimeNotifications';
import { ProjectSourceWorkflow, WasteTrackingWorkflow } from './components/Workflows';
import { Auth } from './components/Auth';
import { View, User } from './types';
import { Mic, Plus, AlertTriangle, CheckCircle, AlertOctagon, Loader2, Truck, Clock, MapPin, Search } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

const ProjectsView = React.lazy(() => import('./components/views/ProjectsView').then((module) => ({ default: module.ProjectsView })));
import { LandingView } from './components/views/LandingView';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Intelligence = React.lazy(() => import('./components/Intelligence'));
const CreativeStudio = React.lazy(() => import('./components/CreativeStudio'));
const LiveAssistant = React.lazy(() => import('./components/LiveAssistant'));
const DigitalEDGE = React.lazy(() => import('./components/DigitalEDGE'));
const Settings = React.lazy(() => import('./components/Settings'));
const FieldOperations = React.lazy(() => import('./components/FieldOperations'));
const ComplianceEngine = React.lazy(() => import('./components/ComplianceEngine'));
const DigitalTwin = React.lazy(() => import('./components/DigitalTwin'));
const Marketplace = React.lazy(() => import('./components/Marketplace'));
const EducationHub = React.lazy(() => import('./components/EducationHub'));


const TrackingView = () => {
   const queryClient = useQueryClient();

   const { data: manifests = [], isLoading } = useQuery({
     queryKey: ['manifests'],
     queryFn: async () => {
       const { data, error } = await supabase.from('waste_logs').select('*').order('created_at', { ascending: false }).limit(20);
       if (error) throw error;
       return data || [];
     }
   });

   useEffect(() => {
     const subscription = supabase.channel('public:waste_logs')
       .on('postgres_changes', { event: '*', schema: 'public', table: 'waste_logs' }, () => {
         queryClient.invalidateQueries({ queryKey: ['manifests'] });
       }).subscribe();

     return () => { supabase.removeChannel(subscription); };
   }, [queryClient]);

   return (
    <div className="flex flex-col h-full space-y-8">
       <div className="flex-none">
         <h2 className="text-2xl font-bold text-slate-800">Waste Tracking</h2>
         <p className="text-slate-500">Create digital manifests and track live logistics.</p>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
          {/* Left: Wizard */}
          <div className="flex-none lg:flex-1 overflow-y-auto">
             <WasteTrackingWorkflow />
          </div>

          {/* Right: Live Board */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[600px] lg:h-auto">
             <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                   <Truck className="w-5 h-5 text-slate-600" />
                   <h3 className="font-bold text-slate-800">Live Logistics Board</h3>
                </div>
                <div className="flex items-center space-x-1 text-xs text-green-600">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="font-medium">Real-time</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                   <table className="w-full text-sm text-left">
                      <thead className="bg-white text-slate-500 font-medium sticky top-0 shadow-sm z-10">
                         <tr>
                            <th className="px-4 py-3">Manifest ID</th>
                            <th className="px-4 py-3">Material</th>
                            <th className="px-4 py-3">Hauler</th>
                            <th className="px-4 py-3">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i}>
                               <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded animate-pulse w-24 mb-1"></div><div className="h-3 bg-slate-200 rounded animate-pulse w-16"></div></td>
                               <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded animate-pulse w-20 mb-1"></div><div className="h-3 bg-slate-200 rounded animate-pulse w-12"></div></td>
                               <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded animate-pulse w-28 mb-1"></div><div className="h-3 bg-slate-200 rounded animate-pulse w-16"></div></td>
                               <td className="px-4 py-3"><div className="h-6 bg-slate-200 rounded animate-pulse w-16"></div></td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                ) : manifests.length === 0 ? (
                   <div className="p-8 text-center text-slate-400 text-sm">No active manifests found.</div>
                ) : (
                   <table className="w-full text-sm text-left">
                      <thead className="bg-white text-slate-500 font-medium sticky top-0 shadow-sm z-10">
                         <tr>
                            <th className="px-4 py-3">Manifest ID</th>
                            <th className="px-4 py-3">Material</th>
                            <th className="px-4 py-3">Hauler</th>
                            <th className="px-4 py-3">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {manifests.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                               <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">
                                  {m.manifest_number}
                                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {m.created_at && m.created_at.toDate ? new Date(m.created_at.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString()}
                                  </div>
                               </td>
                               <td className="px-4 py-3">
                                  <span className="font-medium">{m.material}</span>
                                  <div className="text-xs text-slate-500">{m.weight} tons</div>
                               </td>
                               <td className="px-4 py-3">
                                  <div className="text-xs text-slate-600 truncate max-w-[120px]" title={m.hauler}>{m.hauler}</div>
                                  <div className="text-[10px] text-slate-400 flex items-center mt-0.5">
                                     <MapPin className="w-3 h-3 mr-1" /> {m.destination?.split(' ')[0]}...
                                  </div>
                               </td>
                               <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                                     m.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                     m.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                     m.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                     'bg-slate-100 text-slate-600'
                                  }`}>
                                     {m.status}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                )}
             </div>
          </div>
       </div>
    </div>
   );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [showLive, setShowLive] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Initial fetch
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase auth error:", error);
        }

        if (session && session.user && session.user.email) {
          setCurrentUser({
            name: 'Loading Profile...',
            email: session.user.email,
            role: 'manager',
            organization: '',
            jurisdiction: '',
            standards: []
          });
          setLoadingSession(false);
          fetchProfile(session.user.id, session.user.email);
        } else {
          setCurrentUser(null);
          setCurrentView(View.DASHBOARD);
          setLoadingSession(false);
        }
      } catch (e) {
        console.error("Session fetch failed:", e);
        setCurrentUser(null);
        setCurrentView(View.DASHBOARD);
        setLoadingSession(false);
      }
    };
    
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && session.user && session.user.email) {
        setLoadingSession(false);
        await fetchProfile(session.user.id, session.user.email);
      } else {
        setCurrentUser(null);
        setCurrentView(View.DASHBOARD);
        setLoadingSession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
      
      if (data && !error) {
        setCurrentUser({
          name: data.full_name || 'User',
          email: email,
          role: data.role || 'manager',
          organization: data.organization || '',
          jurisdiction: data.jurisdiction || '',
          standards: data.standards || []
        });
      } else {
         setCurrentUser({
          name: 'New User',
          email: email,
          role: 'manager',
          organization: '',
          jurisdiction: '',
          standards: []
        });
      }
    } catch (e) {
      console.error("Profile fetch error", e);
      setCurrentUser({
          name: 'User (Offline)',
          email: email,
          role: 'manager',
          organization: 'Offline Mode',
          jurisdiction: '',
          standards: []
      });
    } finally {
      setLoadingSession(false);
    }
  };

  const refreshProfile = async () => {
    if (!currentUser) return;
    setLoadingSession(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user && session.user.email) {
      await fetchProfile(session.user.id, session.user.email);
    }
    setLoadingSession(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error", e);
      setCurrentUser(null);
    }
  };

  const handleManualLogin = (user: User) => {
    setCurrentUser(user);
    setLoadingSession(false);
  };

  if (loadingSession) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    if (showAuth) {
      return <Auth onLogin={handleManualLogin} />;
    }
    return <LandingView onRequestAccess={() => setShowAuth(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard initialRole={currentUser.role} />;
      case View.FIELD_OPS: return <FieldOperations />;
      case View.PROJECTS: return <ProjectsView />;
      case View.TRACKING: return <TrackingView />;
      case View.TWIN: return <DigitalTwin />;
      case View.INTELLIGENCE: return <Intelligence />;
      case View.EDGE: return <DigitalEDGE />;
      case View.COMPLIANCE: return <ComplianceEngine user={currentUser} />;
      case View.MARKETPLACE: return <Marketplace />;
      case View.EDUCATION: return <EducationHub />;
      case View.CREATIVE: return <CreativeStudio />;
      case View.SETTINGS: return <Settings user={currentUser} onLogout={handleLogout} onProfileUpdate={refreshProfile} />;
      default: return <div className="text-slate-400">Section under development</div>;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView} user={currentUser} onLogout={handleLogout}>
      <Suspense fallback={<div className="h-full flex items-center justify-center text-slate-500"><Loader2 className="w-6 h-6 mr-2 animate-spin text-green-600" /> Loading module...</div>}>
        {renderContent()}
      </Suspense>
      
      {/* Real-time Notifications Overlay */}
      <RealtimeNotifications />

      {/* Floating Action Button for Live Assistant */}
      <button 
        onClick={() => setShowLive(!showLive)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform z-50"
      >
        <Mic className="w-6 h-6" />
      </button>

      {showLive && (
        <Suspense fallback={null}>
          <LiveAssistant onClose={() => setShowLive(false)} />
        </Suspense>
      )}
    </Layout>
  );
};

export default App;
