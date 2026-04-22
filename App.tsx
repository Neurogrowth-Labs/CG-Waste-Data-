
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Intelligence from './components/Intelligence';
import CreativeStudio from './components/CreativeStudio';
import LiveAssistant from './components/LiveAssistant';
import DigitalEDGE from './components/DigitalEDGE';
import Settings from './components/Settings';
import FieldOperations from './components/FieldOperations';
import ComplianceEngine from './components/ComplianceEngine';
import DigitalTwin from './components/DigitalTwin';
import Marketplace from './components/Marketplace';
import EducationHub from './components/EducationHub';
import { RealtimeNotifications } from './components/RealtimeNotifications';
import { ProjectSourceWorkflow, WasteTrackingWorkflow } from './components/Workflows';
import { Auth } from './components/Auth';
import { View, User } from './types';
import { Mic, Plus, AlertTriangle, CheckCircle, AlertOctagon, Loader2, Truck, Clock, MapPin } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

const ProjectsView = () => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setProjects(data);
      } catch (e) {
        console.error("Error fetching projects:", e);
        // Fallback or empty state is handled by the UI below
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    // Realtime Subscription
    const channel = supabase.channel('projects-view-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
           if (payload.eventType === 'INSERT') {
             setProjects(prev => [payload.new, ...prev]);
           } else if (payload.eventType === 'UPDATE') {
             setProjects(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
           } else if (payload.eventType === 'DELETE') {
             setProjects(prev => prev.filter(p => p.id !== payload.old.id));
           }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []); // Remove dependency on showNewProject as realtime handles inserts

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
              <th className="p-4">Phase</th>
              <th className="p-4">HazMat Status</th>
              <th className="p-4">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">No projects found. Create one to get started.</td></tr>
            ) : (
              projects.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{p.name}</td>
                  <td className="p-4">{p.location || 'N/A'}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       p.status === 'Active' ? 'bg-green-100 text-green-700' : 
                       p.status === 'Planning' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                     }`}>{p.status}</span>
                  </td>
                  <td className="p-4">{p.construction_phase}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      p.hazmat_status === 'Detected' ? 'bg-red-100 text-red-700' :
                      p.hazmat_status === 'Potential' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                       {p.hazmat_status === 'Detected' ? <AlertOctagon className="w-3 h-3 mr-1.5" /> : 
                        p.hazmat_status === 'Potential' ? <AlertTriangle className="w-3 h-3 mr-1.5" /> : 
                        <CheckCircle className="w-3 h-3 mr-1.5" />}
                       {p.hazmat_status}
                    </span>
                  </td>
                  <td className="p-4">
                     <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[100px] mb-1">
                       <div className={`h-1.5 rounded-full ${
                         (p.compliance_score || 0) >= 80 ? 'bg-green-500' : 
                         (p.compliance_score || 0) >= 50 ? 'bg-amber-500' : 'bg-red-500'
                       }`} style={{width: `${p.compliance_score || 0}%`}}></div>
                     </div>
                     <span className="text-xs">{p.compliance_score || 0}%</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TrackingView = () => {
   const [manifests, setManifests] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     // Fetch existing manifests
     const fetchManifests = async () => {
       try {
         const { data, error } = await supabase.from('waste_manifests').select('*').order('created_at', { ascending: false });
         if (error) throw error;
         if (data) setManifests(data);
       } catch (e) {
         console.error("Error fetching manifests:", e);
       } finally {
         setLoading(false);
       }
     };
     fetchManifests();

     // Realtime Subscription for Status Updates
     const channel = supabase.channel('manifests-view-realtime')
       .on(
         'postgres_changes',
         { event: '*', schema: 'public', table: 'waste_manifests' },
         (payload) => {
            if (payload.eventType === 'INSERT') {
              setManifests(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setManifests(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
            }
         }
       )
       .subscribe();

      return () => { supabase.removeChannel(channel); };
   }, []);

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
                {loading ? (
                   <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
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
                                    {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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

  useEffect(() => {
    // 1. Check for active session on load with robust error handling
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session?.user) {
          await fetchProfile(data.session.user.id, data.session.user.email!);
        } else {
          // No session found, stop loading to show Auth screen
          setLoadingSession(false);
        }
      } catch (err) {
        console.warn("Supabase session check failed - potential network or config issue:", err);
        // Ensure we stop loading so the user isn't stuck on a white screen
        setLoadingSession(false);
      }
    };

    checkSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setLoadingSession(true);
        await fetchProfile(session.user.id, session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView(View.DASHBOARD);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // Even if profile fetch fails, we can populate basic user info from auth or defaults
      if (data) {
        setCurrentUser({
          name: data.full_name || 'User',
          email: email,
          role: data.role || 'manager',
          organization: data.organization || '',
          jurisdiction: data.jurisdiction || '',
          standards: data.standards || []
        });
      } else {
         // Fallback if profile doesn't exist yet
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
      // Fallback to allow app usage
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
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      await fetchProfile(user.id, user.email);
    }
    setLoadingSession(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error", e);
      setCurrentUser(null); // Force local logout
    }
  };

  const handleManualLogin = (user: User) => {
    setCurrentUser(user);
    setLoadingSession(false);
  };

  if (loadingSession) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
    </div>;
  }

  if (!currentUser) {
    return <Auth onLogin={handleManualLogin} />;
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
      {renderContent()}
      
      {/* Real-time Notifications Overlay */}
      <RealtimeNotifications />

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
