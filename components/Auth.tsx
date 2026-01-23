
import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Building2, FileCheck, Globe, 
  ChevronRight, Check, AlertTriangle, Fingerprint, Smartphone, Mail, Loader2
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthProps {
  onLogin: (user: User) => void;
}

const STEPS = [
  { id: 1, label: 'Identity' },
  { id: 2, label: 'Organization' },
  { id: 3, label: 'Compliance' },
  { id: 4, label: 'Security' }
];

const ISO_STANDARDS = [
  { id: 'iso14001', label: 'ISO 14001 (Environment)', icon: Globe },
  { id: 'iso9001', label: 'ISO 9001 (Quality)', icon: FileCheck },
  { id: 'iso27001', label: 'ISO 27001 (Security)', icon: Lock },
  { id: 'esg', label: 'ESG Reporting', icon: Building2 },
];

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    orgName: '',
    role: 'manager',
    jurisdiction: 'USA',
    standards: [] as string[],
    mfaMethod: 'app'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      // onLogin will be handled by the session listener in App.tsx
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setError(null);

    // Step 1 Validation: Identity
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError("Please enter your full legal name.");
        return;
      }
      if (!formData.email.trim()) {
        setError("Please enter your work email.");
        return;
      }
      // Simple email format check
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    // Step 2 Validation: Organization
    if (step === 2) {
      if (!formData.orgName.trim()) {
        setError("Organization Name is required.");
        return;
      }
    }

    // Proceed if valid
    setStep(step + 1);
  };

  const handleSignupComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: 'TemporaryPassword123!', // In a real app, ask for password in UI
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
            organization: formData.orgName,
            jurisdiction: formData.jurisdiction,
            standards: formData.standards
          }
        }
      });

      if (error) throw error;
      
      // Auto-login happens on signup usually, App.tsx listener will catch it
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Signup failed');
      setLoading(false);
    }
  };

  const toggleStandard = (id: string) => {
    setFormData(prev => ({
      ...prev,
      standards: prev.standards.includes(id) 
        ? prev.standards.filter(s => s !== id)
        : [...prev.standards, id]
    }));
  };

  const handleShowLegal = (e: React.MouseEvent, type: 'terms' | 'privacy') => {
      e.preventDefault();
      // Since Auth is outside main app context, we use a simple alert or modal approach here
      // For this demo, a simple alert suffices to show interactivity, or we could add a state for a modal.
      alert(`${type === 'terms' ? 'Terms of Service' : 'Privacy Policy'} content would appear here in a production environment.`);
  };

  // Background Pattern Styles (Data Mesh / Hexagon Grid)
  const backgroundStyle = {
    backgroundColor: '#0f172a',
    backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)`,
    position: 'relative' as const,
  };

  const overlayPattern = {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      zIndex: 0
  };

  if (mode === 'login') {
    return (
      <div style={backgroundStyle} className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div style={overlayPattern}></div>
        {/* Organic Green Glow to represent Recycling/Sustainability */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-[380px] overflow-hidden flex flex-col z-10 border border-slate-700/30 transform transition-all hover:shadow-green-900/20">
          <div className="p-6 bg-slate-50/80 border-b border-slate-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-600/20">
               <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3L3 8.2V15.8L12 21L21 15.8V8.2L12 3Z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V21" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8L3 13" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8L21 13" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CG Waste Data</h1>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Enterprise Construction Intelligence</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {error && (
              <div className="p-2.5 bg-red-50 text-red-600 text-xs rounded-lg flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-2" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-70 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Secure Login'}
            </button>
            
            {/* Google Sign In Section */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500 text-[10px] uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <div className="text-center pt-1">
              <button 
                type="button" 
                onClick={() => setMode('signup')}
                className="text-xs text-green-700 font-bold hover:underline"
              >
                Create Enterprise Account
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-center space-x-4 opacity-70">
              <div className="flex items-center text-[10px] text-slate-500">
                <Lock className="w-2.5 h-2.5 mr-1" /> ISO 27001
              </div>
              <div className="flex items-center text-[10px] text-slate-500">
                <ShieldCheck className="w-2.5 h-2.5 mr-1" /> SOC 2 Type II
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // SIGN UP / ONBOARDING WIZARD
  return (
    <div style={backgroundStyle} className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative">
       <div style={overlayPattern}></div>
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[450px] z-10 border border-slate-700/30">
        
        {/* Sidebar / Progress */}
        <div className="bg-slate-900 w-full md:w-60 p-6 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle grid for sidebar too */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: overlayPattern.backgroundImage}}></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3L3 8.2V15.8L12 21L21 15.8V8.2L12 3Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V21" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8L3 13" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8L21 13" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </div>
              <div>
                 <span className="block text-lg font-bold tracking-tight text-white leading-none">CG Waste</span>
                 <span className="block text-[8px] font-medium text-emerald-200 tracking-widest uppercase mt-0.5">Intelligence</span>
              </div>
            </div>
            
            <nav className="space-y-5 relative">
               {/* Connecting Line */}
               <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-800 -z-0"></div>
               
               {STEPS.map((s, i) => (
                 <div key={s.id} className="relative z-10 flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      step >= s.id 
                        ? 'bg-green-50 border-green-500 text-white' 
                        : 'bg-slate-900 border-slate-600 text-slate-400'
                    }`}>
                      {step > s.id ? <Check className="w-3 h-3" /> : s.id}
                    </div>
                    <span className={`text-xs font-medium ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>
                      {s.label}
                    </span>
                 </div>
               ))}
            </nav>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-800 relative z-10">
             <p className="text-[10px] text-slate-400 leading-relaxed">
               Secure onboarding compliant with ISO 27001 policies.
             </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col bg-slate-50">
          {error && (
             <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs rounded-lg flex items-center">
               <AlertTriangle className="w-3.5 h-3.5 mr-2" />
               {error}
             </div>
          )}
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">Identity Verification</h2>
                   <p className="text-sm text-slate-500">Establish your digital identity for audit traceability.</p>
                </div>
                <div className="space-y-3">
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name</label>
                     <input 
                       type="text" 
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" 
                       placeholder="John Doe"
                       value={formData.fullName}
                       onChange={e => setFormData({...formData, fullName: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
                     <input 
                       type="email" 
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" 
                       placeholder="john@construction-inc.com"
                       value={formData.email}
                       onChange={e => setFormData({...formData, email: e.target.value})}
                     />
                   </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">Organization & Role</h2>
                   <p className="text-sm text-slate-500">Define your access level and jurisdiction.</p>
                </div>
                <div className="space-y-3">
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Organization Name</label>
                     <div className="relative">
                       <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                       <input 
                         type="text" 
                         className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" 
                         placeholder="Company Ltd."
                         value={formData.orgName}
                         onChange={e => setFormData({...formData, orgName: e.target.value})}
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Role Type</label>
                     <select 
                       value={formData.role}
                       onChange={e => setFormData({...formData, role: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm"
                     >
                       <option value="manager">Site Manager / Contractor</option>
                       <option value="transporter">Waste Operator / Transporter</option>
                       <option value="recycler">Recycling Facility</option>
                       <option value="executive">Executive / Developer</option>
                       <option value="regulator">Government / Regulator</option>
                       <option value="investor">Investor / ESG Auditor</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Jurisdiction</label>
                     <select 
                       value={formData.jurisdiction}
                       onChange={e => setFormData({...formData, jurisdiction: e.target.value})}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm"
                     >
                       <option value="USA">United States</option>
                       <option value="UK">United Kingdom</option>
                       <option value="EU">European Union</option>
                       <option value="AFRICA_EA">East Africa (EAC)</option>
                       <option value="AFRICA_WA">West Africa (ECOWAS)</option>
                     </select>
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">Regulatory Context</h2>
                   <p className="text-sm text-slate-500">Select applicable frameworks for compliance tracking.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {ISO_STANDARDS.map(std => (
                    <button
                      key={std.id}
                      onClick={() => toggleStandard(std.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                        formData.standards.includes(std.id)
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-slate-200 hover:border-green-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${formData.standards.includes(std.id) ? 'bg-white text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                          <std.icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-medium ${formData.standards.includes(std.id) ? 'text-green-900' : 'text-slate-700'}`}>
                          {std.label}
                        </span>
                      </div>
                      {formData.standards.includes(std.id) && <Check className="w-4 h-4 text-green-600" />}
                    </button>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <label className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-0.5 rounded text-blue-600" defaultChecked />
                    <span className="text-[10px] text-blue-800 leading-snug">
                      I acknowledge responsibility for data accuracy in accordance with the selected frameworks and ISO 9001 quality controls.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
               <div className="space-y-4 animate-fade-in">
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">Security Hardening</h2>
                    <p className="text-sm text-slate-500">Secure your account with Multi-Factor Authentication (MFA).</p>
                 </div>

                 <div className="space-y-3">
                    <button 
                      onClick={() => setFormData({...formData, mfaMethod: 'app'})}
                      className={`w-full p-3 border rounded-xl flex items-center justify-between bg-white ${formData.mfaMethod === 'app' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                    >
                       <div className="flex items-center">
                          <Smartphone className="w-5 h-5 text-slate-600 mr-3" />
                          <div className="text-left">
                             <div className="text-sm font-semibold text-slate-900">Authenticator App</div>
                             <div className="text-[10px] text-slate-500">Google Auth, Authy, MS Auth</div>
                          </div>
                       </div>
                       {formData.mfaMethod === 'app' && <div className="px-1.5 py-0.5 bg-green-200 text-green-800 text-[10px] font-bold rounded">RECOMMENDED</div>}
                    </button>

                    <button 
                      onClick={() => setFormData({...formData, mfaMethod: 'bio'})}
                      className={`w-full p-3 border rounded-xl flex items-center justify-between bg-white ${formData.mfaMethod === 'bio' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                    >
                       <div className="flex items-center">
                          <Fingerprint className="w-5 h-5 text-slate-600 mr-3" />
                          <div className="text-left">
                             <div className="text-sm font-semibold text-slate-900">Hardware Key / Bio</div>
                             <div className="text-[10px] text-slate-500">YubiKey, TouchID, Windows Hello</div>
                          </div>
                       </div>
                    </button>
                 </div>
                 
                 <div className="pt-2 text-center">
                    <p className="text-[10px] text-slate-400">
                       By clicking Complete, you agree to the <button onClick={(e) => handleShowLegal(e, 'terms')} className="text-green-600 hover:underline">Terms</button> and <button onClick={(e) => handleShowLegal(e, 'privacy')} className="text-green-600 hover:underline">Privacy Policy</button>.
                    </p>
                 </div>
               </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
             {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 rounded transition-colors text-sm">Back</button>
             ) : (
                <div></div>
             )}
             <button 
               onClick={() => step === 4 ? handleSignupComplete() : handleNextStep()}
               disabled={loading}
               className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-green-500/20 flex items-center transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
             >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                {step === 4 ? 'Complete Setup' : 'Continue'}
                {!loading && step < 4 && <ChevronRight className="w-3.5 h-3.5 ml-1.5" />}
             </button>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center relative z-10">
         <p className="text-xs text-slate-300">Already have an account? <button onClick={() => setMode('login')} className="text-green-400 font-bold hover:underline">Log in</button></p>
      </div>
    </div>
  );
};
