
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Bell, User as UserIcon, Lock, FileText, ChevronRight, Save, LogOut, Loader2, Check } from 'lucide-react';
import { auth } from '../lib/firebaseClient';
import { supabase } from '../lib/supabaseClient';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  onProfileUpdate: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogout, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'terms'>('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const authUser = auth.currentUser;
      if (!authUser) throw new Error("No authenticated user found.");

      const { error: profileError } = await supabase.from('users').update({
        full_name: formData.name,
        organization: formData.organization,
      }).eq('id', authUser.uid);

      if (profileError) throw profileError;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Trigger refresh in parent
      onProfileUpdate();

    } catch (e: any) {
      console.error("Profile update error", e);
      setError(e.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fade-in">
             <h3 className="text-lg font-bold text-slate-800">Profile Settings</h3>
             {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                   <input 
                     type="text" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                   <input 
                     type="email" 
                     value={formData.email}
                     disabled
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                   <input 
                     type="text" 
                     value={formData.role}
                     disabled
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed capitalize"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
                   <input 
                     type="text" 
                     value={formData.organization}
                     onChange={(e) => setFormData({...formData, organization: e.target.value})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                   />
                </div>
             </div>
             <div className="pt-4 flex items-center space-x-4">
               <button 
                 onClick={handleSave}
                 disabled={saving}
                 className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center transition-colors disabled:opacity-70"
               >
                 {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                 {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
               </button>
               <button onClick={onLogout} className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center transition-colors">
                 <LogOut className="w-4 h-4 mr-2" /> Sign Out
               </button>
             </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
             <h3 className="text-lg font-bold text-slate-800">Notification Preferences</h3>
             <div className="space-y-4">
               {['Compliance Alerts', 'Manifest Updates', 'Weekly Reports', 'Marketing Updates'].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 animate-fade-in prose prose-sm max-w-none">
             <h3 className="text-lg font-bold text-slate-800">Privacy Policy</h3>
             <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
             <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-slate-700 space-y-4">
                <p><strong>1. Data Collection:</strong> We collect waste manifest data, user profile information, and construction site imagery to provide our services.</p>
                <p><strong>2. Data Usage:</strong> Your data is used to calculate environmental impact scores, generate compliance reports, and optimize logistics.</p>
                <p><strong>3. Third-Party Sharing:</strong> We do not sell your personal data. Aggregated, anonymized waste data may be shared with regulatory bodies for city-level planning.</p>
                <p><strong>4. Security:</strong> We utilize ISO 27001 compliant infrastructure and encryption at rest and in transit.</p>
             </div>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-6 animate-fade-in prose prose-sm max-w-none">
             <h3 className="text-lg font-bold text-slate-800">Terms of Service</h3>
             <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
             <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-slate-700 space-y-4">
                <p><strong>1. Acceptance:</strong> By using CG Waste Data, you agree to these terms.</p>
                <p><strong>2. Compliance:</strong> Users are responsible for the accuracy of waste data entered. Intentional falsification of regulatory data may result in account termination.</p>
                <p><strong>3. Liability:</strong> CG Waste Data provides estimates and advisory based on AI. Professional verification is recommended for critical structural decisions.</p>
                <p><strong>4. Termination:</strong> We reserve the right to suspend accounts violating acceptable use policies.</p>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
       {/* Settings Sidebar */}
       <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4">
          <h2 className="text-lg font-bold text-slate-800 mb-6 px-2">Settings</h2>
          <nav className="space-y-1">
             <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}>
                <UserIcon className="w-4 h-4" /> <span>Profile</span>
             </button>
             <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}>
                <Bell className="w-4 h-4" /> <span>Notifications</span>
             </button>
             <div className="my-4 border-t border-slate-200"></div>
             <button onClick={() => setActiveTab('privacy')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'privacy' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}>
                <Lock className="w-4 h-4" /> <span>Privacy Policy</span>
             </button>
             <button onClick={() => setActiveTab('terms')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'terms' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}>
                <FileText className="w-4 h-4" /> <span>Terms of Service</span>
             </button>
          </nav>
       </div>

       {/* Content */}
       <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
       </div>
    </div>
  );
};

export default Settings;
